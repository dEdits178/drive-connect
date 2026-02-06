import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Building2, Trash2, Edit2, MapPin, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type College = Tables<"colleges">;

// Degree types and their sub-branches (for suggestions)
const degreeTypes = {
  "B.Tech/B.E": [
    "Computer Science & Engineering",
    "Electronics & Communication",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Information Technology",
    "AI & Machine Learning",
    "Data Science",
    "Biotechnology",
    "Aerospace Engineering",
  ],
  "B.Com": [
    "B.Com General",
    "B.Com Honours",
    "B.Com Computer Applications",
    "B.Com Accounting & Finance",
  ],
  "B.Sc": [
    "Computer Science",
    "Information Technology",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Statistics",
    "Electronics",
    "Biotechnology",
  ],
  "B.A": [
    "Economics",
    "English",
    "Psychology",
    "Political Science",
    "History",
    "Sociology",
  ],
  "MBA": [
    "MBA Finance",
    "MBA Marketing",
    "MBA HR",
    "MBA Operations",
    "MBA IT",
    "MBA International Business",
  ],
  "MCA": [
    "MCA",
  ],
  "M.Tech": [
    "M.Tech CSE",
    "M.Tech ECE",
    "M.Tech Mechanical",
    "M.Tech Civil",
  ],
  "M.Sc": [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Data Science",
  ],
  "BBA": [
    "BBA General",
    "BBA Finance",
    "BBA Marketing",
  ],
  "BCA": [
    "BCA",
  ],
};

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
  const [selectedDegreeType, setSelectedDegreeType] = useState<string>("");
  const [customCourse, setCustomCourse] = useState("");
  const [suggestedBranches, setSuggestedBranches] = useState<string[]>([]);

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    // Update suggested branches when degree type changes
    if (selectedDegreeType && degreeTypes[selectedDegreeType as keyof typeof degreeTypes]) {
      setSuggestedBranches(degreeTypes[selectedDegreeType as keyof typeof degreeTypes]);
    } else {
      setSuggestedBranches([]);
    }
  }, [selectedDegreeType]);

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
    setSelectedDegreeType("");
    setCustomCourse("");
    setEditingCollege(null);
  };

  const handleAddCourse = (course: string) => {
    const fullCourse = selectedDegreeType ? `${selectedDegreeType} - ${course}` : course;
    if (fullCourse && !formData.courses.includes(fullCourse)) {
      setFormData({ ...formData, courses: [...formData.courses, fullCourse] });
    }
  };

  const handleAddCustomCourse = () => {
    if (customCourse) {
      const fullCourse = selectedDegreeType ? `${selectedDegreeType} - ${customCourse}` : customCourse;
      if (!formData.courses.includes(fullCourse)) {
        setFormData({ ...formData, courses: [...formData.courses, fullCourse] });
      }
      setCustomCourse("");
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

  // Group courses by degree type for display
  const groupCourses = (courses: string[]) => {
    const grouped: { [key: string]: string[] } = {};
    courses.forEach((course) => {
      const parts = course.split(" - ");
      if (parts.length === 2) {
        const degreeType = parts[0];
        const branch = parts[1];
        if (!grouped[degreeType]) grouped[degreeType] = [];
        grouped[degreeType].push(branch);
      } else {
        if (!grouped["Other"]) grouped["Other"] = [];
        grouped["Other"].push(course);
      }
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">College Management</h1>
          <p className="text-muted-foreground">Add and manage colleges with their degree programs</p>
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
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCollege ? "Edit College" : "Add New College"}</DialogTitle>
              <DialogDescription>
                {editingCollege ? "Update college details and programs" : "Add a new college with its degree programs"}
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

              {/* Degree Programs Section */}
              <div className="space-y-4 pt-4 border-t">
                <Label>Degree Programs Offered</Label>
                
                {/* Current courses grouped */}
                {formData.courses.length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(groupCourses(formData.courses)).map(([degreeType, branches]) => (
                      <div key={degreeType} className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium text-muted-foreground mb-2">{degreeType}</p>
                        <div className="flex flex-wrap gap-2">
                          {branches.map((branch) => {
                            const fullCourse = degreeType === "Other" ? branch : `${degreeType} - ${branch}`;
                            return (
                              <Badge key={fullCourse} variant="secondary" className="gap-1">
                                {branch}
                                <button type="button" onClick={() => handleRemoveCourse(fullCourse)}>
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add courses */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Select Degree Type</Label>
                    <Select
                      value={selectedDegreeType}
                      onValueChange={setSelectedDegreeType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose degree type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(degreeTypes).map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Suggested branches */}
                  {suggestedBranches.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Click to add branches:</Label>
                      <div className="flex flex-wrap gap-2">
                        {suggestedBranches.map((branch) => {
                          const fullCourse = `${selectedDegreeType} - ${branch}`;
                          const isAdded = formData.courses.includes(fullCourse);
                          return (
                            <Button
                              key={branch}
                              type="button"
                              variant={isAdded ? "default" : "outline"}
                              size="sm"
                              onClick={() => isAdded ? handleRemoveCourse(fullCourse) : handleAddCourse(branch)}
                            >
                              {isAdded ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                              {branch}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom course input */}
                  <div className="flex gap-2">
                    <Input
                      value={customCourse}
                      onChange={(e) => setCustomCourse(e.target.value)}
                      placeholder={selectedDegreeType ? `Add custom ${selectedDegreeType} branch` : "Add custom course"}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomCourse())}
                    />
                    <Button type="button" variant="outline" onClick={handleAddCustomCourse}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
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
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{college.name}</h3>
                        {college.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {college.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant={college.is_active ? "default" : "secondary"} className="text-xs">
                      {college.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {college.tier && (
                    <Badge variant="outline" className="mb-2 text-xs">{college.tier}</Badge>
                  )}

                  {/* Show courses grouped by degree */}
                  {college.courses && college.courses.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {Object.entries(groupCourses(college.courses)).slice(0, 2).map(([degreeType, branches]) => (
                        <div key={degreeType} className="text-xs">
                          <span className="text-muted-foreground">{degreeType}:</span>{" "}
                          <span>{branches.slice(0, 2).join(", ")}</span>
                          {branches.length > 2 && <span className="text-muted-foreground"> +{branches.length - 2}</span>}
                        </div>
                      ))}
                      {Object.keys(groupCourses(college.courses)).length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{Object.keys(groupCourses(college.courses)).length - 2} more programs
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(college)}
                    >
                      {college.is_active ? (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Activate
                        </>
                      )}
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