import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, User, Building } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface ContactInfo {
  id: string;
  office_name: string;
  address: string;
  phone: string;
  email: string;
  office_hours: string;
  contact_person: string;
  designation: string;
  department: string;
  image_url?: string;
}

interface OfficeLocation {
  id: string;
  name: string;
  building: string;
  floor: string;
  room_number: string;
  address: string;
  phone: string;
  email: string;
  office_hours: string;
  is_main_office: boolean;
  image_url?: string;
}

interface QuickContactInfo {
  main_phone: string;
  main_email: string;
  main_address: string;
  general_inquiries_email: string;
  admissions_email: string;
  placement_email: string;
  emergency_phone: string;
  website_url: string;
  social_media_links: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  is_active: boolean;
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [quickContactInfo, setQuickContactInfo] = useState<QuickContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    department: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactResponse, locationsResponse, quickContactResponse] = await Promise.all([
        api.contactInfo.list({ is_active: true, ordering: 'display_order' }),
        api.officeLocations.list({ is_active: true, ordering: '-is_main_office' }),
        api.quickContactInfo.list({ is_active: true })
      ]);

      if (contactResponse.results) setContactInfo(contactResponse.results);
      if (locationsResponse.results) setOfficeLocations(locationsResponse.results);
      
      // Fetch quick contact info from Django API
      if (quickContactResponse.results && quickContactResponse.results.length > 0) {
        setQuickContactInfo(quickContactResponse.results[0]); // Use first record
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      department: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 to-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us for any queries, admissions, or information about our institute
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department/Office</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g., Admissions, CSE, MBA"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Main Office Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Office Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {officeLocations.map((location) => (
                  <div key={location.id} className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-lg">{location.name}</h4>
                    {location.is_main_office && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        Main Office
                      </span>
                    )}
                    <div className="space-y-2 mt-2 text-sm text-muted-foreground">
                      {location.building && (
                        <p className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {location.building}
                          {location.floor && `, Floor ${location.floor}`}
                          {location.room_number && `, Room ${location.room_number}`}
                        </p>
                      )}
                      {location.address && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {location.address}
                        </p>
                      )}
                      {location.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {location.phone}
                        </p>
                      )}
                      {location.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {location.email}
                        </p>
                      )}
                      {location.office_hours && (
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {location.office_hours}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Department Contacts */}
            {contactInfo.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Department Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((info) => (
                    <div key={info.id} className="border-l-4 border-accent pl-4">
                      <h4 className="font-semibold">{info.office_name}</h4>
                      {info.contact_person && (
                        <p className="text-sm text-muted-foreground">
                          {info.contact_person}
                          {info.designation && ` - ${info.designation}`}
                        </p>
                      )}
                      <div className="space-y-1 mt-2 text-sm">
                        {info.phone && (
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {info.phone}
                          </p>
                        )}
                        {info.email && (
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {info.email}
                          </p>
                        )}
                        {info.office_hours && (
                          <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {info.office_hours}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Contact */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle>Quick Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickContactInfo ? (
                  <div className="space-y-4">
                    {/* Main Contact Information */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-primary">Main Contact</h4>
                      {quickContactInfo.main_phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-sm">Phone</p>
                            <p className="text-sm text-muted-foreground">{quickContactInfo.main_phone}</p>
                          </div>
                        </div>
                      )}
                      {quickContactInfo.main_email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-sm">Email</p>
                            <p className="text-sm text-muted-foreground">{quickContactInfo.main_email}</p>
                          </div>
                        </div>
                      )}
                      {quickContactInfo.main_address && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-sm">Address</p>
                            <p className="text-sm text-muted-foreground">
                              {quickContactInfo.main_address.split('\n').map((line, index) => (
                                <span key={index}>
                                  {line}
                                  {index < quickContactInfo.main_address.split('\n').length - 1 && <br />}
                                </span>
                              ))}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Department Emails */}
                    {(quickContactInfo.general_inquiries_email || quickContactInfo.admissions_email || quickContactInfo.placement_email) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-primary">Department Contacts</h4>
                        {quickContactInfo.general_inquiries_email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium text-sm">General Inquiries</p>
                              <p className="text-sm text-muted-foreground">{quickContactInfo.general_inquiries_email}</p>
                            </div>
                          </div>
                        )}
                        {quickContactInfo.admissions_email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium text-sm">Admissions</p>
                              <p className="text-sm text-muted-foreground">{quickContactInfo.admissions_email}</p>
                            </div>
                          </div>
                        )}
                        {quickContactInfo.placement_email && (
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium text-sm">Placement</p>
                              <p className="text-sm text-muted-foreground">{quickContactInfo.placement_email}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Emergency Contact */}
                    {quickContactInfo.emergency_phone && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-red-600">Emergency Contact</h4>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="font-medium text-sm">Emergency Phone</p>
                            <p className="text-sm text-muted-foreground">{quickContactInfo.emergency_phone}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Website & Social Media */}
                    {(quickContactInfo.website_url || quickContactInfo.social_media_links?.facebook || quickContactInfo.social_media_links?.twitter || quickContactInfo.social_media_links?.linkedin || quickContactInfo.social_media_links?.instagram) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-primary">Online Presence</h4>
                        {quickContactInfo.website_url && (
                          <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded bg-primary flex items-center justify-center">
                              <span className="text-white text-xs font-bold">W</span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">Website</p>
                              <a 
                                href={quickContactInfo.website_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline"
                              >
                                {quickContactInfo.website_url}
                              </a>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {quickContactInfo.social_media_links?.facebook && (
                            <a 
                              href={quickContactInfo.social_media_links.facebook} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                            >
                              <span>📘</span> Facebook
                            </a>
                          )}
                          {quickContactInfo.social_media_links?.twitter && (
                            <a 
                              href={quickContactInfo.social_media_links.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-400 text-white text-xs rounded hover:bg-blue-500 transition-colors"
                            >
                              <span>🐦</span> Twitter
                            </a>
                          )}
                          {quickContactInfo.social_media_links?.linkedin && (
                            <a 
                              href={quickContactInfo.social_media_links.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-800 transition-colors"
                            >
                              <span>💼</span> LinkedIn
                            </a>
                          )}
                          {quickContactInfo.social_media_links?.instagram && (
                            <a 
                              href={quickContactInfo.social_media_links.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-pink-600 text-white text-xs rounded hover:bg-pink-700 transition-colors"
                            >
                              <span>📷</span> Instagram
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Main Office</p>
                    <p className="text-sm text-muted-foreground">+91-XXX-XXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">General Inquiries</p>
                    <p className="text-sm text-muted-foreground">info@nitinstitute.edu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      NIT Campus, Technology Road,<br />
                      City, State - 123456
                    </p>
                  </div>
                </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Find Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive Campus Map Coming Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
      <Footer />
    </div>
  );
}