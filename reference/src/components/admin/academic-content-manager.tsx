import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Download, 
  Calendar, 
  CreditCard, 
  Award, 
  FileCheck,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface ContentStats {
  academicPages: number;
  downloads: number;
  timetables: number;
  fees: number;
  scholarships: number;
  transcripts: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  action: string;
  timestamp: string;
}

export default function AcademicContentManager() {
  const [stats, setStats] = useState<ContentStats>({
    academicPages: 0,
    downloads: 0,
    timetables: 0,
    fees: 0,
    scholarships: 0,
    transcripts: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const [academicPages, downloads, timetables, fees, scholarships] = await Promise.all([
        supabase.from('academic_pages').select('*', { count: 'exact' }),
        supabase.from('academic_downloads').select('*', { count: 'exact' }),
        supabase.from('timetables').select('*', { count: 'exact' }),
        supabase.from('fees_structure').select('*', { count: 'exact' }),
        supabase.from('scholarships').select('*', { count: 'exact' })
      ]);

      setStats({
        academicPages: academicPages.count || 0,
        downloads: downloads.count || 0,
        timetables: timetables.count || 0,
        fees: fees.count || 0,
        scholarships: scholarships.count || 0,
        transcripts: 0 // Add when transcripts table exists
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch content statistics',
        variant: 'destructive'
      });
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Simulate recent activity - in real app, this would come from audit logs
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'academic_pages',
          title: 'Admission Guidelines',
          action: 'updated',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: '2',
          type: 'downloads',
          title: 'Syllabus PDF - CSE',
          action: 'created',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
          id: '3',
          type: 'fees',
          title: 'Semester Fee Structure',
          action: 'updated',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
        }
      ];
      setRecentActivity(mockActivity);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setLoading(false);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'academic_pages': return BookOpen;
      case 'downloads': return Download;
      case 'timetables': return Calendar;
      case 'fees': return CreditCard;
      case 'scholarships': return Award;
      case 'transcripts': return FileCheck;
      default: return BookOpen;
    }
  };

  const getActionBadge = (action: string) => {
    const variants = {
      created: 'default',
      updated: 'secondary',
      deleted: 'destructive'
    } as const;
    return variants[action as keyof typeof variants] || 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Academic Content Manager</h1>
          <p className="text-muted-foreground">
            Centralized hub for all academic-related content
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Academic Pages</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.academicPages}</div>
            <p className="text-xs text-muted-foreground">
              Published academic pages
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.downloads}</div>
            <p className="text-xs text-muted-foreground">
              Available downloads
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timetables</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timetables}</div>
            <p className="text-xs text-muted-foreground">
              Current timetables
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Structures</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fees}</div>
            <p className="text-xs text-muted-foreground">
              Fee structures
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scholarships</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scholarships}</div>
            <p className="text-xs text-muted-foreground">
              Available scholarships
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transcripts</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.transcripts}</div>
            <p className="text-xs text-muted-foreground">
              Transcript requests
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Academic Pages</span>
                    <Badge variant="outline">{stats.academicPages}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Downloads</span>
                    <Badge variant="outline">{stats.downloads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Timetables</span>
                    <Badge variant="outline">{stats.timetables}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fee Structures</span>
                    <Badge variant="outline">{stats.fees}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Academic Page
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Add Timetable
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Create Scholarship
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest changes to academic content
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActionIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={getActionBadge(activity.action)}>
                        {activity.action}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="space-y-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Academic Pages</h3>
                <p className="text-sm text-muted-foreground">
                  Manage academic information pages
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-3">
                <Download className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Downloads</h3>
                <p className="text-sm text-muted-foreground">
                  Upload and manage downloadable files
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-3">
                <Calendar className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Timetables</h3>
                <p className="text-sm text-muted-foreground">
                  Manage class and exam timetables
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-3">
                <CreditCard className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Fee Structures</h3>
                <p className="text-sm text-muted-foreground">
                  Update fee information
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-3">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Scholarships</h3>
                <p className="text-sm text-muted-foreground">
                  Manage scholarship programs
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-3">
                <FileCheck className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Transcripts</h3>
                <p className="text-sm text-muted-foreground">
                  Handle transcript requests
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Process
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}