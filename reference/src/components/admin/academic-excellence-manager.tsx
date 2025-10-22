import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star,
  Plus,
  Edit,
  Trash2,
  Users,
  Target,
  TrendingUp
} from 'lucide-react';

interface Topper {
  id: string;
  name: string;
  department: string;
  year: number;
  rank: number;
  cgpa: number;
  photo_url?: string;
  achievements?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Award {
  id: string;
  title: string;
  description?: string;
  category: string;
  award_date?: string;
  image_url?: string;
  certificate_url?: string;
  display_order: number;
  is_active: boolean;
}

export default function AcademicExcellenceManager() {
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopper, setEditingTopper] = useState<Topper | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: new Date().getFullYear(),
    rank: 1,
    cgpa: 0,
    photo_url: '',
    achievements: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [toppersResponse, awardsResponse] = await Promise.all([
        supabase.from('toppers').select('*').order('year', { ascending: false }).order('rank'),
        supabase.from('awards_achievements').select('*').order('award_date', { ascending: false })
      ]);

      if (toppersResponse.error) throw toppersResponse.error;
      if (awardsResponse.error) throw awardsResponse.error;

      setToppers(toppersResponse.data || []);
      setAwards(awardsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch academic excellence data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      department: '',
      year: new Date().getFullYear(),
      rank: 1,
      cgpa: 0,
      photo_url: '',
      achievements: ''
    });
    setEditingTopper(null);
  };

  const openEditDialog = (topper: Topper) => {
    setEditingTopper(topper);
    setFormData({
      name: topper.name,
      department: topper.department,
      year: topper.year,
      rank: topper.rank,
      cgpa: topper.cgpa,
      photo_url: topper.photo_url || '',
      achievements: topper.achievements?.join(', ') || ''
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const achievementsArray = formData.achievements
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const data = {
        name: formData.name,
        department: formData.department,
        year: formData.year,
        rank: formData.rank,
        cgpa: formData.cgpa,
        photo_url: formData.photo_url || null,
        achievements: achievementsArray,
        is_active: true
      };

      let result;
      if (editingTopper) {
        result = await supabase
          .from('toppers')
          .update(data)
          .eq('id', editingTopper.id);
      } else {
        result = await supabase
          .from('toppers')
          .insert([data]);
      }

      if (result.error) throw result.error;

      toast({
        title: 'Success',
        description: `Topper ${editingTopper ? 'updated' : 'added'} successfully`
      });

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving topper:', error);
      toast({
        title: 'Error',
        description: 'Failed to save topper',
        variant: 'destructive'
      });
    }
  };

  const deleteTopper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topper?')) return;

    try {
      const { error } = await supabase
        .from('toppers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Topper deleted successfully'
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting topper:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete topper',
        variant: 'destructive'
      });
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500"><Medal className="h-3 w-3 mr-1" />1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400"><Medal className="h-3 w-3 mr-1" />2nd</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600"><Medal className="h-3 w-3 mr-1" />3rd</Badge>;
    return <Badge variant="outline">{rank}th</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    totalToppers: toppers.length,
    totalAwards: awards.length,
    departments: [...new Set(toppers.map(t => t.department))].length,
    latestYear: Math.max(...toppers.map(t => t.year), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Academic Excellence Manager</h1>
          <p className="text-muted-foreground">
            Manage academic achievements and excellence recognition
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Topper
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTopper ? 'Edit Topper' : 'Add New Topper'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                    <SelectItem value="IT">Information Technology</SelectItem>
                    <SelectItem value="Mechanical">Mechanical Engineering</SelectItem>
                    <SelectItem value="Electrical">Electrical Engineering</SelectItem>
                    <SelectItem value="Civil">Civil Engineering</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="MCA">MCA</SelectItem>
                    <SelectItem value="BCA">BCA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    type="number"
                    min="1"
                    value={formData.rank}
                    onChange={(e) => setFormData({...formData, rank: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cgpa">CGPA</Label>
                <Input
                  id="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({...formData, cgpa: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="photo_url">Photo URL</Label>
                <Input
                  id="photo_url"
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="achievements">Achievements (comma-separated)</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                  placeholder="Achievement 1, Achievement 2, Achievement 3"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">
                  {editingTopper ? 'Update' : 'Add'} Topper
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Toppers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalToppers}</div>
            <p className="text-xs text-muted-foreground">
              Academic achievers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awards & Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAwards}</div>
            <p className="text-xs text-muted-foreground">
              Recognition received
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departments}</div>
            <p className="text-xs text-muted-foreground">
              With toppers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.latestYear}</div>
            <p className="text-xs text-muted-foreground">
              Most recent data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Toppers List */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Toppers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage students who achieved academic excellence
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {toppers.map((topper) => (
              <div key={topper.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-card">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  {topper.photo_url ? (
                    <img
                      src={topper.photo_url}
                      alt={topper.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <Users className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{topper.name}</h3>
                    {getRankBadge(topper.rank)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {topper.department} • {topper.year} • CGPA: {topper.cgpa}
                  </p>
                  {topper.achievements && topper.achievements.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {topper.achievements.slice(0, 3).map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                      {topper.achievements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{topper.achievements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(topper)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTopper(topper.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {toppers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No toppers found. Add some academic achievers to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Awards Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Institutional Awards</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Awards and recognitions received by the institution
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((award) => (
              <Card key={award.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm">{award.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {award.category}
                      </Badge>
                    </div>
                    {award.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {award.description}
                      </p>
                    )}
                    {award.award_date && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(award.award_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {awards.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No awards found. Institutional awards will appear here.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}