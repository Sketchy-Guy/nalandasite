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
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  Dumbbell,
  Target,
  Award,
  Calendar
} from 'lucide-react';

interface SportsFacilityImage {
  id: string;
  image: string;
  image_url: string;
  display_order: number;
}

interface SportsFacility {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  facility_type: string;
  capacity?: number;
  operating_hours?: string;
  booking_required: boolean;
  contact_person?: string;
  contact_email?: string;
  images: SportsFacilityImage[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SportsFacilitiesManager = () => {
  const [facilities, setFacilities] = useState<SportsFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<SportsFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<SportsFacility | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    facility_type: 'outdoor',
    capacity: '',
    operating_hours: '',
    booking_required: false,
    contact_person: '',
    contact_email: '',
    is_active: true
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    filterFacilities();
  }, [facilities, searchTerm, filterType]);

  const fetchFacilities = async () => {
    try {
      const response = await api.sportsFacilities.list({ ordering: '-created_at' });
      const data = Array.isArray(response) ? response : (response.results || []);
      setFacilities(data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sports facilities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterFacilities = () => {
    let filtered = facilities;

    if (searchTerm) {
      filtered = filtered.filter(facility =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(facility => facility.facility_type === filterType);
    }

    setFilteredFacilities(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      facility_type: 'outdoor',
      capacity: '',
      operating_hours: '',
      booking_required: false,
      contact_person: '',
      contact_email: '',
      is_active: true
    });
    setSelectedImages([]);
    setImagePreview([]);
    setEditingFacility(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 4) {
      toast({
        title: "Too many images",
        description: "You can only upload up to 4 images",
        variant: "destructive"
      });
      return;
    }

    setSelectedImages(prev => [...prev, ...files].slice(0, 4));

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append('name', formData.name);
      if (formData.description) formDataToSend.append('description', formData.description);
      if (formData.image_url) formDataToSend.append('image_url', formData.image_url);
      formDataToSend.append('facility_type', formData.facility_type);
      if (formData.capacity) formDataToSend.append('capacity', formData.capacity);
      if (formData.operating_hours) formDataToSend.append('operating_hours', formData.operating_hours);
      formDataToSend.append('booking_required', String(formData.booking_required));
      if (formData.contact_person) formDataToSend.append('contact_person', formData.contact_person);
      if (formData.contact_email) formDataToSend.append('contact_email', formData.contact_email);
      formDataToSend.append('is_active', String(formData.is_active));

      // Append images
      selectedImages.forEach((image) => {
        formDataToSend.append('uploaded_images', image);
      });

      if (editingFacility) {
        await api.sportsFacilities.update(editingFacility.id, formDataToSend);

        toast({
          title: "Success",
          description: "Sports facility updated successfully"
        });
      } else {
        await api.sportsFacilities.create(formDataToSend);

        toast({
          title: "Success",
          description: "Sports facility created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFacilities();
    } catch (error) {
      console.error('Error saving facility:', error);
      toast({
        title: "Error",
        description: "Failed to save sports facility",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (facility: SportsFacility) => {
    setFormData({
      name: facility.name,
      description: facility.description || '',
      image_url: facility.image_url || '',
      facility_type: facility.facility_type,
      capacity: facility.capacity?.toString() || '',
      operating_hours: facility.operating_hours || '',
      booking_required: facility.booking_required,
      contact_person: facility.contact_person || '',
      contact_email: facility.contact_email || '',
      is_active: facility.is_active
    });
    setEditingFacility(facility);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sports facility?')) {
      return;
    }

    try {
      await api.sportsFacilities.delete(id);

      toast({
        title: "Success",
        description: "Sports facility deleted successfully"
      });

      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast({
        title: "Error",
        description: "Failed to delete sports facility",
        variant: "destructive"
      });
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gym':
      case 'fitness':
        return Dumbbell;
      case 'outdoor':
        return Target;
      case 'indoor':
        return Trophy;
      default:
        return Award;
    }
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
            <Trophy className="h-8 w-8 text-primary" />
            Sports Facilities Manager
          </h1>
          <p className="text-muted-foreground">Manage sports facilities and equipment</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFacility ? 'Edit Sports Facility' : 'Add New Sports Facility'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Facility Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter facility name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facility_type">Facility Type *</Label>
                      <Select
                        value={formData.facility_type}
                        onValueChange={(value) => setFormData({ ...formData, facility_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outdoor">Outdoor</SelectItem>
                          <SelectItem value="indoor">Indoor</SelectItem>
                          <SelectItem value="gym">Gym</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="court">Court</SelectItem>
                          <SelectItem value="field">Field</SelectItem>
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
                      placeholder="Describe the facility"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="Number of people"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="operating_hours">Operating Hours</Label>
                      <Input
                        id="operating_hours"
                        value={formData.operating_hours}
                        onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                        placeholder="e.g., 6:00 AM - 10:00 PM"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="booking_required"
                      checked={formData.booking_required}
                      onCheckedChange={(checked) => setFormData({ ...formData, booking_required: checked })}
                    />
                    <Label htmlFor="booking_required">Booking Required</Label>
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

                <TabsContent value="images" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="images">Upload Images (Max 4)</Label>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      disabled={selectedImages.length >= 4}
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedImages.length}/4 images selected
                    </p>
                  </div>

                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      placeholder="Enter contact person name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="Enter contact email"
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
                  {editingFacility ? 'Update' : 'Create'} Facility
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
            placeholder="Search facilities..."
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
            <SelectItem value="outdoor">Outdoor</SelectItem>
            <SelectItem value="indoor">Indoor</SelectItem>
            <SelectItem value="gym">Gym</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="court">Court</SelectItem>
            <SelectItem value="field">Field</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Facilities Grid */}
      {filteredFacilities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Sports Facilities Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterType !== 'all'
                ? 'No facilities match your current filters.'
                : 'Get started by adding your first sports facility.'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Facility
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility, index) => {
            const Icon = getFacilityIcon(facility.facility_type);
            return (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{facility.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{facility.facility_type}</Badge>
                            <Badge variant={facility.is_active ? "default" : "secondary"}>
                              {facility.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    {facility.description && (
                      <CardDescription className="line-clamp-2">
                        {facility.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {facility.capacity && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          Capacity: {facility.capacity}
                        </div>
                      )}
                      {facility.operating_hours && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          {facility.operating_hours}
                        </div>
                      )}
                      {facility.booking_required && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          Booking Required
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(facility)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(facility.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SportsFacilitiesManager;