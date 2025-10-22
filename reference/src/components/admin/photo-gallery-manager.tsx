import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Star, Image, Upload, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhotoGallery {
  id?: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  photographer?: string;
  photo_date?: string;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
}

const categories = [
  { value: "academic", label: "Academic", subcategories: ["classroom", "laboratory", "library", "research", "graduation"] },
  { value: "campus_life", label: "Campus Life", subcategories: ["hostel", "sports", "cultural", "festivals", "dining"] },
  { value: "departments", label: "Departments", subcategories: ["cse", "mechanical", "electrical", "civil", "mba", "mca", "bca", "it"] },
  { value: "about_us", label: "About Us", subcategories: ["leadership", "history", "awards", "accreditation"] },
  { value: "contact", label: "Contact", subcategories: ["office", "staff", "facilities"] },
  { value: "events", label: "Events", subcategories: ["conference", "seminar", "workshop", "competition", "celebration"] }
];

export function PhotoGalleryManager() {
  const [photos, setPhotos] = useState<PhotoGallery[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<PhotoGallery | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSubcategory, setFilterSubcategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    filterPhotos();
  }, [photos, filterCategory, filterSubcategory]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_galleries')
        .select('*')
        .order('display_order')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch photo gallery",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPhotos = () => {
    let filtered = photos;
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(photo => photo.category === filterCategory);
    }
    
    if (filterSubcategory !== "all") {
      filtered = filtered.filter(photo => photo.subcategory === filterSubcategory);
    }
    
    setFilteredPhotos(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      if (editingPhoto.id) {
        await supabase
          .from('photo_galleries')
          .update(editingPhoto)
          .eq('id', editingPhoto.id);
      } else {
        await supabase
          .from('photo_galleries')
          .insert([editingPhoto]);
      }

      toast({
        title: "Success",
        description: `Photo ${editingPhoto.id ? 'updated' : 'added'} successfully`,
      });

      setIsDialogOpen(false);
      setEditingPhoto(null);
      fetchPhotos();
    } catch (error) {
      console.error('Error saving photo:', error);
      toast({
        title: "Error",
        description: "Failed to save photo",
        variant: "destructive",
      });
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await supabase.from('photo_galleries').delete().eq('id', id);
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const openDialog = (photo?: PhotoGallery) => {
    if (photo) {
      setEditingPhoto(photo);
    } else {
      setEditingPhoto({
        title: "",
        description: "",
        category: "academic",
        subcategory: "",
        image_url: "",
        alt_text: "",
        caption: "",
        photographer: "",
        photo_date: "",
        is_featured: false,
        display_order: 0,
        is_active: true
      });
    }
    setIsDialogOpen(true);
  };

  const getSubcategories = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.subcategories : [];
  };

  const getCurrentSubcategories = () => {
    if (filterCategory === "all") return [];
    return getSubcategories(filterCategory);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Photo Gallery Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPhoto?.id ? 'Edit Photo' : 'Add Photo'}
              </DialogTitle>
            </DialogHeader>
            {editingPhoto && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingPhoto.title}
                    onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingPhoto.description}
                    onChange={(e) => setEditingPhoto({...editingPhoto, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editingPhoto.category}
                      onValueChange={(value) => setEditingPhoto({...editingPhoto, category: value, subcategory: ""})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={editingPhoto.subcategory}
                      onValueChange={(value) => setEditingPhoto({...editingPhoto, subcategory: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {getSubcategories(editingPhoto.category).map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub.charAt(0).toUpperCase() + sub.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={editingPhoto.image_url}
                    onChange={(e) => setEditingPhoto({...editingPhoto, image_url: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="alt_text">Alt Text</Label>
                  <Input
                    id="alt_text"
                    value={editingPhoto.alt_text}
                    onChange={(e) => setEditingPhoto({...editingPhoto, alt_text: e.target.value})}
                    placeholder="Descriptive text for accessibility"
                  />
                </div>

                <div>
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    value={editingPhoto.caption}
                    onChange={(e) => setEditingPhoto({...editingPhoto, caption: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="photographer">Photographer</Label>
                    <Input
                      id="photographer"
                      value={editingPhoto.photographer}
                      onChange={(e) => setEditingPhoto({...editingPhoto, photographer: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="photo_date">Photo Date</Label>
                    <Input
                      id="photo_date"
                      type="date"
                      value={editingPhoto.photo_date}
                      onChange={(e) => setEditingPhoto({...editingPhoto, photo_date: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={editingPhoto.display_order}
                    onChange={(e) => setEditingPhoto({...editingPhoto, display_order: parseInt(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingPhoto.is_featured}
                      onCheckedChange={(checked) => setEditingPhoto({...editingPhoto, is_featured: checked})}
                    />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingPhoto.is_active}
                      onCheckedChange={(checked) => setEditingPhoto({...editingPhoto, is_active: checked})}
                    />
                    <Label>Active</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingPhoto.id ? 'Update' : 'Add'} Photo
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subcategory</Label>
              <Select value={filterSubcategory} onValueChange={setFilterSubcategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {getCurrentSubcategories().map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterCategory("all");
                  setFilterSubcategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="aspect-video relative">
              {photo.image_url ? (
                <img
                  src={photo.image_url}
                  alt={photo.alt_text || photo.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              {photo.is_featured && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openDialog(photo)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => deletePhoto(photo.id!)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold line-clamp-2 mb-2">{photo.title}</h4>
              {photo.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {photo.description}
                </p>
              )}
              <div className="flex gap-1 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.value === photo.category)?.label}
                </Badge>
                {photo.subcategory && (
                  <Badge variant="outline" className="text-xs">
                    {photo.subcategory}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Order: {photo.display_order}</span>
                <Badge variant={photo.is_active ? "default" : "secondary"} className="text-xs">
                  {photo.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {photos.length === 0 
                ? "No photos found. Add your first photo!" 
                : "No photos match the current filters."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}