import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Calendar, Users, ExternalLink, CheckCircle, Clock, AlertCircle, Phone, MapPin, Mail } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface TranscriptService {
  id: string;
  service_name: string;
  description: string | null;
  processing_time: string | null;
  required_documents: string[] | null;
  fees_amount: number | null;
  contact_email: string | null;
  is_online: boolean;
  is_active: boolean;
  created_at: string;
}

const TranscriptsPage = () => {
  const [services, setServices] = useState<TranscriptService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transcript-services/`);
      if (response.ok) {
        const data = await response.json();
        // Handle both array and paginated responses
        const servicesData = Array.isArray(data) ? data : (data.results || []);
        // Filter only active services for public view
        const activeServices = servicesData.filter((s: TranscriptService) => s.is_active);
        setServices(activeServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Free';
    const formatted = new Intl.NumberFormat('en-IN').format(amount);
    return `Rs. ${formatted}/-`;
  };


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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
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
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Transcripts & Academic Services</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Apply for official transcripts, duplicate certificates, and other academic documents. All services are processed efficiently with proper verification.
          </p>
        </div>
      </section>


      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Available Services</h2>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <FileText className="h-6 w-6 text-primary" />
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{service.service_name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{service.processing_time || 'Contact office'}</span>
                        </div>
                        <Badge variant="outline">{formatCurrency(service.fees_amount)}</Badge>
                      </div>

                      {service.is_online && (
                        <Badge variant="default" className="mb-2">Online Service Available</Badge>
                      )}

                      <Separator />

                      {service.required_documents && service.required_documents.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Required Documents:</h4>
                          <ul className="text-sm space-y-1">
                            {service.required_documents.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.contact_email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {service.contact_email}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Services Available</h3>
              <p className="text-muted-foreground">
                Transcript services information will be updated here soon.
              </p>
            </div>
          )}
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

      <Footer />
    </div>
  );
};

export default TranscriptsPage;