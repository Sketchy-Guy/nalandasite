import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Filter,
  Globe,
  Eye,
  EyeOff,
  Calendar,
  Hash,
  Image,
  ExternalLink
} from 'lucide-react';

interface CampusPage {
  id: string;
  slug: string;
  title: string;
  content?: string;
  meta_description?: string;
  hero_image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const CampusPagesManager = () => {
  const [pages, setPages] = useState<CampusPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<CampusPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CampusPage | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    meta_description: '',
    hero_image_url: '',
    is_active: true,
    display_order: '0'
  });

  // Predefined campus life pages
  const campusLifePages = [
    { slug: 'overview', title: 'Campus Life Overview' },
    { slug: 'wellness', title: 'Wellness Community Centre' },
    { slug: 'hostel', title: 'Hostel Life' },
    { slug: 'governance', title: 'Student Governance' },
    { slug: 'womens-forum', title: "Women's Forum" },
    { slug: 'sports', title: 'Sports' },
    { slug: 'clubs', title: 'Clubs' },
    { slug: 'innovation', title: 'Technology & Innovation' },
    { slug: 'activities', title: 'Student Activities' },
    { slug: 'social', title: 'Social Consciousness' },
    { slug: 'festivals', title: 'Campus Festivals' },
    { slug: 'publications', title: 'Campus Publications' },
    { slug: 'amenities', title: 'Campus Amenities' },
    { slug: 'facilities', title: 'Other Facilities' }
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    filterPages();
  }, [pages, searchTerm]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('campus_pages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campus pages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPages = () => {
    let filtered = pages;

    if (searchTerm) {
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPages(filtered);
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      content: '',
      meta_description: '',
      hero_image_url: '',
      is_active: true,
      display_order: '0'
    });
    setEditingPage(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const pageData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        display_order: parseInt(formData.display_order)
      };

      if (editingPage) {
        const { error } = await supabase
          .from('campus_pages')
          .update(pageData)
          .eq('id', editingPage.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Campus page updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('campus_pages')
          .insert(pageData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Campus page created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPages();
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: "Failed to save campus page",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (page: CampusPage) => {
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content || '',
      meta_description: page.meta_description || '',
      hero_image_url: page.hero_image_url || '',
      is_active: page.is_active,
      display_order: page.display_order.toString()
    });
    setEditingPage(page);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('campus_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campus page deleted successfully"
      });
      
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Error",
        description: "Failed to delete campus page",
        variant: "destructive"
      });
    }
  };

  const createPredefinedPage = (pageInfo: { slug: string; title: string }) => {
    setFormData({
      slug: pageInfo.slug,
      title: pageInfo.title,
      content: `# ${pageInfo.title}\n\nWelcome to the ${pageInfo.title} section of our campus life.\n\n## Overview\n\nContent for this page will be added soon.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Contact Information\n\nFor more information, please contact us.`,
      meta_description: `Learn more about ${pageInfo.title} and discover what our campus has to offer.`,
      hero_image_url: '',
      is_active: true,
      display_order: '0'
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Campus Pages Manager
          </h1>
          <p className="text-muted-foreground">Manage campus life content and pages</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? 'Edit Campus Page' : 'Add New Campus Page'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter page title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="page-url-slug"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero_image_url">Hero Image URL</Label>
                    <Input
                      id="hero_image_url"
                      type="url"
                      value={formData.hero_image_url}
                      onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Page Content (Markdown supported)</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter page content in Markdown format..."
                      rows={15}
                      className="font-mono"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      placeholder="Brief description for search engines (150-160 characters)"
                      rows={3}
                    />
                    <p className="text-sm text-muted-foreground">
                      {formData.meta_description.length}/160 characters
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPage ? 'Update' : 'Create'} Page
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Add Predefined Pages */}
      {pages.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Start: Campus Life Pages</CardTitle>
            <CardDescription>
              Create predefined campus life pages with default content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {campusLifePages.map((page) => (
                <Button
                  key={page.slug}
                  variant="outline"
                  size="sm"
                  onClick={() => createPredefinedPage(page)}
                  className="justify-start"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  {page.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages Grid */}
      {filteredPages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Campus Pages Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? 'No pages match your search criteria.' 
                : 'Get started by creating your first campus page.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Page
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <code className="text-sm bg-muted px-1 rounded">{page.slug}</code>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{page.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={page.is_active ? "default" : "secondary"}>
                          {page.is_active ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </Badge>
                        <Badge variant="outline">
                          Order: {page.display_order}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {page.content && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {page.content.substring(0, 150)}...
                    </p>
                  )}

                  {page.hero_image_url && (
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Image className="h-4 w-4 mr-2" />
                      Has hero image
                    </div>
                  )}

                  <div className="flex items-center text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated: {new Date(page.updated_at).toLocaleDateString()}
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-primary hover:text-primary"
                    >
                      <a 
                        href={`/campus-life/${page.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </a>
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(page)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(page.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampusPagesManager;