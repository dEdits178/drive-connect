import { motion } from "framer-motion";
import { Building2, ArrowRight, TrendingUp, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import freshbitLogo from "@/assets/freshbit-logo.png";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-0">
            <img src={freshbitLogo} alt="Freshbit" className="h-12 w-auto" />
            <span className="font-bold text-lg text-foreground -ml-5 -mt-1">freshbit</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button variant="accent" size="sm" asChild>
              <Link to="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Dark Gradient */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-primary/5 via-background to-background dark:from-primary/20 dark:via-background dark:to-background">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              Trusted by 500+ Companies & Colleges
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Campus Recruitment
              <br />
              <span className="text-gradient-accent">Made Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline your hiring process from drive creation to final selection. 
              Connect companies with top talent across colleges seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth/register">
                  Start Recruiting
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/auth/login">View Demo</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {[
              { value: "500+", label: "Companies" },
              { value: "2000+", label: "Colleges" },
              { value: "50K+", label: "Students Placed" },
              { value: "98%", label: "Success Rate" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center p-6 rounded-xl bg-card border border-border shadow-sm"
                variants={fadeUp}
              >
                <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Role Selection Cards - Company Only */}
      <section className="py-20 px-6 bg-muted/30 dark:bg-primary/5" id="features">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">For Companies</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Access powerful tools to streamline your campus recruitment process
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card variant="interactive" className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Company Portal</h3>
                <p className="text-muted-foreground mb-6">
                  Create hiring drives, manage campus recruitment, and track selections across multiple colleges.
                </p>
                <ul className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    "Create Hiring Drives",
                    "College Selection",
                    "Test & Interview Scheduling",
                    "Offer Management",
                    "Candidate Tracking",
                    "Analytics Dashboard"
                  ].map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/auth/register">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6" id="how-it-works">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A streamlined 6-step process from drive creation to final selection
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: 1, title: "Create Drive", desc: "Define role, requirements, and eligibility criteria" },
              { step: 2, title: "Select Colleges", desc: "Choose target colleges and send invitations" },
              { step: 3, title: "Applications", desc: "Receive and review student applications" },
              { step: 4, title: "Conduct Tests", desc: "Schedule and manage online assessments" },
              { step: 5, title: "Interviews", desc: "Shortlist and interview top candidates" },
              { step: 6, title: "Offer & Close", desc: "Send offers and complete the hiring cycle" }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-4 p-6 rounded-xl bg-card border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary dark:bg-primary/90">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Recruitment?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join hundreds of companies and colleges already using Freshbit for seamless campus recruitment.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth/register">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border" id="contact">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={freshbitLogo} alt="Freshbit" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              <Link to="/admin/login" className="hover:text-foreground transition-colors text-xs opacity-50">
                Admin
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Freshbit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
