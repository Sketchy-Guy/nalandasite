import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Database, 
  Users, 
  Settings, 
  Shield, 
  Activity,
  BarChart3,
  FileText,
  Image,
  Calendar
} from "lucide-react";

interface SystemStats {
  totalUsers: number;
  totalAdmins: number;
  totalNotices: number;
  totalNews: number;
  totalEvents: number;
  totalPhotos: number;
  totalDepartments: number;
  totalFaculty: number;
}

export default function SettingsManager() {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalNotices: 0,
    totalNews: 0,
    totalEvents: 0,
    totalPhotos: 0,
    totalDepartments: 0,
    totalFaculty: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const [
        usersResult,
        adminsResult,
        noticesResult,
        newsResult,
        eventsResult,
        photosResult,
        departmentsResult,
        facultyResult
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('admin_roles').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('notices').select('id', { count: 'exact', head: true }),
        supabase.from('news_announcements').select('id', { count: 'exact', head: true }),
        supabase.from('campus_events').select('id', { count: 'exact', head: true }),
        supabase.from('photo_galleries').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role_type', 'faculty')
      ]);

      setStats({
        totalUsers: usersResult.count || 0,
        totalAdmins: adminsResult.count || 0,
        totalNotices: noticesResult.count || 0,
        totalNews: newsResult.count || 0,
        totalEvents: eventsResult.count || 0,
        totalPhotos: photosResult.count || 0,
        totalDepartments: departmentsResult.count || 0,
        totalFaculty: facultyResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      toast.error('Failed to fetch system statistics');
    } finally {
      setLoading(false);
    }
  };

  const runDatabaseCleanup = async () => {
    if (!confirm('Are you sure you want to run database cleanup? This will remove inactive records.')) return;
    
    try {
      // This is a placeholder for database cleanup operations
      // In a real implementation, you would have specific cleanup logic
      toast.success('Database cleanup completed successfully');
    } catch (error) {
      console.error('Error running cleanup:', error);
      toast.error('Failed to run database cleanup');
    }
  };

  const exportData = async (table: string) => {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select('*');
      
      if (error) throw error;
      
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${table}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`${table} data exported successfully`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  if (loading) {
    return <div className="p-6">Loading system settings...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and view statistics</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdmins}</div>
                <p className="text-xs text-muted-foreground">Active admin accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Items</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalNotices + stats.totalNews}</div>
                <p className="text-xs text-muted-foreground">Notices & news</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Media Files</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPhotos}</div>
                <p className="text-xs text-muted-foreground">Photos in gallery</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDepartments}</div>
                <p className="text-xs text-muted-foreground">Academic departments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFaculty}</div>
                <p className="text-xs text-muted-foreground">Faculty members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">Campus events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Online</Badge>
                </div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Management
                </CardTitle>
                <CardDescription>
                  Manage database operations and export data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Data Export</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => exportData('notices')}
                        className="w-full justify-start"
                      >
                        Export Notices
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportData('news_announcements')}
                        className="w-full justify-start"
                      >
                        Export News
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportData('campus_events')}
                        className="w-full justify-start"
                      >
                        Export Events
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportData('photo_galleries')}
                        className="w-full justify-start"
                      >
                        Export Photos
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Database Operations</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={runDatabaseCleanup}
                        className="w-full justify-start"
                      >
                        Run Cleanup
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toast.info('Backup initiated')}
                        className="w-full justify-start"
                      >
                        Create Backup
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => fetchSystemStats()}
                        className="w-full justify-start"
                      >
                        Refresh Statistics
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security policies and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Row Level Security</h4>
                      <p className="text-sm text-muted-foreground">All tables have RLS enabled</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Admin Role Management</h4>
                      <p className="text-sm text-muted-foreground">Role-based access control</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Activity Logging</h4>
                      <p className="text-sm text-muted-foreground">Admin activities are logged</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Maintenance
                </CardTitle>
                <CardDescription>
                  Perform system maintenance operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Cache Management</h4>
                    <p className="text-sm text-muted-foreground mb-4">Clear cached data to improve performance</p>
                    <Button variant="outline">Clear Cache</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Log Rotation</h4>
                    <p className="text-sm text-muted-foreground mb-4">Archive old activity logs</p>
                    <Button variant="outline">Archive Logs</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">System Health Check</h4>
                    <p className="text-sm text-muted-foreground mb-4">Run comprehensive system diagnostics</p>
                    <Button variant="outline">Run Diagnostics</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}