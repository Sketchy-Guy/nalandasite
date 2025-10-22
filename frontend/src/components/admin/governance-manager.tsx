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
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Filter,
  Award,
  User,
  Mail,
  Calendar,
  GraduationCap,
  Shield,
  BookOpen,
  X
} from 'lucide-react';

interface StudentGovernance {
  id: string;
  position: string;
  student_name: string;
  department?: string;
  year?: number;
  bio?: string;
  photo_url?: string;
  term_start?: string;
  term_end?: string;
  contact_email?: string;
  responsibilities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const GovernanceManager = () => {
  const [members, setMembers] = useState<StudentGovernance[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<StudentGovernance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StudentGovernance | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    position: '',
    student_name: '',
    department: '',
    year: '',
    bio: '',
    photo_url: '',
    term_start: '',
    term_end: '',
    contact_email: '',
    responsibilities: [] as string[],
    is_active: true
  });

  const [responsibilityInput, setResponsibilityInput] = useState('');

  const positions = [
    'President', 'Vice President', 'Secretary', 'Treasurer', 'Cultural Secretary',
    'Sports Secretary', 'Technical Secretary', 'General Secretary', 'Joint Secretary',
    'Class Representative', 'Department Representative', 'Council Member'
  ];

  const departments = [
    'Computer Science', 'Information Technology', 'Electronics', 'Mechanical',
    'Civil', 'Electrical', 'Chemical', 'Biotech', 'MBA', 'MCA'
  ];

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('student_governance')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching governance members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch governance members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  };

  const resetForm = () => {
    setFormData({
      position: '',
      student_name: '',
      department: '',
      year: '',
      bio: '',
      photo_url: '',
      term_start: '',
      term_end: '',
      contact_email: '',
      responsibilities: [],
      is_active: true
    });
    setResponsibilityInput('');
    setEditingMember(null);
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim() && !formData.responsibilities.includes(responsibilityInput.trim())) {
      setFormData({
        ...formData,
        responsibilities: [...formData.responsibilities, responsibilityInput.trim()]
      });
      setResponsibilityInput('');
    }
  };

  const removeResponsibility = (responsibility: string) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter(r => r !== responsibility)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const memberData = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
        term_start: formData.term_start || null,
        term_end: formData.term_end || null
      };

      if (editingMember) {
        const { error } = await supabase
          .from('student_governance')
          .update(memberData)
          .eq('id', editingMember.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Governance member updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('student_governance')
          .insert(memberData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Governance member created successfully"
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast({
        title: "Error",
        description: "Failed to save governance member",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (member: StudentGovernance) => {
    setFormData({
      position: member.position,
      student_name: member.student_name,
      department: member.department || '',
      year: member.year?.toString() || '',
      bio: member.bio || '',
      photo_url: member.photo_url || '',
      term_start: member.term_start?.split('T')[0] || '',
      term_end: member.term_end?.split('T')[0] || '',
      contact_email: member.contact_email || '',
      responsibilities: member.responsibilities || [],
      is_active: member.is_active
    });
    setEditingMember(member);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this governance member?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('student_governance')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Governance member deleted successfully"
      });
      
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to delete governance member",
        variant: "destructive"
      });
    }
  };

  const getPositionIcon = (position: string) => {
    const lower = position.toLowerCase();
    if (lower.includes('president') || lower.includes('chairperson')) return Award;
    if (lower.includes('secretary')) return BookOpen;
    if (lower.includes('treasurer')) return Shield;
    return User;
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
            <Users className="h-8 w-8 text-primary" />
            Student Governance Manager
          </h1>
          <p className="text-muted-foreground">Manage student council and governance members</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Edit Governance Member' : 'Add New Governance Member'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="term">Term Details</TabsTrigger>
                  <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_name">Student Name *</Label>
                    <Input
                      id="student_name"
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      placeholder="Enter student name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => setFormData({ ...formData, position: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Brief biography"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo_url">Photo URL</Label>
                    <Input
                      id="photo_url"
                      type="url"
                      value={formData.photo_url}
                      onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="student@example.com"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">First Year</SelectItem>
                        <SelectItem value="2">Second Year</SelectItem>
                        <SelectItem value="3">Third Year</SelectItem>
                        <SelectItem value="4">Fourth Year</SelectItem>
                        <SelectItem value="5">Fifth Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="term" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="term_start">Term Start Date</Label>
                      <Input
                        id="term_start"
                        type="date"
                        value={formData.term_start}
                        onChange={(e) => setFormData({ ...formData, term_start: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="term_end">Term End Date</Label>
                      <Input
                        id="term_end"
                        type="date"
                        value={formData.term_end}
                        onChange={(e) => setFormData({ ...formData, term_end: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Currently Active</Label>
                  </div>
                </TabsContent>

                <TabsContent value="responsibilities" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Responsibility</Label>
                    <div className="flex gap-2">
                      <Input
                        value={responsibilityInput}
                        onChange={(e) => setResponsibilityInput(e.target.value)}
                        placeholder="Enter responsibility"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addResponsibility();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={addResponsibility}
                        disabled={!responsibilityInput.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Responsibilities</Label>
                    <div className="space-y-2">
                      {formData.responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span className="text-sm">{responsibility}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResponsibility(responsibility)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {formData.responsibilities.length === 0 && (
                        <p className="text-sm text-muted-foreground">No responsibilities added yet.</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMember ? 'Update' : 'Create'} Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Governance Members Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? 'No members match your search criteria.' 
                : 'Get started by adding your first governance member.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Member
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => {
            const Icon = getPositionIcon(member.position);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      {member.photo_url ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                          <img 
                            src={member.photo_url} 
                            alt={member.student_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon className="h-10 w-10 text-primary" />
                        </div>
                      )}
                    </div>
                    <Badge variant="default" className="mb-2">
                      {member.position}
                    </Badge>
                    <CardTitle className="text-lg">{member.student_name}</CardTitle>
                    {member.department && (
                      <CardDescription className="flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {member.department}
                        {member.year && ` - Year ${member.year}`}
                      </CardDescription>
                    )}
                    <Badge variant={member.is_active ? "default" : "secondary"} className="mt-2">
                      {member.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {member.bio && (
                      <p className="text-sm text-muted-foreground text-center line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Term Information */}
                    {(member.term_start || member.term_end) && (
                      <div className="bg-muted/50 p-3 rounded-lg text-center">
                        <div className="flex items-center justify-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          Term: {member.term_start && new Date(member.term_start).getFullYear()}
                          {member.term_end && ` - ${new Date(member.term_end).getFullYear()}`}
                        </div>
                      </div>
                    )}

                    {/* Responsibilities */}
                    {member.responsibilities && member.responsibilities.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-center text-sm">Key Responsibilities</h4>
                        <div className="space-y-1">
                          {member.responsibilities.slice(0, 2).map((responsibility, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground flex items-start">
                              <div className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                              {responsibility}
                            </div>
                          ))}
                          {member.responsibilities.length > 2 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{member.responsibilities.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      {member.contact_email && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${member.contact_email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      
                      <div className="flex space-x-2 ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default GovernanceManager;