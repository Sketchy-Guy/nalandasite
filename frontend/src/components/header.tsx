import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { motion } from "framer-motion";
import { Menu, X, Search, User, CreditCard, ChevronDown, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";
import LoginPortal from "./login-portal";
import nitLogo from "@/assets/nit-logo.png";
import allLogo from "@/assets/All Logo copy.png";
import { useAuth } from "@/hooks/use-auth";
import { HierarchicalDepartmentMenu } from "./hierarchical-department-menu";
import { MobileHierarchicalMenu } from "./mobile-hierarchical-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [showTopbar, setShowTopbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [topbarHeight, setTopbarHeight] = useState(0);
  const topbarRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { user, signOut, isAdmin } = useAuth();

  // Measure topbar height
  useEffect(() => {
    if (topbarRef.current) {
      setTopbarHeight(topbarRef.current.offsetHeight);
    }
  }, []);

  // Scroll detection for topbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show topbar at the very top
        setShowTopbar(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show topbar
        setShowTopbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide topbar (only after scrolling past 50px)
        setShowTopbar(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const academicsSubMenu = [
    { title: "Toppers", href: "/academics/toppers" },
    { title: "Timetable", href: "/academics/timetable" },
    { title: "Fees", href: "/academics/fees" },
    { title: "Scholarships & Financial Assistance", href: "/academics/scholarships" },
    { title: "Ordinances", href: "/academics/ordinances" },
    { title: "Transcripts & Other Academic Services", href: "/academics/transcripts" },
    { title: "Duplicate Degree", href: "/academics/duplicate-degree" },
    { title: "Orientation Programme", href: "/academics/orientation" },
    { title: "Downloads", href: "/academics/downloads" },
    { title: "Inclusive Education Services", href: "/academics/inclusive-education" }
  ];

  const campusLifeSubMenu = [
    { title: "Overview", href: "/campus-life/overview" },
    // { title: "Wellness Community Centre", href: "/campus-life/wellness" },"commented out"
    { title: "Hostel Life", href: "/campus-life/hostel" },
    { title: "Student Governance", href: "/campus-life/governance" },
    { title: "Women's Forum", href: "/campus-life/womens-forum" },
    { title: "Sports", href: "/campus-life/sports" },
    { title: "Clubs", href: "/campus-life/clubs" },
    { title: "Technology & Innovation", href: "/campus-life/innovation" },
    // { title: "Student Activities", href: "/campus-life/activities" },
    // { title: "Social Consciousness", href: "/campus-life/social" },
    // { title: "Campus Festivals", href: "/campus-life/festivals" },
    // { title: "Campus Publications", href: "/campus-life/publications" },
    // { title: "Campus Amenities", href: "/campus-life/amenities" },
    { title: "Other Facilities", href: "/campus-life/facilities" }
  ];

  const aboutUsSubMenu = [
    { title: "About Us", href: "/about" },
    { title: "Vision & Mission", href: "/about/vision-mission" },
    { title: "Awards & Achievements", href: "/about/awards" },
    {
      title: "Accreditation", href: "/about/accreditation",
      subItems: [
        { title: "NAAC A+", href: "/about/accreditation/naac" },
        { title: "NBA", href: "/about/accreditation/nba" },
        { title: "SIRO", href: "/about/accreditation/siro" }
      ]
    },
    { title: "Atal Incubation Center (10 CR Grant)", href: "https://www.aicnalanda.com/", external: true },
    { title: "SISS-Startup India (8 CR Grants)", href: "/about/siss-startup" },
    { title: "MSME-Best Business Incubator", href: "/about/msme" }
  ];

  const [departmentsSubMenu, setDepartmentsSubMenu] = useState([
    // These will be shown while loading or if the fetch fails
    { title: "Computer Science & Engineering", href: "/departments/cse" },
  ]);
  const [departmentHierarchy, setDepartmentHierarchy] = useState<any[]>([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const hierarchyData = await api.programs.hierarchy();
        setDepartmentHierarchy(hierarchyData || []);
        const response = await api.departments.list();
        // Ensure we have a valid array, fallback to empty array
        const departments = Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response)
            ? response
            : [];

        const formattedDepartments = departments
          .filter((dept: any) => {
            // Filter out any invalid department objects
            const hasValidId = Boolean(dept?.id || dept?.code);
            if (!hasValidId) {
              console.warn('Skipping department - missing id and code:', dept);
            }
            return hasValidId;
          })
          .map((dept: any) => {
            // Safely get department ID, default to empty string
            const departmentId = String(dept?.code || dept?.id || '');

            return {
              title: String(dept?.name || 'Unnamed Department'),
              href: `/departments/${departmentId.toLowerCase()}`,
              // Preserve original data for debugging
              _original: dept
            };
          });

        if (formattedDepartments.length > 0) {
          setDepartmentsSubMenu(formattedDepartments);
        } else {
          // Fallback to default if no valid departments found
          console.warn('No valid departments found, using fallback');
          setDepartmentsSubMenu([
            { title: "Computer Science & Engineering", href: "/departments/cse" },
            { title: "Information Technology", href: "/departments/it" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Fallback to default departments on error
        setDepartmentsSubMenu([
          { title: "Computer Science & Engineering", href: "/departments/cse" },
          { title: "Information Technology", href: "/departments/it" }
        ]);
      }
    };

    fetchDepartments();
  }, []);

  const feesSubMenu = [
    { title: "Registration Fees", href: "/fees/registration" },
    { title: "College Dues", href: "/fees/dues" }
  ];

  const trainingPlacementSubMenu = [
    { title: "Placement Department", href: "/placement-department" },
    { title: "Placement Report", href: "/placement-report" }
  ];

  const contactUsSubMenu = [
    { title: "Contact Information", href: "/contact" },
    { title: "Office Locations", href: "/contact/locations" },
    { title: "Quick Contact", href: "/contact/quick" },
    { title: "Feedback", href: "/contact/feedback" }
  ];

  const toggleMobileSection = (section: string) => {
    setOpenMobileSection(openMobileSection === section ? null : section);
  };

  const handleUserAction = (action: string) => {
    if (action === 'logout') {
      signOut();
    } else if (action === 'admin') {
      window.location.href = '/admin';
    }
  };

  return (
    <>
      {/* Top Login Bar (Fees moved right next to login) */}
      <motion.div
        ref={topbarRef}
        className="topbar text-white py-2 px-2 sm:px-4"
        initial={{ y: 0 }}
        animate={{ y: showTopbar ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Left side: New Logo */}
          <div className="hidden sm:flex items-center">
            <div className="relative p-2 rounded-lg bg-gradient-to-r from-white via-white to-blue-100 shadow-sm">
              <img
                src={allLogo}
                alt="Nalanda Institute of Technology"
                className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-blue-200 opacity-60 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Right side: Fees Payment + User Menu */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Fees Payment - moved next to login */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative p-1 rounded-lg bg-gradient-to-r from-white via-white to-blue-100 shadow-sm">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-blue-50 text-xs sm:text-sm relative z-10">
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Fees Payment</span>
                    <span className="sm:hidden">Fees</span>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  </Button>
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-blue-200 opacity-40 rounded-lg animate-pulse"></div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border border-border shadow-lg rounded-xl z-50">
                {feesSubMenu.map((item) => (
                  <DropdownMenuItem key={item.title} asChild>
                    <a href={item.href} className="w-full cursor-pointer">
                      {item.title}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <div className="flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative p-1 rounded-lg bg-gradient-to-r from-white via-white to-blue-100 shadow-sm">
                      <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-blue-50 relative z-10">
                        <User className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{`Welcome, ${user.email?.split('@')[0]}`}</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-blue-200 opacity-40 rounded-lg animate-pulse"></div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg rounded-xl z-50">
                    <DropdownMenuItem onClick={() => handleUserAction('profile')}>
                      Profile
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => handleUserAction('admin')}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleUserAction('logout')}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="relative p-1 rounded-lg bg-gradient-to-r from-white via-white to-blue-100 shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLoginOpen(true)}
                    className="text-gray-700 hover:bg-blue-50 flex items-center relative z-10"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Login Portal</span>
                  </Button>
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-blue-200 opacity-40 rounded-lg animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          {/* Far Right: Theme Toggle - Always on right edge */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-white hover:bg-white/20"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header
        className="sticky z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-header"
        style={{
          top: showTopbar ? `${topbarHeight}px` : '0',
          transition: 'top 0.3s ease-in-out'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-2 sm:px-4 md:px-6 flex h-14 sm:h-16 items-center justify-between gap-1 sm:gap-2 md:gap-4 max-w-full">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 min-w-0 flex-1 md:flex-none"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={nitLogo}
              alt="NIT Logo"
              className="h-8 sm:h-10 md:h-12 w-auto flex-shrink-0"
            />
            <div className="hidden sm:block min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-foreground leading-tight">
                <span className="hidden lg:inline">नालंदा प्रौद्योगिकी संस्थान, भुवनेश्वर</span>
                <span className="lg:hidden">Nalanda</span>
              </h1>
              <div className="hidden md:block border-t border-muted-foreground/30 my-1"></div>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground hidden md:block leading-tight">
                <span className="hidden lg:inline">Nalanda Institute of Technology</span>
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-foreground leading-tight">
                नालंदा प्रौद्योगिकी संस्थान, भुवनेश्वर
              </h1>
              <div className="border-t border-muted-foreground/30 my-1"></div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                Nalanda Institute of Technology
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/"
                    className="px-2 py-2 text-xs font-medium hover:text-primary transition-colors"
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs">Academics</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[100]">
                    <div className="w-80 p-4 bg-popover border border-border shadow-lg rounded-xl">
                      <div className="grid gap-2">
                        {academicsSubMenu.map((item) => (
                          <NavigationMenuLink
                            key={item.title}
                            href={item.href}
                            className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                          >
                            {item.title}
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs">Campus Life</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[100]">
                    <div className="w-80 p-4 bg-popover border border-border shadow-lg rounded-xl max-h-96 overflow-y-auto scrollbar-hide">
                      <div className="grid gap-2">
                        {campusLifeSubMenu.map((item) => (
                          <NavigationMenuLink
                            key={item.title}
                            href={item.href}
                            className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                          >
                            {item.title}
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs">About Us</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[100]">
                    <div className="w-80 p-4 bg-popover border border-border shadow-lg rounded-xl">
                      <div className="grid gap-2">
                        {aboutUsSubMenu.map((item) => (
                          <div key={item.title}>
                            <NavigationMenuLink
                              href={item.href}
                              className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors font-medium"
                            >
                              {item.title}
                            </NavigationMenuLink>
                            {item.subItems && (
                              <div className="ml-4 mt-1 space-y-1">
                                {item.subItems.map((subItem) => (
                                  <NavigationMenuLink
                                    key={subItem.title}
                                    href={subItem.href}
                                    className="block px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {subItem.title}
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>

                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs">Training & Placement</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[100]">
                    <div className="w-80 p-4 bg-popover border border-border shadow-lg rounded-xl">
                      <div className="grid gap-2">
                        {trainingPlacementSubMenu.map((item) => (
                          <NavigationMenuLink
                            key={item.title}
                            href={item.href}
                            className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                          >
                            {item.title}
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/research"
                    className="px-2 py-2 text-xs font-medium hover:text-primary transition-colors"
                  >
                    Research
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-xs">Departments</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[100]">
                    {departmentHierarchy.length > 0 ? (
                      <HierarchicalDepartmentMenu hierarchy={departmentHierarchy} />
                    ) : (
                      <div className="w-80 p-4 bg-popover border border-border shadow-lg rounded-xl">
                        <div className="grid gap-2">
                          {departmentsSubMenu.map((item) => (
                            <NavigationMenuLink
                              key={item.title}
                              href={item.href}
                              className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                            >
                              {item.title}
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className="px-2 py-2 text-xs font-medium hover:text-primary transition-colors flex items-center whitespace-nowrap"
                  >
                    Contact Us
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and Mobile Menu Toggle (theme moved to top bar) */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            {/* Desktop Search Button */}
            <Button size="icon" variant="ghost" className="hidden xl:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="xl:hidden flex-shrink-0 p-0.5 sm:p-1"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden flex-shrink-0 p-0.5 sm:p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-3 space-y-1 max-h-screen overflow-y-auto">
              <a href="/" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Home
              </a>

              {/* Academics Section */}
              <div className="border-b border-border/50">
                <button
                  onClick={() => toggleMobileSection('academics')}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Academics
                  <ChevronRight className={`h-4 w-4 transition-transform ${openMobileSection === 'academics' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'academics' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 pb-2 space-y-1"
                  >
                    {academicsSubMenu.map((item) => (
                      <a key={item.title} href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                        {item.title}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* About Us Section */}
              <div className="border-b border-border/50">
                <button
                  onClick={() => toggleMobileSection('about')}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  About Us
                  <ChevronRight className={`h-4 w-4 transition-transform ${openMobileSection === 'about' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 pb-2 space-y-1"
                  >
                    {aboutUsSubMenu.map((item) => (
                      <div key={item.title}>
                        <a href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                          {item.title}
                        </a>
                        {item.subItems && (
                          <div className="ml-4 space-y-1">
                            {item.subItems.map((subItem) => (
                              <a key={subItem.title} href={subItem.href} className="block py-1 text-xs text-muted-foreground hover:text-foreground">
                                {subItem.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Training & Placement Section */}
              <div className="border-b border-border/50">
                <button
                  onClick={() => toggleMobileSection('training')}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Training & Placement
                  <ChevronRight className={`h-4 w-4 transition-transform ${openMobileSection === 'training' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'training' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 pb-2 space-y-1"
                  >
                    {trainingPlacementSubMenu.map((item) => (
                      <a key={item.title} href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                        {item.title}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Research Section */}
              <div className="border-b border-border/50">
                <a href="/research" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                  Research
                </a>
              </div>

              {/* Departments Section */}
              <div className="border-b border-border/50">
                <button
                  onClick={() => toggleMobileSection('departments')}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Departments
                  <ChevronRight className={`h-4 w-4 transition-transform ${openMobileSection === 'departments' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'departments' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 pb-2 space-y-1"
                  >
                    {departmentHierarchy.length > 0 ? (
                      <MobileHierarchicalMenu hierarchy={departmentHierarchy} />
                    ) : (
                      <>
                        {departmentsSubMenu.map((item) => (
                          <a key={item.title} href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                            {item.title}
                          </a>
                        ))}
                      </>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Campus Life Section */}
              <div className="border-b border-border/50">
                <button
                  onClick={() => toggleMobileSection('campus')}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Campus Life
                  <ChevronRight className={`h-4 w-4 transition-transform ${openMobileSection === 'campus' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'campus' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 pb-2 space-y-1"
                  >
                    {campusLifeSubMenu.map((item) => (
                      <a key={item.title} href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                        {item.title}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Contact Us Section */}
              <div className="border-b border-border/50">
                <button
                  onClick={() => toggleMobileSection('contact')}
                  className="w-full flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Contact Us
                  <ChevronRight className={`h-4 w-4 transition-transform ${openMobileSection === 'contact' ? 'rotate-90' : ''}`} />
                </button>
                {openMobileSection === 'contact' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 pb-2 space-y-1"
                  >
                    {contactUsSubMenu.map((item) => (
                      <a key={item.title} href={item.href} className="block py-1 text-sm text-muted-foreground hover:text-foreground">
                        {item.title}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      <LoginPortal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;