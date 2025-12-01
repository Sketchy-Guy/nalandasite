import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Users, Target, Eye, Building2, Lightbulb, Trophy } from "lucide-react";
import collegeImage from "@/assets/about us image.jpg";
import heroImage from "@/assets/aboutus hero.jpg";


const About = () => {
  const aboutQuickLinks = [
    { title: "Vision & Mission", link: "/about/vision-mission", icon: Target },
    { title: "Leadership Messages", link: "/about/chairman-message", icon: Users },
    { title: "Awards & Recognition", link: "/about/awards", icon: Award },
    { title: "Accreditation", link: "/about/accreditation", icon: Eye }
  ];

  const achievements = [
    "Odisha's first ATAL Incubation Centre established in 2019, supported by NITI Aayog, Govt of India with a Grant of ₹10 Crores",
    "Establishment of Nodal Centre of Research supported by BPUT, Govt of Odisha",
    "Accredited with NAAC A+ category institute",
    "Accredited with NBA for Mechanical and Electrical Engineering Departments",
    "Establishment of MSME Business Incubator supported by Ministry of MSME, Govt of India",
    "Recognized by SIRO, Dept. of Science & Technology, Govt of India",
    "Recognized by Startup India Seed Funds Scheme, supported by Ministry of Commerce, Govt of India with a Grant of ₹8 Crores",
    "Recognized by BPUT as Nodal Centre of Research in 2022",
    "Accredited with NAAC (A+) in 2023",
    "Accredited with NBA for Mechanical and Electrical Engineering Department in 2023",
    "Recognized as Business Incubator by MSME in 2023"
  ];

  return (
    <PageLayout
      heroTitle="About Nalanda Institute of Technology"
      heroSubtitle="Excellence in Technical Education and Innovation"
      heroDescription="A premier institution committed to fostering innovation, research, and developing globally competent professionals."
      heroImage={heroImage}
      heroBadge="About Us"
      heroHeight="large"
      heroChildren={
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            {/* <Link to="/about/vision-mission">
              <Target className="mr-2 h-4 w-4" />
              Our Vision
            </Link> */}
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20" asChild>
            {/* <Link to="/about/awards">
              <Award className="mr-2 h-4 w-4" />
              Awards & Recognition
            </Link> */}
          </Button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Institution Overview with Image */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-primary">Brief About the Institution</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed text-justify">
              <p>
                Nalanda Institute of Technology is located in Buddhist Villa, Chandaka, Bhubaneswar, Odisha-754005.
                It is a self-financing institution established in 2006 under the Balaji Educational Trust, Bhubaneswar.
              </p>
              <p>
                Offering a diverse range of programs including undergraduate and postgraduate degrees in Engineering & Technology,
                as well as MBA, MCA, and BSH courses, the institute is committed to providing quality education in the field of
                technical and management education.
              </p>
              <p>
                The institute is Accredited by NAAC with Grade A+, and recognised by NBA. It is also recognized by the Scientific
                and Industrial Research Organization (SIRO). It hosts an Atal Incubation Centre funded by NITI Aayog and an MSME
                Incubator, demonstrating its commitment to fostering innovation and entrepreneurship.
              </p>
              <p>
                Additionally, the institute holds recognition under 2(f) of UGC, further solidifying its status as a reputable
                educational institution. Approved by AICTE, New Delhi, and affiliated with Biju Patnaik University of Technology,
                Rourkela, Odisha, Nalanda Institute of Technology, Bhubaneswar stands as a beacon of academic excellence and
                innovation in the region.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src={collegeImage}
              alt="Nalanda Institute of Technology Campus"
              className="rounded-lg shadow-elegant w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Vision and Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed text-justify">
                To emerge as a next-generation university that blends knowledge, innovation, and industry engagement to create
                skilled, ethical and globally competent leaders for a sustainable future with unique and Flexible Curriculum,
                Advanced Research and Innovation for Holistic human development.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Our Mission</h3>
              <ul className="text-muted-foreground leading-relaxed space-y-3 text-justify">
                <li className="flex items-start">
                  <span className="text-primary mr-2">1.</span>
                  <span>To deliver outcome-based, industry-linked education across technical, professional, and vocational streams.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">2.</span>
                  <span>To foster research, innovation, and entrepreneurship through Centers of Excellence and real-world collaborations.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">3.</span>
                  <span>To equip students with 21st-century skills, integrity, and global competencies for inclusive growth.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">Our Achievements</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{achievement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-card">
          <CardContent className="p-8">
            <h3 className="text-3xl font-bold mb-8 text-center">Nalanda Institute of Technology at a Glance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">19+</div>
                <div className="text-muted-foreground font-medium">Years of Excellence</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">A+</div>
                <div className="text-muted-foreground font-medium">NAAC Grade</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">NBA</div>
                <div className="text-muted-foreground font-medium">Accredited</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">SIRO</div>
                <div className="text-muted-foreground font-medium">Recognized</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-card">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Explore More About Us</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {aboutQuickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.title} to={link.link} className="group">
                    <Card className="hover:shadow-lg transition-all hover:border-primary/20 group-hover:scale-105">
                      <CardContent className="p-6 text-center">
                        <Icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:text-primary/80 transition-colors" />
                        <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {link.title}
                        </h4>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default About;