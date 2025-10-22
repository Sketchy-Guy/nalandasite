import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MapPin, Clock, BookOpen, Star, CheckCircle } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const OrientationPage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const orientationSchedule = [
    {
      day: "Day 1",
      date: "Registration & Welcome",
      activities: [
        "Student Registration & ID Card Distribution",
        "Welcome Address by Director",
        "Introduction to College Facilities",
        "Campus Tour"
      ]
    },
    {
      day: "Day 2", 
      date: "Academic Orientation",
      activities: [
        "Academic Policies & Procedures",
        "Course Structure & Curriculum",
        "Faculty Introduction",
        "Library & Laboratory Tour"
      ]
    },
    {
      day: "Day 3",
      date: "Student Life & Activities",
      activities: [
        "Student Clubs & Societies",
        "Sports & Recreation Facilities",
        "Cultural Activities Overview",
        "Student Support Services"
      ]
    }
  ];

  const keyHighlights = [
    {
      title: "Academic Excellence",
      description: "Learn about our rigorous academic programs and research opportunities",
      icon: <BookOpen className="h-6 w-6 text-primary" />
    },
    {
      title: "Campus Life",
      description: "Discover vibrant student life, clubs, and extracurricular activities",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      title: "Support Services",
      description: "Access counseling, career guidance, and academic support services",
      icon: <Star className="h-6 w-6 text-primary" />
    }
  ];

  const importantDates = [
    { event: "Orientation Registration", date: "July 15-20, 2024" },
    { event: "Orientation Programme", date: "July 25-27, 2024" },
    { event: "Academic Session Begins", date: "August 1, 2024" },
    { event: "Last Date for Fee Payment", date: "August 15, 2024" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Orientation Programme</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Welcome to our comprehensive orientation programme designed to help new students transition smoothly into college life. 
              Get acquainted with academic policies, campus facilities, and student services.
            </p>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Programme Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {keyHighlights.map((highlight, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {highlight.icon}
                  </div>
                  <CardTitle className="text-xl">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{highlight.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Orientation Schedule</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {orientationSchedule.map((day, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm font-semibold">
                      {day.day}
                    </Badge>
                    <CardTitle className="text-xl">{day.date}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Important Dates</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Academic Calendar 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {importantDates.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="font-medium">{item.event}</span>
                      <Badge variant="secondary">{item.date}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What to Bring</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Admission confirmation letter
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Original mark sheets & certificates
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Transfer certificate (if applicable)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Passport-size photographs (6 copies)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Identity proof (Aadhar card/Passport)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Notebook and pen for taking notes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Water bottle and light snacks
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Comfortable clothing and footwear
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Mobile phone with charger
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    Any prescribed medications
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Need Help?</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Contact Student Affairs Office</CardTitle>
                <CardDescription>For orientation-related queries and assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Student Affairs Office, First Floor<br />
                    Administrative Building
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM
                  </span>
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

export default OrientationPage;
