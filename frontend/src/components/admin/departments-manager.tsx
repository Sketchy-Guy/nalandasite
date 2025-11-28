import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { DepartmentWizard } from './department-wizard';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  head_name: string;
  contact_email: string;
  program: string;              // ADD THIS - the program ID
  program_name: string;
  trade: string | null;          // ADD THIS - the trade ID
  trade_name: string | null;
  is_direct_branch: boolean;
  is_active: boolean;
  mission: string;               // ADD THIS
  vision: string;                // ADD THIS
  facilities: string[];          // ADD THIS
  programs_offered: string[];    // ADD THIS
  achievements: string[];        // ADD THIS
  location_details: string;      // ADD THIS
  hero_image: string | null;
}

export function DepartmentsManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

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
    setEditingDept(null);
  };

  const openEditDialog = (dept: Department) => {
    setEditingDept(dept);
    setIsDialogOpen(true);
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
            <DepartmentWizard
              editingDept={editingDept}
              onClose={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
              onSuccess={() => {
                fetchDepartments();
                setIsDialogOpen(false);
                resetForm();
              }}
            />
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
                <TableHead>Program</TableHead>
                <TableHead>Trade</TableHead>
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
                  <TableCell>{dept.program_name}</TableCell>
                  <TableCell>
                    {dept.is_direct_branch ? (
                      <Badge variant="outline">Direct Branch</Badge>
                    ) : (
                      dept.trade_name || '-'
                    )}
                  </TableCell>
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