import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CreditCard, Search, Calendar, IndianRupee, FileText, Shield, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface FeeItem {
  category: string;
  label: string;
  amount: number;
}

interface Fee {
  id: string;
  title: string;
  description: string;
  fee_items: FeeItem[];
  total_amount?: number;
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
      const response = await api.fees.list();
      const feeData = response.results || response;
      // Filter only active fees for public display
      const activeFees = feeData.filter((fee: any) => fee.is_active);
      setFees(activeFees);
    } catch (error) {
      console.error("Error fetching fees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFees = fees.filter((fee) => {
    const matchesSearch = fee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.fee_items?.some(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === "all" ||
      fee.fee_items?.some(item => item.category === categoryFilter);

    const matchesDepartment = departmentFilter === "all" ||
      fee.department?.toLowerCase().includes(departmentFilter.toLowerCase());

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
    const formatted = new Intl.NumberFormat('en-IN').format(amount);
    return `Rs. ${formatted}/-`;
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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Fee Items */}
                      {fee.fee_items && fee.fee_items.length > 0 && (
                        <div className="space-y-2">
                          {fee.fee_items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant={getCategoryColor(item.category)} className="text-xs">
                                  {item.label}
                                </Badge>
                              </div>
                              <span className="font-semibold text-sm">
                                {formatCurrency(item.amount)}
                              </span>
                            </div>
                          ))}
                          {/* Total Amount */}
                          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border-2 border-primary/20 mt-3">
                            <IndianRupee className="h-5 w-5 text-primary" />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                              <p className="text-xl font-bold text-primary">
                                {fee.total_amount ? formatCurrency(fee.total_amount) : formatCurrency(
                                  fee.fee_items.reduce((sum, item) => sum + item.amount, 0)
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

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

      {/* Policies & Information Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Policies & Information</h2>

          <div className="grid gap-8">
            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Terms and Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Admission Terms</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="text-justify">• All admissions are subject to verification of documents and eligibility criteria</li>
                    <li className="text-justify">• Students must maintain minimum attendance of 75% as per university regulations</li>
                    <li className="text-justify">• Academic performance standards must be maintained throughout the program</li>
                    <li className="text-justify">• Disciplinary actions may result in suspension or expulsion from the university</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">General Terms</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="text-justify">• All fees must be paid within the stipulated time frame</li>
                    <li className="text-justify">• The university reserves the right to modify fee structure and policies</li>
                    <li className="text-justify">• Students are responsible for their personal belongings on campus</li>
                    <li className="text-justify">• Compliance with all university rules and regulations is mandatory</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Information Collection</h3>
                  <p className="text-muted-foreground text-justify">
                    We collect personal information including name, contact details, academic records, and financial information necessary for admission and academic purposes. This information is used solely for educational administration and student services.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Data Security</h3>
                  <p className="text-muted-foreground text-justify">
                    We implement robust security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All data is stored securely and access is limited to authorized personnel only.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Information Usage</h3>
                  <p className="text-muted-foreground text-justify">
                    Your information is used for admission processing, academic record maintenance, communication regarding university matters, and providing student services. We do not sell or share personal information with third parties without consent.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
                  <p className="text-muted-foreground text-justify">
                    You have the right to access, update, or request deletion of your personal information. Contact our data protection officer for any privacy-related concerns or requests.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Return and Refund Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <RefreshCw className="h-6 w-6" />
                  Return and Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Fee Refund Conditions</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="text-justify">
                      <strong>Before Course Commencement:</strong> 90% refund if withdrawal is made 30 days before course start
                    </li>
                    <li className="text-justify">
                      <strong>Within First Week:</strong> 75% refund if withdrawal is made within first week of classes
                    </li>
                    <li className="text-justify">
                      <strong>Within First Month:</strong> 50% refund if withdrawal is made within first month
                    </li>
                    <li className="text-justify">
                      <strong>After One Month:</strong> No refund applicable after completion of one month
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Refund Process</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="text-justify">• Written application must be submitted to the Accounts Department</li>
                    <li className="text-justify">• Original fee receipts and required documents must be provided</li>
                    <li className="text-justify">• Processing time: 15-30 working days from application date</li>
                    <li className="text-justify">• Refunds will be processed to the original payment method</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Non-Refundable Fees</h3>
                  <p className="text-muted-foreground text-justify">
                    Application fees, examination fees, and hostel security deposits are non-refundable under any circumstances.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeesPage;