import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Phone, Mail, Calendar } from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  location: string;
  operating_hours: string;
  features: string[];
  booking_required: boolean;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  is_active: boolean;
}

export default function OtherFacilities() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    const { data, error } = await supabase
      .from('amenities')
      .select('*')
      .eq('category', 'other')
      .order('name');

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-primary/20 to-accent/20 flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574618298473-7341159b5f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Other Facilities</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Discover additional facilities and services available on campus to enhance your academic and personal experience.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {facilities.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Additional Facilities Coming Soon</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are continuously working to expand our campus facilities. Check back soon for updates on new amenities and services.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {facility.image_url && (
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${facility.image_url})` }} />
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{facility.category}</Badge>
                    {facility.booking_required && (
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Booking Required
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{facility.name}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{facility.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    {facility.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{facility.location}</span>
                      </div>
                    )}
                    
                    {facility.operating_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{facility.operating_hours}</span>
                      </div>
                    )}
                  </div>

                  {facility.features && facility.features.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {facility.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {(facility.contact_person || facility.contact_phone || facility.contact_email) && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Contact Information:</h4>
                      <div className="space-y-1 text-sm">
                        {facility.contact_person && (
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-primary" />
                            <span>{facility.contact_person}</span>
                          </div>
                        )}
                        
                        {facility.contact_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-primary" />
                            <span>{facility.contact_phone}</span>
                          </div>
                        )}
                        
                        {facility.contact_email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-primary" />
                            <span>{facility.contact_email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Default Facilities Section if no database content */}
        {facilities.length === 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Common Campus Facilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder cards for common facilities */}
              <Card className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Parking Facilities</h3>
                <p className="text-sm text-muted-foreground">Secure parking spaces for students, faculty, and visitors</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Student Lounge</h3>
                <p className="text-sm text-muted-foreground">Comfortable spaces for students to relax and socialize</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">24/7 Security</h3>
                <p className="text-sm text-muted-foreground">Round-the-clock security services for campus safety</p>
              </Card>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}