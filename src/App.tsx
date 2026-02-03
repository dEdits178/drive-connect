import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import CompanyRegister from "./pages/auth/CompanyRegister";
import NotFound from "./pages/NotFound";

// Company Pages
import CompanyLayout from "./components/layouts/CompanyLayout";
import CompanyDashboard from "./pages/company/Dashboard";
import DrivesList from "./pages/company/DrivesList";
import CreateDrive from "./pages/company/CreateDrive";
import CollegeSelection from "./pages/company/CollegeSelection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<CompanyRegister />} />
          
          {/* Company Routes */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="drives" element={<DrivesList />} />
            <Route path="drives/new" element={<CreateDrive />} />
            <Route path="colleges" element={<CollegeSelection />} />
            <Route path="applications" element={<PlaceholderPage title="Applications" />} />
            <Route path="candidates" element={<PlaceholderPage title="Candidates" />} />
            <Route path="schedule" element={<PlaceholderPage title="Schedule" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
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
