import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Building, MapPin, Clock, Phone, Mail } from "lucide-react";

interface Amenity {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  operating_hours: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  features: string[];
  booking_required: boolean;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

export default function AmenitiesManager() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general",
    location: "",
    operating_hours: "",
    contact_person: "",
    contact_phone: "",
    contact_email: "",
    features: [] as string[],
    booking_required: false,
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await api.amenities.list({ ordering: '-created_at' });
      const data = Array.isArray(response) ? response : (response.results || []);
      setAmenities(data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      toast.error('Failed to load amenities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAmenity) {
        await api.amenities.update(editingAmenity.id, formData);
        toast.success('Amenity updated successfully');
      } else {
        await api.amenities.create(formData);
        toast.success('Amenity created successfully');
      }

      setIsDialogOpen(false);
      setEditingAmenity(null);
      resetForm();
      fetchAmenities();
    } catch (error) {
      console.error('Error saving amenity:', error);
      toast.error('Failed to save amenity');
    }
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name,
      description: amenity.description || "",
      category: amenity.category,
      location: amenity.location || "",
      operating_hours: amenity.operating_hours || "",
      contact_person: amenity.contact_person || "",
      contact_phone: amenity.contact_phone || "",
      contact_email: amenity.contact_email || "",
      features: amenity.features || [],
      booking_required: amenity.booking_required,
      image_url: amenity.image_url || "",
      is_active: amenity.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this amenity?')) return;

    try {
      await api.amenities.delete(id);
      toast.success('Amenity deleted successfully');
      fetchAmenities();
    } catch (error) {
      console.error('Error deleting amenity:', error);
      toast.error('Failed to delete amenity');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "general",
      location: "",
      operating_hours: "",
      contact_person: "",
      contact_phone: "",
      contact_email: "",
      features: [],
      booking_required: false,
      image_url: "",
      is_active: true,
    });
  };

  const handleFeaturesChange = (value: string) => {
    const features = value.split(',').map(f => f.trim()).filter(f => f);
    setFormData({ ...formData, features });
  };

  const categories = [
    { value: "general", label: "General" },
    { value: "dining", label: "Dining" },
    { value: "parking", label: "Parking" },
    { value: "retail", label: "Retail" },
    { value: "technology", label: "Technology" },
    { value: "recreation", label: "Recreation" },
    { value: "academic", label: "Academic Support" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading amenities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Amenities Manager</h1>
          <p className="text-muted-foreground">Manage campus facilities and services</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingAmenity(null);
              resetForm();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Amenity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}
              </DialogTitle>
              <DialogDescription>
                {editingAmenity ? 'Update the amenity details.' : 'Create a new amenity or facility entry.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Building, Floor, Room"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operating_hours">Operating Hours</Label>
                  <Input
                    id="operating_hours"
                    value={formData.operating_hours}
                    onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })}
                    placeholder="Mon-Fri: 9:00 AM - 5:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features.join(', ')}
                  onChange={(e) => handleFeaturesChange(e.target.value)}
                  placeholder="WiFi, Air Conditioning, Parking Available"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/facility.jpg"
                />
              </div>

              <div className="flex items-center space-x-6">
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
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAmenity ? 'Update' : 'Create'} Amenity
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Amenities & Facilities ({amenities.length})
          </CardTitle>
          <CardDescription>
            Manage all campus amenities, facilities, and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {amenities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No amenities found. Create your first amenity to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amenities.map((amenity) => (
                    <TableRow key={amenity.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          {amenity.operating_hours && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {amenity.operating_hours}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {amenity.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {amenity.location && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {amenity.location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {amenity.contact_person && (
                            <div className="text-sm">{amenity.contact_person}</div>
                          )}
                          {amenity.contact_phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {amenity.contact_phone}
                            </div>
                          )}
                          {amenity.contact_email && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {amenity.contact_email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {amenity.features?.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {amenity.features?.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{amenity.features.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={amenity.is_active ? "default" : "secondary"}>
                            {amenity.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {amenity.booking_required && (
                            <Badge variant="outline" className="text-blue-600">
                              Booking Required
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(amenity)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(amenity.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}