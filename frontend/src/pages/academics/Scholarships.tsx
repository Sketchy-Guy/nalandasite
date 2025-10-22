import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search, Calendar, Users, ExternalLink, Award, DollarSign } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { format } from "date-fns";

interface Scholarship {
  id: string;
  title: string;
  description: string;
  eligibility_criteria: string;
  amount: number;
  application_deadline: string;
  application_url: string;
  created_at: string;
}

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await api.academicServices.list();
      // Filter for scholarship-related services
      const scholarshipData = (response.results || []).filter((item: any) => 
        item.category?.toLowerCase().includes('scholarship') || 
        item.title?.toLowerCase().includes('scholarship') ||
        item.title?.toLowerCase().includes('financial')
      );
      setScholarships(scholarshipData);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter((scholarship) => 
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.eligibility_criteria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg"></div>
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
            <Award className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Scholarships & Financial Assistance</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore various scholarship opportunities and financial assistance programs available for deserving students. Find support for your academic journey.
          </p>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-8 bg-accent/20 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Merit-Based</h3>
              <p className="text-sm text-muted-foreground">Scholarships for academic excellence</p>
            </div>
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Need-Based</h3>
              <p className="text-sm text-muted-foreground">Financial assistance for economically weaker sections</p>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Regular Updates</h3>
              <p className="text-sm text-muted-foreground">New opportunities added regularly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Scholarships Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredScholarships.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Scholarships Found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms to see more results."
                  : "New scholarship opportunities will be posted here soon."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{scholarship.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {scholarship.description}
                        </CardDescription>
                      </div>
                      {scholarship.application_deadline && (
                        <div className="flex flex-col items-end gap-2">
                          {isDeadlinePassed(scholarship.application_deadline) ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : isDeadlineApproaching(scholarship.application_deadline) ? (
                            <Badge variant="secondary">Deadline Soon</Badge>
                          ) : (
                            <Badge variant="default">Active</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Amount */}
                      {scholarship.amount && (
                        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Scholarship Amount</span>
                            <p className="text-xl font-bold text-primary">
                              {formatCurrency(scholarship.amount)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Eligibility Criteria */}
                      {scholarship.eligibility_criteria && (
                        <div>
                          <h4 className="font-medium mb-2">Eligibility Criteria:</h4>
                          <div className="text-sm text-muted-foreground bg-accent/20 p-3 rounded-lg">
                            <div dangerouslySetInnerHTML={{ __html: scholarship.eligibility_criteria.replace(/\n/g, '<br>') }} />
                          </div>
                        </div>
                      )}

                      {/* Application Deadline */}
                      {scholarship.application_deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Application Deadline: <span className="font-medium">
                              {format(new Date(scholarship.application_deadline), "dd MMM yyyy")}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Apply Button */}
                      {scholarship.application_url && !isDeadlinePassed(scholarship.application_deadline) && (
                        <Button 
                          onClick={() => window.open(scholarship.application_url, '_blank')}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* General Information */}
      <section className="py-12 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Application Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Read all eligibility criteria carefully before applying</li>
                    <li>• Submit complete applications with all required documents</li>
                    <li>• Apply well before the deadline to avoid last-minute issues</li>
                    <li>• Keep copies of all submitted documents for your records</li>
                    <li>• Check your email regularly for updates on your application</li>
                    <li>• Contact the scholarship office for any clarifications</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generally required documents (may vary by scholarship):
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Academic transcripts and certificates</li>
                    <li>• Income certificate (for need-based scholarships)</li>
                    <li>• Caste certificate (if applicable)</li>
                    <li>• Bank account details</li>
                    <li>• Passport-size photographs</li>
                    <li>• Identity proof (Aadhar card, etc.)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ScholarshipsPage;