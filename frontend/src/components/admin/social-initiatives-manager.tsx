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

interface SocialInitiative {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  start_date: string;
  end_date: string;
  impact_metrics: string;
  participants_count: number;
  organizer: string;
  status: string;
  gallery_images: string[];
  is_featured: boolean;
  is_active: boolean;
}

export default function SocialInitiativesManager() {
  const [initiatives, setInitiatives] = useState<SocialInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SocialInitiative | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'community_service',
    image_url: '',
    start_date: '',
    end_date: '',
    impact_metrics: '',
    participants_count: 0,
    organizer: '',
    status: 'active',
    gallery_images: [] as string[],
    is_featured: false,
    is_active: true
  });

  const [newGalleryImage, setNewGalleryImage] = useState('');

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    try {
      const { data, error } = await supabase
        .from('social_initiatives')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setInitiatives(data || []);
    } catch (error) {
      console.error('Error fetching social initiatives:', error);
      toast({
        title: "Error",
        description: "Failed to fetch social initiatives",
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
          .from('social_initiatives')
          .update(formData)
          .eq('id', editingItem.id);
        if (error) throw error;
        toast({ title: "Success", description: "Initiative updated successfully" });
      } else {
        const { error } = await supabase
          .from('social_initiatives')
          .insert([formData]);
        if (error) throw error;
        toast({ title: "Success", description: "Initiative created successfully" });
      }
      resetForm();
      fetchInitiatives();
    } catch (error) {
      console.error('Error saving initiative:', error);
      toast({
        title: "Error",
        description: "Failed to save initiative",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this initiative?')) return;
    
    try {
      const { error } = await supabase
        .from('social_initiatives')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Initiative deleted successfully" });
      fetchInitiatives();
    } catch (error) {
      console.error('Error deleting initiative:', error);
      toast({
        title: "Error",
        description: "Failed to delete initiative",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: SocialInitiative) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      image_url: item.image_url || '',
      start_date: item.start_date ? item.start_date.split('T')[0] : '',
      end_date: item.end_date ? item.end_date.split('T')[0] : '',
      impact_metrics: item.impact_metrics || '',
      participants_count: item.participants_count || 0,
      organizer: item.organizer || '',
      status: item.status,
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
      category: 'community_service',
      image_url: '',
      start_date: '',
      end_date: '',
      impact_metrics: '',
      participants_count: 0,
      organizer: '',
      status: 'active',
      gallery_images: [],
      is_featured: false,
      is_active: true
    });
    setEditingItem(null);
    setShowForm(false);
    setNewGalleryImage('');
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
        <h1 className="text-3xl font-bold">Social Initiatives Manager</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Initiative
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Social Initiative' : 'Add New Social Initiative'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Initiative Title</Label>
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
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="community_service">Community Service</option>
                    <option value="environment">Environment</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="disaster_relief">Disaster Relief</option>
                    <option value="social_awareness">Social Awareness</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="image_url">Initiative Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/initiative-image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="impact_metrics">Impact Metrics</Label>
                <Textarea
                  id="impact_metrics"
                  value={formData.impact_metrics}
                  onChange={(e) => setFormData(prev => ({ ...prev, impact_metrics: e.target.value }))}
                  rows={2}
                  placeholder="Describe the impact and outcomes of this initiative"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participants_count">Participants Count</Label>
                  <Input
                    id="participants_count"
                    type="number"
                    value={formData.participants_count}
                    onChange={(e) => setFormData(prev => ({ ...prev, participants_count: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input
                    id="organizer"
                    value={formData.organizer}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                  />
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
                  <Label>Featured Initiative</Label>
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
                  {editingItem ? 'Update' : 'Create'} Initiative
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
        {initiatives.map((initiative) => (
          <Card key={initiative.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {initiative.title}
                    {initiative.is_featured && <Badge variant="default">Featured</Badge>}
                    <Badge variant={initiative.status === 'active' ? "default" : "secondary"}>
                      {initiative.status}
                    </Badge>
                    <Badge variant={initiative.is_active ? "default" : "secondary"}>
                      {initiative.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {initiative.category.replace('_', ' ')} • {initiative.start_date ? new Date(initiative.start_date).toLocaleDateString() : 'No start date'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(initiative)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(initiative.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {initiative.image_url && (
                <img
                  src={initiative.image_url}
                  alt={initiative.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
              
              {initiative.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {initiative.description}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {initiative.organizer && (
                  <div>
                    <span className="font-medium">Organizer: </span>
                    <span className="text-muted-foreground">{initiative.organizer}</span>
                  </div>
                )}
                
                {initiative.participants_count > 0 && (
                  <div>
                    <span className="font-medium">Participants: </span>
                    <span className="text-muted-foreground">{initiative.participants_count}</span>
                  </div>
                )}
                
                {initiative.impact_metrics && (
                  <div className="col-span-2">
                    <span className="font-medium">Impact: </span>
                    <span className="text-muted-foreground line-clamp-1">{initiative.impact_metrics}</span>
                  </div>
                )}
                
                {initiative.gallery_images && initiative.gallery_images.length > 0 && (
                  <div>
                    <span className="font-medium">Gallery: </span>
                    <span className="text-muted-foreground">{initiative.gallery_images.length} images</span>
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