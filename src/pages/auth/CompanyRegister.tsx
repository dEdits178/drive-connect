import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Eye, EyeOff, ArrowRight, Briefcase, Mail, Lock, User, Globe } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CompanyRegister = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    domain: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Handle registration
      navigate("/company/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-secondary blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-xl text-primary-foreground">PlaceHub</span>
          </Link>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-primary-foreground mb-4">
              Start Hiring Top Talent
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              Connect with thousands of colleges and find the perfect candidates for your organization.
            </p>
          </motion.div>

          <div className="mt-12 space-y-4">
            {[
              "Create and manage hiring drives",
              "Access 2000+ verified colleges",
              "Track candidates through stages",
              "Streamlined offer management"
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                <span className="text-primary-foreground/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-primary-foreground/60 text-sm">
          © 2024 PlaceHub. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-semibold">PlaceHub</span>
            </Link>
          </div>

          <Card variant="flat" className="border-0">
            <CardHeader className="px-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                    1
                  </div>
                  <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-muted'}`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                    2
                  </div>
                </div>
              </div>
              <CardTitle className="text-2xl">
                {step === 1 ? "Create Company Account" : "Verify Your Domain"}
              </CardTitle>
              <CardDescription>
                {step === 1 
                  ? "Enter your company details to get started" 
                  : "We'll verify your company email domain"
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          placeholder="Acme Corporation"
                          className="pl-10"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Official Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="hr@company.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="domain">Company Domain</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="domain"
                          placeholder="company.com"
                          className="pl-10"
                          value={formData.domain}
                          onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                      <p className="text-sm text-foreground">
                        We've sent a verification code to <strong>{formData.email}</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                        required
                      />
                    </div>

                    <button type="button" className="text-sm text-accent hover:underline">
                      Resend verification code
                    </button>
                  </>
                )}

                <Button type="submit" variant="hero" className="w-full" size="lg">
                  {step === 1 ? "Continue" : "Complete Registration"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth/login" className="text-accent hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyRegister;
