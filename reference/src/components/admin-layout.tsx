import { Outlet, NavLink, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Image,
  GraduationCap,
  Building2,
  Users,
  Settings,
  BookOpen,
  Trophy,
  Calendar,
  Palette,
  Download,
  CreditCard,
  Award,
  FileCheck,
  Info,
  Users2,
  Medal,
  Shield,
} from "lucide-react";

const navigationItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    url: "/admin",
    group: "Dashboard"
  },
  {
    title: "Notices",
    icon: FileText,
    url: "/admin/notices",
    group: "Content"
  },
  {
    title: "News & Announcements", 
    icon: FileText,
    url: "/admin/news",
    group: "Content"
  },
  {
    title: "Contact Management",
    icon: FileText,
    url: "/admin/contact",
    group: "Content"
  },
  {
    title: "Campus Statistics",
    icon: Trophy,
    url: "/admin/campus-stats",
    group: "Content"
  },
  {
    title: "Hero Images",
    icon: Image,
    url: "/admin/hero-images",
    group: "Media"
  },
  {
    title: "Photo Gallery",
    icon: Image,
    url: "/admin/photo-gallery",
    group: "Media"
  },
  {
    title: "Magazines",
    icon: BookOpen,
    url: "/admin/magazines",
    group: "Media"
  },
  {
    title: "Creative Gallery",
    icon: Palette,
    url: "/admin/creative-gallery",
    group: "Media"
  },
  {
    title: "Submissions Manager",
    icon: FileText,
    url: "/admin/submissions",
    group: "Media"
  },
  {
    title: "Academic Pages",
    icon: BookOpen,
    url: "/admin/academic-pages",
    group: "Academic Management"
  },
  {
    title: "Timetables",
    icon: Calendar,
    url: "/admin/timetables",
    group: "Academic Management"
  },
  {
    title: "Downloads",
    icon: Download,
    url: "/admin/downloads",
    group: "Academic Management"
  },
  {
    title: "Fees Management",
    icon: CreditCard,
    url: "/admin/fees",
    group: "Academic Management"
  },
  {
    title: "Scholarships",
    icon: Award,
    url: "/admin/scholarships",
    group: "Academic Management"
  },
  {
    title: "Transcripts",
    icon: FileCheck,
    url: "/admin/transcripts",
    group: "Academic Management"
  },
  {
    title: "Academic Content",
    icon: BookOpen,
    url: "/admin/academic-content",
    group: "Academic Content"
  },
  {
    title: "Academic Excellence",
    icon: Trophy,
    url: "/admin/academic-excellence",
    group: "Academic Content"
  },
  {
    title: "Academic Services",
    icon: GraduationCap,
    url: "/admin/academic-services",
    group: "Academic Content"
  },
  {
    title: "Clubs & Activities",
    icon: Calendar,
    url: "/admin/clubs-activities",
    group: "Academic Content"
  },
  {
    title: "Departments",
    icon: Building2,
    url: "/admin/departments",
    group: "Academic Content"
  },
  {
    title: "Faculty",
    icon: Users2,
    url: "/admin/faculty",
    group: "Academic Content"
  },
  {
    title: "Campus Life Content",
    icon: FileText,
    url: "/admin/campus-life",
    group: "Campus Life"
  },
  {
    title: "Campus Pages",
    icon: FileText,
    url: "/admin/campus-pages",
    group: "Campus Life"
  },
  {
    title: "Student Activities",
    icon: Users,
    url: "/admin/student-activities",
    group: "Campus Life"
  },
  {
    title: "Sports Facilities",
    icon: Trophy,
    url: "/admin/sports-facilities",
    group: "Campus Life"
  },
  {
    title: "Hostel Management",
    icon: Building2,
    url: "/admin/hostel",
    group: "Campus Life"
  },
  {
    title: "Events Manager",
    icon: Calendar,
    url: "/admin/events",
    group: "Campus Life"
  },
  {
    title: "Wellness Programs",
    icon: Trophy,
    url: "/admin/wellness",
    group: "Campus Life"
  },
  {
    title: "Student Governance",
    icon: Users,
    url: "/admin/governance",
    group: "Campus Life"
  },
  {
    title: "Publications",
    icon: BookOpen,
    url: "/admin/publications",
    group: "Campus Life"
  },
  {
    title: "Amenities",
    icon: Building2,
    url: "/admin/amenities",
    group: "Campus Life"
  },
  {
    title: "Women's Forum",
    icon: Users2,
    url: "/admin/womens-forum",
    group: "Campus Life"
  },
  {
    title: "Social Initiatives",
    icon: Users,
    url: "/admin/social-initiatives",
    group: "Campus Life"
  },
  {
    title: "Innovation Centers",
    icon: Trophy,
    url: "/admin/innovation",
    group: "Campus Life"
  },
  {
    title: "About Pages",
    icon: Info,
    url: "/admin/about-pages",
    group: "About Us"
  },
  {
    title: "Awards & Achievements",
    icon: Award,
    url: "/admin/awards",
    group: "About Us"
  },
  {
    title: "Leadership Messages",
    icon: Users2,
    url: "/admin/leadership",
    group: "About Us"
  },
  {
    title: "Users",
    icon: Users,
    url: "/admin/users",
    group: "Management"
  },
  {
    title: "Role Management",
    icon: Shield,
    url: "/admin/roles",
    group: "Management"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/admin/settings",
    group: "Management"
  },
];

function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const groups = navigationItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50";

  return (
    <Sidebar className="w-60" collapsible="icon">
      <SidebarContent>
        {Object.entries(groups).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavCls(item.url)}
                        end={item.url === "/admin"}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage your NIT Nalanda website content
              </p>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="p-4 w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}