import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar, 
  Activity, 
  Trophy,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Clock
} from 'lucide-react';

interface Club {
  id: string;
  name: string;
  description?: string;
  icon: string;
  member_count: number;
  event_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_date?: string;
  end_date?: string;
  venue?: string;
  organizer?: string;
  max_participants?: number;
  registration_required: boolean;
  registration_url?: string;
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export default function ClubsActivitiesManager() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubDialogOpen, setClubDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [clubFormData, setClubFormData] = useState({
    name: '',
    description: '',
    icon: '',
    member_count: 0,
    event_count: 0
  });
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    event_type: 'festival',
    start_date: '',
    end_date: '',
    venue: '',
    organizer: '',
    max_participants: '',
    registration_required: false,
    registration_url: '',
    image_url: '',
    is_featured: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clubsResponse, eventsResponse] = await Promise.all([
        supabase.from('clubs').select('*').order('name'),
        supabase.from('campus_events').select('*').order('start_date', { ascending: false })
      ]);

      if (clubsResponse.error) throw clubsResponse.error;
      if (eventsResponse.error) throw eventsResponse.error;

      setClubs(clubsResponse.data || []);
      setEvents(eventsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch clubs and activities data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetClubForm = () => {
    setClubFormData({
      name: '',
      description: '',
      icon: '',
      member_count: 0,
      event_count: 0
    });
    setEditingClub(null);
  };

  const resetEventForm = () => {
    setEventFormData({
      title: '',
      description: '',
      event_type: 'festival',
      start_date: '',
      end_date: '',
      venue: '',
      organizer: '',
      max_participants: '',
      registration_required: false,
      registration_url: '',
      image_url: '',
      is_featured: false
    });
    setEditingEvent(null);
  };

  const openEditClubDialog = (club: Club) => {
    setEditingClub(club);
    setClubFormData({
      name: club.name,
      description: club.description || '',
      icon: club.icon,
      member_count: club.member_count,
      event_count: club.event_count
    });
    setClubDialogOpen(true);
  };

  const openEditEventDialog = (event: Event) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type,
      start_date: event.start_date || '',
      end_date: event.end_date || '',
      venue: event.venue || '',
      organizer: event.organizer || '',
      max_participants: event.max_participants?.toString() || '',
      registration_required: event.registration_required,
      registration_url: event.registration_url || '',
      image_url: event.image_url || '',
      is_featured: event.is_featured
    });
    setEventDialogOpen(true);
  };

  const handleClubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        name: clubFormData.name,
        description: clubFormData.description || null,
        icon: clubFormData.icon,
        member_count: clubFormData.member_count,
        event_count: clubFormData.event_count,
        is_active: true
      };

      let result;
      if (editingClub) {
        result = await supabase
          .from('clubs')
          .update(data)
          .eq('id', editingClub.id);
      } else {
        result = await supabase
          .from('clubs')
          .insert([data]);
      }

      if (result.error) throw result.error;

      toast({
        title: 'Success',
        description: `Club ${editingClub ? 'updated' : 'created'} successfully`
      });

      setClubDialogOpen(false);
      resetClubForm();
      fetchData();
    } catch (error) {
      console.error('Error saving club:', error);
      toast({
        title: 'Error',
        description: 'Failed to save club',
        variant: 'destructive'
      });
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        title: eventFormData.title,
        description: eventFormData.description || null,
        event_type: eventFormData.event_type,
        start_date: eventFormData.start_date || null,
        end_date: eventFormData.end_date || null,
        venue: eventFormData.venue || null,
        organizer: eventFormData.organizer || null,
        max_participants: eventFormData.max_participants ? parseInt(eventFormData.max_participants) : null,
        registration_required: eventFormData.registration_required,
        registration_url: eventFormData.registration_url || null,
        image_url: eventFormData.image_url || null,
        is_featured: eventFormData.is_featured,
        is_active: true
      };

      let result;
      if (editingEvent) {
        result = await supabase
          .from('campus_events')
          .update(data)
          .eq('id', editingEvent.id);
      } else {
        result = await supabase
          .from('campus_events')
          .insert([data]);
      }

      if (result.error) throw result.error;

      toast({
        title: 'Success',
        description: `Event ${editingEvent ? 'updated' : 'created'} successfully`
      });

      setEventDialogOpen(false);
      resetEventForm();
      fetchData();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event',
        variant: 'destructive'
      });
    }
  };

  const deleteClub = async (id: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return;

    try {
      const { error } = await supabase.from('clubs').delete().eq('id', id);
      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Club deleted successfully'
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting club:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete club',
        variant: 'destructive'
      });
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase.from('campus_events').delete().eq('id', id);
      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Event deleted successfully'
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    totalClubs: clubs.length,
    activeClubs: clubs.filter(c => c.is_active).length,
    totalEvents: events.length,
    upcomingEvents: events.filter(e => new Date(e.start_date || '') > new Date()).length,
    totalMembers: clubs.reduce((sum, club) => sum + club.member_count, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clubs & Activities Manager</h1>
          <p className="text-muted-foreground">
            Comprehensive club and activity management
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClubs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clubs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClubs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clubs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
          <TabsTrigger value="events">Events & Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="clubs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Student Clubs</h2>
            <Dialog open={clubDialogOpen} onOpenChange={setClubDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetClubForm(); setClubDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Club
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingClub ? 'Edit Club' : 'Add New Club'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleClubSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="club-name">Club Name</Label>
                    <Input
                      id="club-name"
                      value={clubFormData.name}
                      onChange={(e) => setClubFormData({...clubFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="club-description">Description</Label>
                    <Textarea
                      id="club-description"
                      value={clubFormData.description}
                      onChange={(e) => setClubFormData({...clubFormData, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="club-icon">Icon (Lucide icon name)</Label>
                    <Input
                      id="club-icon"
                      value={clubFormData.icon}
                      onChange={(e) => setClubFormData({...clubFormData, icon: e.target.value})}
                      placeholder="e.g., Users, Trophy, Music"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="member-count">Member Count</Label>
                      <Input
                        id="member-count"
                        type="number"
                        min="0"
                        value={clubFormData.member_count}
                        onChange={(e) => setClubFormData({...clubFormData, member_count: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="event-count">Event Count</Label>
                      <Input
                        id="event-count"
                        type="number"
                        min="0"
                        value={clubFormData.event_count}
                        onChange={(e) => setClubFormData({...clubFormData, event_count: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingClub ? 'Update' : 'Create'} Club
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setClubDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club) => (
              <Card key={club.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{club.name}</h3>
                          <Badge variant={club.is_active ? "default" : "secondary"}>
                            {club.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {club.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {club.description}
                      </p>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {club.member_count} members
                      </span>
                      <span className="text-muted-foreground">
                        {club.event_count} events
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditClubDialog(club)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteClub(club.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campus Events & Activities</h2>
            <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetEventForm(); setEventDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      value={eventFormData.title}
                      onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select value={eventFormData.event_type} onValueChange={(value) => setEventFormData({...eventFormData, event_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="festival">Festival</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="seminar">Seminar</SelectItem>
                          <SelectItem value="cultural">Cultural Event</SelectItem>
                          <SelectItem value="sports">Sports Event</SelectItem>
                          <SelectItem value="technical">Technical Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="organizer">Organizer</Label>
                      <Input
                        id="organizer"
                        value={eventFormData.organizer}
                        onChange={(e) => setEventFormData({...eventFormData, organizer: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={eventFormData.start_date}
                        onChange={(e) => setEventFormData({...eventFormData, start_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={eventFormData.end_date}
                        onChange={(e) => setEventFormData({...eventFormData, end_date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={eventFormData.venue}
                        onChange={(e) => setEventFormData({...eventFormData, venue: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-participants">Max Participants</Label>
                      <Input
                        id="max-participants"
                        type="number"
                        min="1"
                        value={eventFormData.max_participants}
                        onChange={(e) => setEventFormData({...eventFormData, max_participants: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="registration-url">Registration URL</Label>
                    <Input
                      id="registration-url"
                      type="url"
                      value={eventFormData.registration_url}
                      onChange={(e) => setEventFormData({...eventFormData, registration_url: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input
                      id="image-url"
                      type="url"
                      value={eventFormData.image_url}
                      onChange={(e) => setEventFormData({...eventFormData, image_url: e.target.value})}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="registration-required"
                        checked={eventFormData.registration_required}
                        onChange={(e) => setEventFormData({...eventFormData, registration_required: e.target.checked})}
                      />
                      <Label htmlFor="registration-required">Registration Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is-featured"
                        checked={eventFormData.is_featured}
                        onChange={(e) => setEventFormData({...eventFormData, is_featured: e.target.checked})}
                      />
                      <Label htmlFor="is-featured">Featured Event</Label>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingEvent ? 'Update' : 'Create'} Event
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEventDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            {event.is_featured && (
                              <Badge className="bg-yellow-500">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            <Badge variant="outline">{event.event_type}</Badge>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {event.start_date && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(event.start_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {event.venue && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{event.venue}</span>
                              </div>
                            )}
                            {event.organizer && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{event.organizer}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditEventDialog(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No events found. Create some events to get started.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}