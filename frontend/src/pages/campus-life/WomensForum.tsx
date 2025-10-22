import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Trophy } from 'lucide-react';

interface WomenForumEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  venue: string;
  speaker_name: string;
  speaker_designation: string;
  image_url: string;
  registration_link: string;
  max_participants: number;
  achievements: string[];
  gallery_images: string[];
  is_featured: boolean;
}

export default function WomensForum() {
  const [events, setEvents] = useState<WomenForumEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('women_forum_events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error fetching women forum events:', error);
    } else {
      setEvents(data || []);
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

  const featuredEvents = events.filter(event => event.is_featured);
  const upcomingEvents = events.filter(event => new Date(event.event_date) > new Date());
  const pastEvents = events.filter(event => new Date(event.event_date) <= new Date());

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-primary/20 to-accent/20 flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Women's Forum</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Empowering women through education, leadership development, and community building.
              Join us in creating an inclusive and supportive environment for all.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image_url && (
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${event.image_url})` }} />
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{event.event_type}</Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{event.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      {event.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                      
                      {event.max_participants && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>Max {event.max_participants} participants</span>
                        </div>
                      )}
                    </div>

                    {event.speaker_name && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">{event.speaker_name}</p>
                        {event.speaker_designation && (
                          <p className="text-sm text-muted-foreground">{event.speaker_designation}</p>
                        )}
                      </div>
                    )}

                    {event.registration_link && (
                      <Button className="w-full mt-4" asChild>
                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                          Register Now
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image_url && (
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${event.image_url})` }} />
                  )}
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{event.event_type}</Badge>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{event.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      {event.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                    </div>

                    {event.registration_link && (
                      <Button className="w-full mt-4" asChild>
                        <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                          Register Now
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .filter(event => event.achievements && event.achievements.length > 0)
              .slice(0, 6)
              .map((event) => (
                <Card key={`achievement-${event.id}`} className="text-center p-6">
                  <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {event.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </Card>
              ))}
          </div>
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastEvents.slice(0, 8).map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {event.image_url && (
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${event.image_url})` }} />
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.event_date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}