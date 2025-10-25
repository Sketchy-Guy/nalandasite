import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, BookOpen, Music, Camera, Code, Theater, 
  Users, Calendar, ChevronRight, ExternalLink, CalendarDays, MapPin, Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/api';

interface Club {
  id: string;
  name: string;
  description: string;
  icon: string;
  member_count: number;
  event_count: number;
  is_active: boolean;
  website_link?: string;
}

interface CampusEvent {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_date?: string;
  club?: string;
}

const iconMap: { [key: string]: any } = {
  Bot, BookOpen, Music, Camera, Code, Theater, Users
};

export default function ClubsActivities() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubEvents, setClubEvents] = useState<CampusEvent[]>([]);

  useEffect(() => {
    fetchClubs();
    fetchEvents();
  }, []);

  const fetchClubs = async () => {
    try {
      const data = await api.clubs.list({ is_active: true });
      setClubs(data.results || data || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await api.campusEvents.upcoming();
      setEvents(data.results || data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleClubClick = async (club: Club) => {
    setSelectedClub(club);
    try {
      const data = await api.clubs.events(club.id);
      setClubEvents(data || []);
    } catch (error) {
      console.error('Error fetching club events:', error);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Clubs & Activities
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-80 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-64 bg-muted"></Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Clubs & Activities
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join vibrant communities and pursue your passions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Main Content - Clubs Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club, index) => {
            const IconComponent = iconMap[club.icon] || Users;
            
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 h-full relative overflow-visible">
                  <CardContent className="p-6 relative">
                    {/* Badges in top-right corner */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
                      <Badge variant="secondary" className="text-xs whitespace-nowrap px-2 py-1 min-w-fit">
                        <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{club.member_count} members</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs whitespace-nowrap px-2 py-1 min-w-fit">
                        <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{club.event_count} events</span>
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors w-fit">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {club.name}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {club.description}
                    </p>

                    <div className="flex gap-2">
                      {club.website_link && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                          onClick={() => window.open(club.website_link, '_blank')}
                        >
                          Visit Site
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleClubClick(club)}
                      >
                        View Events
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
              })}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white shadow-elegant"
              >
                Explore All Clubs
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Sidebar - Club Events (Desktop) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CalendarDays className="w-5 h-5 text-primary mr-2" />
                  Upcoming Events
                </h3>
                
                <div className="space-y-3">
                  {events.slice(0, 4).map((event, index) => (
                    <Card key={event.id} className="card-gradient hover:shadow-card transition-smooth">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm line-clamp-2 flex-1">
                              {event.title}
                            </h4>
                            <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                              {event.event_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {event.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {event.start_date && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(event.start_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => window.location.href = '/events'}
                >
                  View All Events
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Events Section */}
        <div className="lg:hidden mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-primary mr-2" />
              Upcoming Events
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {events.slice(0, 4).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-gradient hover:shadow-card transition-smooth h-full">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-base line-clamp-2 flex-1">
                          {event.title}
                        </h4>
                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                          {event.event_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {event.start_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(event.start_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/events'}
            >
              View All Events
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Club Events Dialog */}
      <Dialog open={!!selectedClub} onOpenChange={() => setSelectedClub(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedClub?.name} - Events & Notices
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {clubEvents.length > 0 ? (
              clubEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.event_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {event.description}
                          </p>
                        )}
                        {event.start_date && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.start_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No events or notices available for this club yet.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}