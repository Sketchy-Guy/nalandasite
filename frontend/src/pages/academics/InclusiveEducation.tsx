import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Accessibility, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const InclusiveEducationPage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const services = [
    {
      title: "Academic Support",
      description: "Personalized learning assistance, note-taking support, and extended time for examinations",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      features: [
        "Individual tutoring sessions",
        "Assistive technology support",
        "Modified assessment methods",
        "Academic counseling"
      ]
    },
    {
      title: "Accessibility Services",
      description: "Physical and digital accessibility solutions to ensure barrier-free education",
      icon: <Accessibility className="h-6 w-6 text-primary" />,
      features: [
        "Wheelchair accessible facilities",
        "Sign language interpreters",
        "Audio-visual aids",
        "Accessible digital content"
      ]
    },
    {
      title: "Counseling & Support",
      description: "Emotional and psychological support services for holistic development",
      icon: <Heart className="h-6 w-6 text-primary" />,
      features: [
        "Individual counseling sessions",
        "Peer support groups",
        "Family counseling",
        "Crisis intervention"
      ]
    },
    {
      title: "Career Guidance",
      description: "Specialized career counseling and placement assistance for diverse abilities",
      icon: <Users className="h-6 w-6 text-primary" />,
      features: [
        "Career assessment",
        "Skill development programs",
        "Job placement assistance",
        "Employer sensitization"
      ]
    }
  ];

  const eligibilityCriteria = [
    "Students with visual impairments",
    "Students with hearing impairments", 
    "Students with physical disabilities",
    "Students with learning disabilities",
    "Students with intellectual disabilities",
    "Students with multiple disabilities",
    "Students with autism spectrum disorders"
  ];

  const applicationProcess = [
    {
      step: 1,
      title: "Initial Assessment",
      description: "Submit medical certificates and disability documentation for evaluation"
    },
    {
      step: 2,
      title: "Needs Assessment", 
      description: "Meet with our specialists to identify specific support requirements"
    },
    {
      step: 3,
      title: "Support Plan",
      description: "Develop personalized support plan based on individual needs"
    },
    {
      step: 4,
      title: "Implementation",
      description: "Begin receiving support services as per the approved plan"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Inclusive Education Services</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Empowering students with diverse abilities through comprehensive support services, accessible infrastructure, 
              and inclusive learning environments. Every student deserves equal opportunities to excel.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Support Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
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
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Who Can Apply</h2>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Eligibility Criteria
                </CardTitle>
                <CardDescription>
                  Our inclusive education services are available for students with various types of disabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {eligibilityCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{criteria}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Application Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {applicationProcess.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Accessible Facilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Accessibility className="h-8 w-8 text-primary mx-auto mb-4" />
                <CardTitle>Physical Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>Ramps and elevators</li>
                  <li>Accessible restrooms</li>
                  <li>Reserved parking spaces</li>
                  <li>Tactile pathways</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mx-auto mb-4" />
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>Braille books and materials</li>
                  <li>Audio books and recordings</li>
                  <li>Large print materials</li>
                  <li>Digital accessibility tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                <CardTitle>Support Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>Trained support personnel</li>
                  <li>Sign language interpreters</li>
                  <li>Reading assistants</li>
                  <li>Mobility assistants</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Inclusive Education Cell</CardTitle>
                <CardDescription>Dedicated support for students with diverse abilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Inclusive Education Cell<br />
                    Student Welfare Building, Room 201
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+91-XXX-XXX-XXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">inclusive@college.edu</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
                <CardDescription>Visit us during these hours for assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Saturday:</span>
                    <span>9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-xs text-primary">
                      Emergency support available 24/7 through campus security
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

export default InclusiveEducationPage;
