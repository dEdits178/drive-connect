import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Building2, Trash2, Edit2, MapPin, Globe, Mail, GraduationCap, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type College = Tables<"colleges">;

const AdminColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    website: "",
    contact_email: "",
    tier: "Tier 2",
    courses: [] as string[],
    is_active: true,
  });
  const [newCourse, setNewCourse] = useState("");

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch colleges");
      console.error(error);
    } else {
      setColleges(data || []);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      website: "",
      contact_email: "",
      tier: "Tier 2",
      courses: [],
      is_active: true,
    });
    setNewCourse("");
    setEditingCollege(null);
  };

  const handleAddCourse = () => {
    if (newCourse && !formData.courses.includes(newCourse)) {
      setFormData({ ...formData, courses: [...formData.courses, newCourse] });
      setNewCourse("");
    }
  };

  const handleRemoveCourse = (course: string) => {
    setFormData({ ...formData, courses: formData.courses.filter((c) => c !== course) });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("College name is required");
      return;
    }

    if (editingCollege) {
      // Update existing college
      const { error } = await supabase
        .from("colleges")
        .update({
          name: formData.name,
          location: formData.location || null,
          website: formData.website || null,
          contact_email: formData.contact_email || null,
          tier: formData.tier || null,
          courses: formData.courses.length > 0 ? formData.courses : null,
          is_active: formData.is_active,
        })
        .eq("id", editingCollege.id);

      if (error) {
        toast.error("Failed to update college");
        console.error(error);
      } else {
        toast.success("College updated successfully");
        fetchColleges();
        setIsAddDialogOpen(false);
        resetForm();
      }
    } else {
      // Add new college
      const { error } = await supabase.from("colleges").insert({
        name: formData.name,
        location: formData.location || null,
        website: formData.website || null,
        contact_email: formData.contact_email || null,
        tier: formData.tier || null,
        courses: formData.courses.length > 0 ? formData.courses : null,
        is_active: formData.is_active,
      });

      if (error) {
        toast.error("Failed to add college");
        console.error(error);
      } else {
        toast.success("College added successfully");
        fetchColleges();
        setIsAddDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleEdit = (college: College) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      location: college.location || "",
      website: college.website || "",
      contact_email: college.contact_email || "",
      tier: college.tier || "Tier 2",
      courses: college.courses || [],
      is_active: college.is_active ?? true,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this college?")) return;

    const { error } = await supabase.from("colleges").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete college");
      console.error(error);
    } else {
      toast.success("College deleted successfully");
      fetchColleges();
    }
  };

  const handleToggleActive = async (college: College) => {
    const { error } = await supabase
      .from("colleges")
      .update({ is_active: !college.is_active })
      .eq("id", college.id);

    if (error) {
      toast.error("Failed to update college status");
      console.error(error);
    } else {
      toast.success(`College ${!college.is_active ? "activated" : "deactivated"}`);
      fetchColleges();
    }
  };

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">College Management</h1>
          <p className="text-muted-foreground">Add and manage colleges available on the platform</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="accent">
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCollege ? "Edit College" : "Add New College"}</DialogTitle>
              <DialogDescription>
                {editingCollege ? "Update college details" : "Add a new college to the platform"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">College Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., IIT Delhi"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New Delhi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tier">Tier</Label>
                  <Select
                    value={formData.tier}
                    onValueChange={(value) => setFormData({ ...formData, tier: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tier 1">Tier 1</SelectItem>
                      <SelectItem value="Tier 2">Tier 2</SelectItem>
                      <SelectItem value="Tier 3">Tier 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="placement@..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Courses Offered</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.courses.map((course) => (
                    <Badge key={course} variant="secondary" className="gap-1">
                      {course}
                      <button type="button" onClick={() => handleRemoveCourse(course)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    placeholder="Add course (e.g., B.Tech CSE)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCourse())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddCourse}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <Label htmlFor="is_active">Active Status</Label>
                  <p className="text-xs text-muted-foreground">College is visible to companies</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button variant="accent" onClick={handleSubmit}>
                {editingCollege ? "Update College" : "Add College"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search colleges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Colleges List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
        </div>
      ) : filteredColleges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No colleges found</p>
            <Button variant="accent" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First College
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredColleges.map((college, i) => (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`relative ${!college.is_active ? "opacity-60" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{college.name}</CardTitle>
                        {college.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {college.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant={college.is_active ? "default" : "secondary"}>
                      {college.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {college.tier && (
                    <Badge variant="outline">{college.tier}</Badge>
                  )}
                  {college.courses && college.courses.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {college.courses.slice(0, 3).map((course) => (
                        <Badge key={course} variant="secondary" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                      {college.courses.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{college.courses.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(college)}
                    >
                      {college.is_active ? (
                        <X className="w-4 h-4 mr-1" />
                      ) : (
                        <Check className="w-4 h-4 mr-1" />
                      )}
                      {college.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(college)}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(college.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminColleges;
