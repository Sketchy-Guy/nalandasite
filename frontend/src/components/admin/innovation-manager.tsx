import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Calendar, DollarSign, Users, TrendingUp } from "lucide-react";

interface IncubationCenter {
  id: string;
  name: string;
  description: string | null;
  center_type: string;
  establishment_date: string | null;
  grant_amount: number | null;
  grant_currency: string | null;
  current_startups: number | null;
  total_funding_raised: number | null;
  image_url: string | null;
  logo_url: string | null;
  website_url: string | null;
  features: string[] | null;
  success_stories: string[] | null;
  gallery_images: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const centerTypes = [
  'Atal Incubation Center',
  'SISS-Startup India',
  'MSME Business Incubator',
  'Technology Incubator',
  'Research Center',
  'Innovation Hub'
];

const currencies = ['INR', 'USD', 'EUR'];

export default function InnovationManager() {
  const [centers, setCenters] = useState<IncubationCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<IncubationCenter | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    center_type: 'Atal Incubation Center',
    establishment_date: '',
    grant_amount: '',
    grant_currency: 'INR',
    current_startups: '',
    total_funding_raised: '',
    image_url: '',
    logo_url: '',
    website_url: '',
    features: '',
    success_stories: '',
    gallery_images: '',
    is_active: true,
  });

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('incubation_centers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCenters(data || []);
    } catch (error) {
      console.error('Error fetching centers:', error);
      toast.error('Failed to fetch centers');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      center_type: 'Atal Incubation Center',
      establishment_date: '',
      grant_amount: '',
      grant_currency: 'INR',
      current_startups: '',
      total_funding_raised: '',
      image_url: '',
      logo_url: '',
      website_url: '',
      features: '',
      success_stories: '',
      gallery_images: '',
      is_active: true,
    });
    setEditingCenter(null);
  };

  const openDialog = (center?: IncubationCenter) => {
    if (center) {
      setEditingCenter(center);
      setFormData({
        name: center.name,
        description: center.description || '',
        center_type: center.center_type,
        establishment_date: center.establishment_date || '',
        grant_amount: center.grant_amount?.toString() || '',
        grant_currency: center.grant_currency || 'INR',
        current_startups: center.current_startups?.toString() || '',
        total_funding_raised: center.total_funding_raised?.toString() || '',
        image_url: center.image_url || '',
        logo_url: center.logo_url || '',
        website_url: center.website_url || '',
        features: center.features?.join('\n') || '',
        success_stories: center.success_stories?.join('\n') || '',
        gallery_images: center.gallery_images?.join('\n') || '',
        is_active: center.is_active,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const centerData = {
      name: formData.name,
      description: formData.description || null,
      center_type: formData.center_type,
      establishment_date: formData.establishment_date || null,
      grant_amount: formData.grant_amount ? parseFloat(formData.grant_amount) : null,
      grant_currency: formData.grant_currency,
      current_startups: formData.current_startups ? parseInt(formData.current_startups) : null,
      total_funding_raised: formData.total_funding_raised ? parseFloat(formData.total_funding_raised) : null,
      image_url: formData.image_url || null,
      logo_url: formData.logo_url || null,
      website_url: formData.website_url || null,
      features: formData.features ? formData.features.split('\n').filter(f => f.trim()) : null,
      success_stories: formData.success_stories ? formData.success_stories.split('\n').filter(s => s.trim()) : null,
      gallery_images: formData.gallery_images ? formData.gallery_images.split('\n').filter(g => g.trim()) : null,
      is_active: formData.is_active,
    };

    try {
      if (editingCenter) {
        const { error } = await supabase
          .from('incubation_centers')
          .update(centerData)
          .eq('id', editingCenter.id);
        
        if (error) throw error;
        toast.success('Center updated successfully');
      } else {
        const { error } = await supabase
          .from('incubation_centers')
          .insert([centerData]);
        
        if (error) throw error;
        toast.success('Center created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      fetchCenters();
    } catch (error) {
      console.error('Error saving center:', error);
      toast.error('Failed to save center');
    }
  };

  const deleteCenter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this center?')) return;
    
    try {
      const { error } = await supabase
        .from('incubation_centers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Center deleted successfully');
      fetchCenters();
    } catch (error) {
      console.error('Error deleting center:', error);
      toast.error('Failed to delete center');
    }
  };

  if (loading) {
    return <div className="p-6">Loading innovation centers...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Innovation Centers Manager</h1>
          <p className="text-muted-foreground">Manage incubation centers and innovation programs</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Center
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCenter ? 'Edit Innovation Center' : 'Add New Innovation Center'}
              </DialogTitle>
              <DialogDescription>
                {editingCenter ? 'Update center information' : 'Create a new innovation center'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Center Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="center_type">Center Type *</Label>
                  <Select value={formData.center_type} onValueChange={(value) => setFormData({ ...formData, center_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {centerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="establishment_date">Establishment Date</Label>
                  <Input
                    id="establishment_date"
                    type="date"
                    value={formData.establishment_date}
                    onChange={(e) => setFormData({ ...formData, establishment_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="grant_amount">Grant Amount</Label>
                  <Input
                    id="grant_amount"
                    type="number"
                    value={formData.grant_amount}
                    onChange={(e) => setFormData({ ...formData, grant_amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="grant_currency">Currency</Label>
                  <Select value={formData.grant_currency} onValueChange={(value) => setFormData({ ...formData, grant_currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="current_startups">Current Startups</Label>
                  <Input
                    id="current_startups"
                    type="number"
                    value={formData.current_startups}
                    onChange={(e) => setFormData({ ...formData, current_startups: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="total_funding_raised">Total Funding Raised</Label>
                <Input
                  id="total_funding_raised"
                  type="number"
                  value={formData.total_funding_raised}
                  onChange={(e) => setFormData({ ...formData, total_funding_raised: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Main Image URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={4}
                  placeholder="State-of-the-art laboratory&#10;Mentorship programs&#10;Funding support"
                />
              </div>
              
              <div>
                <Label htmlFor="success_stories">Success Stories (one per line)</Label>
                <Textarea
                  id="success_stories"
                  value={formData.success_stories}
                  onChange={(e) => setFormData({ ...formData, success_stories: e.target.value })}
                  rows={4}
                  placeholder="TechCorp raised 50 lakhs in Series A&#10;StartupXYZ got acquired by major company"
                />
              </div>
              
              <div>
                <Label htmlFor="gallery_images">Gallery Image URLs (one per line)</Label>
                <Textarea
                  id="gallery_images"
                  value={formData.gallery_images}
                  onChange={(e) => setFormData({ ...formData, gallery_images: e.target.value })}
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCenter ? 'Update' : 'Create'} Center
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {centers.map((center) => (
          <Card key={center.id}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {center.image_url && (
                <div className="md:col-span-1">
                  <img
                    src={center.image_url}
                    alt={center.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className={center.image_url ? "md:col-span-2" : "md:col-span-3"}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {center.logo_url && (
                        <img
                          src={center.logo_url}
                          alt={`${center.name} logo`}
                          className="w-12 h-12 object-contain"
                        />
                      )}
                      <div>
                        <CardTitle className="text-lg">{center.name}</CardTitle>
                        <Badge variant="secondary">{center.center_type}</Badge>
                      </div>
                    </div>
                  </div>
                  {center.description && (
                    <CardDescription>{center.description.slice(0, 100)}...</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {center.establishment_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(center.establishment_date).getFullYear()}</span>
                      </div>
                    )}
                    {center.grant_amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{center.grant_currency} {center.grant_amount.toLocaleString()}</span>
                      </div>
                    )}
                    {center.current_startups && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{center.current_startups} startups</span>
                      </div>
                    )}
                    {center.total_funding_raised && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>₹{center.total_funding_raised.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <Badge variant={center.is_active ? "default" : "secondary"}>
                      {center.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDialog(center)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteCenter(center.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {centers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No innovation centers found. Add your first center to get started.</p>
        </div>
      )}
    </div>
  );
}