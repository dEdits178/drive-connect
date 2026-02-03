import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Briefcase, 
  Building2, 
  Users, 
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const CompanyDashboard = () => {
  const stats = [
    { 
      label: "Active Drives", 
      value: "12", 
      change: "+3", 
      trend: "up", 
      icon: Briefcase,
      color: "accent"
    },
    { 
      label: "Colleges Engaged", 
      value: "48", 
      change: "+12", 
      trend: "up", 
      icon: Building2,
      color: "primary"
    },
    { 
      label: "Applications", 
      value: "1,234", 
      change: "+156", 
      trend: "up", 
      icon: FileText,
      color: "success"
    },
    { 
      label: "Candidates Hired", 
      value: "89", 
      change: "+8", 
      trend: "up", 
      icon: Users,
      color: "secondary"
    },
  ];

  const activeDrives = [
    { 
      id: 1, 
      title: "Software Engineer - Full Stack", 
      type: "Full-time", 
      colleges: 15, 
      applications: 234, 
      stage: "Interview",
      progress: 75 
    },
    { 
      id: 2, 
      title: "Product Design Intern", 
      type: "Internship", 
      colleges: 8, 
      applications: 156, 
      stage: "Test",
      progress: 45 
    },
    { 
      id: 3, 
      title: "Data Analyst", 
      type: "Full-time", 
      colleges: 12, 
      applications: 89, 
      stage: "Applications",
      progress: 25 
    },
  ];

  const upcomingEvents = [
    { id: 1, title: "Technical Interview - IIT Delhi", date: "Today, 2:00 PM", type: "Interview" },
    { id: 2, title: "Campus Visit - NIT Trichy", date: "Tomorrow, 10:00 AM", type: "Visit" },
    { id: 3, title: "Online Assessment", date: "Feb 5, 9:00 AM", type: "Test" },
  ];

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
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-destructive" />
                      )}
                      <span className={`text-sm font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">this month</span>
                    </div>
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
                <CardTitle className="text-lg">Active Hiring Drives</CardTitle>
                <CardDescription>Track progress of your ongoing drives</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/company/drives">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeDrives.map((drive) => (
                <div
                  key={drive.id}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{drive.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {drive.colleges} colleges
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {drive.applications} applications
                        </span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      drive.type === "Full-time" 
                        ? "bg-accent/10 text-accent" 
                        : "bg-secondary/50 text-secondary-foreground"
                    }`}>
                      {drive.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={drive.progress} className="h-2 flex-1" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {drive.stage}
                    </span>
                  </div>
                </div>
              ))}
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
