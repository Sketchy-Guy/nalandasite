import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

const AboutPagesManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aboutPages } = useQuery({
    queryKey: ['about-pages'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about_pages')
        .select('*')
        .order('display_order');
      return data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newPage: any) => {
      const { error } = await supabase.from('about_pages').insert([newPage]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-pages'] });
      toast({ title: "Success", description: "About page created successfully" });
      setIsEditing(false);
      setEditingItem(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from('about_pages').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-pages'] });
      toast({ title: "Success", description: "About page updated successfully" });
      setIsEditing(false);
      setEditingItem(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('about_pages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-pages'] });
      toast({ title: "Success", description: "About page deleted successfully" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      page_type: formData.get('page_type'),
      title: formData.get('title'),
      content: formData.get('content'),
      meta_description: formData.get('meta_description'),
      image_url: formData.get('image_url'),
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_active: formData.get('is_active') === 'on'
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, updates: data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">About Pages Manager</h2>
        <Button onClick={() => { setIsEditing(true); setEditingItem(null); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Page
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit About Page' : 'Create New About Page'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="page_type">Page Type</Label>
                  <Select name="page_type" defaultValue={editingItem?.page_type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select page type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="about">About</SelectItem>
                      <SelectItem value="vision-mission">Vision & Mission</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="governance">Governance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    name="display_order"
                    type="number"
                    defaultValue={editingItem?.display_order || 0}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  name="title"
                  defaultValue={editingItem?.title || ''}
                  placeholder="Page title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  name="content"
                  defaultValue={editingItem?.content || ''}
                  placeholder="Page content..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Input
                  name="meta_description"
                  defaultValue={editingItem?.meta_description || ''}
                  placeholder="SEO meta description"
                />
              </div>

              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  name="image_url"
                  defaultValue={editingItem?.image_url || ''}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  name="is_active" 
                  defaultChecked={editingItem?.is_active ?? true} 
                />
                <Label>Active</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingItem ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {aboutPages?.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{page.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Type: {page.page_type} | Order: {page.display_order} | 
                    Status: {page.is_active ? 'Active' : 'Inactive'}
                  </p>
                  {page.content && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {page.content.substring(0, 150)}...
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditingItem(page); setIsEditing(true); }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutPagesManager;