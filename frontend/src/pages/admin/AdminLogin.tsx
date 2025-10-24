import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import nitLogo from '../../assets/nit-logo.png';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [accessDenied, setAccessDenied] = useState<{
    show: boolean;
    userRole: string;
    email: string;
  }>({ show: false, userRole: '', email: '' });
  const [countdown, setCountdown] = useState(5);
  
  const { signIn, signOut, user, isAdmin, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Handle auth state changes
  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        navigate('/admin');
      } else if (userRole && userRole !== 'admin') {
        // User logged in successfully but doesn't have admin access
        setAccessDenied({
          show: true,
          userRole: userRole,
          email: user.email || formData.email
        });
        setCountdown(5);
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              signOut();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      }
    }
  }, [user, isAdmin, userRole, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAccessDenied({ show: false, userRole: '', email: '' });

    try {
      const { error } = await signIn(formData.email, formData.password);
      // useEffect will handle the admin access check and redirect
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={nitLogo} 
                  alt="NIT Logo" 
                  className="h-12 w-12"
                />
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Admin Access
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Nalanda Institute of Technology
                </p>
              </div>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {accessDenied.show && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <Alert className="border-red-300 bg-red-50 shadow-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-900">
                    <div className="space-y-2">
                      <div className="font-semibold">
                        <strong className="capitalize">{accessDenied.userRole}</strong> does not have admin access.
                      </div>
                      <div className="text-sm">
                        Trying to login again will send the current entered email ({accessDenied.email}) to Administrative office.
                      </div>
                      <div className="text-xs bg-red-100 px-2 py-1 rounded border border-red-200 inline-block">
                        Redirecting in {countdown} seconds...
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-sm font-medium">
                  Administrator Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@nalanda.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-11 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Access Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </motion.form>


            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Main Site
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}