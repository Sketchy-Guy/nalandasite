import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert,
  UserCheck,
  Users,
  Activity,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  role_type: string;
  created_at: string;
}

interface AdminRole {
  id: string;
  user_id: string;
  role_level: number;
  permissions: any;
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  profile?: Profile;
  granted_by_profile?: Profile;
}

interface ActivityLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details: any;
  created_at: string;
  profile?: Profile;
}

export default function RoleManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    role_level: 2,
    expires_at: '',
    permissions: '{}'
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (profilesError) throw profilesError;

      // Fetch admin roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('admin_roles')
        .select('*')
        .order('granted_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch recent activity logs
      const { data: logsData, error: logsError } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      setProfiles(profilesData || []);
      setAdminRoles((rolesData as any) || []);
      setActivityLogs((logsData as any) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch role management data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (level: number) => {
    switch (level) {
      case 1: return 'Super Admin';
      case 2: return 'Admin';
      case 3: return 'Moderator';
      default: return 'Unknown';
    }
  };

  const getRoleBadge = (level: number) => {
    switch (level) {
      case 1: return <Badge className="bg-red-500"><Shield className="h-3 w-3 mr-1" />Super Admin</Badge>;
      case 2: return <Badge className="bg-blue-500"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>;
      case 3: return <Badge className="bg-green-500"><ShieldAlert className="h-3 w-3 mr-1" />Moderator</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const grantRole = async () => {
    if (!selectedUser) return;

    try {
      // Check if user already has this role level
      const existingRole = adminRoles.find(
        role => role.user_id === selectedUser.user_id && role.role_level === roleFormData.role_level
      );

      if (existingRole) {
        toast({
          title: 'Error',
          description: 'User already has this role level',
          variant: 'destructive'
        });
        return;
      }

      const data = {
        user_id: selectedUser.user_id,
        role_level: roleFormData.role_level,
        permissions: JSON.parse(roleFormData.permissions || '{}'),
        granted_by: user?.id,
        expires_at: roleFormData.expires_at || null,
        is_active: true
      };

      const { error } = await supabase
        .from('admin_roles')
        .insert([data]);

      if (error) throw error;

      // Log the activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'grant_role',
        p_resource_type: 'admin_roles',
        p_details: {
          target_user: selectedUser.email,
          role_level: roleFormData.role_level,
          role_name: getRoleName(roleFormData.role_level)
        }
      });

      toast({
        title: 'Success',
        description: `${getRoleName(roleFormData.role_level)} role granted to ${selectedUser.full_name}`
      });

      setDialogOpen(false);
      setSelectedUser(null);
      setRoleFormData({ role_level: 2, expires_at: '', permissions: '{}' });
      fetchData();
    } catch (error) {
      console.error('Error granting role:', error);
      toast({
        title: 'Error',
        description: 'Failed to grant role',
        variant: 'destructive'
      });
    }
  };

  const revokeRole = async (roleId: string, roleName: string, targetUserEmail: string) => {
    try {
      const { error } = await supabase
        .from('admin_roles')
        .update({ is_active: false })
        .eq('id', roleId);

      if (error) throw error;

      // Log the activity
      await supabase.rpc('log_admin_activity', {
        p_action: 'revoke_role',
        p_resource_type: 'admin_roles',
        p_resource_id: roleId,
        p_details: {
          target_user: targetUserEmail,
          role_name: roleName
        }
      });

      toast({
        title: 'Success',
        description: `Role revoked successfully`
      });

      fetchData();
    } catch (error) {
      console.error('Error revoking role:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke role',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = {
    totalAdmins: adminRoles.filter(role => role.is_active).length,
    superAdmins: adminRoles.filter(role => role.role_level === 1 && role.is_active).length,
    admins: adminRoles.filter(role => role.role_level === 2 && role.is_active).length,
    moderators: adminRoles.filter(role => role.role_level === 3 && role.is_active).length,
    temporaryRoles: adminRoles.filter(role => role.expires_at && role.is_active).length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage admin privileges and permissions
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Grant Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant Admin Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-select">Select User</Label>
                <Select onValueChange={(value) => {
                  const profile = profiles.find(p => p.user_id === value);
                  setSelectedUser(profile || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles
                      .filter(profile => !adminRoles.some(role => 
                        role.user_id === profile.user_id && role.is_active
                      ))
                      .map((profile) => (
                        <SelectItem key={profile.user_id} value={profile.user_id}>
                          {profile.full_name} ({profile.email})
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              {selectedUser && (
                <>
                  <div>
                    <Label htmlFor="role-level">Role Level</Label>
                    <Select 
                      value={roleFormData.role_level.toString()} 
                      onValueChange={(value) => setRoleFormData({...roleFormData, role_level: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">Moderator</SelectItem>
                        <SelectItem value="2">Admin</SelectItem>
                        <SelectItem value="1">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="expires-at">Expiry Date (Optional)</Label>
                    <Input
                      id="expires-at"
                      type="datetime-local"
                      value={roleFormData.expires_at}
                      onChange={(e) => setRoleFormData({...roleFormData, expires_at: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={grantRole}>
                      Grant Role
                    </Button>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.superAdmins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderators</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.moderators}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temporary Roles</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.temporaryRoles}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Admin Roles</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Admin Roles</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage admin privileges and permissions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminRoles
                  .filter(role => role.is_active)
                  .map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">
                              {role.profile?.full_name || 'Unknown User'}
                            </h3>
                            {getRoleBadge(role.role_level)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {role.profile?.email}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>
                              Granted by: {role.granted_by_profile?.full_name || 'System'}
                            </span>
                            <span>
                              {new Date(role.granted_at).toLocaleDateString()}
                            </span>
                            {role.expires_at && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Expires: {new Date(role.expires_at).toLocaleDateString()}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Admin Role</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to revoke the {getRoleName(role.role_level)} role from {role.profile?.full_name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => revokeRole(
                                  role.id, 
                                  getRoleName(role.role_level),
                                  role.profile?.email || 'Unknown'
                                )}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke Role
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                {adminRoles.filter(role => role.is_active).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No admin roles found. Grant some roles to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Admin actions and role changes
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {log.profile?.full_name || 'Unknown Admin'} {log.action.replace('_', ' ')} {log.resource_type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(log.details)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {activityLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No activity logs found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}