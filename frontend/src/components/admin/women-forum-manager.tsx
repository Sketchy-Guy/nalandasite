import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  is_active: boolean;
}

export default function WomenForumManager() {
  const [events, setEvents] = useState<WomenForumEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<WomenForumEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    event_date: '',
    venue: '',
    speaker_name: '',
    speaker_designation: '',
    image_url: '',
    registration_link: '',
    max_participants: 0,
    achievements: [] as string[],
    gallery_images: [] as string[],
    is_featured: false,
    is_active: true
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('women_forum_events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching women forum events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch women forum events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('women_forum_events')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        const { error } = await supabase
          .from('women_forum_events')
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Success", description: "Event created successfully" });
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const { error } = await supabase
        .from('women_forum_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Event deleted successfully" });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: WomenForumEvent) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      event_type: item.event_type,
      event_date: item.event_date ? item.event_date.split('T')[0] : '',
      venue: item.venue || '',
      speaker_name: item.speaker_name || '',
      speaker_designation: item.speaker_designation || '',
      image_url: item.image_url || '',
      registration_link: item.registration_link || '',
      max_participants: item.max_participants || 0,
      achievements: item.achievements || [],
      gallery_images: item.gallery_images || [],
      is_featured: item.is_featured,
      is_active: item.is_active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_type: 'workshop',
      event_date: '',
      venue: '',
      speaker_name: '',
      speaker_designation: '',
      image_url: '',
      registration_link: '',
      max_participants: 0,
      achievements: [],
      gallery_images: [],
      is_featured: false,
      is_active: true
    });
    setEditingItem(null);
    setShowForm(false);
    setNewAchievement('');
    setNewGalleryImage('');
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Women's Forum Events Manager</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Women Forum Event' : 'Add New Women Forum Event'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_type">Event Type</Label>
                  <select
                    id="event_type"
                    value={formData.event_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="conference">Conference</option>
                    <option value="webinar">Webinar</option>
                    <option value="training">Training</option>
                    <option value="panel_discussion">Panel Discussion</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="event_date">Event Date</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="speaker_name">Speaker Name</Label>
                  <Input
                    id="speaker_name"
                    value={formData.speaker_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, speaker_name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="speaker_designation">Speaker Designation</Label>
                  <Input
                    id="speaker_designation"
                    value={formData.speaker_designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, speaker_designation: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Event Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/event-image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registration_link">Registration Link</Label>
                  <Input
                    id="registration_link"
                    value={formData.registration_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, registration_link: e.target.value }))}
                    placeholder="https://example.com/register"
                  />
                </div>
                
                <div>
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Achievements */}
              <div>
                <Label>Achievements</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add achievement"
                  />
                  <Button type="button" onClick={addAchievement} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {achievement}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeAchievement(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <Label>Gallery Images</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newGalleryImage}
                    onChange={(e) => setNewGalleryImage(e.target.value)}
                    placeholder="Add gallery image URL"
                  />
                  <Button type="button" onClick={addGalleryImage} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {formData.gallery_images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label>Featured Event</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'} Event
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {event.title}
                    {event.is_featured && <Badge variant="default">Featured</Badge>}
                    <Badge variant={event.is_active ? "default" : "secondary"}>
                      {event.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.event_type} • {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'No date set'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
              
              {event.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {event.description}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {event.venue && (
                  <div>
                    <span className="font-medium">Venue: </span>
                    <span className="text-muted-foreground">{event.venue}</span>
                  </div>
                )}
                
                {event.speaker_name && (
                  <div>
                    <span className="font-medium">Speaker: </span>
                    <span className="text-muted-foreground">{event.speaker_name}</span>
                  </div>
                )}
                
                {event.max_participants > 0 && (
                  <div>
                    <span className="font-medium">Max Participants: </span>
                    <span className="text-muted-foreground">{event.max_participants}</span>
                  </div>
                )}
                
                {event.achievements && event.achievements.length > 0 && (
                  <div>
                    <span className="font-medium">Achievements: </span>
                    <span className="text-muted-foreground">{event.achievements.length} items</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}