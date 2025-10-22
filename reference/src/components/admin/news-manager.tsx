import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Star, Zap, Calendar, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewsAnnouncement {
  id?: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  image_url?: string;
  is_featured: boolean;
  is_breaking: boolean;
  publish_date?: string;
  expiry_date?: string;
  author: string;
  tags: string[];
  external_url?: string;
  is_active: boolean;
}

const categories = [
  "news", "announcement", "academic", "admission", "event", 
  "achievement", "placement", "research", "alumni", "sports", "cultural"
];

export function NewsManager() {
  const [news, setNews] = useState<NewsAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsAnnouncement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch news and announcements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    try {
      // Convert tag input to array
      const tagsArray = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      const newsData = { ...editingNews, tags: tagsArray };

      if (editingNews.id) {
        await supabase
          .from('news_announcements')
          .update(newsData)
          .eq('id', editingNews.id);
      } else {
        await supabase
          .from('news_announcements')
          .insert([newsData]);
      }

      toast({
        title: "Success",
        description: `News ${editingNews.id ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingNews(null);
      setTagInput("");
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: "Error",
        description: "Failed to save news",
        variant: "destructive",
      });
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      await supabase.from('news_announcements').delete().eq('id', id);
      toast({
        title: "Success",
        description: "News deleted successfully",
      });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: "Error",
        description: "Failed to delete news",
        variant: "destructive",
      });
    }
  };

  const openDialog = (newsItem?: NewsAnnouncement) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setTagInput(newsItem.tags.join(', '));
    } else {
      setEditingNews({
        title: "",
        content: "",
        summary: "",
        category: "news",
        image_url: "",
        is_featured: false,
        is_breaking: false,
        publish_date: "",
        expiry_date: "",
        author: "",
        tags: [],
        external_url: "",
        is_active: true
      });
      setTagInput("");
    }
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News & Announcements</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNews?.id ? 'Edit News' : 'Add News'}
              </DialogTitle>
            </DialogHeader>
            {editingNews && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({...editingNews, title: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea
                    id="summary"
                    value={editingNews.summary}
                    onChange={(e) => setEditingNews({...editingNews, summary: e.target.value})}
                    rows={2}
                    placeholder="Brief summary for preview"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={editingNews.content}
                    onChange={(e) => setEditingNews({...editingNews, content: e.target.value})}
                    rows={8}
                    placeholder="Full content of the news/announcement"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editingNews.category}
                      onValueChange={(value) => setEditingNews({...editingNews, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={editingNews.author}
                      onChange={(e) => setEditingNews({...editingNews, author: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publish_date">Publish Date</Label>
                    <Input
                      id="publish_date"
                      type="date"
                      value={editingNews.publish_date}
                      onChange={(e) => setEditingNews({...editingNews, publish_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={editingNews.expiry_date}
                      onChange={(e) => setEditingNews({...editingNews, expiry_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={editingNews.image_url}
                      onChange={(e) => setEditingNews({...editingNews, image_url: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="external_url">External Link</Label>
                    <Input
                      id="external_url"
                      value={editingNews.external_url}
                      onChange={(e) => setEditingNews({...editingNews, external_url: e.target.value})}
                      placeholder="Optional external link"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g., admission, engineering, deadline"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingNews.is_featured}
                      onCheckedChange={(checked) => setEditingNews({...editingNews, is_featured: checked})}
                    />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingNews.is_breaking}
                      onCheckedChange={(checked) => setEditingNews({...editingNews, is_breaking: checked})}
                    />
                    <Label>Breaking News</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingNews.is_active}
                      onCheckedChange={(checked) => setEditingNews({...editingNews, is_active: checked})}
                    />
                    <Label>Active</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingNews.id ? 'Update' : 'Create'} News
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    {item.is_featured && (
                      <Badge className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {item.is_breaking && (
                      <Badge variant="destructive">
                        <Zap className="h-3 w-3 mr-1" />
                        Breaking
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openDialog(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNews(item.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {item.summary && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {item.summary}
                </p>
              )}
              
              <div className="space-y-2 text-sm">
                {item.author && (
                  <p className="flex items-center gap-1">
                    <span className="font-medium">Author:</span> {item.author}
                  </p>
                )}
                
                {item.publish_date && (
                  <p className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">Published:</span> {formatDate(item.publish_date)}
                  </p>
                )}
                
                {item.expiry_date && (
                  <p className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">Expires:</span> {formatDate(item.expiry_date)}
                  </p>
                )}

                {item.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="h-3 w-3" />
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t">
                <Badge variant={item.is_active ? "default" : "secondary"}>
                  {item.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {news.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No news or announcements found. Create your first one!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}