import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, FileText, AlertCircle, CheckCircle, Clock, Phone, Mail, MapPin } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const DuplicateDegreePage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const requirements = [
    "Police complaint copy (if degree is lost)",
    "Affidavit on stamp paper (₹100)",
    "Original fee receipt of degree",
    "Copy of mark sheets/transcripts",
    "Identity proof (Aadhar card/Passport)",
    "Two passport-size photographs",
    "Address proof for delivery"
  ];

  const processSteps = [
    {
      step: 1,
      title: "Submit Application",
      description: "Fill the application form and submit with required documents",
      icon: <FileText className="h-5 w-5" />
    },
    {
      step: 2,
      title: "Document Verification",
      description: "Academic office verifies submitted documents and eligibility",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      step: 3,
      title: "Fee Payment",
      description: "Pay the prescribed fee of ₹2000 through online portal or cash",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      step: 4,
      title: "Processing",
      description: "Duplicate degree is prepared and verified by authorized officials",
      icon: <Clock className="h-5 w-5" />
    },
    {
      step: 5,
      title: "Collection",
      description: "Collect the duplicate degree from Academic Office or by post",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Duplicate Degree Certificate</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Apply for a duplicate degree certificate in case of loss, damage, or name change. Get your official replacement certificate with proper verification.
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-amber-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Important Information</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Processing time: 15-20 working days</li>
                <li>• Fee: ₹2000 (non-refundable)</li>
                <li>• Police complaint is mandatory for lost certificates</li>
                <li>• Original degree will be cancelled upon issuance of duplicate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Required Documents</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Document Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">₹2,000</div>
                  <div className="text-sm text-muted-foreground">Processing Fee</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Application Fee:</span>
                    <span>₹500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificate Fee:</span>
                    <span>₹1,500</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹2,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Application Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
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

      {/* Contact Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Academic Office</CardTitle>
                <CardDescription>For application submission and queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Academic Section, Ground Floor<br />
                    Administrative Building
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+91-XXX-XXX-XXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">academic@college.edu</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
                <CardDescription>Visit during these hours for assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
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

export default DuplicateDegreePage;
