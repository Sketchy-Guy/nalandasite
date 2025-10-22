import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, FileText, Trash2, Edit2, Plus, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Magazine {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  file_url?: string;
  issue_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const MagazinesManager = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState<Magazine | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image_url: '',
    file_url: '',
    issue_date: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMagazines(data || []);
    } catch (error) {
      console.error('Error fetching magazines:', error);
      toast({
        title: "Error",
        description: "Failed to fetch magazines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMagazine) {
        const { error } = await supabase
          .from('magazines')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMagazine.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Magazine updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('magazines')
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Magazine created successfully",
        });
      }

      setDialogOpen(false);
      setEditingMagazine(null);
      setFormData({
        title: '',
        description: '',
        cover_image_url: '',
        file_url: '',
        issue_date: '',
        is_active: true
      });
      fetchMagazines();
    } catch (error) {
      console.error('Error saving magazine:', error);
      toast({
        title: "Error",
        description: "Failed to save magazine",
        variant: "destructive",
      });
    }
  };

  const deleteMagazine = async (id: string) => {
    if (!confirm('Are you sure you want to delete this magazine?')) return;

    try {
      const { error } = await supabase
        .from('magazines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Magazine deleted successfully",
      });
      fetchMagazines();
    } catch (error) {
      console.error('Error deleting magazine:', error);
      toast({
        title: "Error",
        description: "Failed to delete magazine",
        variant: "destructive",
      });
    }
  };

  const openDialog = (magazine?: Magazine) => {
    if (magazine) {
      setEditingMagazine(magazine);
      setFormData({
        title: magazine.title,
        description: magazine.description || '',
        cover_image_url: magazine.cover_image_url || '',
        file_url: magazine.file_url || '',
        issue_date: magazine.issue_date || '',
        is_active: magazine.is_active
      });
    } else {
      setEditingMagazine(null);
      setFormData({
        title: '',
        description: '',
        cover_image_url: '',
        file_url: '',
        issue_date: '',
        is_active: true
      });
    }
    setDialogOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading magazines...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Magazines Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Magazine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMagazine ? 'Edit Magazine' : 'Add New Magazine'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input
                    id="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the magazine..."
                />
              </div>

              <div>
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div>
                <Label htmlFor="file_url">Magazine File URL</Label>
                <Input
                  id="file_url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://example.com/magazine.pdf"
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
                  {editingMagazine ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magazines.map((magazine) => (
          <Card key={magazine.id} className="overflow-hidden">
            {magazine.cover_image_url && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={magazine.cover_image_url} 
                  alt={magazine.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="line-clamp-2">{magazine.title}</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {magazine.issue_date ? formatDate(magazine.issue_date) : 'No date set'}
              </div>
            </CardHeader>
            <CardContent>
              {magazine.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {magazine.description}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog(magazine)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMagazine(magazine.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {magazine.file_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(magazine.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  magazine.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {magazine.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {magazines.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No magazines found</h3>
          <p className="text-muted-foreground">Get started by adding your first magazine.</p>
        </div>
      )}
    </div>
  );
};