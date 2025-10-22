import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Clock, CheckCircle, AlertCircle, Phone, Mail, MapPin } from "lucide-react";

interface AcademicPage {
  id: string;
  title: string;
  content: string;
  slug: string;
}

const TranscriptsPage = () => {
  const [pageContent, setPageContent] = useState<AcademicPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const { data, error } = await supabase
        .from("academic_pages")
        .select("*")
        .eq("slug", "transcripts")
        .eq("is_active", true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPageContent(data);
    } catch (error) {
      console.error("Error fetching page content:", error);
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      title: "Official Transcripts",
      description: "Certified academic transcripts with official seal and signature",
      processingTime: "5-7 working days",
      fee: "₹500 per transcript",
      icon: <FileText className="h-6 w-6 text-primary" />,
      requirements: [
        "Completed application form",
        "Copy of student ID",
        "Fee payment receipt",
        "Address proof for delivery"
      ]
    },
    {
      title: "Duplicate Degree Certificate",
      description: "Replacement degree certificate for lost or damaged originals",
      processingTime: "10-15 working days",
      fee: "₹2000 per certificate",
      icon: <FileText className="h-6 w-6 text-primary" />,
      requirements: [
        "Police complaint copy (if lost)",
        "Affidavit on stamp paper",
        "Original fee receipt",
        "Identity proof"
      ]
    },
    {
      title: "Provisional Certificate",
      description: "Temporary certificate issued before degree conferment",
      processingTime: "3-5 working days",
      fee: "₹300 per certificate",
      icon: <FileText className="h-6 w-6 text-primary" />,
      requirements: [
        "All semester mark sheets",
        "Fee clearance certificate",
        "Library clearance",
        "Completed application"
      ]
    },
    {
      title: "Character Certificate",
      description: "Certificate of good conduct during the course of study",
      processingTime: "2-3 working days",
      fee: "₹200 per certificate",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      requirements: [
        "Application form",
        "Copy of degree/provisional",
        "Fee payment",
        "Identity proof"
      ]
    }
  ];

  const applicationProcess = [
    {
      step: 1,
      title: "Download Application Form",
      description: "Download the relevant application form from the downloads section or collect from the Academic Office.",
      icon: <FileText className="h-5 w-5" />
    },
    {
      step: 2,
      title: "Complete Application",
      description: "Fill the application form completely with accurate information and attach required documents.",
      icon: <FileText className="h-5 w-5" />
    },
    {
      step: 3,
      title: "Payment of Fees",
      description: "Pay the prescribed fees through the online payment portal or at the Accounts Office.",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      step: 4,
      title: "Submit Application",
      description: "Submit the completed application with documents and fee receipt to the Academic Office.",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      step: 5,
      title: "Processing & Verification",
      description: "Your application will be processed and documents verified by the academic department.",
      icon: <Clock className="h-5 w-5" />
    },
    {
      step: 6,
      title: "Collection/Delivery",
      description: "Collect from the office or receive by post as per your preference mentioned in the application.",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Transcripts & Academic Services</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Apply for official transcripts, duplicate certificates, and other academic documents. All services are processed efficiently with proper verification.
          </p>
        </div>
      </section>

      {/* Dynamic Content */}
      {pageContent && (
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: pageContent.content }} />
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Available Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {service.icon}
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{service.processingTime}</span>
                      </div>
                      <Badge variant="outline">{service.fee}</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Required Documents:</h4>
                      <ul className="text-sm space-y-1">
                        {service.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-12 bg-accent/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Application Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {applicationProcess.map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-primary">
                    {step.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• All applications must be submitted with complete documentation</li>
                  <li>• Processing time excludes holidays and weekends</li>
                  <li>• Fees are non-refundable once application is processed</li>
                  <li>• Original documents may be required for verification</li>
                  <li>• Address any discrepancies before certificate issuance</li>
                  <li>• Courier charges are additional for postal delivery</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Academic Office</p>
                      <p className="text-sm text-muted-foreground">
                        Nalanda Institute of Technology<br />
                        Bhubaneswar, Odisha
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">+91 674 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">academic@nalandainstitute.edu</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Office Hours:</p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TranscriptsPage;