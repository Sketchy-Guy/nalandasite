import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Trophy, Calendar, Sparkles, Bot, BookOpen, Music, Camera, Code, Theater, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
  end_date?: string;
  venue?: string;
  organizer?: string;
  club_name?: string;
  is_featured: boolean;
}

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllEvents, setShowAllEvents] = useState(false);

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
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await api.campusEvents.list({ is_active: true });
      const eventsData = data.results || data || [];
      console.log('Fetched events:', eventsData.length, eventsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort events to show featured first, then by date
  const sortedEvents = events.sort((a, b) => {
    // Featured events first
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    
    // Then sort by start_date (newest first)
    if (a.start_date && b.start_date) {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    }
    
    return 0;
  });

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Bot': Bot,
      'BookOpen': BookOpen,
      'Music': Music,
      'Camera': Camera,
      'Code': Code,
      'Theater': Theater,
      'Users': Users,
      'Trophy': Trophy,
      'Calendar': Calendar,
      'Sparkles': Sparkles,
    };
    const IconComponent = iconMap[iconName] || Users;
    return <IconComponent className="h-8 w-8" />;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>
            <Skeleton className="h-10 w-full max-w-md mx-auto" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 flex-1" />
                      <Skeleton className="h-10 w-20" />
                    </div>
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
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                <Users className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Clubs & Activities
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover your passion, build lasting friendships, and develop leadership skills through our diverse range of student clubs and organizations.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clubs and activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-blue-100"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Found {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-blue-600">{clubs.length}+</CardTitle>
                <CardDescription>Active Clubs</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-purple-600">{clubs.reduce((acc, club) => acc + club.member_count, 0)}+</CardTitle>
                <CardDescription>Active Members</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-green-600">{clubs.reduce((acc, club) => acc + club.event_count, 0)}+</CardTitle>
                <CardDescription>Events This Year</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Clubs Grid */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Our Clubs & Organizations</h2>
              <p className="text-muted-foreground">
                Join a community of like-minded individuals and pursue your interests.
              </p>
            </div>

            {filteredClubs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {searchTerm ? 'No clubs found' : 'No clubs available'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search terms to find relevant clubs.'
                      : 'Check back soon as new clubs are being registered.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                        {getIconComponent(club.icon)}
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {club.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {club.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {club.member_count} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {club.event_count} events
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        Join Club
                      </Button>
                      {club.website_link ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(club.website_link, '_blank')}
                        >
                          Visit Site
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

          {/* Events & Notices Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Upcoming Events & Notices
              </h2>
              <p className="text-muted-foreground">
                Stay updated with the latest club activities, events, and important announcements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllEvents ? sortedEvents : sortedEvents.slice(0, 9)).map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50 dark:border-blue-800/50">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge 
                        variant={event.event_type === 'notice' ? 'secondary' : 'outline'} 
                        className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                      >
                        {event.event_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {event.is_featured && (
                        <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                    {event.description && (
                      <CardDescription className="line-clamp-3">
                        {event.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {event.start_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>{new Date(event.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                      {event.club_name && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-green-500" />
                          <span>by {event.club_name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {events.length === 0 && (
              <Card className="text-center py-12 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10">
                <CardContent>
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Events Available</h3>
                  <p className="text-muted-foreground">
                    Check back soon for upcoming club events and announcements.
                  </p>
                </CardContent>
              </Card>
            )}

            {events.length > 9 && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                  onClick={() => {
                    setShowAllEvents(!showAllEvents);
                    // Smooth scroll to show expanded content
                    if (!showAllEvents) {
                      setTimeout(() => {
                        window.scrollBy({
                          top: 200,
                          behavior: 'smooth'
                        });
                      }, 100);
                    }
                  }}
                >
                  {showAllEvents ? 'Show Less' : `View All ${events.length} Events`}
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Start Your Own Club</CardTitle>
              <CardDescription>
                Have a unique idea or passion? We'll help you start your own club!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Contact the Student Activities Office to learn about the process of starting a new club. 
                We provide guidance, resources, and support to help you build a thriving community.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Start a Club
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                  Get Guidelines
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}