import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Clock, Users, Calendar, Phone, Mail, Dumbbell, Target, Award } from 'lucide-react';
import { api } from '@/lib/api';
import { Link } from 'react-router-dom';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface SportsFacilityImage {
  id: string;
  image: string;
  image_url: string;
  display_order: number;
}

interface SportsFacility {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  facility_type: string;
  capacity?: number;
  operating_hours?: string;
  booking_required: boolean;
  contact_person?: string;
  contact_email?: string;
  images: SportsFacilityImage[];
  is_active: boolean;
}

const Sports = () => {
  const [facilities, setFacilities] = useState<SportsFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await api.sportsFacilities.list({ is_active: true, ordering: 'name' });
      const data = Array.isArray(response) ? response : (response.results || []);
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching sports facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gym':
      case 'fitness':
        return Dumbbell;
      case 'outdoor':
        return Target;
      case 'indoor':
        return Trophy;
      default:
        return Award;
    }
  };

  const getFacilityBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'outdoor':
        return 'default';
      case 'indoor':
        return 'secondary';
      case 'gym':
      case 'fitness':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <Skeleton className="h-12 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto mb-8" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-4">Sports & Recreation</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Sports Excellence
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                State-of-the-art sports facilities and programs to keep you active, healthy, and competitive.
                Join our sports community and unleash your athletic potential.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Sports Facilities */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Our Sports Facilities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                World-class facilities designed to support athletes of all levels
              </p>
            </motion.div>

            {facilities.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Facilities Available</h3>
                <p className="text-muted-foreground">
                  Sports facilities information will be available soon.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((facility, index) => {
                  const Icon = getFacilityIcon(facility.facility_type);
                  return (
                    <motion.div
                      key={facility.id}
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
                            <Badge variant={getFacilityBadgeColor(facility.facility_type)}>
                              {facility.facility_type}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{facility.name}</CardTitle>
                          {facility.description && (
                            <CardDescription>{facility.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Image Gallery */}
                          {facility.images && facility.images.length > 0 && (
                            <div className={`grid gap-2 ${facility.images.length === 1 ? 'grid-cols-1' :
                              facility.images.length === 2 ? 'grid-cols-2' :
                                facility.images.length === 3 ? 'grid-cols-3' :
                                  'grid-cols-2'
                              }`}>
                              {facility.images.slice(0, 4).map((image, idx) => (
                                <div
                                  key={image.id}
                                  className={`${facility.images.length === 4 && idx === 0 ? 'col-span-2' : ''
                                    } aspect-video rounded-lg overflow-hidden bg-muted`}
                                >
                                  <img
                                    src={image.image_url}
                                    alt={`${facility.name} - Image ${idx + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="space-y-2 text-sm">
                            {facility.capacity && (
                              <div className="flex items-center text-muted-foreground">
                                <Users className="h-4 w-4 mr-2" />
                                Capacity: {facility.capacity} people
                              </div>
                            )}
                            {facility.operating_hours && (
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="h-4 w-4 mr-2" />
                                {facility.operating_hours}
                              </div>
                            )}
                            {facility.booking_required && (
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                Booking required
                              </div>
                            )}
                          </div>

                          {(facility.contact_person || facility.contact_email) && (
                            <div className="border-t pt-4 space-y-2">
                              <h4 className="font-medium text-sm">Contact Information</h4>
                              {facility.contact_person && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 mr-2" />
                                  {facility.contact_person}
                                </div>
                              )}
                              {facility.contact_email && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3 mr-2" />
                                  {facility.contact_email}
                                </div>
                              )}
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
              <Trophy className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Ready to Get Active?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our sports community and discover your athletic potential.
                Whether you're a beginner or a seasoned athlete, we have something for everyone.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Sports;