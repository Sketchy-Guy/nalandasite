import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Calendar, Search } from 'lucide-react';
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
import { api } from '@/lib/api';

interface FeeItem {
  category: string;
  label: string;
  amount: number;
}

interface FeesStructure {
  id: string;
  title: string;
  description: string | null;
  fee_items: FeeItem[];
  total_amount?: number;
  academic_year: string;
  semester: string | null;
  department: string | null;
  amount: number | null;
  due_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function FeesManager() {
  const [fees, setFees] = useState<FeesStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeesStructure | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fee_items: [] as FeeItem[],
    academic_year: '2024-25',
    semester: '',
    department: '',
    amount: '',
    due_date: '',
  });

  const categories = [
    { value: 'tuition', label: 'Tuition Fees' },
    { value: 'hostel', label: 'Hostel Fees' },
    { value: 'examination', label: 'Examination Fees' },
    { value: 'library', label: 'Library Fees' },
    { value: 'development', label: 'Development Fees' },
    { value: 'registration', label: 'Registration Fees' },
    { value: 'other', label: 'Other Fees' },
  ];

  const academicYears = ['2024-25', '2025-26', '2026-27'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await api.fees.list();
      setFees(response.results || response);
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch fees structure',
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
      fee_items: [],
      academic_year: '2024-25',
      semester: '',
      department: '',
      amount: '',
      due_date: '',
    });
    setEditingFee(null);
  };

  const handleEdit = (fee: FeesStructure) => {
    setFormData({
      title: fee.title,
      description: fee.description || '',
      fee_items: fee.fee_items || [],
      academic_year: fee.academic_year,
      semester: fee.semester || '',
      department: fee.department || '',
      amount: fee.amount?.toString() || '',
      due_date: fee.due_date || '',
    });
    setEditingFee(fee);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const feeData = {
        title: formData.title,
        description: formData.description || null,
        fee_items: formData.fee_items,
        academic_year: formData.academic_year,
        semester: formData.semester || null,
        department: formData.department || null,
        due_date: formData.due_date || null,
      };

      if (editingFee) {
        await api.fees.update(editingFee.id, feeData);
        toast({
          title: 'Success',
          description: 'Fee structure updated successfully',
        });
      } else {
        await api.fees.create(feeData);
        toast({
          title: 'Success',
          description: 'Fee structure created successfully',
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchFees();
    } catch (error) {
      console.error('Error saving fee structure:', error);
      toast({
        title: 'Error',
        description: 'Failed to save fee structure',
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.fees.patch(id, { is_active: !currentStatus });
      toast({
        title: 'Success',
        description: `Fee structure ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
      fetchFees();
    } catch (error) {
      console.error('Error updating fee status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update fee status',
        variant: 'destructive',
      });
    }
  };

  const deleteFee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fee structure?')) return;

    try {
      await api.fees.delete(id);
      toast({
        title: 'Success',
        description: 'Fee structure deleted successfully',
      });
      fetchFees();
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete fee structure',
        variant: 'destructive',
      });
    }
  };

  const filteredFees = fees.filter((fee) =>
    fee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.fee_items?.some(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'Not Set';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
          <h1 className="text-3xl font-bold text-foreground">Fees Management</h1>
          <p className="text-muted-foreground">Manage fee structure and payment information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Fee Structure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFee ? 'Edit' : 'Add'} Fee Structure</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Fee Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Fee Items</Label>
                  <div className="space-y-3 p-3 border rounded-md">
                    {formData.fee_items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Label className="text-xs">Category</Label>
                          <Select
                            value={item.category}
                            onValueChange={(value) => {
                              const newItems = [...formData.fee_items];
                              const selectedCat = categories.find(c => c.value === value);
                              newItems[index] = {
                                category: value,
                                label: selectedCat?.label || value,
                                amount: item.amount
                              };
                              setFormData({ ...formData, fee_items: newItems });
                            }}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">Amount (₹)</Label>
                          <Input
                            type="number"
                            value={item.amount === 0 ? '' : item.amount}
                            onChange={(e) => {
                              const newItems = [...formData.fee_items];
                              const value = e.target.value;
                              newItems[index].amount = value === '' ? 0 : parseFloat(value);
                              setFormData({ ...formData, fee_items: newItems });
                            }}
                            onFocus={(e) => e.target.select()}
                            placeholder="0"
                            className="h-9"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newItems = formData.fee_items.filter((_, i) => i !== index);
                            setFormData({ ...formData, fee_items: newItems });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          fee_items: [...formData.fee_items, { category: 'tuition', label: 'Tuition Fees', amount: 0 }]
                        });
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Fee Item
                    </Button>
                    {formData.fee_items.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between font-semibold">
                          <span>Total Amount:</span>
                          <span>₹{formData.fee_items.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Select value={formData.academic_year} onValueChange={(value) => setFormData({ ...formData, academic_year: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">Semester (Optional)</Label>
                  <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem} value={sem}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingFee ? 'Update' : 'Add'} Fee Structure
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fee structures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Structures ({filteredFees.length})</CardTitle>
          <CardDescription>
            Manage institutional fee structure and payment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{fee.title}</div>
                      {fee.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {fee.description}
                        </div>
                      )}
                      {fee.semester && (
                        <Badge variant="outline" className="mt-1">
                          Sem {fee.semester}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {fee.fee_items && fee.fee_items.length > 0 ? (
                        fee.fee_items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {idx + 1}. {item.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No fee items</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{fee.academic_year}</TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {fee.total_amount ? `₹${fee.total_amount.toLocaleString('en-IN')}` : '₹0'}
                    </div>
                  </TableCell>
                  <TableCell>{fee.academic_year}</TableCell>
                  <TableCell>{formatAmount(fee.amount)}</TableCell>
                  <TableCell>
                    {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'Not Set'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={fee.is_active ? 'default' : 'secondary'}>
                      {fee.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(fee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(fee.id, fee.is_active)}
                      >
                        {fee.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteFee(fee.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredFees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No fee structures found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}