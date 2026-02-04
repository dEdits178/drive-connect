import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import CompanyRegister from "./pages/auth/CompanyRegister";
import AdminLogin from "./pages/auth/AdminLogin";
import NotFound from "./pages/NotFound";

// Company Pages
import CompanyLayout from "./components/layouts/CompanyLayout";
import CompanyDashboard from "./pages/company/Dashboard";
import DrivesList from "./pages/company/DrivesList";
import DriveDetails from "./pages/company/DriveDetails";
import CreateDrive from "./pages/company/CreateDrive";
import CollegeSelection from "./pages/company/CollegeSelection";

// Admin Pages
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmails from "./pages/admin/AdminEmails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<CompanyRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Company Routes */}
            <Route path="/company" element={<CompanyLayout />}>
              <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="drives" element={<DrivesList />} />
              <Route path="drives/new" element={<CreateDrive />} />
              <Route path="drives/:id" element={<DriveDetails />} />
              <Route path="colleges" element={<CollegeSelection />} />
              <Route path="colleges" element={<CollegeSelection />} />
              <Route path="applications" element={<PlaceholderPage title="Applications" />} />
              <Route path="candidates" element={<PlaceholderPage title="Candidates" />} />
              <Route path="schedule" element={<PlaceholderPage title="Schedule" />} />
              <Route path="settings" element={<PlaceholderPage title="Settings" />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="emails" element={<AdminEmails />} />
              <Route path="companies" element={<PlaceholderPage title="Companies Management" />} />
              <Route path="colleges" element={<PlaceholderPage title="Colleges Management" />} />
              <Route path="drives" element={<PlaceholderPage title="All Drives" />} />
              <Route path="users" element={<PlaceholderPage title="Users Management" />} />
              <Route path="settings" element={<PlaceholderPage title="Admin Settings" />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Placeholder component for pages not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">This page is coming soon.</p>
    </div>
  </div>
);

export default App;
