import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfileForm } from '@/components/user-profile-form';

interface Faculty {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  department: string;
  designation: string;
  qualifications: string;
  research_areas: string[];
  photo_url: string;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

export function FacultyManager() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterFaculty();
  }, [faculty, searchTerm, departmentFilter]);

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role_type', 'faculty')
        .order('full_name');

      if (error) throw error;
      setFaculty(data || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch faculty',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, code')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const filterFaculty = () => {
    let filtered = faculty;

    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.designation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(member => member.department === departmentFilter);
    }

    setFilteredFaculty(filtered);
  };

  const openEditDialog = (facultyMember: Faculty) => {
    setEditingFaculty(facultyMember);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingFaculty(null);
    setIsDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingFaculty(null);
    fetchFaculty();
  };

  const deleteFaculty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Faculty member deleted successfully' });
      fetchFaculty();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const assignToDepartment = async (facultyId: string, departmentId: string) => {
    try {
      const { error } = await supabase
        .from('faculty_departments')
        .upsert({
          faculty_id: facultyId,
          department_id: departmentId
        });

      if (error) throw error;
      toast({ title: 'Success', description: 'Faculty assigned to department successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Faculty Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
              </DialogTitle>
            </DialogHeader>
            <UserProfileForm 
              profile={editingFaculty ? { ...editingFaculty, role_type: 'faculty' } : { role_type: 'faculty' }}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Faculty Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Faculty Photo */}
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {member.photo_url ? (
                    <img 
                      src={member.photo_url} 
                      alt={member.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>

                {/* Faculty Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{member.full_name}</h3>
                  {member.designation && (
                    <p className="text-sm text-primary font-medium">{member.designation}</p>
                  )}
                  {member.department && (
                    <Badge variant="outline">{member.department}</Badge>
                  )}
                  {member.qualifications && (
                    <p className="text-sm text-muted-foreground">{member.qualifications}</p>
                  )}
                </div>

                {/* Research Areas */}
                {member.research_areas && member.research_areas.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Research Areas:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.research_areas.slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {member.research_areas.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{member.research_areas.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <p className="text-sm text-muted-foreground">{member.email}</p>

                {/* Actions */}
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(member)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteFaculty(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFaculty.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No faculty members found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}