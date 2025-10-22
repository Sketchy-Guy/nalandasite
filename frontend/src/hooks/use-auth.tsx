import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

interface Profile {
  id: string;
  user: User;
  full_name?: string;
  role: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session on mount
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedProfile = localStorage.getItem('profile');
      const accessToken = localStorage.getItem('access_token');

      if (storedUser && storedProfile && accessToken) {
        const userData = JSON.parse(storedUser);
        const profileData = JSON.parse(storedProfile);
        
        setUser(userData);
        setProfile(profileData);
        setUserRole(profileData.role);
        setIsAdmin(profileData.role === 'admin');
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      // Clear invalid session data
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await api.auth.login(email, password);
      
      setUser(data.user);
      setProfile(data.profile);
      setUserRole(data.profile?.role || null);
      setIsAdmin(data.profile?.role === 'admin');

      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });

      return { error: null };
    } catch (error: any) {
      // Check if it's an authentication error
      const isAuthError = error.message?.toLowerCase().includes('login failed') || 
                         error.message?.toLowerCase().includes('invalid') ||
                         error.message?.toLowerCase().includes('unauthorized') ||
                         error.message?.toLowerCase().includes('unable to log in') ||
                         error.message?.toLowerCase().includes('provided credentials') ||
                         error.status === 401;
      
      toast({
        title: 'Sign In Error',
        description: isAuthError ? 'Wrong credentials' : (error.message || 'Failed to sign in'),
        variant: 'destructive',
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    try {
      // For now, return error as signup is not implemented in Django yet
      const error = new Error('Sign up functionality not yet implemented');
      toast({
        title: 'Sign Up Error',
        description: 'Sign up functionality is not yet available. Please contact administrator.',
        variant: 'destructive',
      });
      return { error };
    } catch (error: any) {
      toast({
        title: 'Sign Up Error',
        description: error.message || 'Failed to sign up',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const refreshProfile = async () => {
    try {
      const profileData = await api.auth.getProfile();
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(profileData.user));
      localStorage.setItem('profile', JSON.stringify(profileData.profile));
      
      // Update state
      setUser(profileData.user);
      setProfile(profileData.profile);
      setUserRole(profileData.profile?.role || null);
      setIsAdmin(profileData.profile?.role === 'admin');

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been refreshed.',
      });
    } catch (error: any) {
      toast({
        title: 'Refresh Error',
        description: 'Failed to refresh profile information.',
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    
    setUser(null);
    setProfile(null);
    setUserRole(null);
    setIsAdmin(false);

    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.',
    });

    // Redirect to login page
    window.location.href = '/admin/login';
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    isAdmin,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}