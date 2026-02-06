import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  Clock,
  Plus,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    colleges: 0,
    drives: 0,
    pendingVerifications: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [companiesRes, collegesRes, drivesRes, pendingRes] = await Promise.all([
        supabase.from("companies").select("id", { count: "exact", head: true }),
        supabase.from("colleges").select("id", { count: "exact", head: true }),
        supabase.from("hiring_drives").select("id", { count: "exact", head: true }),
        supabase.from("companies").select("id", { count: "exact", head: true }).eq("verified", false)
      ]);

      setStats({
        companies: companiesRes.count || 0,
        colleges: collegesRes.count || 0,
        drives: drivesRes.count || 0,
        pendingVerifications: pendingRes.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statCards = [
    { 
      title: "Total Companies", 
      value: stats.companies, 
      icon: Building2, 
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "/admin/companies"
    },
    { 
      title: "Total Colleges", 
      value: stats.colleges, 
      icon: GraduationCap, 
      color: "text-success",
      bgColor: "bg-success/10",
      link: "/admin/colleges"
    },
    { 
      title: "Active Drives", 
      value: stats.drives, 
      icon: Briefcase, 
      color: "text-accent",
      bgColor: "bg-accent/10",
      link: "/admin/companies"
    },
    { 
      title: "Pending Verifications", 
      value: stats.pendingVerifications, 
      icon: Clock, 
      color: "text-warning",
      bgColor: "bg-warning/10",
      link: "/admin/companies"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
              <Link to={stat.link}>
                <Card className="hover:border-accent/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Verify companies, manage accounts, and view their hiring drives.
            </p>
            <div className="flex gap-2">
              <Button variant="accent" size="sm" asChild>
                <Link to="/admin/companies">View All Companies</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              College Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add, edit, and manage college profiles with degree programs.
            </p>
            <div className="flex gap-2">
              <Button variant="accent" size="sm" asChild>
                <Link to="/admin/colleges">
                  <Plus className="w-4 h-4 mr-1" />
                  Manage Colleges
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Drive Oversight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Monitor all hiring drives, manage stages, and resolve issues.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View All Drives
              </Button>
              <Button variant="outline" size="sm">
                Stage Overrides
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View platform metrics, hiring trends, and performance data.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Reports
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
