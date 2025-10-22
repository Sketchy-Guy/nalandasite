import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TranscriptService {
  id: string;
  service_name: string;
  description: string | null;
  processing_time: string | null;
  required_documents: string[] | null;
  fees_amount: number | null;
  contact_email: string | null;
  is_online: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function TranscriptsManager() {
  const [services, setServices] = useState<TranscriptService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<TranscriptService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    processing_time: '',
    required_documents: '',
    fees_amount: '',
    contact_email: '',
    is_online: false,
  });

  const processingTimeOptions = [
    '1-2 working days',
    '3-5 working days',
    '1 week',
    '2 weeks',
    '3-4 weeks',
    '1 month',
    '2 months',
  ];

  // For demo purposes, using academic_pages table to store transcript services
  // In a real application, you would create a dedicated transcripts table
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Using academic_pages table for demo - filter by slug containing 'transcript'
      const { data, error } = await supabase
        .from('academic_pages')
        .select('*')
        .ilike('slug', '%transcript%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        service_name: item.title,
        description: item.content,
        processing_time: '3-5 working days', // Default values for demo
        required_documents: ['ID Proof', 'Academic Records'],
        fees_amount: 500,
        contact_email: 'academics@nalanda.com',
        is_online: true,
        is_active: item.is_active,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      
      setServices(transformedData);
    } catch (error) {
      console.error('Error fetching transcript services:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transcript services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      description: '',
      processing_time: '',
      required_documents: '',
      fees_amount: '',
      contact_email: '',
      is_online: false,
    });
    setEditingService(null);
  };

  const handleEdit = (service: TranscriptService) => {
    setFormData({
      service_name: service.service_name,
      description: service.description || '',
      processing_time: service.processing_time || '',
      required_documents: service.required_documents?.join(', ') || '',
      fees_amount: service.fees_amount?.toString() || '',
      contact_email: service.contact_email || '',
      is_online: service.is_online,
    });
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        title: formData.service_name,
        content: formData.description,
        slug: `transcript-${formData.service_name.toLowerCase().replace(/\s+/g, '-')}`,
        meta_description: formData.description?.substring(0, 160),
      };

      if (editingService) {
        const { error } = await supabase
          .from('academic_pages')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Transcript service updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('academic_pages')
          .insert(serviceData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Transcript service created successfully',
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving transcript service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save transcript service',
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('academic_pages')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Transcript service ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      fetchServices();
    } catch (error) {
      console.error('Error updating service status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update service status',
        variant: 'destructive',
      });
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transcript service?')) return;

    try {
      const { error } = await supabase
        .from('academic_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Transcript service deleted successfully',
      });

      fetchServices();
    } catch (error) {
      console.error('Error deleting transcript service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transcript service',
        variant: 'destructive',
      });
    }
  };

  const filteredServices = services.filter((service) =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transcripts Manager</h1>
          <p className="text-muted-foreground">Manage academic transcript services and procedures</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit' : 'Add'} Transcript Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="service_name">Service Name</Label>
                <Input
                  id="service_name"
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="processing_time">Processing Time</Label>
                  <Select value={formData.processing_time} onValueChange={(value) => setFormData({ ...formData, processing_time: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {processingTimeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fees_amount">Fees (₹)</Label>
                  <Input
                    id="fees_amount"
                    type="number"
                    value={formData.fees_amount}
                    onChange={(e) => setFormData({ ...formData, fees_amount: e.target.value })}
                    placeholder="0 for free"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="required_documents">Required Documents (comma separated)</Label>
                <Input
                  id="required_documents"
                  value={formData.required_documents}
                  onChange={(e) => setFormData({ ...formData, required_documents: e.target.value })}
                  placeholder="ID Proof, Academic Records, Application Form"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_online"
                  checked={formData.is_online}
                  onChange={(e) => setFormData({ ...formData, is_online: e.target.checked })}
                />
                <Label htmlFor="is_online">Online Service Available</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingService ? 'Update' : 'Add'} Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transcript services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {services.filter(s => s.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Online Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {services.filter(s => s.is_online).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Free Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {services.filter(s => !s.fees_amount || s.fees_amount === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transcript Services ({filteredServices.length})</CardTitle>
          <CardDescription>
            Manage academic transcript and document services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Processing Time</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {service.service_name}
                      </div>
                      {service.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {service.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {service.processing_time || 'Not specified'}
                    </div>
                  </TableCell>
                  <TableCell>{formatAmount(service.fees_amount)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={service.is_online ? 'default' : 'secondary'}>
                        {service.is_online ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </div>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(service.id, service.is_active)}
                      >
                        {service.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredServices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No transcript services found</p>
              <p className="text-sm">Add your first transcript service to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}