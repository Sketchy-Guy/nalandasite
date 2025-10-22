import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, Users, MapPin, Phone, Mail, Wifi, Car, Utensils, Shield, Clock, DollarSign, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface HostelInfo {
  id: string;
  name: string;
  description: string;
  hostel_type: string;
  capacity: number;
  rooms_available: number;
  facilities: string[];
  rules: string;
  fee_structure: any;
  warden_name?: string;
  warden_contact?: string;
  image_url?: string;
  is_active: boolean;
}

const Hostel = () => {
  const [hostels, setHostels] = useState<HostelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const { data, error } = await supabase
        .from('hostel_info')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setHostels(data || []);
    } catch (error) {
      console.error('Error fetching hostel information:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHostelIcon = (type: string) => {
    return type === 'boys' ? User : Users;
  };

  const getHostelBadgeVariant = (type: string) => {
    return type === 'boys' ? 'default' : 'secondary';
  };

  const getFacilityIcon = (facility: string) => {
    const lower = facility.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return Wifi;
    if (lower.includes('parking')) return Car;
    if (lower.includes('mess') || lower.includes('food')) return Utensils;
    if (lower.includes('security')) return Shield;
    return Home;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">Accommodation</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Hostel Life
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Comfortable, secure, and well-equipped accommodation designed to be your home away from home. 
              Experience community living with modern amenities and a supportive environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/amenities">
                  <Home className="mr-2 h-4 w-4" />
                  Campus Amenities
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/activities">
                  <Users className="mr-2 h-4 w-4" />
                  Community Events
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hostel Information */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Hostel Facilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Modern accommodation with all essential amenities for a comfortable stay
            </p>
          </motion.div>

          {hostels.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Hostel Information Available</h3>
              <p className="text-muted-foreground">
                Hostel details and accommodation information will be available soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {hostels.map((hostel, index) => {
                const Icon = getHostelIcon(hostel.hostel_type);
                return (
                  <motion.div
                    key={hostel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <Badge variant={getHostelBadgeVariant(hostel.hostel_type)}>
                            {hostel.hostel_type} hostel
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{hostel.name}</CardTitle>
                        {hostel.description && (
                          <CardDescription>{hostel.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {hostel.image_url && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={hostel.image_url} 
                              alt={hostel.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Capacity and Availability */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{hostel.capacity}</div>
                            <div className="text-sm text-muted-foreground">Total Capacity</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{hostel.rooms_available}</div>
                            <div className="text-sm text-muted-foreground">Rooms Available</div>
                          </div>
                        </div>

                        {/* Facilities */}
                        {hostel.facilities && hostel.facilities.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-3">Facilities</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {hostel.facilities.map((facility, idx) => {
                                const FacilityIcon = getFacilityIcon(facility);
                                return (
                                  <div key={idx} className="flex items-center text-sm text-muted-foreground">
                                    <FacilityIcon className="h-3 w-3 mr-2" />
                                    {facility}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Fee Structure */}
                        {hostel.fee_structure && (
                          <div>
                            <h4 className="font-medium mb-3 flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Fee Structure
                            </h4>
                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                              {typeof hostel.fee_structure === 'object' && hostel.fee_structure ? 
                                Object.entries(hostel.fee_structure as Record<string, any>).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                                    <span className="font-medium">₹{value}</span>
                                  </div>
                                ))
                                : 
                                <div>{String(hostel.fee_structure)}</div>
                              }
                            </div>
                          </div>
                        )}

                        {/* Warden Information */}
                        {(hostel.warden_name || hostel.warden_contact) && (
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Warden Information</h4>
                            <div className="space-y-2">
                              {hostel.warden_name && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <User className="h-3 w-3 mr-2" />
                                  {hostel.warden_name}
                                </div>
                              )}
                              {hostel.warden_contact && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 mr-2" />
                                  {hostel.warden_contact}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Rules */}
                        {hostel.rules && (
                          <div>
                            <h4 className="font-medium mb-3 flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              Rules & Regulations
                            </h4>
                            <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
                              {hostel.rules}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Home className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Ready to Make It Your Home?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience comfortable living with a vibrant community of students. 
              Our hostels provide the perfect environment for academic success and personal growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/activities">
                  <Users className="mr-2 h-4 w-4" />
                  Community Life
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/amenities">
                  <MapPin className="mr-2 h-4 w-4" />
                  Campus Facilities
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hostel;