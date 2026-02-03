import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Briefcase, 
  Building2, 
  FileText, 
  Users, 
  Calendar, 
  Settings,
  ChevronLeft,
  LogOut,
  Bell,
  Search,
  Plus
} from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
  { name: "Hiring Drives", href: "/company/drives", icon: Briefcase },
  { name: "Colleges", href: "/company/colleges", icon: Building2 },
  { name: "Applications", href: "/company/applications", icon: FileText },
  { name: "Candidates", href: "/company/candidates", icon: Users },
  { name: "Schedule", href: "/company/schedule", icon: Calendar },
  { name: "Settings", href: "/company/settings", icon: Settings },
];

const CompanyLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <motion.aside
        className={cn(
          "bg-sidebar fixed left-0 top-0 h-screen flex flex-col border-r border-sidebar-border z-40 transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/company/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">PlaceHub</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
              <Briefcase className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse Toggle & Logout */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span className="text-sm">Collapse</span>}
          </button>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-destructive/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={cn("flex-1 transition-all duration-300", collapsed ? "ml-16" : "ml-64")}>
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search drives, colleges, candidates..." 
                className="pl-9 bg-muted/50 border-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </Button>
            <Button variant="accent" size="sm" asChild>
              <Link to="/company/drives/new">
                <Plus className="w-4 h-4 mr-1" />
                New Drive
              </Link>
            </Button>
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">AC</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CompanyLayout;
