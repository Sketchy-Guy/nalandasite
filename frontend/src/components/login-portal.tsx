import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Users, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface LoginPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const userTypes = [
  { id: 'student', label: 'Student', icon: GraduationCap, color: 'bg-blue-500' },
  { id: 'faculty', label: 'Faculty & Staff', icon: Users, color: 'bg-green-500' },
  { id: 'alumni', label: 'Alumni', icon: User, color: 'bg-purple-500' },
];

export default function LoginPortal({ isOpen, onClose }: LoginPortalProps) {
  const [selectedUserType, setSelectedUserType] = useState<string>('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  
  const { signIn, signOut, userRole } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in with Django backend
      const result = await signIn(formData.email, formData.password);
      
      if (!result.error) {
        // Check if user role matches selected user type
        const currentUserRole = result.profile?.role;
        
        // Debug logging
        console.log('Login Debug:', {
          currentUserRole,
          selectedUserType,
          profile: result.profile
        });
        
        if (currentUserRole && currentUserRole.toLowerCase() !== selectedUserType.toLowerCase()) {
          // Role mismatch - sign out user silently and show error
          await signOut(true); // Silent signout - no toast or redirect
          setError(`Access denied. This account is registered as "${currentUserRole}" but you selected "${selectedUserType}". Please select the correct user type and try again.`);
          setLoading(false); // Explicitly reset loading state for error case
          return;
        }
        
        // Role matches or no role restriction - success
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        });
        
        onClose();
        resetForm();
      } else {
        setError(result.error.message || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '' });
    setSelectedUserType('student');
    setError('');
    setShowPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); resetForm(); }}>
      <DialogContent className="w-[95vw] max-w-sm sm:max-w-md lg:max-w-lg p-0 overflow-hidden mx-auto my-auto max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 sm:p-6 relative overflow-hidden">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline">NIT Portal Login</span>
                  <span className="sm:hidden">Login Portal</span>
                </DialogTitle>
              </DialogHeader>
            </motion.div>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* User Type Selection */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 sm:mb-6"
            >
              <Label className="text-sm font-medium mb-2 sm:mb-3 block">Select User Type</Label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedUserType(type.id)}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-center ${
                        selectedUserType === type.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mx-auto mb-0.5 sm:mb-1" />
                      <span className="text-[10px] sm:text-xs font-medium leading-tight">{type.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Login Form */}
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 sm:h-10 lg:h-11 text-sm"
                  required
                />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-9 sm:h-10 lg:h-11 pr-10 text-sm"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 sm:h-10 lg:h-11 px-3 hover:bg-transparent"
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

              <Button
                type="submit"
                className="w-full h-9 sm:h-10 lg:h-11 bg-primary hover:bg-primary/90 font-medium text-sm sm:text-base mt-4 sm:mt-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm sm:text-base">Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.form>

            {/* Information Note */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 sm:mt-6 p-2.5 sm:p-3 lg:p-4 bg-muted rounded-lg"
            >
              <p className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground text-center leading-relaxed">
                Use your registered credentials provided by the administrative office. 
                <br className="hidden sm:inline" />
                <span className="font-medium">Contact admin if you need account access.</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}