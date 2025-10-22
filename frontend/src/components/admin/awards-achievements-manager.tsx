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
import { Pencil, Trash2, Plus, Award, Calendar, Download } from "lucide-react";

interface AwardAchievement {
  id: string;
  title: string;
  description: string | null;
  category: string;
  award_date: string | null;
  image_url: string | null;
  certificate_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const categories = [
  'institutional',
  'academic',
  'research',
  'sports',
  'cultural',
  'social',
  'innovation',
  'accreditation',
  'ranking',
  'recognition'
];

export default function AwardsAchievementsManager() {
  const [awards, setAwards] = useState<AwardAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardAchievement | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'institutional',
    award_date: '',
    image_url: '',
    certificate_url: '',
    display_order: '',
    is_active: true,
  });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const { data, error } = await supabase
        .from('awards_achievements')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setAwards(data || []);
    } catch (error) {
      console.error('Error fetching awards:', error);
      toast.error('Failed to fetch awards');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'institutional',
      award_date: '',
      image_url: '',
      certificate_url: '',
      display_order: '',
      is_active: true,
    });
    setEditingAward(null);
  };

  const openDialog = (award?: AwardAchievement) => {
    if (award) {
      setEditingAward(award);
      setFormData({
        title: award.title,
        description: award.description || '',
        category: award.category,
        award_date: award.award_date || '',
        image_url: award.image_url || '',
        certificate_url: award.certificate_url || '',
        display_order: award.display_order.toString(),
        is_active: award.is_active,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const awardData = {
      title: formData.title,
      description: formData.description || null,
      category: formData.category,
      award_date: formData.award_date || null,
      image_url: formData.image_url || null,
      certificate_url: formData.certificate_url || null,
      display_order: formData.display_order ? parseInt(formData.display_order) : 0,
      is_active: formData.is_active,
    };

    try {
      if (editingAward) {
        const { error } = await supabase
          .from('awards_achievements')
          .update(awardData)
          .eq('id', editingAward.id);
        
        if (error) throw error;
        toast.success('Award updated successfully');
      } else {
        const { error } = await supabase
          .from('awards_achievements')
          .insert([awardData]);
        
        if (error) throw error;
        toast.success('Award created successfully');
      }
      
      setDialogOpen(false);
      resetForm();
      fetchAwards();
    } catch (error) {
      console.error('Error saving award:', error);
      toast.error('Failed to save award');
    }
  };

  const deleteAward = async (id: string) => {
    if (!confirm('Are you sure you want to delete this award?')) return;
    
    try {
      const { error } = await supabase
        .from('awards_achievements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Award deleted successfully');
      fetchAwards();
    } catch (error) {
      console.error('Error deleting award:', error);
      toast.error('Failed to delete award');
    }
  };

  if (loading) {
    return <div className="p-6">Loading awards...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Awards & Achievements Manager</h1>
          <p className="text-muted-foreground">Manage institutional awards, recognitions, and achievements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Award
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAward ? 'Edit Award' : 'Add New Award'}
              </DialogTitle>
              <DialogDescription>
                {editingAward ? 'Update award information' : 'Create a new award or achievement'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Award Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
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
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="award_date">Award Date</Label>
                  <Input
                    id="award_date"
                    type="date"
                    value={formData.award_date}
                    onChange={(e) => setFormData({ ...formData, award_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="certificate_url">Certificate URL</Label>
                <Input
                  id="certificate_url"
                  type="url"
                  value={formData.certificate_url}
                  onChange={(e) => setFormData({ ...formData, certificate_url: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  placeholder="0"
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
                  {editingAward ? 'Update' : 'Create'} Award
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((award) => (
          <Card key={award.id}>
            {award.image_url && (
              <div className="h-48 overflow-hidden">
                <img
                  src={award.image_url}
                  alt={award.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{award.title}</CardTitle>
                <Badge variant="secondary" className="capitalize">
                  {award.category}
                </Badge>
              </div>
              {award.description && (
                <CardDescription>{award.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {award.award_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(award.award_date).toLocaleDateString()}</span>
                </div>
              )}
              {award.certificate_url && (
                <div className="flex items-center gap-2 text-sm">
                  <Download className="h-4 w-4" />
                  <a
                    href={award.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Certificate
                  </a>
                </div>
              )}
              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2">
                  <Badge variant={award.is_active ? "default" : "secondary"}>
                    {award.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Order: {award.display_order}
                  </span>
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(award)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAward(award.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {awards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No awards found. Add your first award to get started.</p>
        </div>
      )}
    </div>
  );
}