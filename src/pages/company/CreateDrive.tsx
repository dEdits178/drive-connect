import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  GraduationCap,
  Upload,
  Plus,
  X,
  Building2,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/hooks/useCompany";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Job Details", description: "Basic information about the role" },
  { id: 2, title: "Eligibility", description: "Define candidate requirements" },
  { id: 3, title: "Documents", description: "Upload relevant files" },
];

const CreateDrive = () => {
  const navigate = useNavigate();
  const { company, isLoading: companyLoading } = useCompany();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    job_type: "fulltime",
    salary_min: "",
    salary_max: "",
    location: "",
    description: "",
    skills: ["React", "TypeScript"] as string[],
    eligibility_branches: ["cse"] as string[],
    min_cgpa: "",
    year_of_passing: "2025",
    experience_level: "fresher",
    backlog_allowed: false,
  });
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (!company) {
      toast.error("Company not found. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.from("hiring_drives").insert({
        company_id: company.id,
        title: formData.title,
        job_type: formData.job_type,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        location: formData.location || null,
        description: formData.description || null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        eligibility_branches: formData.eligibility_branches.length > 0 ? formData.eligibility_branches : null,
        min_cgpa: formData.min_cgpa ? parseFloat(formData.min_cgpa) : null,
        year_of_passing: formData.year_of_passing ? parseInt(formData.year_of_passing) : null,
        experience_level: formData.experience_level || null,
        backlog_allowed: formData.backlog_allowed,
        status: "draft",
      }).select().single();

      if (error) {
        console.error("Error creating drive:", error);
        toast.error("Failed to create drive. Please try again.");
      } else {
        toast.success("Hiring drive created successfully!");
        navigate("/company/colleges");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          to="/company/drives" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Drives
        </Link>
        <h1 className="text-2xl font-bold">Create Hiring Drive</h1>
        <p className="text-muted-foreground">Set up a new campus recruitment drive</p>
      </motion.div>

      {/* Steps Indicator */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentStep >= step.id 
                    ? "bg-accent text-accent-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 rounded ${
                  currentStep > step.id ? "bg-accent" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roleName">Role Name *</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="roleName" 
                          placeholder="e.g., Software Engineer" 
                          className="pl-10" 
                          required 
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type *</Label>
                      <Select 
                        value={formData.job_type}
                        onValueChange={(value) => setFormData({ ...formData, job_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fulltime">Full-time</SelectItem>
                          <SelectItem value="intern">Internship</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">Minimum Salary (LPA)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="salaryMin" 
                          type="number"
                          placeholder="e.g., 8" 
                          className="pl-10" 
                          value={formData.salary_min}
                          onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">Maximum Salary (LPA)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="salaryMax" 
                          type="number"
                          placeholder="e.g., 12" 
                          className="pl-10" 
                          value={formData.salary_max}
                          onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="location" 
                        placeholder="e.g., Bangalore, Remote" 
                        className="pl-10" 
                        required 
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Skills Required</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm"
                        >
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-accent-foreground">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add a skill" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" variant="outline" onClick={addSkill}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the role, responsibilities, and expectations..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch/Stream *</Label>
                      <Select 
                        value={formData.eligibility_branches[0] || "cse"}
                        onValueChange={(value) => setFormData({ ...formData, eligibility_branches: [value] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cse">Computer Science</SelectItem>
                          <SelectItem value="ece">Electronics & Communication</SelectItem>
                          <SelectItem value="eee">Electrical Engineering</SelectItem>
                          <SelectItem value="mech">Mechanical Engineering</SelectItem>
                          <SelectItem value="all">All Branches</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cgpa">Minimum CGPA *</Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="cgpa" 
                          type="number" 
                          step="0.1" 
                          min="0" 
                          max="10" 
                          placeholder="e.g., 7.0" 
                          className="pl-10" 
                          required 
                          value={formData.min_cgpa}
                          onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passingYear">Year of Passing *</Label>
                      <Select 
                        value={formData.year_of_passing}
                        onValueChange={(value) => setFormData({ ...formData, year_of_passing: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select 
                        value={formData.experience_level}
                        onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fresher">Fresher</SelectItem>
                          <SelectItem value="0-1">0-1 Years</SelectItem>
                          <SelectItem value="1-2">1-2 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 space-y-4">
                    <h4 className="font-medium">Additional Criteria</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Allow Active Backlogs</p>
                        <p className="text-xs text-muted-foreground">Students with active backlogs can apply</p>
                      </div>
                      <Switch 
                        checked={formData.backlog_allowed}
                        onCheckedChange={(checked) => setFormData({ ...formData, backlog_allowed: checked })}
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="space-y-4">
                    {[
                      { label: "Job Description (PDF)", desc: "Detailed JD document" },
                      { label: "Test Guidelines", desc: "Assessment instructions" },
                      { label: "Company Brochure", desc: "About your company" },
                    ].map((doc) => (
                      <div 
                        key={doc.label}
                        className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border hover:border-accent/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-sm">{doc.label}</p>
                          <p className="text-xs text-muted-foreground">{doc.desc}</p>
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Next: Select Colleges</p>
                        <p className="text-xs text-muted-foreground">
                          After creating this drive, you'll be able to select and invite colleges to participate.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            {currentStep > 1 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            ) : (
              <div />
            )}
            <Button type="submit" variant="accent" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                currentStep === 3 ? "Create Drive & Select Colleges" : "Continue"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDrive;
