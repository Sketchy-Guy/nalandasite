import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Search, User, CreditCard, ChevronDown, LogOut } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut, isAdmin } = useAuth();

  const academicsSubMenu = [
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
    { title: "Wellness Community Centre", href: "/campus-life/wellness" },
    { title: "Hostel Life", href: "/campus-life/hostel" },
    { title: "Student Governance", href: "/campus-life/governance" },
    { title: "Women's Forum", href: "/campus-life/womens-forum" },
    { title: "Sports", href: "/campus-life/sports" },
    { title: "Clubs", href: "/campus-life/clubs" },
    { title: "Technology & Innovation", href: "/campus-life/innovation" },
    { title: "Student Activities", href: "/campus-life/activities" },
    { title: "Social Consciousness", href: "/campus-life/social" },
    { title: "Campus Festivals", href: "/campus-life/festivals" },
    { title: "Campus Publications", href: "/campus-life/publications" },
    { title: "Campus Amenities", href: "/campus-life/amenities" },
    { title: "Other Facilities", href: "/campus-life/facilities" }
  ];

  const aboutUsSubMenu = [
    { title: "About Us", href: "/about" },
    { title: "Vision & Mission", href: "/about/vision-mission" },
    { title: "Awards & Achievements", href: "/about/awards" },
    { title: "Accreditation", href: "/about/accreditation", 
      subItems: [
        { title: "NAAC A+", href: "/about/accreditation/naac" },
        { title: "NBA", href: "/about/accreditation/nba" },
        { title: "SIRO", href: "/about/accreditation/siro" }
      ]
    },
    { title: "Atal Incubation Center (10 CR Grant)", href: "/about/atal-incubation" },
    { title: "SISS-Startup India (8 CR Grants)", href: "/about/siss-startup" },
    { title: "MSME-Best Business Incubator", href: "/about/msme" }
  ];

  const departmentsSubMenu = [
    { title: "Computer Science & Engineering", href: "/departments/cse" },
    { title: "Information Technology", href: "/departments/it" },
    { title: "Master of Computer Applications", href: "/departments/mca" },
    { title: "Bachelor of Computer Applications", href: "/departments/bca" },
    { title: "Mechanical Engineering", href: "/departments/mechanical" },
    { title: "Electrical Engineering", href: "/departments/electrical" },
    { title: "Civil Engineering", href: "/departments/civil" },
    { title: "Master of Business Administration", href: "/departments/mba" }
  ];

  const feesSubMenu = [
    { title: "Registration Fees", href: "/fees/registration" },
    { title: "College Dues", href: "/fees/dues" }
  ];

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
  <div className="topbar text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div />

          {/* Right side: Fees Payment + User Menu */}
          <div className="flex items-center space-x-3">
            {/* Fees Payment - moved next to login */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Fees Payment
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border border-border shadow-lg z-50">
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
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{`Welcome, ${user.email?.split('@')[0]}`}</span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg z-50">
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-white hover:bg-white/20 flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Login Portal</span>
                </Button>
              )}
            </div>
            {/* Theme Toggle - placed after login */}
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
      </div>

      {/* Main Header */}
      <motion.header 
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 min-w-0 flex-1 md:flex-none"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src={nitLogo} 
              alt="NIT Logo" 
              className="h-10 w-10 flex-shrink-0"
            />
            <div className="hidden sm:block min-w-0">
              <h1 className="text-base lg:text-lg font-bold text-foreground leading-tight">
                <span className="hidden lg:inline">Nalanda Institute of Technology</span>
                <span className="lg:hidden">NIT Nalanda</span>
              </h1>
              <p className="text-xs text-muted-foreground">Excellence in Education</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-foreground">NIT</h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/" 
                    className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm">Academics</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-50">
                    <div className="w-80 p-4 bg-popover border border-border shadow-lg">
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
                  <NavigationMenuTrigger className="text-sm">Campus Life</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-50">
                    <div className="w-80 p-4 bg-popover border border-border shadow-lg max-h-96 overflow-y-auto">
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
                  <NavigationMenuTrigger className="text-sm">About Us</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-50">
                    <div className="w-80 p-4 bg-popover border border-border shadow-lg">
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
                  <NavigationMenuTrigger className="text-sm">Departments</NavigationMenuTrigger>
                  <NavigationMenuContent className="z-50">
                    <div className="w-80 p-4 bg-popover border border-border shadow-lg">
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
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/contact" 
                    className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center whitespace-nowrap"
                  >
                    Contact Us
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and Mobile Menu Toggle (theme moved to top bar) */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="hidden xl:flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search..."
                className="w-48"
              />
              <Button size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            <div className="container mx-auto px-4 py-4 space-y-2">
              <a href="/" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Home
              </a>
              <div className="space-y-1">
                <div className="font-medium text-sm">Academics</div>
                <div className="ml-4 space-y-1">
                  <a href="/academics/timetable" className="block py-1 text-sm text-muted-foreground hover:text-foreground">Timetable</a>
                  <a href="/academics/fees" className="block py-1 text-sm text-muted-foreground hover:text-foreground">Fees</a>
                </div>
              </div>
              <a href="/departments" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Departments
              </a>
              <a href="/contact" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </motion.header>

      <LoginPortal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;