import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter,
  Building2,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const drives = [
  { 
    id: 1, 
    title: "Software Engineer - Full Stack", 
    type: "Full-time", 
    salary: "12-18 LPA",
    location: "Bangalore",
    colleges: 15, 
    applications: 234, 
    shortlisted: 45,
    stage: "Interview",
    progress: 75,
    status: "active",
    createdAt: "Jan 15, 2024"
  },
  { 
    id: 2, 
    title: "Product Design Intern", 
    type: "Internship", 
    salary: "30K/month",
    location: "Remote",
    colleges: 8, 
    applications: 156, 
    shortlisted: 28,
    stage: "Test",
    progress: 45,
    status: "active",
    createdAt: "Jan 20, 2024"
  },
  { 
    id: 3, 
    title: "Data Analyst", 
    type: "Full-time", 
    salary: "8-12 LPA",
    location: "Hyderabad",
    colleges: 12, 
    applications: 89, 
    shortlisted: 0,
    stage: "Applications",
    progress: 25,
    status: "active",
    createdAt: "Jan 25, 2024"
  },
  { 
    id: 4, 
    title: "Frontend Developer", 
    type: "Full-time", 
    salary: "10-15 LPA",
    location: "Mumbai",
    colleges: 10, 
    applications: 312, 
    shortlisted: 52,
    stage: "Closed",
    progress: 100,
    status: "completed",
    createdAt: "Dec 10, 2023"
  },
];

const DrivesList = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold">Hiring Drives</h1>
          <p className="text-muted-foreground">Manage all your campus recruitment drives</p>
        </div>
        <Button variant="accent" asChild>
          <Link to="/company/drives/new">
            <Plus className="w-4 h-4 mr-1" />
            Create Drive
          </Link>
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search drives..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-1" />
          Filters
        </Button>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({drives.filter(d => d.status === "active").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({drives.filter(d => d.status === "completed").length})</TabsTrigger>
          <TabsTrigger value="all">All Drives</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {drives.filter(d => d.status === "active").map((drive, i) => (
            <DriveCard key={drive.id} drive={drive} index={i} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {drives.filter(d => d.status === "completed").map((drive, i) => (
            <DriveCard key={drive.id} drive={drive} index={i} />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {drives.map((drive, i) => (
            <DriveCard key={drive.id} drive={drive} index={i} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DriveCardProps {
  drive: typeof drives[0];
  index: number;
}

const DriveCard = ({ drive, index }: DriveCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="elevated" className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Main Info */}
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{drive.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      drive.type === "Full-time" 
                        ? "bg-accent/10 text-accent" 
                        : "bg-secondary/50 text-secondary-foreground"
                    }`}>
                      {drive.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {drive.salary} • {drive.location}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Drive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{drive.colleges} colleges</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{drive.applications} applications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Shortlisted:</span>
                  <span className="font-medium text-accent">{drive.shortlisted}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{drive.stage}</span>
                </div>
                <Progress value={drive.progress} className="h-2" />
              </div>
            </div>

            {/* Side Panel */}
            <div className="md:w-48 bg-muted/30 p-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium">{drive.createdAt}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link to={`/company/drives/${drive.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DrivesList;
