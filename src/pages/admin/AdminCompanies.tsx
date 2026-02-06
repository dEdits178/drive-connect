import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Search, Eye, Briefcase, MapPin, Globe, CheckCircle, XCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type Company = Tables<"companies">;
type HiringDrive = Tables<"hiring_drives">;

interface CompanyWithDrives extends Company {
  hiring_drives?: HiringDrive[];
}

const AdminCompanies = () => {
  const [companies, setCompanies] = useState<CompanyWithDrives[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithDrives | null>(null);
  const [companyDrives, setCompanyDrives] = useState<HiringDrive[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch companies");
      console.error(error);
    } else {
      setCompanies(data || []);
    }
    setIsLoading(false);
  };

  const fetchCompanyDrives = async (companyId: string) => {
    const { data, error } = await supabase
      .from("hiring_drives")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch drives");
      console.error(error);
    } else {
      setCompanyDrives(data || []);
    }
  };

  const handleViewCompany = async (company: CompanyWithDrives) => {
    setSelectedCompany(company);
    await fetchCompanyDrives(company.id);
    setDialogOpen(true);
  };

  const handleToggleVerified = async (company: Company) => {
    const { error } = await supabase
      .from("companies")
      .update({ verified: !company.verified })
      .eq("id", company.id);

    if (error) {
      toast.error("Failed to update company");
      console.error(error);
    } else {
      toast.success(`Company ${!company.verified ? "verified" : "unverified"}`);
      fetchCompanies();
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case "closed":
        return <Badge className="bg-muted text-muted-foreground border-muted">Closed</Badge>;
      case "draft":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Company Management</h1>
          <p className="text-muted-foreground">View and manage registered companies and their drives</p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-sm text-muted-foreground">Total Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{companies.filter(c => c.verified).length}</div>
            <p className="text-sm text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{companies.filter(c => !c.verified).length}</div>
            <p className="text-sm text-muted-foreground">Pending Verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString("en-IN", { month: "short" })}
            </div>
            <p className="text-sm text-muted-foreground">
              {companies.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length} new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Companies List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No companies found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCompanies.map((company, i) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {company.logo_url ? (
                          <img src={company.logo_url} alt={company.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <Building2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div>
                      <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{company.name}</h3>
                          {company.verified ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <Badge variant="outline" className="text-xs">Unverified</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {company.industry && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {company.industry}
                            </span>
                          )}
                          {company.domain && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {company.domain}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Joined {new Date(company.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleVerified(company)}
                      >
                        {company.verified ? (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Unverify
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </>
                        )}
                      </Button>
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => handleViewCompany(company)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Drives
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Company Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {selectedCompany?.name}
            </DialogTitle>
            <DialogDescription>
              Company details and hiring drives
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{selectedCompany.industry || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Domain</p>
                  <p className="font-medium">{selectedCompany.domain || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <p className="font-medium">{selectedCompany.website || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedCompany.verified ? "default" : "secondary"}>
                    {selectedCompany.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>

              {/* Drives */}
              <div>
                <h3 className="font-semibold mb-4">Hiring Drives ({companyDrives.length})</h3>
                {companyDrives.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No drives created yet</p>
                ) : (
                  <div className="space-y-3">
                    {companyDrives.map((drive) => (
                      <Card key={drive.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{drive.title}</h4>
                                {getStatusBadge(drive.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span>{drive.job_type}</span>
                                {drive.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {drive.location}
                                  </span>
                                )}
                                {drive.salary_min && drive.salary_max && (
                                  <span>₹{drive.salary_min} - ₹{drive.salary_max} LPA</span>
                                )}
                              </div>
                              {drive.eligibility_branches && drive.eligibility_branches.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {drive.eligibility_branches.slice(0, 3).map((branch) => (
                                    <Badge key={branch} variant="outline" className="text-xs">
                                      {branch}
                                    </Badge>
                                  ))}
                                  {drive.eligibility_branches.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{drive.eligibility_branches.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>Created</p>
                              <p>{new Date(drive.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCompanies;