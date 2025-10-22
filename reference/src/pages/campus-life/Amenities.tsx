import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock, Phone, Mail, User, Coffee, BookOpen, Wifi, Car, Utensils } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Amenity {
  id: string;
  name: string;
  description: string;
  category: string;
  location?: string;
  operating_hours?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  image_url?: string;
  features: string[];
  booking_required: boolean;
  is_active: boolean;
}

const Amenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setAmenities(data || []);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAmenityIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dining':
      case 'food':
        return Utensils;
      case 'library':
      case 'study':
        return BookOpen;
      case 'recreation':
      case 'entertainment':
        return Coffee;
      case 'parking':
      case 'transport':
        return Car;
      case 'technology':
      case 'internet':
        return Wifi;
      default:
        return MapPin;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'dining':
      case 'food':
        return 'default';
      case 'library':
      case 'study':
        return 'secondary';
      case 'recreation':
      case 'entertainment':
        return 'outline';
      case 'parking':
      case 'transport':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  if (loading) {
    return (
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
            <Badge variant="outline" className="mb-4">Campus Facilities</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Campus Amenities
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover all the facilities and services available on campus. From dining and recreation 
              to study spaces and essential services, we've got everything you need for a comfortable campus life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/hostel">
                  <MapPin className="mr-2 h-4 w-4" />
                  Hostel Facilities
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/sports">
                  <Coffee className="mr-2 h-4 w-4" />
                  Sports Facilities
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Amenities by Category */}
      {Object.keys(groupedAmenities).length === 0 ? (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Amenities Available</h3>
            <p className="text-muted-foreground">
              Campus amenities information will be available soon.
            </p>
          </div>
        </section>
      ) : (
        Object.entries(groupedAmenities).map(([category, categoryAmenities], categoryIndex) => (
          <section key={category} className={`py-16 px-4 ${categoryIndex % 2 === 1 ? 'bg-muted/30' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold mb-4 capitalize">{category} Facilities</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {category === 'dining' && "Nutritious meals and refreshments available on campus"}
                  {category === 'library' && "Quiet study spaces and extensive book collections"}
                  {category === 'recreation' && "Entertainment and relaxation facilities"}
                  {category === 'parking' && "Secure parking and transportation services"}
                  {!['dining', 'library', 'recreation', 'parking'].includes(category) && `Essential ${category.toLowerCase()} services for students`}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryAmenities.map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity.category);
                  return (
                    <motion.div
                      key={amenity.id}
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
                            <Badge variant={getCategoryBadgeColor(amenity.category)}>
                              {amenity.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{amenity.name}</CardTitle>
                          {amenity.description && (
                            <CardDescription>{amenity.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {amenity.image_url && (
                            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                              <img 
                                src={amenity.image_url} 
                                alt={amenity.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <div className="space-y-2 text-sm">
                            {amenity.location && (
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                {amenity.location}
                              </div>
                            )}
                            {amenity.operating_hours && (
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="h-4 w-4 mr-2" />
                                {amenity.operating_hours}
                              </div>
                            )}
                            {amenity.booking_required && (
                              <div className="flex items-center text-orange-600">
                                <Phone className="h-4 w-4 mr-2" />
                                Booking required
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          {amenity.features && amenity.features.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 text-sm">Features:</h4>
                              <div className="flex flex-wrap gap-1">
                                {amenity.features.slice(0, 3).map((feature, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {amenity.features.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{amenity.features.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Contact Information */}
                          {(amenity.contact_person || amenity.contact_phone || amenity.contact_email) && (
                            <div className="border-t pt-4 space-y-2">
                              <h4 className="font-medium text-sm">Contact Information</h4>
                              {amenity.contact_person && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <User className="h-3 w-3 mr-2" />
                                  {amenity.contact_person}
                                </div>
                              )}
                              {amenity.contact_phone && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 mr-2" />
                                  {amenity.contact_phone}
                                </div>
                              )}
                              {amenity.contact_email && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3 mr-2" />
                                  {amenity.contact_email}
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
            </div>
          </section>
        ))
      )}

      {/* Essential Services Overview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Essential Campus Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key facilities and services that support your daily campus life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Library Services</CardTitle>
                <CardDescription>
                  Extensive collections, study spaces, and research facilities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Utensils className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Dining Facilities</CardTitle>
                <CardDescription>
                  Cafeteria, mess halls, and food courts with diverse options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Wifi className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Technology Services</CardTitle>
                <CardDescription>
                  Campus-wide Wi-Fi, computer labs, and tech support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Car className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Transportation</CardTitle>
                <CardDescription>
                  Parking facilities and campus shuttle services
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <MapPin className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Everything You Need on Campus</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our comprehensive facilities ensure you have access to everything you need for 
              a comfortable and productive campus experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/hostel">
                  <MapPin className="mr-2 h-4 w-4" />
                  Accommodation
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/overview">
                  <Coffee className="mr-2 h-4 w-4" />
                  Campus Life Overview
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Amenities;