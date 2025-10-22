import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search, Star, Zap, Calendar, Tag, ExternalLink, Edit, FileText } from "lucide-react";
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
  description: string;
  content?: string;
  category: string;
  author?: string;
  publish_date?: string;
  expiry_date?: string;
  image_url?: string;
  external_link?: string;
  pdf_link?: string;
  tags?: string[];
  is_featured: boolean;
  is_breaking: boolean;
  is_active: boolean;
  published_date?: string;
  created_at?: string;
  updated_at?: string;
}

const categories = [
  "Achievement", "News", "Announcement", "Academic", "Admission", 
  "Event", "Placement", "Research", "Alumni", "Sports", "Cultural"
];

export function NewsManager() {
  const [news, setNews] = useState<NewsAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsAnnouncement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  // Using toast directly from the hook

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.news.list({ ordering: '-created_at' });
      const data = Array.isArray(response) ? response : (response.results || []);
      setNews(data);
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
      console.log('Submitting news data:', editingNews);
      
      // Create the data object with all the fields that match Django model
      const newsData = {
        title: editingNews.title,
        description: editingNews.description,
        content: editingNews.content || '',
        category: editingNews.category,
        author: editingNews.author || '',
        publish_date: editingNews.publish_date || '',
        expiry_date: editingNews.expiry_date || '',
        image_url: editingNews.image_url || '',
        external_link: editingNews.external_link || '',
        pdf_link: editingNews.pdf_link || '',
        tags: tagInput.split(',').map(tag => tag.trim()).filter(tag => tag),
        is_featured: editingNews.is_featured,
        is_breaking: editingNews.is_breaking,
        is_active: editingNews.is_active
      };

      console.log('Processed news data:', newsData);

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all text fields
      formData.append('title', newsData.title);
      formData.append('description', newsData.description);
      formData.append('content', newsData.content);
      formData.append('category', newsData.category);
      formData.append('author', newsData.author);
      formData.append('publish_date', newsData.publish_date);
      formData.append('expiry_date', newsData.expiry_date);
      formData.append('external_link', newsData.external_link);
      formData.append('pdf_link', newsData.pdf_link);
      formData.append('tags', JSON.stringify(newsData.tags));
      formData.append('is_featured', String(newsData.is_featured));
      formData.append('is_breaking', String(newsData.is_breaking));
      formData.append('is_active', String(newsData.is_active));
      
      // Handle image file upload
      const imageInput = document.getElementById('image') as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        formData.append('image', imageInput.files[0]);
        console.log('Image file added to FormData:', imageInput.files[0].name);
      } else if (editingNews.image_url === "") {
        // Image was removed - send empty value to clear it
        formData.append('image', '');
        console.log('Image removed - sending empty value');
      }

      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (editingNews.id) {
        await api.news.update(editingNews.id, formData);
      } else {
        console.log('Making API call with FormData...');
        await api.news.create(formData);
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
      console.error('Error details:', error?.message, error?.response?.data);
      toast({
        title: "Error",
        description: error?.message || "Failed to save news",
        variant: "destructive",
      });
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      await api.news.delete(id);
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
      setTagInput(newsItem.tags?.join(', ') || "");
    } else {
      setEditingNews({
        title: "",
        description: "",
        content: "",
        category: "News",
        author: "",
        publish_date: "",
        expiry_date: "",
        image_url: "",
        external_link: "",
        pdf_link: "",
        tags: [],
        is_featured: false,
        is_breaking: false,
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
                  <Label htmlFor="description">Summary</Label>
                  <Textarea
                    id="description"
                    value={editingNews.description}
                    onChange={(e) => setEditingNews({...editingNews, description: e.target.value})}
                    rows={2}
                    placeholder="Brief description of the news"
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
                      value={editingNews.author || ""}
                      onChange={(e) => setEditingNews({...editingNews, author: e.target.value})}
                      placeholder="Enter author name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="publish_date">Publish Date</Label>
                    <Input
                      id="publish_date"
                      type="date"
                      value={editingNews.publish_date || ""}
                      onChange={(e) => setEditingNews({...editingNews, publish_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={editingNews.expiry_date || ""}
                      onChange={(e) => setEditingNews({...editingNews, expiry_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Current Image</Label>
                    {editingNews.image_url ? (
                      <div className="mt-2 space-y-3">
                        <div className="relative inline-block">
                          <img 
                            src={editingNews.image_url} 
                            alt={editingNews.title}
                            className="w-full max-w-sm h-32 object-cover rounded-md border"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingNews({...editingNews, image_url: ""});
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">No image uploaded</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Upload New Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Create preview URL for immediate display
                          const previewUrl = URL.createObjectURL(file);
                          setEditingNews({...editingNews, image_url: previewUrl});
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose a new image to replace the current one
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="external_link">External Link</Label>
                    <Input
                      id="external_link"
                      value={editingNews.external_link || ""}
                      onChange={(e) => setEditingNews({...editingNews, external_link: e.target.value})}
                      placeholder="Optional external link"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pdf_link">PDF Document Link</Label>
                    <Input
                      id="pdf_link"
                      value={editingNews.pdf_link || ""}
                      onChange={(e) => setEditingNews({...editingNews, pdf_link: e.target.value})}
                      placeholder="Google Drive PDF link"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste Google Drive shareable link to PDF document
                    </p>
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
          <Card key={item.id} className="relative overflow-hidden">
            {/* Action buttons positioned absolutely in top-right corner */}
            <div className="absolute top-2 right-2 z-10 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openDialog(item)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteNews(item.id!)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <CardHeader className="pb-2">
              <div className="pr-20"> {/* Add right padding to avoid overlap with buttons */}
                <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                <div className="flex gap-1 mt-2 flex-wrap">
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
            </CardHeader>
            <CardContent>
              {item.image_url && (
                <div className="mb-3">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}
              
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {item.description}
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

                {item.tags && item.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="h-3 w-3" />
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {item.external_link && (
                  <p className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    <a href={item.external_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      External Link
                    </a>
                  </p>
                )}

                {item.pdf_link && (
                  <p className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <a href={item.pdf_link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      PDF Document
                    </a>
                  </p>
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