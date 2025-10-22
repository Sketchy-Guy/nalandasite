import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  head_name: string;
  contact_email: string;
  hero_image: File | null;
  hero_image_url: string;
  gallery_images: { 
    id: string; 
    media_type: 'image' | 'video';
    image_url?: string; 
    video_url?: string;
    media_url?: string;
    caption: string; 
    display_order: number;
  }[];
  mission: string;
  vision: string;
  facilities: string[];
  programs_offered: string[];
  achievements: string[];
  location_details: string;
  is_active: boolean;
}

export function DepartmentsManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    head_name: '',
    contact_email: '',
    hero_image: null as File | null,
    mission: '',
    vision: '',
    facilities: [] as string[],
    programs_offered: [] as string[],
    achievements: [] as string[],
    location_details: '',
    is_active: true
  });

  const [newItems, setNewItems] = useState({
    facilities: '',
    programs_offered: '',
    achievements: ''
  });
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await api.departments.list();
      setDepartments(data.results || data || []);
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch departments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      head_name: '',
      contact_email: '',
      hero_image: null,
      mission: '',
      vision: '',
      facilities: [],
      programs_offered: [],
      achievements: [],
      location_details: '',
      is_active: true
    });
    setEditingDept(null);
    setNewItems({ facilities: '', programs_offered: '', achievements: '' });
    setSelectedGalleryFiles(null);
  };

  const openEditDialog = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      head_name: dept.head_name || '',
      contact_email: dept.contact_email || '',
      hero_image: null,
      mission: dept.mission || '',
      vision: dept.vision || '',
      facilities: dept.facilities || [],
      programs_offered: dept.programs_offered || [],
      achievements: dept.achievements || [],
      location_details: dept.location_details || '',
      is_active: dept.is_active
    });
    setIsDialogOpen(true);
  };

  const addItemToArray = (field: 'facilities' | 'programs_offered' | 'achievements') => {
    const value = newItems[field];
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setNewItems(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeItemFromArray = (field: 'facilities' | 'programs_offered' | 'achievements', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== item)
    }));
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, hero_image: file }));
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGalleryFiles(e.target.files);
  };

  const removeGalleryImage = async (imageId: string) => {
    try {
      await api.delete(`/department-gallery-images/${imageId}/`);
      toast({ title: 'Success', description: 'Gallery image removed successfully' });
      fetchDepartments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove gallery image',
        variant: 'destructive'
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add text fields
      submitData.append('name', formData.name);
      submitData.append('code', formData.code);
      submitData.append('description', formData.description);
      submitData.append('head_name', formData.head_name);
      submitData.append('contact_email', formData.contact_email);
      submitData.append('mission', formData.mission);
      submitData.append('vision', formData.vision);
      submitData.append('location_details', formData.location_details);
      submitData.append('is_active', formData.is_active.toString());
      
      // Add JSON arrays
      submitData.append('facilities', JSON.stringify(formData.facilities));
      submitData.append('programs_offered', JSON.stringify(formData.programs_offered));
      submitData.append('achievements', JSON.stringify(formData.achievements));
      
      // Add hero image if selected
      if (formData.hero_image) {
        submitData.append('hero_image', formData.hero_image);
      }

      if (editingDept) {
        await api.departments.update(editingDept.id, submitData);
        toast({ title: 'Success', description: 'Department updated successfully' });
      } else {
        await api.departments.create(submitData);
        toast({ title: 'Success', description: 'Department created successfully' });
      }

      // Upload gallery images if any selected
      if (selectedGalleryFiles && selectedGalleryFiles.length > 0) {
        let departmentId = editingDept?.id;
        
        // If creating a new department, get the ID from the response
        if (!departmentId && !editingDept) {
          // For new departments, we need to get the created department ID
          // This would require modifying the API response to return the created object
          console.log('New department created, need to get ID for gallery upload');
        }
        
        if (departmentId) {
          for (let i = 0; i < selectedGalleryFiles.length; i++) {
            const file = selectedGalleryFiles[i];
            const galleryData = new FormData();
            
            // Determine media type based on file type
            const isVideo = file.type.startsWith('video/');
            const mediaType = isVideo ? 'video' : 'image';
            
            galleryData.append('department', departmentId);
            galleryData.append('media_type', mediaType);
            galleryData.append('display_order', i.toString());
            
            if (isVideo) {
              galleryData.append('video', file);
            } else {
              galleryData.append('image', file);
            }
            
            await api.departmentGalleryImages.create(galleryData);
          }
        }
      }

      setIsDialogOpen(false);
      resetForm();
      fetchDepartments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Operation failed',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      await api.departments.delete(id);
      toast({ title: 'Success', description: 'Department deleted successfully' });
      fetchDepartments();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Delete failed',
        variant: 'destructive'
      });
    }
  };

  if (loading && departments.length === 0) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Departments Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDept ? 'Edit Department' : 'Add New Department'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Department Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="head_name">Department Head</Label>
                  <Input
                    id="head_name"
                    value={formData.head_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, head_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission</Label>
                  <Textarea
                    id="mission"
                    value={formData.mission}
                    onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Vision</Label>
                  <Textarea
                    id="vision"
                    value={formData.vision}
                    onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_image">Hero Image</Label>
                <Input
                  id="hero_image"
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageChange}
                />
                {editingDept?.hero_image_url && (
                  <div className="mt-2">
                    <img src={editingDept.hero_image_url} alt="Current hero" className="w-32 h-20 object-cover rounded" />
                    <p className="text-sm text-muted-foreground">Current hero image</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_details">Location Details</Label>
                <Input
                  id="location_details"
                  value={formData.location_details}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_details: e.target.value }))}
                />
              </div>

              {/* Dynamic Arrays */}
              {['facilities', 'programs_offered', 'achievements'].map((field) => (
                <div key={field} className="space-y-2">
                  <Label>{field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newItems[field as keyof typeof newItems]}
                      onChange={(e) => setNewItems(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder={`Add ${field.replace('_', ' ')}`}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItemToArray(field as any))}
                    />
                    <Button type="button" onClick={() => addItemToArray(field as any)} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData[field as keyof typeof formData] as string[]).map((item: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeItemFromArray(field as any, item)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              {/* Gallery Images */}
              <div className="space-y-2">
                <Label>Gallery Images & Videos</Label>
                <Input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                />
                {editingDept?.gallery_images && editingDept.gallery_images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {editingDept.gallery_images.map((media) => (
                      <div key={media.id} className="relative group">
                        {media.media_type === 'video' ? (
                          <video 
                            src={media.video_url || media.media_url} 
                            className="w-full h-20 object-cover rounded"
                            controls={false}
                            muted
                          />
                        ) : (
                          <img 
                            src={media.image_url || media.media_url} 
                            alt={media.caption || 'Gallery'} 
                            className="w-full h-20 object-cover rounded"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeGalleryImage(media.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute top-1 left-1">
                          <Badge variant="secondary" className="text-xs">
                            {media.media_type === 'video' ? '🎥' : '📷'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : editingDept ? 'Update Department' : 'Create Department'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{dept.code}</TableCell>
                  <TableCell>{dept.head_name}</TableCell>
                  <TableCell>{dept.contact_email}</TableCell>
                  <TableCell>
                    <Badge variant={dept.is_active ? "default" : "secondary"}>
                      {dept.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(dept)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteDepartment(dept.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}