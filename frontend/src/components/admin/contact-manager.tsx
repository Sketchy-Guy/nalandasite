import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, MapPin, Phone, Mail, Clock, Building } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface ContactInfo {
  id?: string;
  office_name: string;
  address: string;
  phone: string;
  email: string;
  office_hours: string;
  contact_person: string;
  designation: string;
  department: string;
  location_map_url?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
}

interface OfficeLocation {
  id?: string;
  name: string;
  building: string;
  floor: string;
  room_number: string;
  address: string;
  landmark: string;
  phone: string;
  email: string;
  office_hours: string;
  map_coordinates?: string;
  image_url?: string;
  is_main_office: boolean;
  is_active: boolean;
}

interface QuickContactInfo {
  id?: string;
  main_phone: string;
  main_email: string;
  main_address: string;
  general_inquiries_email: string;
  admissions_email: string;
  placement_email: string;
  emergency_phone: string;
  website_url: string;
  social_media_links: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  is_active: boolean;
}

export function ContactManager() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [quickContactInfo, setQuickContactInfo] = useState<QuickContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [editingLocation, setEditingLocation] = useState<OfficeLocation | null>(null);
  const [editingQuickContact, setEditingQuickContact] = useState<QuickContactInfo | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isQuickContactDialogOpen, setIsQuickContactDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactResponse, locationsResponse, quickContactResponse] = await Promise.all([
        api.contactInfo.list({ ordering: 'display_order' }),
        api.officeLocations.list({ ordering: '-is_main_office' }),
        api.quickContactInfo.list()
      ]);

      if (contactResponse.results) setContactInfo(contactResponse.results);
      if (locationsResponse.results) setOfficeLocations(locationsResponse.results);
      
      // Fetch quick contact info from Django API
      if (quickContactResponse.results && quickContactResponse.results.length > 0) {
        setQuickContactInfo(quickContactResponse.results[0]); // Use first record
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      if (editingContact.id) {
        await api.contactInfo.update(editingContact.id, editingContact);
      } else {
        await api.contactInfo.create(editingContact);
      }

      toast({
        title: "Success",
        description: `Contact information ${editingContact.id ? 'updated' : 'created'} successfully`,
      });

      setIsContactDialogOpen(false);
      setEditingContact(null);
      fetchData();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast({
        title: "Error",
        description: "Failed to save contact information",
        variant: "destructive",
      });
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation) return;

    try {
      if (editingLocation.id) {
        await api.officeLocations.update(editingLocation.id, editingLocation);
      } else {
        await api.officeLocations.create(editingLocation);
      }

      toast({
        title: "Success",
        description: `Office location ${editingLocation.id ? 'updated' : 'created'} successfully`,
      });

      setIsLocationDialogOpen(false);
      setEditingLocation(null);
      fetchData();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: "Error",
        description: "Failed to save office location",
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await api.contactInfo.delete(id);
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      await api.officeLocations.delete(id);
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    }
  };

  const deleteQuickContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete the quick contact information?')) return;

    try {
      await api.quickContactInfo.delete(id);
      toast({
        title: "Success",
        description: "Quick contact information deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting quick contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete quick contact information",
        variant: "destructive",
      });
    }
  };

  const handleQuickContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuickContact) return;

    try {
      if (editingQuickContact.id) {
        await api.quickContactInfo.update(editingQuickContact.id, editingQuickContact);
      } else {
        await api.quickContactInfo.create(editingQuickContact);
      }

      toast({
        title: "Success",
        description: "Quick contact information updated successfully",
      });

      setIsQuickContactDialogOpen(false);
      setEditingQuickContact(null);
      fetchData();
    } catch (error) {
      console.error('Error saving quick contact:', error);
      toast({
        title: "Error",
        description: "Failed to save quick contact information",
        variant: "destructive",
      });
    }
  };

  const openContactDialog = (contact?: ContactInfo) => {
    setEditingContact(contact || {
      office_name: "",
      address: "",
      phone: "",
      email: "",
      office_hours: "",
      contact_person: "",
      designation: "",
      department: "",
      location_map_url: "",
      image_url: "",
      is_active: true,
      display_order: 0
    });
    setIsContactDialogOpen(true);
  };

  const openLocationDialog = (location?: OfficeLocation) => {
    setEditingLocation(location || {
      name: "",
      building: "",
      floor: "",
      room_number: "",
      address: "",
      landmark: "",
      phone: "",
      email: "",
      office_hours: "",
      map_coordinates: "",
      image_url: "",
      is_main_office: false,
      is_active: true
    });
    setIsLocationDialogOpen(true);
  };

  const openQuickContactDialog = () => {
    setEditingQuickContact(quickContactInfo || {
      main_phone: "",
      main_email: "",
      main_address: "",
      general_inquiries_email: "",
      admissions_email: "",
      placement_email: "",
      emergency_phone: "",
      website_url: "",
      social_media_links: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: ""
      },
      is_active: true
    });
    setIsQuickContactDialogOpen(true);
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Management</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={openQuickContactDialog}>
            <Edit className="h-4 w-4 mr-2" />
            Quick Contact Info
          </Button>
          <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openContactDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact Info
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingContact?.id ? 'Edit Contact Information' : 'Add Contact Information'}
                </DialogTitle>
              </DialogHeader>
              {editingContact && (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="office_name">Office Name</Label>
                      <Input
                        id="office_name"
                        value={editingContact.office_name}
                        onChange={(e) => setEditingContact({...editingContact, office_name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={editingContact.department}
                        onChange={(e) => setEditingContact({...editingContact, department: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_person">Contact Person</Label>
                      <Input
                        id="contact_person"
                        value={editingContact.contact_person}
                        onChange={(e) => setEditingContact({...editingContact, contact_person: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={editingContact.designation}
                        onChange={(e) => setEditingContact({...editingContact, designation: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editingContact.phone}
                        onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editingContact.email}
                        onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editingContact.address}
                      onChange={(e) => setEditingContact({...editingContact, address: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="office_hours">Office Hours</Label>
                    <Input
                      id="office_hours"
                      value={editingContact.office_hours}
                      onChange={(e) => setEditingContact({...editingContact, office_hours: e.target.value})}
                      placeholder="e.g., Mon-Fri 9:00 AM - 5:00 PM"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={editingContact.image_url}
                        onChange={(e) => setEditingContact({...editingContact, image_url: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="display_order">Display Order</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={editingContact.display_order}
                        onChange={(e) => setEditingContact({...editingContact, display_order: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingContact.is_active}
                      onCheckedChange={(checked) => setEditingContact({...editingContact, is_active: checked})}
                    />
                    <Label>Active</Label>
                  </div>

                  <Button type="submit" className="w-full">
                    {editingContact.id ? 'Update' : 'Create'} Contact
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => openLocationDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Office Location
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingLocation?.id ? 'Edit Office Location' : 'Add Office Location'}
                </DialogTitle>
              </DialogHeader>
              {editingLocation && (
                <form onSubmit={handleLocationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Location Name</Label>
                      <Input
                        id="name"
                        value={editingLocation.name}
                        onChange={(e) => setEditingLocation({...editingLocation, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="building">Building</Label>
                      <Input
                        id="building"
                        value={editingLocation.building}
                        onChange={(e) => setEditingLocation({...editingLocation, building: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="floor">Floor</Label>
                      <Input
                        id="floor"
                        value={editingLocation.floor}
                        onChange={(e) => setEditingLocation({...editingLocation, floor: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="room_number">Room Number</Label>
                      <Input
                        id="room_number"
                        value={editingLocation.room_number}
                        onChange={(e) => setEditingLocation({...editingLocation, room_number: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={editingLocation.address}
                      onChange={(e) => setEditingLocation({...editingLocation, address: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editingLocation.phone}
                        onChange={(e) => setEditingLocation({...editingLocation, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editingLocation.email}
                        onChange={(e) => setEditingLocation({...editingLocation, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="office_hours">Office Hours</Label>
                    <Input
                      id="office_hours"
                      value={editingLocation.office_hours}
                      onChange={(e) => setEditingLocation({...editingLocation, office_hours: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingLocation.is_main_office}
                        onCheckedChange={(checked) => setEditingLocation({...editingLocation, is_main_office: checked})}
                      />
                      <Label>Main Office</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingLocation.is_active}
                        onCheckedChange={(checked) => setEditingLocation({...editingLocation, is_active: checked})}
                      />
                      <Label>Active</Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    {editingLocation.id ? 'Update' : 'Create'} Location
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Quick Contact Dialog */}
          <Dialog open={isQuickContactDialogOpen} onOpenChange={setIsQuickContactDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Quick Contact Information</DialogTitle>
              </DialogHeader>
              {editingQuickContact && (
                <form onSubmit={handleQuickContactSubmit} className="space-y-6">
                  {/* Main Contact Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Main Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="main_phone">Main Phone</Label>
                        <Input
                          id="main_phone"
                          value={editingQuickContact.main_phone}
                          onChange={(e) => setEditingQuickContact({...editingQuickContact, main_phone: e.target.value})}
                          placeholder="+91-XXX-XXX-XXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="main_email">Main Email</Label>
                        <Input
                          id="main_email"
                          type="email"
                          value={editingQuickContact.main_email}
                          onChange={(e) => setEditingQuickContact({...editingQuickContact, main_email: e.target.value})}
                          placeholder="info@college.edu"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="main_address">Main Address</Label>
                      <Textarea
                        id="main_address"
                        value={editingQuickContact.main_address}
                        onChange={(e) => setEditingQuickContact({...editingQuickContact, main_address: e.target.value})}
                        placeholder="College Campus, City, State - PIN"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Department Emails Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Department Emails</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="general_inquiries_email">General Inquiries</Label>
                        <Input
                          id="general_inquiries_email"
                          type="email"
                          value={editingQuickContact.general_inquiries_email}
                          onChange={(e) => setEditingQuickContact({...editingQuickContact, general_inquiries_email: e.target.value})}
                          placeholder="info@college.edu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admissions_email">Admissions</Label>
                        <Input
                          id="admissions_email"
                          type="email"
                          value={editingQuickContact.admissions_email}
                          onChange={(e) => setEditingQuickContact({...editingQuickContact, admissions_email: e.target.value})}
                          placeholder="admissions@college.edu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="placement_email">Placement</Label>
                        <Input
                          id="placement_email"
                          type="email"
                          value={editingQuickContact.placement_email}
                          onChange={(e) => setEditingQuickContact({...editingQuickContact, placement_email: e.target.value})}
                          placeholder="placement@college.edu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency_phone">Emergency Phone</Label>
                        <Input
                          id="emergency_phone"
                          value={editingQuickContact.emergency_phone}
                          onChange={(e) => setEditingQuickContact({...editingQuickContact, emergency_phone: e.target.value})}
                          placeholder="+91-XXX-XXX-XXXX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Website and Social Media Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Website & Social Media</h3>
                    <div>
                      <Label htmlFor="website_url">Website URL</Label>
                      <Input
                        id="website_url"
                        type="url"
                        value={editingQuickContact.website_url}
                        onChange={(e) => setEditingQuickContact({...editingQuickContact, website_url: e.target.value})}
                        placeholder="https://www.college.edu"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          type="url"
                          value={editingQuickContact.social_media_links?.facebook || ""}
                          onChange={(e) => setEditingQuickContact({
                            ...editingQuickContact, 
                            social_media_links: {...editingQuickContact.social_media_links, facebook: e.target.value}
                          })}
                          placeholder="https://facebook.com/college"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          type="url"
                          value={editingQuickContact.social_media_links?.twitter || ""}
                          onChange={(e) => setEditingQuickContact({
                            ...editingQuickContact, 
                            social_media_links: {...editingQuickContact.social_media_links, twitter: e.target.value}
                          })}
                          placeholder="https://twitter.com/college"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          type="url"
                          value={editingQuickContact.social_media_links?.linkedin || ""}
                          onChange={(e) => setEditingQuickContact({
                            ...editingQuickContact, 
                            social_media_links: {...editingQuickContact.social_media_links, linkedin: e.target.value}
                          })}
                          placeholder="https://linkedin.com/company/college"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          type="url"
                          value={editingQuickContact.social_media_links?.instagram || ""}
                          onChange={(e) => setEditingQuickContact({
                            ...editingQuickContact, 
                            social_media_links: {...editingQuickContact.social_media_links, instagram: e.target.value}
                          })}
                          placeholder="https://instagram.com/college"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingQuickContact.is_active}
                      onCheckedChange={(checked) => setEditingQuickContact({...editingQuickContact, is_active: checked})}
                    />
                    <Label>Active</Label>
                  </div>

                  <Button type="submit" className="w-full">
                    Save Quick Contact Information
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactInfo.map((contact) => (
              <Card key={contact.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{contact.office_name}</h4>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openContactDialog(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteContact(contact.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {contact.contact_person && (
                    <p>{contact.contact_person} - {contact.designation}</p>
                  )}
                  {contact.department && <p>Dept: {contact.department}</p>}
                  {contact.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{contact.phone}</p>}
                  {contact.email && <p className="flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</p>}
                </div>
                <div className="mt-2">
                  <Badge variant={contact.is_active ? "default" : "secondary"}>
                    {contact.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Office Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Office Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {officeLocations.map((location) => (
              <Card key={location.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{location.name}</h4>
                    {location.is_main_office && (
                      <Badge className="mt-1">Main Office</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openLocationDialog(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteLocation(location.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {location.building && (
                    <p className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {location.building}
                      {location.floor && `, Floor ${location.floor}`}
                      {location.room_number && `, Room ${location.room_number}`}
                    </p>
                  )}
                  {location.phone && (
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {location.phone}
                    </p>
                  )}
                  {location.email && (
                    <p className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {location.email}
                    </p>
                  )}
                  {location.office_hours && (
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {location.office_hours}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <Badge variant={location.is_active ? "default" : "secondary"}>
                    {location.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quick Contact Information</CardTitle>
            {quickContactInfo && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openQuickContactDialog()}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteQuickContact(quickContactInfo.id!)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {quickContactInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Main Contact</h4>
                {quickContactInfo.main_phone && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {quickContactInfo.main_phone}
                  </p>
                )}
                {quickContactInfo.main_email && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {quickContactInfo.main_email}
                  </p>
                )}
                {quickContactInfo.main_address && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {quickContactInfo.main_address}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Department Emails</h4>
                {quickContactInfo.general_inquiries_email && (
                  <p className="text-sm text-muted-foreground">
                    <strong>General:</strong> {quickContactInfo.general_inquiries_email}
                  </p>
                )}
                {quickContactInfo.admissions_email && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Admissions:</strong> {quickContactInfo.admissions_email}
                  </p>
                )}
                {quickContactInfo.placement_email && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Placement:</strong> {quickContactInfo.placement_email}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Emergency & Links</h4>
                {quickContactInfo.emergency_phone && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {quickContactInfo.emergency_phone}
                  </p>
                )}
                {quickContactInfo.website_url && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Website:</strong> {quickContactInfo.website_url}
                  </p>
                )}
                <div className="flex gap-2">
                  {quickContactInfo.social_media_links?.facebook && (
                    <Badge variant="outline" className="text-xs">Facebook</Badge>
                  )}
                  {quickContactInfo.social_media_links?.twitter && (
                    <Badge variant="outline" className="text-xs">Twitter</Badge>
                  )}
                  {quickContactInfo.social_media_links?.linkedin && (
                    <Badge variant="outline" className="text-xs">LinkedIn</Badge>
                  )}
                  {quickContactInfo.social_media_links?.instagram && (
                    <Badge variant="outline" className="text-xs">Instagram</Badge>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No quick contact information configured.</p>
              <p className="text-sm">Click "Quick Contact Info" to add general contact details.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}