import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Music, Calendar, MapPin, Users, Ticket, Star, Award, Sparkles, PartyPopper } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Festival {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date?: string;
  end_date?: string;
  venue?: string;
  organizer?: string;
  image_url?: string;
  registration_required: boolean;
  registration_url?: string;
  max_participants?: number;
  is_featured: boolean;
  is_active: boolean;
}

const Festivals = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      const { data, error } = await supabase
        .from('campus_events')
        .select('*')
        .in('event_type', ['festival', 'cultural'])
        .eq('is_active', true)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setFestivals(data || []);
    } catch (error) {
      console.error('Error fetching festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFestivalIcon = (type: string) => {
    return type === 'cultural' ? Music : PartyPopper;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const featuredFestivals = festivals.filter(festival => festival.is_featured);
  const upcomingFestivals = festivals.filter(festival => 
    festival.start_date && isUpcoming(festival.start_date) && !festival.is_featured
  );
  const pastFestivals = festivals.filter(festival => 
    festival.start_date && !isUpcoming(festival.start_date) && !festival.is_featured
  );

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
            <Badge variant="outline" className="mb-4">Campus Celebrations</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Campus Festivals
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Experience the vibrant cultural life of our campus through exciting festivals, 
              cultural events, and celebrations that bring our community together throughout the year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/activities">
                  <Calendar className="mr-2 h-4 w-4" />
                  All Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Cultural Clubs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Festivals */}
      {featuredFestivals.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary mr-3" />
                Featured Festivals
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't miss our signature festivals and major cultural celebrations
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredFestivals.map((festival, index) => {
                const Icon = getFestivalIcon(festival.event_type);
                return (
                  <motion.div
                    key={festival.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="group hover:shadow-xl transition-all hover:border-primary/20 overflow-hidden">
                      {festival.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={festival.image_url} 
                            alt={festival.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <Badge variant="default">
                                {festival.event_type}
                              </Badge>
                              <Badge variant="outline" className="ml-2">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{festival.title}</CardTitle>
                        {festival.description && (
                          <CardDescription>{festival.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          {festival.start_date && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(festival.start_date)}
                              {festival.end_date && festival.end_date !== festival.start_date && (
                                <span> - {formatDate(festival.end_date)}</span>
                              )}
                              {festival.start_date && isUpcoming(festival.start_date) && (
                                <Badge variant="outline" className="ml-2 text-xs">Upcoming</Badge>
                              )}
                            </div>
                          )}
                          {festival.venue && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {festival.venue}
                            </div>
                          )}
                          {festival.organizer && (
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              Organized by: {festival.organizer}
                            </div>
                          )}
                        </div>

                        {festival.registration_required && (
                          <div className="bg-primary/5 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-primary font-medium">
                                <Ticket className="h-4 w-4 mr-2" />
                                Registration Required
                              </div>
                              {festival.registration_url && (
                                <Button size="sm" asChild>
                                  <a href={festival.registration_url} target="_blank" rel="noopener noreferrer">
                                    Register Now
                                  </a>
                                </Button>
                              )}
                            </div>
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
      )}

      {/* Upcoming Festivals */}
      {upcomingFestivals.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Upcoming Festivals</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Mark your calendars for these exciting upcoming cultural celebrations
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingFestivals.map((festival, index) => {
                const Icon = getFestivalIcon(festival.event_type);
                return (
                  <motion.div
                    key={festival.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge variant="secondary">
                            {festival.event_type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{festival.title}</CardTitle>
                        {festival.description && (
                          <CardDescription className="line-clamp-2">
                            {festival.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          {festival.start_date && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(festival.start_date)}
                            </div>
                          )}
                          {festival.venue && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {festival.venue}
                            </div>
                          )}
                        </div>

                        {festival.registration_required && festival.registration_url && (
                          <Button size="sm" className="w-full" asChild>
                            <a href={festival.registration_url} target="_blank" rel="noopener noreferrer">
                              <Ticket className="h-4 w-4 mr-2" />
                              Register
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Festival Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Types of Festivals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our diverse range of festivals celebrates different aspects of campus culture
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Music className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Cultural Festivals</CardTitle>
                <CardDescription>
                  Celebrating diverse cultures, traditions, and artistic expressions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Achievement Fests</CardTitle>
                <CardDescription>
                  Recognizing academic excellence and student accomplishments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardHeader>
                <PartyPopper className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Seasonal Celebrations</CardTitle>
                <CardDescription>
                  Holiday celebrations and seasonal festivities throughout the year
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <CardTitle>Special Events</CardTitle>
                <CardDescription>
                  Unique celebrations and milestone commemorations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-muted/30 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <PartyPopper className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Join the Celebration</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Be part of our vibrant festival culture. Participate, volunteer, or simply 
              enjoy the festivities that make campus life memorable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/activities">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Join Event Clubs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Festivals;