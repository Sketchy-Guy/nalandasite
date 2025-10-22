import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfileFormProps {
  profile?: any;
  onSuccess?: () => void;
}

export function UserProfileForm({ profile, onSuccess }: UserProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    department: profile?.department || '',
    role_type: profile?.role_type || 'student',
    designation: profile?.designation || '',
    qualifications: profile?.qualifications || '',
    research_areas: profile?.research_areas || [],
    enrollment_year: profile?.enrollment_year || '',
    semester: profile?.semester || '',
    branch: profile?.branch || '',
    graduation_year: profile?.graduation_year || '',
    current_position: profile?.current_position || '',
    photo_url: profile?.photo_url || ''
  });
  
  const [newResearchArea, setNewResearchArea] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addResearchArea = () => {
    if (newResearchArea.trim() && !formData.research_areas.includes(newResearchArea.trim())) {
      setFormData(prev => ({
        ...prev,
        research_areas: [...prev.research_areas, newResearchArea.trim()]
      }));
      setNewResearchArea('');
    }
  };

  const removeResearchArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      research_areas: prev.research_areas.filter(a => a !== area)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        ...formData,
        enrollment_year: formData.enrollment_year ? parseInt(formData.enrollment_year) : null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null
      };

      const { error } = profile?.id 
        ? await supabase.from('profiles').update(updateData).eq('id', profile.id)
        : await supabase.from('profiles').insert({ ...updateData, user_id: crypto.randomUUID() });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile ? 'Edit Profile' : 'Add New User'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role_type">Role</Label>
              <Select 
                value={formData.role_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role_type: value }))}
              >
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
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>
          </div>

          {/* Faculty-specific fields */}
          {formData.role_type === 'faculty' && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input
                    id="qualifications"
                    value={formData.qualifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, qualifications: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Research Areas</Label>
                <div className="flex gap-2">
                  <Input
                    value={newResearchArea}
                    onChange={(e) => setNewResearchArea(e.target.value)}
                    placeholder="Add research area"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchArea())}
                  />
                  <Button type="button" onClick={addResearchArea} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.research_areas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {area}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeResearchArea(area)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Student-specific fields */}
          {formData.role_type === 'student' && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollment_year">Enrollment Year</Label>
                <Input
                  id="enrollment_year"
                  type="number"
                  value={formData.enrollment_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, enrollment_year: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Alumni-specific fields */}
          {formData.role_type === 'alumni' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graduation_year">Graduation Year</Label>
                <Input
                  id="graduation_year"
                  type="number"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, graduation_year: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_position">Current Position</Label>
                <Input
                  id="current_position"
                  value={formData.current_position}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_position: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="photo_url">Photo URL</Label>
            <Input
              id="photo_url"
              value={formData.photo_url}
              onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}