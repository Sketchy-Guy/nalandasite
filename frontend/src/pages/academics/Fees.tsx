import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Fee {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  department: string;
  semester: string;
  academic_year: string;
  due_date: string;
  created_at: string;
}

const FeesPage = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await api.academicServices.list();
      // Filter for fee-related services
      const feeData = (response.results || []).filter((item: any) => 
        item.category?.toLowerCase().includes('fee') || 
        item.title?.toLowerCase().includes('fee')
      );
      setFees(feeData);
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFees = fees.filter((fee) => {
    const matchesSearch = fee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || fee.category === categoryFilter;
    const matchesDepartment = departmentFilter === "all" || fee.department === departmentFilter;
    
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tuition": return "default";
      case "hostel": return "secondary";
      case "exam": return "destructive";
      case "other": return "outline";
      default: return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Fees Structure</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Complete information about tuition fees, hostel charges, examination fees, and other academic expenses for all courses and departments.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-6 bg-accent/20 border-b">
        <div className="container mx-auto px-4">
          <div className="bg-accent/40 border border-accent rounded-lg p-4">
            <h3 className="font-semibold text-accent-foreground mb-2">Important Information</h3>
            <ul className="text-sm text-accent-foreground space-y-1">
              <li>• Fee payment can be made online through the official payment portal</li>
              <li>• Late payment may attract penalty charges as per institute policy</li>
              <li>• For any fee-related queries, contact the Accounts section</li>
              <li>• Scholarships and fee concessions are available for eligible students</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search fees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="tuition">Tuition Fees</SelectItem>
                <SelectItem value="hostel">Hostel Charges</SelectItem>
                <SelectItem value="exam">Examination Fees</SelectItem>
                <SelectItem value="other">Other Fees</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">Computer Science</SelectItem>
                <SelectItem value="IT">Information Technology</SelectItem>
                <SelectItem value="MCA">Master of Computer Applications</SelectItem>
                <SelectItem value="MBA">Master of Business Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Fees Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredFees.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Fee Information Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all" || departmentFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Fee structure information will be updated here soon."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFees.map((fee) => (
                <Card key={fee.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{fee.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {fee.description}
                        </CardDescription>
                      </div>
                      <Badge variant={getCategoryColor(fee.category)}>
                        {fee.category.charAt(0).toUpperCase() + fee.category.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Amount */}
                      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Amount</span>
                          <p className="text-xl font-bold text-primary">
                            {fee.amount ? formatCurrency(fee.amount) : "TBA"}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        {fee.department && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Department:</span>
                            <Badge variant="outline">{fee.department}</Badge>
                          </div>
                        )}
                        {fee.semester && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Semester:</span>
                            <Badge variant="outline">{fee.semester}</Badge>
                          </div>
                        )}
                        {fee.academic_year && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Academic Year:</span>
                            <Badge variant="outline">{fee.academic_year}</Badge>
                          </div>
                        )}
                        {fee.due_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Due: {format(new Date(fee.due_date), "dd MMM yyyy")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FeesPage;