import { useState, useEffect, useRef } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
    AlertTriangle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface User {
    id: string;  // This is actually the profile ID from the API
    user_id: number;  // This is the actual user ID
    username: string;
    email: string;
    full_name: string;
    role: string;
}

interface AdminRole {
    id: number;
    user: number;
    user_email: string;
    user_full_name: string;
    role_level: number;
    role_level_display: string;
    allowed_pages: string[];
    granted_by: number | null;
    granted_by_name: string;
    granted_at: string;
    expires_at: string | null;
    is_active: boolean;
    is_superadmin: boolean;
}

interface ActivityLog {
    id: number;
    admin: number;
    admin_email: string;
    admin_name: string;
    action: string;
    resource_type: string;
    resource_id: string | null;
    details: any;
    ip_address: string | null;
    created_at: string;
}

interface AvailablePage {
    slug: string;
    name: string;
}

export default function RoleManagement() {
    const [adminRoles, setAdminRoles] = useState<AdminRole[]>([]);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [availablePages, setAvailablePages] = useState<AvailablePage[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [dialogStep, setDialogStep] = useState<'select-user' | 'configure-role'>('select-user');
    const [creatingAccount, setCreatingAccount] = useState(false);
    const [newAdminData, setNewAdminData] = useState({
        full_name: '',
        email: '',
        username: '',
        contact: '',
        password: '',
        confirm_password: ''
    });
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        role_level: 2,
        expires_at: '',
        allowed_pages: [] as string[]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Fetch admin roles
            const rolesResponse = await fetch(`${API_BASE_URL}/admin-roles/`, { headers });
            if (rolesResponse.ok) {
                const rolesData = await rolesResponse.json();
                setAdminRoles(Array.isArray(rolesData) ? rolesData : (rolesData.results || []));
            }

            // Fetch activity logs
            const logsResponse = await fetch(`${API_BASE_URL}/admin-activity-logs/recent/`, { headers });
            if (logsResponse.ok) {
                const logsData = await logsResponse.json();
                setActivityLogs(Array.isArray(logsData) ? logsData : (logsData.results || []));
            }

            // Fetch available pages
            const pagesResponse = await fetch(`${API_BASE_URL}/admin-roles/available_pages/`, { headers });
            if (pagesResponse.ok) {
                const pagesData = await pagesResponse.json();
                setAvailablePages(pagesData);
            }

            // Fetch users (from authentication app)
            const usersResponse = await fetch(`${API_BASE_URL}/auth/users/`, { headers });
            console.log('Users response status:', usersResponse.status);

            if (usersResponse.ok) {
                const usersData = await usersResponse.json();
                console.log('Users data received:', usersData);

                // Handle different response formats
                let usersList = [];
                if (Array.isArray(usersData)) {
                    usersList = usersData;
                } else if (usersData.results) {
                    usersList = usersData.results;
                } else if (usersData.data) {
                    usersList = usersData.data;
                }

                console.log('Processed users list:', usersList);
                setUsers(usersList);
            } else {
                console.error('Failed to fetch users:', usersResponse.status, usersResponse.statusText);
                const errorText = await usersResponse.text();
                console.error('Error response:', errorText);
            }
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

    const getRoleBadge = (level: number) => {
        switch (level) {
            case 1: return <Badge className="bg-red-500"><Shield className="h-3 w-3 mr-1" />Super Admin</Badge>;
            case 2: return <Badge className="bg-blue-500"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>;
            case 3: return <Badge className="bg-green-500"><ShieldAlert className="h-3 w-3 mr-1" />Moderator</Badge>;
            default: return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const handlePageToggle = (pageSlug: string) => {
        setFormData(prev => ({
            ...prev,
            allowed_pages: prev.allowed_pages.includes(pageSlug)
                ? prev.allowed_pages.filter(p => p !== pageSlug)
                : [...prev.allowed_pages, pageSlug]
        }));
    };

    const grantRole = async () => {
        if (!selectedUserId) {
            toast({
                title: 'Error',
                description: 'Please select a user',
                variant: 'destructive'
            });
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            const data = {
                user: selectedUserId,
                role_level: formData.role_level,
                allowed_pages: formData.allowed_pages,
                expires_at: formData.expires_at || null,
                is_active: true
            };

            const response = await fetch(`${API_BASE_URL}/admin-roles/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Admin role granted successfully'
                });
                resetForm();
                setDialogOpen(false);
                fetchData();
            } else {
                const error = await response.json();
                throw new Error(error.detail || 'Failed to grant role');
            }
        } catch (error: any) {
            console.error('Error granting role:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to grant role',
                variant: 'destructive'
            });
        }
    };

    const updateRole = async () => {
        if (!editingRole) return;

        try {
            const token = localStorage.getItem('access_token');
            const data = {
                role_level: formData.role_level,
                allowed_pages: formData.allowed_pages,
                expires_at: formData.expires_at || null,
            };

            const response = await fetch(`${API_BASE_URL}/admin-roles/${editingRole.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Admin role updated successfully'
                });
                resetForm();
                setDialogOpen(false);
                fetchData();
            } else {
                throw new Error('Failed to update role');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: 'Error',
                description: 'Failed to update role',
                variant: 'destructive'
            });
        }
    };

    const revokeRole = async (roleId: number) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_BASE_URL}/admin-roles/${roleId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok || response.status === 204) {
                toast({
                    title: 'Success',
                    description: 'Role revoked successfully'
                });
                fetchData();
            } else {
                throw new Error('Failed to revoke role');
            }
        } catch (error) {
            console.error('Error revoking role:', error);
            toast({
                title: 'Error',
                description: 'Failed to revoke role',
                variant: 'destructive'
            });
        }
    };

    const handleEdit = (role: AdminRole) => {
        setEditingRole(role);
        setSelectedUserId(role.user);
        setFormData({
            role_level: role.role_level,
            expires_at: role.expires_at ? role.expires_at.split('T')[0] : '',
            allowed_pages: role.allowed_pages || []
        });
        setDialogOpen(true);
    };

    const handleCreateAdminAccount = async () => {
        // Validation
        if (!newAdminData.full_name || !newAdminData.email || !newAdminData.username ||
            !newAdminData.contact || !newAdminData.password || !newAdminData.confirm_password) {
            toast({
                title: "Error",
                description: "All fields are required",
                variant: "destructive",
            });
            return;
        }

        if (newAdminData.password !== newAdminData.confirm_password) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (newAdminData.password.length < 8) {
            toast({
                title: "Error",
                description: "Password must be at least 8 characters long",
                variant: "destructive",
            });
            return;
        }

        setCreatingAccount(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_BASE_URL}/admin-roles/create_admin_account/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: newAdminData.full_name,
                    email: newAdminData.email,
                    username: newAdminData.username,
                    contact: newAdminData.contact,
                    password: newAdminData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create admin account');
            }

            toast({
                title: "Success",
                description: `Admin account created for ${data.full_name}`,
            });

            // Set the user ID and move to step 2
            setSelectedUserId(data.user_id);
            setDialogStep('configure-role');

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create admin account",
                variant: "destructive",
            });
        } finally {
            setCreatingAccount(false);
        }
    };

    const resetForm = () => {
        setFormData({
            role_level: 2,
            expires_at: '',
            allowed_pages: []
        });
        setSelectedUserId(null);
        setEditingRole(null);
        setUserSearchQuery('');
        setDialogStep('select-user');
        setNewAdminData({
            full_name: '',
            email: '',
            username: '',
            contact: '',
            password: '',
            confirm_password: ''
        });
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

    // Get users who don't have active admin roles
    const availableUsers = users.filter(user =>
        !adminRoles.some(role => role.user === user.user_id && role.is_active)
    );

    // Filter users based on search query
    const filteredUsers = availableUsers.filter(user => {
        const searchLower = userSearchQuery.toLowerCase();
        const fullName = (user.full_name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const username = (user.username || '').toLowerCase();
        return fullName.includes(searchLower) || email.includes(searchLower) || username.includes(searchLower);
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Role Management</h1>
                    <p className="text-muted-foreground">
                        Manage admin privileges and permissions
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Grant Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh]">
                        <div className="max-h-[85vh] pr-2 overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingRole ? 'Edit' : 'Grant'} Admin Role</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {/* STEP 1: Create Admin Account */}
                                {!editingRole && dialogStep === 'select-user' && (
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Create Admin Account</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Create a dedicated admin account with login credentials
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <Label htmlFor="full_name">Full Name *</Label>
                                                <Input
                                                    id="full_name"
                                                    type="text"
                                                    placeholder="Enter full name"
                                                    value={newAdminData.full_name}
                                                    onChange={(e) => setNewAdminData({ ...newAdminData, full_name: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="email">Email *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="admin@example.com"
                                                    value={newAdminData.email}
                                                    onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="username">Username *</Label>
                                                <Input
                                                    id="username"
                                                    type="text"
                                                    placeholder="admin_username"
                                                    value={newAdminData.username}
                                                    onChange={(e) => setNewAdminData({ ...newAdminData, username: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="col-span-2">
                                                <Label htmlFor="contact">Contact Number *</Label>
                                                <Input
                                                    id="contact"
                                                    type="tel"
                                                    placeholder="+91 1234567890"
                                                    value={newAdminData.contact}
                                                    onChange={(e) => setNewAdminData({ ...newAdminData, contact: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="password">Password *</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Min 8 characters"
                                                    value={newAdminData.password}
                                                    onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="confirm_password">Confirm Password *</Label>
                                                <Input
                                                    id="confirm_password"
                                                    type="password"
                                                    placeholder="Re-enter password"
                                                    value={newAdminData.confirm_password}
                                                    onChange={(e) => setNewAdminData({ ...newAdminData, confirm_password: e.target.value })}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleCreateAdminAccount}
                                            disabled={creatingAccount}
                                            className="w-full"
                                        >
                                            {creatingAccount ? 'Creating Account...' : 'Create Account & Continue'}
                                        </Button>
                                    </div>
                                )}

                                {/* STEP 2: Role Configuration */}
                                {(dialogStep === 'configure-role' || editingRole) && (
                                    <div className="space-y-4">
                                        {/* Back Button */}
                                        {!editingRole && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setDialogStep('select-user');
                                                    setSelectedUserId(null);
                                                }}
                                            >
                                                ← Back to User Selection
                                            </Button>
                                        )}

                                        {/* User Details Preview */}
                                        {selectedUserId && !editingRole && (
                                            <Card className="bg-muted/50">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-sm font-medium">Admin Account Details</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-2 text-sm">
                                                    {(() => {
                                                        const user = users.find(u => u.user_id == selectedUserId);

                                                        // If user not found in list, show newly created admin data
                                                        if (!user && newAdminData.full_name) {
                                                            return (
                                                                <>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Name:</span>
                                                                        <span className="font-medium">{newAdminData.full_name}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Email:</span>
                                                                        <span className="font-medium">{newAdminData.email}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Username:</span>
                                                                        <span className="font-medium">{newAdminData.username}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Contact:</span>
                                                                        <span className="font-medium">{newAdminData.contact}</span>
                                                                    </div>
                                                                </>
                                                            );
                                                        }

                                                        if (!user) {
                                                            return <p className="text-muted-foreground">User not found</p>;
                                                        }

                                                        return (
                                                            <>
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Name:</span>
                                                                    <span className="font-medium">{user.full_name || user.username || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Email:</span>
                                                                    <span className="font-medium">{user.email || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Username:</span>
                                                                    <span className="font-medium">{user.username || 'N/A'}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-muted-foreground">Role:</span>
                                                                    <span className="font-medium capitalize">{user.role || 'student'}</span>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </CardContent>
                                            </Card>
                                        )}

                                        {(selectedUserId || editingRole) && (
                                            <>
                                                <div>
                                                    <Label htmlFor="role-level">Role Level</Label>
                                                    <Select
                                                        value={formData.role_level.toString()}
                                                        onValueChange={(value) => setFormData({ ...formData, role_level: parseInt(value) })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="3">Moderator - Limited access to selected pages</SelectItem>
                                                            <SelectItem value="2">Admin - Full access to selected pages</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Note: Super Admin role can only be assigned via database. Only one Super Admin should exist.
                                                    </p>
                                                </div>

                                                {formData.role_level !== 1 && (
                                                    <div>
                                                        <Label className="mb-3 block">Allowed Admin Pages</Label>
                                                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                                                            {availablePages.map((page) => (
                                                                <div key={page.slug} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={page.slug}
                                                                        checked={formData.allowed_pages.includes(page.slug)}
                                                                        onCheckedChange={() => handlePageToggle(page.slug)}
                                                                    />
                                                                    <label
                                                                        htmlFor={page.slug}
                                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                                    >
                                                                        {page.name}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {formData.allowed_pages.length} page(s) selected
                                                        </p>
                                                    </div>
                                                )}

                                                <div>
                                                    <Label htmlFor="expires-at">Expiry Date (Optional)</Label>
                                                    <Input
                                                        id="expires-at"
                                                        type="date"
                                                        value={formData.expires_at}
                                                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                                    />
                                                </div>

                                                <div className="flex space-x-2">
                                                    <Button onClick={editingRole ? updateRole : grantRole}>
                                                        {editingRole ? 'Update' : 'Grant'} Role
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
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
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-semibold">
                                                            {role.user_full_name}
                                                        </h3>
                                                        {getRoleBadge(role.role_level)}
                                                        {role.role_level === 1 && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                SYSTEM OWNER
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {role.user_email}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                                                        <span>
                                                            Granted by: {role.granted_by_name}
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
                                                    {role.role_level === 1 && (
                                                        <p className="text-xs text-amber-600 mt-2 font-medium">
                                                            ⚠️ This is the system owner with full access to everything including role management
                                                        </p>
                                                    )}
                                                    {role.allowed_pages && role.allowed_pages.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {role.allowed_pages.slice(0, 5).map(page => (
                                                                <Badge key={page} variant="outline" className="text-xs">
                                                                    {availablePages.find(p => p.slug === page)?.name || page}
                                                                </Badge>
                                                            ))}
                                                            {role.allowed_pages.length > 5 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{role.allowed_pages.length - 5} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                {role.role_level !== 1 ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(role)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
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
                                                                        Are you sure you want to revoke the {role.role_level_display} role from {role.user_full_name}? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => revokeRole(role.id)}
                                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                    >
                                                                        Revoke Role
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs">
                                                        Protected - Cannot Edit/Delete
                                                    </Badge>
                                                )}
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
                                                {log.admin_name} {log.action.replace('_', ' ')} {log.resource_type.replace('_', ' ')}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(log.created_at).toLocaleString()}
                                            </p>
                                            {log.details && Object.keys(log.details).length > 0 && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {log.details.target_user && <span>User: {log.details.target_user}</span>}
                                                    {log.details.role_name && <span> • Role: {log.details.role_name}</span>}
                                                </div>
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