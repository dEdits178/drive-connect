import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  Building2, 
  Users, 
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/hooks/useCompany";
import { Tables } from "@/integrations/supabase/types";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const CompanyDashboard = () => {
  const { company, isLoading: companyLoading } = useCompany();
  const [drives, setDrives] = useState<Tables<"hiring_drives">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (company) {
      fetchDrives();
    }
  }, [company]);

  const fetchDrives = async () => {
    if (!company) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("hiring_drives")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setDrives(data);
    }
    setIsLoading(false);
  };

  const stats = [
    { 
      label: "Active Drives", 
      value: drives.filter(d => d.status === "active").length.toString(), 
      change: `+${drives.length}`, 
      trend: "up", 
      icon: Briefcase,
      color: "accent"
    },
    { 
      label: "Total Drives", 
      value: drives.length.toString(), 
      change: "", 
      trend: "up", 
      icon: Building2,
      color: "primary"
    },
    { 
      label: "Draft Drives", 
      value: drives.filter(d => d.status === "draft").length.toString(), 
      change: "", 
      trend: "up", 
      icon: FileText,
      color: "warning"
    },
    { 
      label: "Completed", 
      value: drives.filter(d => d.status === "completed").length.toString(), 
      change: "", 
      trend: "up", 
      icon: Users,
      color: "secondary"
    },
  ];

  const upcomingEvents = [
    { id: 1, title: "Technical Interview - IIT Delhi", date: "Today, 2:00 PM", type: "Interview" },
    { id: 2, title: "Campus Visit - NIT Trichy", date: "Tomorrow, 10:00 AM", type: "Visit" },
    { id: 3, title: "Online Assessment", date: "Feb 5, 9:00 AM", type: "Test" },
  ];

  if (companyLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div {...fadeUp}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your hiring activities.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUp}
            transition={{ delay: i * 0.1 }}
          >
            <Card variant="elevated">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    {stat.change && (
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-4 h-4 text-success" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-destructive" />
                        )}
                        <span className={`text-sm font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-muted-foreground">total</span>
                      </div>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Drives */}
        <motion.div 
          className="lg:col-span-2"
          {...fadeUp}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Your Hiring Drives</CardTitle>
                <CardDescription>Track progress of your ongoing drives</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/company/drives">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {drives.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No hiring drives yet</p>
                  <Button variant="accent" asChild>
                    <Link to="/company/drives/new">Create Your First Drive</Link>
                  </Button>
                </div>
              ) : (
                drives.map((drive) => (
                  <Link
                    key={drive.id}
                    to={`/company/drives/${drive.id}`}
                    className="block p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{drive.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {drive.location || "Remote"}
                          </span>
                          {drive.salary_min && drive.salary_max && (
                            <span>₹{drive.salary_min}-{drive.salary_max} LPA</span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        drive.status === "active" 
                          ? "bg-success/10 text-success" 
                          : drive.status === "draft"
                          ? "bg-warning/10 text-warning"
                          : "bg-secondary/50 text-secondary-foreground"
                      }`}>
                        {drive.status || "draft"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={drive.status === "active" ? 50 : drive.status === "completed" ? 100 : 10} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-muted-foreground capitalize">
                        {drive.status || "draft"}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Upcoming
              </CardTitle>
              <CardDescription>Your scheduled activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.type === "Interview" 
                      ? "bg-accent/10 text-accent" 
                      : event.type === "Test"
                      ? "bg-warning/10 text-warning"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {event.type === "Interview" ? (
                      <Users className="w-5 h-5" />
                    ) : event.type === "Test" ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <Building2 className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full mt-2" size="sm" asChild>
                <Link to="/company/schedule">
                  <Calendar className="w-4 h-4 mr-1" />
                  View Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        {...fadeUp}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Create New Drive", icon: Briefcase, href: "/company/drives/new", color: "accent" },
                { label: "Browse Colleges", icon: Building2, href: "/company/colleges", color: "primary" },
                { label: "Review Applications", icon: FileText, href: "/company/applications", color: "success" },
                { label: "Schedule Interview", icon: Calendar, href: "/company/schedule", color: "warning" },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${action.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className={`w-6 h-6 text-${action.color}`} />
                  </div>
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompanyDashboard;
