import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Building2, 
  Users, 
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Drive {
  id: string;
  title: string;
  job_type: string;
  location: string | null;
  description: string | null;
  salary_min: number | null;
  salary_max: number | null;
  min_cgpa: number | null;
  year_of_passing: number | null;
  backlog_allowed: boolean | null;
  eligibility_branches: string[] | null;
  skills: string[] | null;
  experience_level: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

const DriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [drive, setDrive] = useState<Drive | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDrive();
    }
  }, [id]);

  const fetchDrive = async () => {
    try {
      const { data, error } = await supabase
        .from("hiring_drives")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setDrive(data);
    } catch (error: any) {
      toast({
        title: "Error loading drive",
        description: error.message,
        variant: "destructive"
      });
      navigate("/company/drives");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!drive) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("hiring_drives")
        .delete()
        .eq("id", drive.id);

      if (error) throw error;

      toast({
        title: "Drive deleted",
        description: "The hiring drive has been deleted successfully."
      });
      navigate("/company/drives");
    } catch (error: any) {
      toast({
        title: "Error deleting drive",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "draft": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "closed": return "bg-muted text-muted-foreground border-border";
      default: return "bg-accent/10 text-accent border-accent/20";
    }
  };

  const getStageProgress = (status: string | null) => {
    switch (status) {
      case "draft": return 10;
      case "active": return 50;
      case "closed": return 100;
      default: return 25;
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `₹${(min/100000).toFixed(1)} - ${(max/100000).toFixed(1)} LPA`;
    if (min) return `₹${(min/100000).toFixed(1)} LPA+`;
    return `Up to ₹${(max!/100000).toFixed(1)} LPA`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!drive) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Drive Not Found</h2>
        <p className="text-muted-foreground mb-4">The drive you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/company/drives">Back to Drives</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/company/drives">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{drive.title}</h1>
              <Badge variant="outline" className={getStatusColor(drive.status)}>
                {drive.status || "Draft"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Created {new Date(drive.created_at).toLocaleDateString()}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Drive
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Drive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: "Applications", value: "0", icon: FileText, color: "text-blue-500" },
          { label: "Shortlisted", value: "0", icon: UserCheck, color: "text-green-500" },
          { label: "Colleges Invited", value: "0", icon: Building2, color: "text-purple-500" },
          { label: "Offers Sent", value: "0", icon: Send, color: "text-accent" },
        ].map((stat, i) => (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Drive Progress</span>
              <span className="text-sm text-muted-foreground capitalize">{drive.status || "Draft"}</span>
            </div>
            <Progress value={getStageProgress(drive.status)} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Draft</span>
              <span>Applications</span>
              <span>Screening</span>
              <span>Interviews</span>
              <span>Closed</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Details Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="colleges">Colleges</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Job Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Job Type</span>
                  <span className="font-medium">{drive.job_type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {drive.location || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Salary Range</span>
                  <span className="font-medium">{formatSalary(drive.salary_min, drive.salary_max)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experience Level</span>
                  <span className="font-medium">{drive.experience_level || "Entry Level"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Minimum CGPA</span>
                  <span className="font-medium">{drive.min_cgpa || "No minimum"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Year of Passing</span>
                  <span className="font-medium">{drive.year_of_passing || "Any"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Backlogs Allowed</span>
                  <span className="font-medium">{drive.backlog_allowed ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Eligible Branches</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {drive.eligibility_branches?.length ? (
                      drive.eligibility_branches.map((branch) => (
                        <Badge key={branch} variant="secondary" className="text-xs">
                          {branch}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">All branches</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              {drive.description ? (
                <p className="text-muted-foreground whitespace-pre-wrap">{drive.description}</p>
              ) : (
                <p className="text-muted-foreground italic">No description provided</p>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          {drive.skills && drive.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {drive.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-4">
                Applications will appear here once colleges start forwarding candidates.
              </p>
              <Button variant="outline" asChild>
                <Link to="/company/colleges">Invite Colleges</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colleges">
          <Card>
            <CardContent className="py-16 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Colleges Invited</h3>
              <p className="text-muted-foreground mb-4">
                Start by inviting colleges to participate in this hiring drive.
              </p>
              <Button asChild>
                <Link to="/company/colleges">
                  Select Colleges
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Schedule Set</h3>
              <p className="text-muted-foreground mb-4">
                Add test dates, interview slots, and deadlines here.
              </p>
              <Button variant="outline">
                Add Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hiring Drive</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{drive.title}"? This action cannot be undone
              and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DriveDetails;
