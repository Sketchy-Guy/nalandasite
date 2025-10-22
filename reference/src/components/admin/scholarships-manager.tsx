import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, ExternalLink, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Scholarship {
  id: string;
  title: string;
  description: string | null;
  eligibility_criteria: string | null;
  amount: number | null;
  application_deadline: string | null;
  application_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ScholarshipsManager() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eligibility_criteria: '',
    amount: '',
    application_deadline: '',
    application_url: '',
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScholarships(data || []);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch scholarships',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eligibility_criteria: '',
      amount: '',
      application_deadline: '',
      application_url: '',
    });
    setEditingScholarship(null);
  };

  const handleEdit = (scholarship: Scholarship) => {
    setFormData({
      title: scholarship.title,
      description: scholarship.description || '',
      eligibility_criteria: scholarship.eligibility_criteria || '',
      amount: scholarship.amount?.toString() || '',
      application_deadline: scholarship.application_deadline || '',
      application_url: scholarship.application_url || '',
    });
    setEditingScholarship(scholarship);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const scholarshipData = {
        title: formData.title,
        description: formData.description || null,
        eligibility_criteria: formData.eligibility_criteria || null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        application_deadline: formData.application_deadline || null,
        application_url: formData.application_url || null,
      };

      if (editingScholarship) {
        const { error } = await supabase
          .from('scholarships')
          .update(scholarshipData)
          .eq('id', editingScholarship.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Scholarship updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('scholarships')
          .insert(scholarshipData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Scholarship created successfully',
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchScholarships();
    } catch (error) {
      console.error('Error saving scholarship:', error);
      toast({
        title: 'Error',
        description: 'Failed to save scholarship',
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('scholarships')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Scholarship ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      fetchScholarships();
    } catch (error) {
      console.error('Error updating scholarship status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update scholarship status',
        variant: 'destructive',
      });
    }
  };

  const deleteScholarship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;

    try {
      const { error } = await supabase
        .from('scholarships')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Scholarship deleted successfully',
      });

      fetchScholarships();
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete scholarship',
        variant: 'destructive',
      });
    }
  };

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'Variable';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isDeadlinePassed = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
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
          <h1 className="text-3xl font-bold text-foreground">Scholarships Manager</h1>
          <p className="text-muted-foreground">Manage scholarship opportunities and financial assistance</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Scholarship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingScholarship ? 'Edit' : 'Add'} Scholarship</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Scholarship Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <div>
                <Label htmlFor="eligibility_criteria">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility_criteria"
                  value={formData.eligibility_criteria}
                  onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Leave empty for variable amount"
                  />
                </div>
                <div>
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="application_url">Application URL (Optional)</Label>
                <Input
                  id="application_url"
                  type="url"
                  value={formData.application_url}
                  onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                  placeholder="https://example.com/apply"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingScholarship ? 'Update' : 'Add'} Scholarship
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Scholarships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scholarships Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scholarships ({filteredScholarships.length})</CardTitle>
          <CardDescription>
            Manage scholarship opportunities and financial assistance programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScholarships.map((scholarship) => (
                <TableRow key={scholarship.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{scholarship.title}</div>
                      {scholarship.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {scholarship.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      {formatAmount(scholarship.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {scholarship.application_deadline ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className={isDeadlinePassed(scholarship.application_deadline) ? 'text-destructive' : ''}>
                          {new Date(scholarship.application_deadline).toLocaleDateString()}
                        </span>
                        {isDeadlinePassed(scholarship.application_deadline) && (
                          <Badge variant="destructive" className="text-xs">Expired</Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No deadline</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {scholarship.application_url ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(scholarship.application_url!, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Apply
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">Manual</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={scholarship.is_active ? 'default' : 'secondary'}>
                      {scholarship.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(scholarship)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(scholarship.id, scholarship.is_active)}
                      >
                        {scholarship.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteScholarship(scholarship.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredScholarships.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No scholarships found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}