import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, Clock, ExternalLink, Star, Ticket, Award, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface CampusEvent {
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

const Events = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('campus_events')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching campus events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'festival':
      case 'cultural':
        return Music;
      case 'competition':
      case 'contest':
        return Award;
      case 'workshop':
      case 'seminar':
        return Users;
      default:
        return Calendar;
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'festival':
      case 'cultural':
        return 'default';
      case 'competition':
      case 'contest':
        return 'destructive';
      case 'workshop':
      case 'seminar':
        return 'secondary';
      case 'sports':
        return 'outline';
      default:
        return 'secondary';
    }
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

  const featuredEvents = events.filter(event => event.is_featured);
  const upcomingEvents = events.filter(event => event.start_date && isUpcoming(event.start_date));
  const pastEvents = events.filter(event => event.start_date && !isUpcoming(event.start_date));

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
            <Badge variant="outline" className="mb-4">Campus Events</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Student Activities & Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover exciting events, festivals, competitions, and activities that make campus life vibrant. 
              From cultural festivals to technical workshops, there's always something happening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/festivals">
                  <Music className="mr-2 h-4 w-4" />
                  Campus Festivals
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Join Clubs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary mr-3" />
                Featured Events
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Don't miss these highlighted events and activities
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredEvents.map((event, index) => {
                const Icon = getEventIcon(event.event_type);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="group hover:shadow-xl transition-all hover:border-primary/20">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <Badge variant={getEventBadgeColor(event.event_type)}>
                                {event.event_type}
                              </Badge>
                              <Badge variant="outline" className="ml-2">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        {event.description && (
                          <CardDescription>{event.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {event.image_url && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          {event.start_date && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(event.start_date)}
                              {event.end_date && event.end_date !== event.start_date && (
                                <span> - {formatDate(event.end_date)}</span>
                              )}
                            </div>
                          )}
                          {event.venue && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.venue}
                            </div>
                          )}
                          {event.organizer && (
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              Organized by: {event.organizer}
                            </div>
                          )}
                          {event.max_participants && (
                            <div className="flex items-center text-muted-foreground">
                              <Ticket className="h-4 w-4 mr-2" />
                              Max participants: {event.max_participants}
                            </div>
                          )}
                        </div>

                        {event.registration_required && (
                          <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg">
                            <div className="flex items-center text-sm text-primary font-medium">
                              <Ticket className="h-4 w-4 mr-2" />
                              Registration Required
                            </div>
                            {event.registration_url && (
                              <Button size="sm" asChild>
                                <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Register
                                </a>
                              </Button>
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
      )}

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mark your calendars for these exciting upcoming activities
            </p>
          </motion.div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">
                Stay tuned for exciting upcoming events and activities.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => {
                const Icon = getEventIcon(event.event_type);
                return (
                  <motion.div
                    key={event.id}
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
                          <Badge variant={getEventBadgeColor(event.event_type)}>
                            {event.event_type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                        {event.description && (
                          <CardDescription className="line-clamp-2">
                            {event.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          {event.start_date && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(event.start_date)}
                            </div>
                          )}
                          {event.venue && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.venue}
                            </div>
                          )}
                        </div>

                        {event.registration_required && event.registration_url && (
                          <Button size="sm" className="w-full" asChild>
                            <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                              <Ticket className="h-4 w-4 mr-2" />
                              Register Now
                            </a>
                          </Button>
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
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Calendar className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Never Miss an Event</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stay connected with campus life and participate in events that interest you. 
              Join clubs, attend festivals, and be part of our vibrant community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Join Student Clubs
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/festivals">
                  <Music className="mr-2 h-4 w-4" />
                  Campus Festivals
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;