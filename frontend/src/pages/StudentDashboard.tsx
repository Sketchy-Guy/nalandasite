import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Bell, Newspaper, BookOpen, Trophy, Calendar, 
  Users, DollarSign, Download, Home, Clock, CheckCircle,
  AlertCircle, FileText, ChevronRight, Award, GraduationCap,
  TrendingUp, Target, BookMarked, Activity, Mail, Phone,
  MapPin, UserCircle, Star, Zap, Menu, CreditCard, IdCard,
  CalendarDays, BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [news, setNews] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not student
    if (profile && profile.role !== 'student') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch notices (get more to show 4 + have extras for "View All")
        const noticesResponse = await api.notices.list({ limit: 10 });
        setNotices(noticesResponse.results || []);

        // Fetch news
        const newsResponse = await api.news.list({ limit: 3 });
        setNews(newsResponse.results || []);

        // Fetch clubs data
        const clubsResponse = await api.clubs.list();
        if (clubsResponse.results) {
          // Transform clubs data to match our structure
          const transformedClubs = clubsResponse.results.map((club: any) => ({
            id: club.id,
            name: club.name,
            members: club.member_count || 0,
            joined: false // TODO: Implement club membership tracking
          }));
          setClubs(transformedClubs);
        }

        // Fetch magazines
        const magazinesResponse = await api.magazines.list({ limit: 5 });
        if (magazinesResponse.results) {
          const transformedMagazines = magazinesResponse.results.map((mag: any) => ({
            id: mag.id,
            title: mag.title,
            date: new Date(mag.created_at).toLocaleDateString()
          }));
          setMagazines(transformedMagazines);
        }

        // Fetch timetables
        try {
          const timetableResponse = await api.timetables.current();
          if (timetableResponse) {
            // Transform timetable data if available
            // For now, keep mock data structure
          }
        } catch (error) {
          console.log('No timetable data available');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile) {
      fetchData();
    }
  }, [profile, navigate]);

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">Please log in to access your dashboard.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  // Real student data from profile
  const studentData = {
    name: profile?.full_name || `${user?.first_name} ${user?.last_name}`.trim() || user?.username || "Student",
    rollNumber: user?.username || "Not Available",
    department: profile?.department || "Not Specified",
    semester: profile?.semester || "Not Specified",
    email: user?.email || "Not Available",
    phone: profile?.phone || "Not Available",
    currentClub: "Not Joined", // TODO: Implement club membership tracking
    attendance: "87.5%", // TODO: Implement attendance tracking
    enrollmentYear: profile?.enrollment_year || null,
    graduationYear: profile?.graduation_year || null,
    branch: profile?.branch || null,
    address: profile?.address || "Not Available"
  };

  const semesterResults = [
    { subject: "Data Structures", credits: 4, grade: "A+", score: 92 },
    { subject: "Database Management", credits: 4, grade: "A", score: 88 },
    { subject: "Operating Systems", credits: 3, grade: "A+", score: 94 },
    { subject: "Computer Networks", credits: 3, grade: "B+", score: 82 },
    { subject: "Software Engineering", credits: 4, grade: "A", score: 89 }
  ];

  const timetable = [
    { day: "Monday", slots: ["Data Structures (9-10)", "DBMS Lab (10-12)", "Free", "OS (2-3)"] },
    { day: "Tuesday", slots: ["Networks (9-10)", "SE (10-11)", "Free", "DSA Lab (2-4)"] },
    { day: "Wednesday", slots: ["DBMS (9-10)", "OS (10-11)", "Networks (11-12)", "Free"] },
    { day: "Thursday", slots: ["SE (9-10)", "Data Structures (10-11)", "Free", "Sports (2-4)"] },
    { day: "Friday", slots: ["Networks Lab (9-11)", "Free", "OS (12-1)", "SE Lab (2-4)"] }
  ];

  // Clubs data is now fetched from API and stored in state

  const attendance = [
    { subject: "Data Structures", total: 45, present: 42, percentage: 93.3 },
    { subject: "DBMS", total: 42, present: 38, percentage: 90.5 },
    { subject: "Operating Systems", total: 40, present: 34, percentage: 85.0 },
    { subject: "Networks", total: 38, present: 32, percentage: 84.2 },
    { subject: "Software Engineering", total: 36, present: 30, percentage: 83.3 }
  ];

  const notes = [
    { id: 1, subject: "Data Structures", topic: "Binary Trees", uploadedBy: "Dr. Sharma", date: "2024-03-15" },
    { id: 2, subject: "DBMS", topic: "Normalization", uploadedBy: "Prof. Verma", date: "2024-03-14" },
    { id: 3, subject: "Operating Systems", topic: "Process Scheduling", uploadedBy: "Dr. Kumar", date: "2024-03-13" },
    { id: 4, subject: "Networks", topic: "TCP/IP Protocol", uploadedBy: "Prof. Singh", date: "2024-03-12" }
  ];

  // Magazines data is now fetched from API and stored in state

  // Function to handle tab change and scroll to top
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Menu items for hamburger (mobile) and quick actions (desktop)
  const menuItems = [
    { label: 'Registration Fees', icon: CreditCard, action: () => {} },
    { label: 'College Due', icon: DollarSign, action: () => {} },
    { label: 'ID Card', icon: IdCard, action: () => {} },
    { label: 'Events', icon: CalendarDays, action: () => {} },
    { label: 'Alerts', icon: BellRing, action: () => {} },
  ];

  // Full menu items for mobile hamburger (includes navigation items)
  const mobileMenuItems = [
    ...menuItems,
    { label: 'Clubs', icon: Users, action: () => { handleTabChange('clubs'); setIsMenuOpen(false); } },
    { label: 'Resources', icon: BookOpen, action: () => { handleTabChange('notes'); setIsMenuOpen(false); } },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 pb-20 md:pb-8">
      {/* Mobile Header - Fixed */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-primary/95 to-accent backdrop-blur-lg border-b border-primary-foreground/10 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-gradient-to-br from-background via-card/50 to-accent/5 backdrop-blur-xl border-r border-border/20">
              <SheetHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Menu className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Quick Menu
                    </SheetTitle>
                    <p className="text-sm text-muted-foreground">Navigate with ease</p>
                  </div>
                </div>
              </SheetHeader>
              
              <div className="space-y-3">
                {mobileMenuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    className="group relative overflow-hidden"
                  >
                    <motion.button
                      onClick={item.action}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-card/50 to-card/30 border border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 active:scale-[0.98]"
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Icon container */}
                      <motion.div 
                        className="relative p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-md"
                        whileHover={{ 
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.4 }
                        }}
                      >
                        <item.icon className="h-5 w-5 text-primary group-hover:text-primary transition-colors duration-300" />
                        
                        {/* Icon glow */}
                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                      </motion.div>
                      
                      {/* Text content */}
                      <div className="flex-1 text-left relative z-10">
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {item.label}
                        </span>
                        <div className="h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-1 rounded-full" />
                      </div>
                      
                      {/* Arrow indicator */}
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <ChevronRight className="h-5 w-5 text-primary" />
                      </motion.div>
                      
                      {/* Ripple effect on hover */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              
              {/* Footer section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mobileMenuItems.length * 0.08 + 0.2 }}
                className="mt-8 pt-6 border-t border-border/30"
              >
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src="" alt={studentData.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold">
                      {studentData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{studentData.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{studentData.rollNumber}</p>
                  </div>
                </div>
              </motion.div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
              <AvatarImage src="" alt={studentData.name} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-sm font-bold">
                {studentData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={() => handleTabChange('profile')}
              className="text-primary-foreground font-medium text-sm hover:underline"
            >
              Profile
            </button>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <a href="/">
              <Home className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Desktop Hero Header */}
      <div className="hero-gradient relative overflow-hidden hidden md:block">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Badge className="mb-3 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                  {studentData.rollNumber}
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
                  Welcome back, {studentData.name}!
                </h1>
                <p className="text-primary-foreground/80 mt-2 text-sm md:text-base">
                  Your academic journey at a glance
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="gap-2 shadow-lg"
                asChild
              >
                <a href="/">
                  <Home className="h-4 w-4" />
                  Visit Main Site
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/70">CGPA</p>
                    <p className="text-xl font-bold text-primary-foreground">8.7</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <Target className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/70">Attendance</p>
                    <p className="text-xl font-bold text-primary-foreground">{studentData.attendance}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <BookMarked className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/70">Semester</p>
                    <p className="text-xl font-bold text-primary-foreground">6th</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <Users className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/70">Club</p>
                    <p className="text-sm font-bold text-primary-foreground truncate">Coding Club</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container py-6 md:py-8 space-y-6 mt-16 md:mt-0 pb-24 md:pb-24">
        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Mobile Quick Info - Show first on mobile */}
                <div className="lg:hidden">
                  <Card className="shadow-card hover:shadow-elegant transition-shadow bg-gradient-to-br from-card to-secondary/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <UserCircle className="h-5 w-5 text-primary" />
                        Quick Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center pb-4 border-b">
                        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold text-primary-foreground shadow-lg">
                          {studentData.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <h3 className="font-bold text-lg md:text-xl mt-3">{studentData.name}</h3>
                        <p className="text-sm text-muted-foreground">{studentData.rollNumber}</p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                          <GraduationCap className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground truncate">{studentData.department}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                          <BookMarked className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{studentData.semester}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                          <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground text-xs truncate">{studentData.email}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                          <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{studentData.phone}</span>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => handleTabChange('profile')}
                      >
                        View Full Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Left Column - Notices & News */}
                  <div className="lg:col-span-2 space-y-4 md:space-y-6">
                    {/* Recent Notices */}
                    <Card className="shadow-card hover:shadow-elegant transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Bell className="h-5 w-5 text-primary" />
                          </div>
                          Important Notices
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {loading ? (
                          <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            ))}
                          </div>
                        ) : notices.length > 0 ? (
                          notices.slice(0, 4).map((notice: any, index) => (
                            <motion.div
                              key={notice.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 md:p-4 rounded-lg border bg-gradient-to-r from-card to-accent/5 hover:shadow-md transition-all cursor-pointer"
                            >
                              <AlertCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${notice.priority === 'high' ? 'text-destructive' : 'text-primary'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm md:text-base">{notice.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notice.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              {notice.priority === 'high' && (
                                <Badge variant="destructive" className="flex-shrink-0">Urgent</Badge>
                              )}
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">No notices available</p>
                        )}
                        {notices.length > 4 && (
                          <div className="text-center text-xs text-muted-foreground py-2">
                            Showing 4 of {notices.length} notices
                          </div>
                        )}
                        <Button variant="outline" className="w-full mt-2">
                          View All Notices {notices.length > 4 && `(${notices.length - 4} more)`}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Latest News */}
                    <Card className="shadow-card hover:shadow-elegant transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                          <div className="p-2 bg-academic-green/10 rounded-lg">
                            <Newspaper className="h-5 w-5 text-academic-green" />
                          </div>
                          News & Highlights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {loading ? (
                          <div className="space-y-3">
                            {[1, 2].map((i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            ))}
                          </div>
                        ) : news.length > 0 ? (
                          news.map((item: any, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start justify-between gap-3 p-3 md:p-4 rounded-lg border bg-gradient-to-r from-card to-accent/5 hover:shadow-md transition-all cursor-pointer"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm md:text-base">{item.title}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(item.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">No news available</p>
                        )}
                        <Button variant="outline" className="w-full mt-2">
                          View All News
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Profile Summary (Desktop Only) */}
                  <div className="hidden lg:block lg:col-span-1 space-y-4 md:space-y-6">
                    {/* Profile Summary */}
                    <Card className="shadow-card hover:shadow-elegant transition-shadow bg-gradient-to-br from-card to-secondary/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <UserCircle className="h-5 w-5 text-primary" />
                          Quick Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-center pb-4 border-b">
                          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold text-primary-foreground shadow-lg">
                            {studentData.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <h3 className="font-bold text-lg md:text-xl mt-3">{studentData.name}</h3>
                          <p className="text-sm text-muted-foreground">{studentData.rollNumber}</p>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                            <GraduationCap className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{studentData.department}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                            <BookMarked className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{studentData.semester}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground text-xs truncate">{studentData.email}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors">
                            <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{studentData.phone}</span>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => handleTabChange('profile')}
                        >
                          View Full Profile
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Menu Options - Desktop Only */}
                    <Card className="shadow-card hover:shadow-elegant transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Menu className="h-5 w-5 text-primary" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {menuItems.map((item, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all text-left group"
                          >
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                              <item.icon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>
                            <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                          </motion.button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Content */}
            {activeTab === 'profile' && (
              <div className="space-y-4 md:space-y-6">
              {/* Profile Header Card with Gradient */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent opacity-90" />
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                
                {/* Profile Content */}
                <div className="relative p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar Section */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 border-4 border-primary-foreground/30 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                        <User className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-academic-gold rounded-full p-2 shadow-lg">
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
                      </div>
                    </motion.div>

                    {/* Student Info */}
                    <div className="flex-1 text-center md:text-left">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
                          {studentData.name}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mb-4">
                          <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs md:text-sm">
                            {studentData.rollNumber}
                          </Badge>
                          <Badge className="bg-academic-gold/20 text-primary-foreground border-academic-gold/30 text-xs md:text-sm">
                            {studentData.semester}
                          </Badge>
                        </div>
                        <p className="text-primary-foreground/90 text-sm md:text-base mb-4">
                          {studentData.department}
                        </p>
                        
                        {/* Profile Completion */}
                        <div className="max-w-md mx-auto md:mx-0">
                          <div className="flex items-center justify-between text-xs md:text-sm text-primary-foreground/80 mb-2">
                            <span>Profile Completion</span>
                            <span className="font-semibold">85%</span>
                          </div>
                          <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "85%" }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-academic-gold to-primary-foreground rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Quick Stats on Profile */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex md:flex-col gap-3 md:gap-4"
                    >
                      <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-primary-foreground/20 text-center min-w-[100px]">
                        <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground mx-auto mb-1" />
                        <p className="text-xl md:text-2xl font-bold text-primary-foreground">8.7</p>
                        <p className="text-xs text-primary-foreground/70">CGPA</p>
                      </div>
                      <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-primary-foreground/20 text-center min-w-[100px]">
                        <Target className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground mx-auto mb-1" />
                        <p className="text-xl md:text-2xl font-bold text-primary-foreground">87.5%</p>
                        <p className="text-xs text-primary-foreground/70">Attendance</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Contact & Academic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Contact Information Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="shadow-card hover:shadow-elegant transition-all h-full border-l-4 border-l-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/30 to-accent/10 border border-accent/30">
                        <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                          <p className="text-sm md:text-base font-medium break-all">{studentData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/30 to-accent/10 border border-accent/30">
                        <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                          <p className="text-sm md:text-base font-medium">{studentData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/30 to-accent/10 border border-accent/30">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Address</p>
                          <p className="text-sm md:text-base font-medium">{studentData.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Academic Details Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="shadow-card hover:shadow-elegant transition-all h-full border-l-4 border-l-academic-green">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <div className="p-2 bg-academic-green/10 rounded-lg">
                          <GraduationCap className="h-5 w-5 text-academic-green" />
                        </div>
                        Academic Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-academic-green/10 to-academic-green/5 border border-academic-green/20">
                        <BookMarked className="h-5 w-5 text-academic-green mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Department</p>
                          <p className="text-sm md:text-base font-medium">{studentData.department}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-academic-green/10 to-academic-green/5 border border-academic-green/20">
                        <Calendar className="h-5 w-5 text-academic-green mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Current Semester</p>
                          <p className="text-sm md:text-base font-medium">{studentData.semester}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-academic-green/10 to-academic-green/5 border border-academic-green/20">
                        <Users className="h-5 w-5 text-academic-green mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">Current Club</p>
                          <p className="text-sm md:text-base font-medium">{studentData.currentClub}</p>
                        </div>
                      </div>
                      {studentData.enrollmentYear && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-academic-green/10 to-academic-green/5 border border-academic-green/20">
                          <Calendar className="h-5 w-5 text-academic-green mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">Enrollment Year</p>
                            <p className="text-sm md:text-base font-medium">{studentData.enrollmentYear}</p>
                          </div>
                        </div>
                      )}
                      {studentData.branch && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-academic-green/10 to-academic-green/5 border border-academic-green/20">
                          <BookMarked className="h-5 w-5 text-academic-green mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">Branch</p>
                            <p className="text-sm md:text-base font-medium">{studentData.branch}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Performance Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="shadow-card hover:shadow-elegant transition-all bg-gradient-to-br from-card via-accent/5 to-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <div className="p-2 bg-academic-gold/10 rounded-lg">
                        <Activity className="h-5 w-5 text-academic-gold" />
                      </div>
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <Trophy className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-2" />
                        <p className="text-2xl md:text-3xl font-bold text-primary">8.7</p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Current CGPA</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-academic-green/10 to-academic-green/5 border border-academic-green/20">
                        <Target className="h-6 w-6 md:h-8 md:w-8 text-academic-green mx-auto mb-2" />
                        <p className="text-2xl md:text-3xl font-bold text-academic-green">87.5%</p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Attendance</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-academic-gold/10 to-academic-gold/5 border border-academic-gold/20">
                        <Award className="h-6 w-6 md:h-8 md:w-8 text-academic-gold mx-auto mb-2" />
                        <p className="text-2xl md:text-3xl font-bold text-academic-gold">12</p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Achievements</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30">
                        <Zap className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-2" />
                        <p className="text-2xl md:text-3xl font-bold text-primary">45</p>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">Activities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4"
              >
                <Button 
                  size="lg" 
                  className="flex-1 gap-2 h-12 md:h-14 text-base shadow-elegant hover:shadow-xl transition-all"
                >
                  <User className="h-5 w-5" />
                  Edit Profile
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1 gap-2 h-12 md:h-14 text-base shadow-card hover:shadow-elegant transition-all"
                >
                  <Download className="h-5 w-5" />
                  Download ID Card
                </Button>
              </motion.div>
            </div>
            )}

            {/* Academics Content */}
            {activeTab === 'academics' && (
              <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Semester Results - 5th Semester
                  </CardTitle>
                  <CardDescription>Your academic performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {semesterResults.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{result.subject}</p>
                          <p className="text-sm text-muted-foreground">Credits: {result.credits}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Score</p>
                            <p className="font-bold text-lg">{result.score}%</p>
                          </div>
                          <Badge className="text-lg px-4 py-1">{result.grade}</Badge>
                        </div>
                      </motion.div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="font-bold">Overall CGPA</span>
                      <span className="text-2xl font-bold text-primary">8.7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Attendance Content */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
              {/* Overall Attendance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="inline-flex p-3 bg-primary/10 rounded-full mb-3">
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-4xl font-bold text-primary">87.5%</p>
                      <p className="text-sm text-muted-foreground mt-2">Overall Attendance</p>
                      <Badge variant="default" className="mt-3">Excellent</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card bg-gradient-to-br from-academic-green/5 to-academic-green/10 border-academic-green/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="inline-flex p-3 bg-academic-green/10 rounded-full mb-3">
                        <CheckCircle className="h-8 w-8 text-academic-green" />
                      </div>
                      <p className="text-4xl font-bold text-academic-green">176</p>
                      <p className="text-sm text-muted-foreground mt-2">Classes Attended</p>
                      <Badge variant="secondary" className="mt-3">Out of 201</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="inline-flex p-3 bg-destructive/10 rounded-full mb-3">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                      </div>
                      <p className="text-4xl font-bold text-destructive">25</p>
                      <p className="text-sm text-muted-foreground mt-2">Classes Missed</p>
                      <Badge variant="outline" className="mt-3">Stay Alert</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subject-wise Attendance */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Activity className="h-5 w-5" />
                    Subject-wise Attendance
                  </CardTitle>
                  <CardDescription>Detailed attendance breakdown for each subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {attendance.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3 p-4 rounded-lg border bg-gradient-to-r from-card to-accent/5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base md:text-lg">{item.subject}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Present: {item.present} | Absent: {item.total - item.present} | Total: {item.total}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={item.percentage >= 85 ? "default" : item.percentage >= 75 ? "secondary" : "destructive"}
                              className="text-base px-4 py-1"
                            >
                              {item.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{item.present}/{item.total} classes</span>
                          </div>
                          <Progress value={item.percentage} className="h-3" />
                        </div>

                        {item.percentage < 75 && (
                          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg mt-3">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                            <div className="text-xs">
                              <p className="font-medium text-destructive">Warning: Below 75%</p>
                              <p className="text-muted-foreground mt-1">
                                You need to attend {Math.ceil((0.75 * item.total - item.present) / 0.25)} more classes to reach 75%
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Subjects</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-primary/10">
                      <p className="text-2xl font-bold text-primary">3</p>
                      <p className="text-xs text-muted-foreground mt-1">Above 85%</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-destructive/10">
                      <p className="text-2xl font-bold text-destructive">2</p>
                      <p className="text-xs text-muted-foreground mt-1">Need Attention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Clubs Content */}
            {activeTab === 'clubs' && (
              <div className="space-y-6">
              {/* Current Club */}
              <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/10 border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Star className="h-5 w-5 text-primary" />
                    Your Current Club
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 md:p-6 rounded-lg bg-card border-2 border-primary">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold">{studentData.currentClub}</h3>
                      <p className="text-muted-foreground mt-1">156 active members</p>
                      <Badge className="mt-3">Active Member</Badge>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Available Clubs */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Users className="h-5 w-5" />
                    Explore Other Clubs
                  </CardTitle>
                  <CardDescription>Join more clubs to expand your interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clubs.map((club, index) => (
                      <motion.div
                        key={club.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`h-full transition-all hover:shadow-lg ${club.joined ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <CardTitle className="text-base md:text-lg">{club.name}</CardTitle>
                                <CardDescription className="text-xs mt-1">
                                  <Users className="h-3 w-3 inline mr-1" />
                                  {club.members} members
                                </CardDescription>
                              </div>
                              {club.joined && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Joined
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            {club.joined ? (
                              <Button variant="outline" className="w-full" disabled>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Current Member
                              </Button>
                            ) : (
                              <Button variant="default" className="w-full">
                                Join Club
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Resources Content */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
              {/* Study Materials */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <FileText className="h-5 w-5" />
                    Study Materials & Notes
                  </CardTitle>
                  <CardDescription>Download lecture notes and study resources uploaded by faculty</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-gradient-to-r from-card to-accent/5 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm md:text-base">{note.topic}</p>
                            <p className="text-sm text-muted-foreground">{note.subject}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              By {note.uploadedBy} • {note.date}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Magazines & Newsletters */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Newspaper className="h-5 w-5" />
                    Magazines & Newsletters
                  </CardTitle>
                  <CardDescription>Stay updated with campus publications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {magazines.map((mag, index) => (
                      <motion.div
                        key={mag.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-gradient-to-r from-card to-accent/5 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 bg-academic-gold/10 rounded-lg flex-shrink-0">
                            <BookOpen className="h-5 w-5 text-academic-gold" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm md:text-base">{mag.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{mag.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 sm:flex-none">
                            View
                          </Button>
                          <Button size="sm" className="flex-1 sm:flex-none">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Timetable Content */}
            {activeTab === 'timetable' && (
              <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Calendar className="h-5 w-5" />
                    Weekly Class Schedule
                  </CardTitle>
                  <CardDescription>Your complete timetable for the current semester</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 md:space-y-6">
                    {timetable.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <Clock className="h-4 w-4 text-primary" />
                          <h4 className="font-bold text-base md:text-lg text-primary">{day.day}</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                          {day.slots.map((slot, slotIndex) => (
                            <motion.div
                              key={slotIndex}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (index * 0.1) + (slotIndex * 0.05) }}
                              className={`p-3 md:p-4 rounded-lg text-center text-xs md:text-sm font-medium transition-all hover:scale-105 ${
                                slot === 'Free' 
                                  ? 'bg-muted text-muted-foreground border border-border' 
                                  : 'bg-gradient-to-br from-primary/10 to-accent/20 text-primary border border-primary/30 shadow-sm'
                              }`}
                            >
                              {slot}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      Download Timetable
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Calendar className="h-4 w-4" />
                      Add to Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-2xl">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            onClick={() => handleTabChange('overview')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">Overview</span>
          </button>

          <button
            onClick={() => handleTabChange('academics')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'academics'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            <span className="text-[10px] font-medium">Academics</span>
          </button>

          <button
            onClick={() => handleTabChange('attendance')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'attendance'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Target className="h-5 w-5" />
            <span className="text-[10px] font-medium">Attendance</span>
          </button>

          <button
            onClick={() => handleTabChange('timetable')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
              activeTab === 'timetable'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Clock className="h-5 w-5" />
            <span className="text-[10px] font-medium">Timetable</span>
          </button>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/40 shadow-2xl">
        <div className="container">
          <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'profile', label: 'Profile', icon: UserCircle },
              { id: 'academics', label: 'Academics', icon: GraduationCap },
              { id: 'attendance', label: 'Attendance', icon: Target },
              { id: 'clubs', label: 'Clubs', icon: Users },
              { id: 'notes', label: 'Resources', icon: BookOpen },
              { id: 'timetable', label: 'Timetable', icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all font-medium ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
