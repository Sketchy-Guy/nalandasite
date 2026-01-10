import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import {
  Home,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Users,
  User,
  Bed,
  Building,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface HostelImage {
  id: string;
  image: string;
  image_url: string;
  display_order: number;
}

interface HostelInfo {
  id: string;
  name: string;
  description: string;
  hostel_type: string;
  capacity: number;
  rooms_available: number;
  facilities: string[];
  rules?: string;
  warden_name?: string;
  warden_contact?: string;
  images: HostelImage[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const HostelManager = () => {
  const [hostels, setHostels] = useState<HostelInfo[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<HostelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<HostelInfo | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hostel_type: 'boys',
    capacity: '',
    rooms_available: '',
    facilities: [] as string[],
    rules: '',
    warden_name: '',
    warden_contact: '',
    is_active: true
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [facilityInput, setFacilityInput] = useState('');

  const commonFacilities = [
    'Wi-Fi', 'Mess/Dining Hall', 'Common Room', 'Study Hall', 'Laundry',
    'Security', 'Parking', 'Medical Facility', 'Gym', 'Library',
    'Recreation Room', 'Water Cooler', 'Backup Power', 'CCTV'
  ];

  useEffect(() => {
    fetchHostels();
  }, []);

  useEffect(() => {
    filterHostels();
  }, [hostels, searchTerm, filterType]);

  const fetchHostels = async () => {
    try {
      const response = await api.hostels.list({ ordering: '-created_at' });
      const data = Array.isArray(response) ? response : (response.results || []);
      setHostels(data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hostel information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterHostels = () => {
    let filtered = hostels;

    if (searchTerm) {
      filtered = filtered.filter(hostel =>
        hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hostel.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(hostel => hostel.hostel_type === filterType);
    }

    setFilteredHostels(filtered);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 4;

    if (files.length + selectedImages.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive"
      });
      return;
    }

    setSelectedImages(prev => [...prev, ...files].slice(0, maxImages));

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string].slice(0, maxImages));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      hostel_type: 'boys',
      capacity: '',
      rooms_available: '',
      facilities: [],
      rules: '',
      warden_name: '',
      warden_contact: '',
      is_active: true
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setFacilityInput('');
    setEditingHostel(null);
  };

  const addFacility = (facility: string) => {
    if (facility && !formData.facilities.includes(facility)) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facility]
      });
    }
    setFacilityInput('');
  };

  const removeFacility = (facility: string) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter(f => f !== facility)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('hostel_type', formData.hostel_type);
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('rooms_available', formData.rooms_available);
      formDataToSend.append('facilities', JSON.stringify(formData.facilities));
      formDataToSend.append('rules', formData.rules);
      formDataToSend.append('warden_name', formData.warden_name);
      formDataToSend.append('warden_contact', formData.warden_contact);
      formDataToSend.append('is_active', String(formData.is_active));

      // Add images
      selectedImages.forEach((image, index) => {
        formDataToSend.append('uploaded_images', image);
      });

      if (editingHostel) {
        await api.hostels.update(editingHostel.id, formDataToSend);
        toast({
          title: "Success",
          description: "Hostel information updated successfully"
        });
      } else {
        await api.hostels.create(formDataToSend);
        toast({
          title: "Success",
          description: "Hostel information created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchHostels();
    } catch (error) {
      console.error('Error saving hostel:', error);
      toast({
        title: "Error",
        description: "Failed to save hostel information",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (hostel: HostelInfo) => {
    setFormData({
      name: hostel.name,
      description: hostel.description || '',
      hostel_type: hostel.hostel_type,
      capacity: hostel.capacity.toString(),
      rooms_available: hostel.rooms_available.toString(),
      facilities: hostel.facilities || [],
      rules: hostel.rules || '',
      warden_name: hostel.warden_name || '',
      warden_contact: hostel.warden_contact || '',
      is_active: hostel.is_active
    });

    // Set existing images as previews
    if (hostel.images && hostel.images.length > 0) {
      setImagePreviews(hostel.images.map(img => img.image_url));
    }

    setEditingHostel(hostel);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this hostel information?')) {
      return;
    }

    try {
      await api.hostels.delete(id);
      toast({
        title: "Success",
        description: "Hostel information deleted successfully"
      });
      fetchHostels();
    } catch (error) {
      console.error('Error deleting hostel:', error);
      toast({
        title: "Error",
        description: "Failed to delete hostel information",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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
            <Building className="h-8 w-8 text-primary" />
            Hostel Details
          </h1>
          <p className="text-muted-foreground">Manage hostel accommodation and facilities</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Hostel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingHostel ? 'Edit Hostel Information' : 'Add New Hostel'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="warden">Warden Info</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Hostel Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter hostel name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hostel_type">Hostel Type *</Label>
                      <Select
                        value={formData.hostel_type}
                        onValueChange={(value) => setFormData({ ...formData, hostel_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="boys">Boys Hostel</SelectItem>
                          <SelectItem value="girls">Girls Hostel</SelectItem>
                          <SelectItem value="mixed">Mixed/Co-ed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the hostel"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Total Capacity *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="Total number of students"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rooms_available">Rooms Available *</Label>
                      <Input
                        id="rooms_available"
                        type="number"
                        value={formData.rooms_available}
                        onChange={(e) => setFormData({ ...formData, rooms_available: e.target.value })}
                        placeholder="Available rooms"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rules">Rules & Regulations</Label>
                    <Textarea
                      id="rules"
                      value={formData.rules}
                      onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                      placeholder="Enter hostel rules and regulations..."
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </TabsContent>

                <TabsContent value="facilities" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Facilities</Label>
                    <div className="flex gap-2">
                      <Input
                        value={facilityInput}
                        onChange={(e) => setFacilityInput(e.target.value)}
                        placeholder="Enter facility name"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addFacility(facilityInput);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => addFacility(facilityInput)}
                        disabled={!facilityInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Quick Add Common Facilities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {commonFacilities.map((facility) => (
                        <Button
                          key={facility}
                          type="button"
                          variant={formData.facilities.includes(facility) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (formData.facilities.includes(facility)) {
                              removeFacility(facility);
                            } else {
                              addFacility(facility);
                            }
                          }}
                        >
                          {facility}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Selected Facilities</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.facilities.map((facility) => (
                        <Badge key={facility} variant="secondary" className="flex items-center gap-1">
                          {facility}
                          <button
                            type="button"
                            onClick={() => removeFacility(facility)}
                            className="ml-1 text-xs hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Images (Max 4)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={selectedImages.length >= 4}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload images ({selectedImages.length}/4)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </label>
                    </div>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Badge className="absolute bottom-2 left-2">
                            {index + 1}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="warden" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="warden_name">Warden Name</Label>
                    <Input
                      id="warden_name"
                      value={formData.warden_name}
                      onChange={(e) => setFormData({ ...formData, warden_name: e.target.value })}
                      placeholder="Enter warden name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warden_contact">Warden Contact</Label>
                    <Input
                      id="warden_contact"
                      value={formData.warden_contact}
                      onChange={(e) => setFormData({ ...formData, warden_contact: e.target.value })}
                      placeholder="Phone number or email"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingHostel ? 'Update' : 'Create'} Hostel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hostels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="boys">Boys Hostel</SelectItem>
            <SelectItem value="girls">Girls Hostel</SelectItem>
            <SelectItem value="mixed">Mixed/Co-ed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hostels Grid */}
      {filteredHostels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hostels Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterType !== 'all'
                ? 'No hostels match your current filters.'
                : 'Get started by adding your first hostel information.'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Hostel
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredHostels.map((hostel, index) => (
            <motion.div
              key={hostel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{hostel.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{hostel.hostel_type}</Badge>
                          <Badge variant={hostel.is_active ? "default" : "secondary"}>
                            {hostel.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  {hostel.description && (
                    <CardDescription className="line-clamp-2">
                      {hostel.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Images */}
                    {hostel.images && hostel.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {hostel.images.slice(0, 4).map((image, idx) => (
                          <img
                            key={image.id}
                            src={image.image_url}
                            alt={`${hostel.name} ${idx + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}

                    {/* Capacity Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Bed className="h-4 w-4 mr-2" />
                        Capacity: {hostel.capacity}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Home className="h-4 w-4 mr-2" />
                        Available: {hostel.rooms_available}
                      </div>
                    </div>

                    {/* Facilities */}
                    {hostel.facilities && hostel.facilities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Facilities:</p>
                        <div className="flex flex-wrap gap-1">
                          {hostel.facilities.slice(0, 3).map((facility) => (
                            <Badge key={facility} variant="outline" className="text-xs">
                              {facility}
                            </Badge>
                          ))}
                          {hostel.facilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{hostel.facilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Warden Info */}
                    {hostel.warden_name && (
                      <div className="text-sm text-muted-foreground">
                        <User className="h-4 w-4 inline mr-2" />
                        Warden: {hostel.warden_name}
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(hostel)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(hostel.id)}
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

export default HostelManager;