import React from "react";
import { Outlet, NavLink, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
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
  LogOut,
} from "lucide-react";

const navigationItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    url: "/admin",
    group: "Dashboard",
    slug: "dashboard" // Always visible
  },
  {
    title: "Notices",
    icon: FileText,
    url: "/admin/notices",
    group: "Content",
    slug: "notices"
  },
  {
    title: "News & Announcements",
    icon: FileText,
    url: "/admin/news",
    group: "Content",
    slug: "news"
  },
  {
    title: "Contact Management",
    icon: FileText,
    url: "/admin/contact",
    group: "Content",
    slug: "contact"
  },
  {
    title: "Campus Statistics",
    icon: Trophy,
    url: "/admin/campus-stats",
    group: "Content",
    slug: "campus-stats"
  },
  {
    title: "Hero Images",
    icon: Image,
    url: "/admin/hero-images",
    group: "Media",
    slug: "hero-images"
  },
  {
    title: "Photo Gallery",
    icon: Image,
    url: "/admin/photo-gallery",
    group: "Media",
    slug: "photo-gallery"
  },
  {
    title: "Magazines",
    icon: BookOpen,
    url: "/admin/magazines",
    group: "Media",
    slug: "magazines"
  },
  {
    title: "Creative Gallery",
    icon: Palette,
    url: "/admin/creative-gallery",
    group: "Media",
    slug: "creative-gallery"
  },
  {
    title: "Submissions Manager",
    icon: FileText,
    url: "/admin/submissions",
    group: "Media",
    slug: "submissions"
  },
  {
    title: "Timetables",
    icon: Calendar,
    url: "/admin/timetables",
    group: "Academic Management",
    slug: "timetables"
  },
  {
    title: "Downloads",
    icon: Download,
    url: "/admin/downloads",
    group: "Academic Management",
    slug: "downloads"
  },
  {
    title: "Fees Management",
    icon: CreditCard,
    url: "/admin/fees",
    group: "Academic Management",
    slug: "fees"
  },
  {
    title: "Scholarships",
    icon: Award,
    url: "/admin/scholarships",
    group: "Academic Management",
    slug: "scholarships"
  },
  {
    title: "Transcripts",
    icon: FileCheck,
    url: "/admin/transcripts",
    group: "Academic Management",
    slug: "transcripts"
  },
  {
    title: "Academic Content",
    icon: BookOpen,
    url: "/admin/academic-content",
    group: "Academic Content",
    slug: "academic-content"
  },
  {
    title: "Academic Excellence",
    icon: Trophy,
    url: "/admin/academic-excellence",
    group: "Academic Content",
    slug: "academic-excellence"
  },
  {
    title: "Clubs & Activities",
    icon: Calendar,
    url: "/admin/clubs-activities",
    group: "Academic Content",
    slug: "clubs-activities"
  },
  {
    title: "Departments",
    icon: Building2,
    url: "/admin/departments",
    group: "Academic Content",
    slug: "departments"
  },
  // {
  //   title: "Campus Life Content",
  //   icon: FileText,
  //   url: "/admin/campus-life",
  //   group: "Campus Life",
  //   slug: "campus-life"
  // }, // Commented out for Django migration
  // {
  //   title: "Campus Pages",
  //   icon: FileText,
  //   url: "/admin/campus-pages",
  //   group: "Campus Life",
  //   slug: "campus-pages"
  // },
  // {
  //   title: "Student Activities",
  //   icon: Users,
  //   url: "/admin/student-activities",
  //   group: "Campus Life",
  //   slug: "student-activities"
  // },
  {
    title: "Sports Facilities",
    icon: Trophy,
    url: "/admin/sports-facilities",
    group: "Campus Life",
    slug: "sports-facilities"
  },
  {
    title: "Hostel Details",
    icon: Building2,
    url: "/admin/hostel",
    group: "Campus Life",
    slug: "hostel"
  },
  // {
  //   title: "Events Manager",
  //   icon: Calendar,
  //   url: "/admin/events",
  //   group: "Campus Life",
  //   slug: "events"
  // },
  // {
  //   title: "Wellness Programs",
  //   icon: Trophy,
  //   url: "/admin/wellness",
  //   group: "Campus Life",
  //   slug: "wellness"
  // },
  {
    title: "Student Governance",
    icon: Users,
    url: "/admin/governance",
    group: "Campus Life",
    slug: "governance"
  },
  // {
  //   title: "Publications",
  //   icon: BookOpen,
  //   url: "/admin/publications",
  //   group: "Campus Life",
  //   slug: "publications"
  // },
  // {
  //   title: "Amenities",
  //   icon: Building2,
  //   url: "/admin/amenities",
  //   group: "Campus Life",
  //   slug: "amenities"
  // },
  {
    title: "Women's Forum",
    icon: Users2,
    url: "/admin/womens-forum",
    group: "Campus Life",
    slug: "womens-forum"
  },
  // {
  //   title: "Social Initiatives",
  //   icon: Users,
  //   url: "/admin/social-initiatives",
  //   group: "Campus Life",
  //   slug: "social-initiatives"
  // },
  {
    title: "Innovation Centers",
    icon: Trophy,
    url: "/admin/innovation",
    group: "Campus Life",
    slug: "innovation"
  },
  {
    title: "Awards & Achievements",
    icon: Award,
    url: "/admin/awards",
    group: "About Us",
    slug: "awards"
  },
  // {
  //   title: "Leadership Messages",
  //   icon: Users2,
  //   url: "/admin/leadership",
  //   group: "About Us",
  //   slug: "leadership"
  // },
  {
    title: "Users",
    icon: Users,
    url: "/admin/users",
    group: "Management",
    slug: "users"
  },
  {
    title: "Role Management",
    icon: Shield,
    url: "/admin/roles",
    group: "Management",
    slug: "roles"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/admin/settings",
    group: "Management",
    slug: "settings"
  },
];

function AdminSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [allowedPages, setAllowedPages] = React.useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  // Fetch user permissions on mount
  React.useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/admin-roles/my_permissions/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Extract allowed_pages - it should be an array
          const pages = Array.isArray(data.allowed_pages) ? data.allowed_pages : [];
          setAllowedPages(pages);
          setIsSuperAdmin(data.role_level === 1);
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Filter navigation items based on permissions
  const filteredNavigationItems = React.useMemo(() => {
    if (loading) return [];
    if (isSuperAdmin) return navigationItems;

    return navigationItems.filter(item => {
      if (item.slug === 'dashboard') return true;
      return allowedPages.includes(item.slug);
    });
  }, [allowedPages, isSuperAdmin, loading]);

  const groups = filteredNavigationItems.reduce((acc, item) => {
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

  if (loading) {
    return (
      <Sidebar className="w-60" collapsible="icon">
        <SidebarContent>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

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
  const { user, isAdmin, loading, signOut } = useAuth();

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
        <div className="flex-1 flex flex-col ml-0">
          <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4">
            <SidebarTrigger className="mr-2 lg:mr-4" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg lg:text-xl font-semibold truncate">Admin Dashboard</h1>
              <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block truncate">
                Manage your NIT Nalanda website content
              </p>
            </div>
            <div className="flex items-center gap-1 lg:gap-2 xl:gap-3">
              <span className="text-xs lg:text-sm text-muted-foreground hidden md:block truncate max-w-32 lg:max-w-40 xl:max-w-none">
                Welcome, {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="flex items-center gap-1 lg:gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs lg:text-sm px-2 lg:px-3"
              >
                <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="w-full p-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}