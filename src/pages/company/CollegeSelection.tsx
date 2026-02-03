import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  CheckCircle, 
  Building2,
  Star,
  ArrowLeft,
  Send
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const colleges = [
  { id: 1, name: "IIT Delhi", location: "New Delhi", tier: "Tier 1", students: 2500, rating: 4.8, selected: false },
  { id: 2, name: "IIT Bombay", location: "Mumbai", tier: "Tier 1", students: 2800, rating: 4.9, selected: false },
  { id: 3, name: "NIT Trichy", location: "Tiruchirappalli", tier: "Tier 1", students: 2000, rating: 4.5, selected: false },
  { id: 4, name: "BITS Pilani", location: "Pilani", tier: "Tier 1", students: 1800, rating: 4.7, selected: false },
  { id: 5, name: "NIT Warangal", location: "Warangal", tier: "Tier 1", students: 1600, rating: 4.4, selected: false },
  { id: 6, name: "IIIT Hyderabad", location: "Hyderabad", tier: "Tier 1", students: 1200, rating: 4.6, selected: false },
  { id: 7, name: "VIT Vellore", location: "Vellore", tier: "Tier 2", students: 5000, rating: 4.2, selected: false },
  { id: 8, name: "SRM University", location: "Chennai", tier: "Tier 2", students: 4500, rating: 4.0, selected: false },
];

const CollegeSelection = () => {
  const navigate = useNavigate();
  const [selectedColleges, setSelectedColleges] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCollege = (id: number) => {
    setSelectedColleges(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedColleges.length === colleges.length) {
      setSelectedColleges([]);
    } else {
      setSelectedColleges(colleges.map(c => c.id));
    }
  };

  const handleSendInvites = () => {
    navigate("/company/drives");
  };

  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          to="/company/drives/new" 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Drive
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Select Colleges</h1>
            <p className="text-muted-foreground">Choose colleges to invite for your hiring drive</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold text-accent">{selectedColleges.length}</p>
            </div>
            <Button 
              variant="accent" 
              disabled={selectedColleges.length === 0}
              onClick={handleSendInvites}
            >
              <Send className="w-4 h-4 mr-1" />
              Send Invites
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex flex-wrap gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search colleges..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="tier1">Tier 1</SelectItem>
            <SelectItem value="tier2">Tier 2</SelectItem>
            <SelectItem value="tier3">Tier 3</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="north">North India</SelectItem>
            <SelectItem value="south">South India</SelectItem>
            <SelectItem value="west">West India</SelectItem>
            <SelectItem value="east">East India</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={selectAll}>
          {selectedColleges.length === colleges.length ? "Deselect All" : "Select All"}
        </Button>
      </motion.div>

      {/* College Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredColleges.map((college, i) => {
          const isSelected = selectedColleges.includes(college.id);
          return (
            <motion.div
              key={college.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card 
                variant={isSelected ? "accent" : "interactive"}
                className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-accent" : ""}`}
                onClick={() => toggleCollege(college.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold truncate">{college.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {college.location}
                          </p>
                        </div>
                        <Checkbox 
                          checked={isSelected}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="px-2 py-0.5 rounded-full bg-secondary/50 text-xs font-medium">
                          {college.tier}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {college.students.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          {college.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Fixed Bottom Bar */}
      {selectedColleges.length > 0 && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="font-medium">{selectedColleges.length} colleges selected</span>
            </div>
            <Button variant="accent" onClick={handleSendInvites}>
              <Send className="w-4 h-4 mr-1" />
              Send Invites to Selected Colleges
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CollegeSelection;
