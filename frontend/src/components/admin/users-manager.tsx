import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: number;
  full_name: string;
  email: string;
  username: string;
  department: string;
  role: string;
  designation: string;
  qualifications: string;
  research_areas: string[];
  enrollment_year: number;
  semester: string;
  branch: string;
  graduation_year: number;
  current_position: string;
  company: string;
  phone: string;
  address: string;
  photo_url: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
}

export function UsersManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [superAdmins, setSuperAdmins] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    full_name: '',
    role: 'student',
    department: '',
    designation: '',
    qualifications: '',
    research_areas: [] as string[],
    enrollment_year: '',
    semester: '',
    branch: '',
    graduation_year: '',
    current_position: '',
    company: '',
    phone: '',
    address: '',
    photo_url: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSuperAdmins();
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [profiles, searchTerm, roleFilter]);

  const fetchSuperAdmins = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/auth/superadmins/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Superadmin data:', data);
        setSuperAdmins(data);
      } else {
        console.error('Failed to fetch superadmins:', response.status);
      }
    } catch (error) {
      console.error('Error fetching superadmins:', error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Fetching profiles with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:8000/api/auth/users/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data);
        
        // Always filter out superadmin users - they can only be managed through Django admin
        const filteredData = data.filter((profile: Profile) => {
          // Check if this user is in the superadmin list
          const isSuperAdmin = superAdmins.some(admin => 
            admin.username === profile.username ||
            admin.email === profile.email ||
            admin.id === profile.user_id
          );
          
          return !isSuperAdmin;
        });
        setProfiles(filteredData || []);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch profiles: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProfiles = () => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter(profile => 
        profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(profile => profile.role === roleFilter);
    }

    setFilteredProfiles(filtered);
  };

  const openEditDialog = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      username: profile.username || '',
      email: profile.email || '',
      first_name: '',
      last_name: '',
      password: '',
      full_name: profile.full_name || '',
      role: profile.role || 'student',
      department: profile.department || '',
      designation: profile.designation || '',
      qualifications: profile.qualifications || '',
      research_areas: profile.research_areas || [],
      enrollment_year: profile.enrollment_year?.toString() || '',
      semester: profile.semester || '',
      branch: profile.branch || '',
      graduation_year: profile.graduation_year?.toString() || '',
      current_position: profile.current_position || '',
      company: profile.company || '',
      phone: profile.phone || '',
      address: profile.address || '',
      photo_url: profile.photo_url || ''
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProfile(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      full_name: '',
      role: 'student',
      department: '',
      designation: '',
      qualifications: '',
      research_areas: [],
      enrollment_year: '',
      semester: '',
      branch: '',
      graduation_year: '',
      current_position: '',
      company: '',
      phone: '',
      address: '',
      photo_url: ''
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        enrollment_year: formData.enrollment_year ? parseInt(formData.enrollment_year) : null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
      };

      if (editingProfile) {
        // Update existing user
        const response = await fetch(`http://localhost:8000/api/auth/users/${editingProfile.user_id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        });

        if (response.ok) {
          toast({ title: 'Success', description: 'User updated successfully' });
          handleFormSuccess();
        } else {
          throw new Error('Failed to update user');
        }
      } else {
        // Create new user
        const response = await fetch('http://localhost:8000/api/auth/users/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        });

        if (response.ok) {
          toast({ title: 'Success', description: 'User created successfully' });
          handleFormSuccess();
        } else {
          throw new Error('Failed to create user');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
    fetchProfiles();
  };

  const deleteProfile = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/auth/users/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Profile deleted successfully' });
        fetchProfiles();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };


  const getRoleColor = (role: string) => {
    switch (role) {
      case 'faculty': return 'faculty-gradient';
      case 'student': return 'student-gradient';
      case 'alumni': return 'alumni-gradient';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // Check if user is authenticated
  const token = localStorage.getItem('access_token');
  if (!token) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please log in to access the user management system.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProfile ? 'Edit User Profile' : 'Add New User'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-6 p-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required={!editingProfile}
                      disabled={!!editingProfile}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required={!editingProfile}
                      disabled={!!editingProfile}
                    />
                  </div>
                  {!editingProfile && (
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Role Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Role Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              {(formData.role === 'student' || formData.role === 'alumni') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="enrollment_year">Enrollment Year</Label>
                      <Input
                        id="enrollment_year"
                        type="number"
                        value={formData.enrollment_year}
                        onChange={(e) => setFormData({...formData, enrollment_year: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="graduation_year">Graduation Year</Label>
                      <Input
                        id="graduation_year"
                        type="number"
                        value={formData.graduation_year}
                        onChange={(e) => setFormData({...formData, graduation_year: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Input
                        id="semester"
                        value={formData.semester}
                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Input
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Faculty Information */}
              {formData.role === 'faculty' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Faculty Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => setFormData({...formData, designation: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="qualifications">Qualifications</Label>
                      <Textarea
                        id="qualifications"
                        value={formData.qualifications}
                        onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Alumni Information */}
              {formData.role === 'alumni' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current_position">Current Position</Label>
                      <Input
                        id="current_position"
                        value={formData.current_position}
                        onChange={(e) => setFormData({...formData, current_position: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="photo_url">Photo URL</Label>
                    <Input
                      id="photo_url"
                      value={formData.photo_url}
                      onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                      placeholder="Paste image URL here"
                    />
                    {formData.photo_url && (
                      <div className="mt-2">
                        <img 
                          src={formData.photo_url} 
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProfile ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{profiles.length}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {profiles.filter(p => p.role === 'faculty').length}
            </div>
            <div className="text-sm text-muted-foreground">Faculty</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {profiles.filter(p => p.role === 'student').length}
            </div>
            <div className="text-sm text-muted-foreground">Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {profiles.filter(p => p.role === 'alumni').length}
            </div>
            <div className="text-sm text-muted-foreground">Alumni</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredProfiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {profile.photo_url && (
                        <img 
                          src={profile.photo_url} 
                          alt={profile.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      {profile.full_name || 'No Name'}
                    </div>
                  </TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.department || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleColor(profile.role)}>
                      {profile.role || 'student'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(profile.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(profile)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteProfile(profile.user_id)}>
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