import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  GraduationCap,
  Users,
  BookOpen,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Admissions", path: "/admissions" },
    { name: "Campus Life", path: "/campus-life" },
    { name: "Research", path: "/research" },
    { name: "Alumni", path: "/alumni" }
  ];

  const academicLinks = [
    { name: "Departments", path: "/departments" },
    { name: "Faculty", path: "/faculty" },
    { name: "Library", path: "/library" },
    { name: "Academic Calendar", path: "/calendar" },
    { name: "Examination", path: "/examination" },
    { name: "Results", path: "/results" }
  ];

  const studentLinks = [
    { name: "Student Portal", path: "/student-portal" },
    { name: "Hostel", path: "/hostel" },
    { name: "Clubs & Activities", path: "/clubs" },
    { name: "Sports", path: "/sports" },
    { name: "Placement", path: "/placement" },
    { name: "Scholarships", path: "/scholarships" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/share/1AG6TvcnQi/" },
    { name: "Twitter", icon: Twitter, href: "https://x.com/NALANDABHUBANE1?t=yZjipw--Sqys2lqrCzzNew&s=09" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/nalandabbsr?igsh=MXJ0Nm1rNGp4Y3U5dw==" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/nalanda-institute-of-technology-bhubaneswar/" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@nalandabhubaneswar4971?si=4Y4sfKUoXeyYvIl6" }
  ];

  return (
    <footer className="bg-card border-t">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* College Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Nalanda Institute</h3>
                <p className="text-sm text-muted-foreground">of Technology</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Leading the future of academic excellence with innovative programs, world-class faculty,
              and cutting-edge research facilities. Empowering students to become tomorrow's leaders.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="https://www.google.com/maps/dir//Nalanda+Institute+of+Technology+Buddhist+Villa,+Khandagiri+-+Chandaka+Rd,+Bhubaneswar,+Odisha+754012/@20.3659638,85.6785819,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3a19060462635441:0x2697f0bcc78c2240!2m2!1d85.7609836!2d20.3659831?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  Nalanda Institute of Technology Buddhist Villa, Chandaka, Bhubaneswar, Odisha 751024
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+918249791801"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  +91 8249791801
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@thenalanda.com"
                  className="text-muted-foreground hover:text-primary transition-smooth"
                >
                  info@thenalanda.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0"
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-smooth text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Academics</h4>
            <ul className="space-y-3">
              {academicLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-smooth text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Student Life</h4>
            <ul className="space-y-3">
              {studentLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-smooth text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-semibold text-lg mb-2">Stay Updated</h4>
              <p className="text-muted-foreground text-sm">
                Subscribe to our newsletter for latest updates and announcements
              </p>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your email"
                className="flex-1"
                type="email"
              />
              <Button className="btn-academic-primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Achievements Banner */}
        <div className="mt-8 pt-8 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Award className="w-5 h-5 text-academic-gold" />
              <div>
                <div className="font-semibold text-primary">NAAC A+</div>
                <div className="text-xs text-muted-foreground">Accredited</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-primary">15,000+</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <GraduationCap className="w-5 h-5 text-academic-green" />
              <div>
                <div className="font-semibold text-primary">50,000+</div>
                <div className="text-xs text-muted-foreground">Alumni</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold text-primary">150+</div>
                <div className="text-xs text-muted-foreground">Programs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-1">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © 2024 Nalanda Institute of Technology. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground text-center md:text-left">
                Designed and Managed by{' '}
                <a
                  href="https://www.logisaar.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  LogiSaar
                </a>
              </p>
            </div>
            <div className="flex space-x-4 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-smooth">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-smooth">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-muted-foreground hover:text-primary transition-smooth">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;