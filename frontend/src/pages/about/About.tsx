import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/page-layout";
import { ContentWithImage } from "@/components/content-with-image";
import { DynamicGallery } from "@/components/dynamic-gallery";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Target, Eye } from "lucide-react";

const About = () => {
  const { data: aboutContent } = useQuery({
    queryKey: ['about-page'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about_pages')
        .select('*')
        .eq('page_type', 'about')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  const aboutQuickLinks = [
    { title: "Vision & Mission", link: "/about/vision-mission", icon: Target },
    { title: "Leadership Messages", link: "/about/chairman-message", icon: Users },
    { title: "Awards & Recognition", link: "/about/awards", icon: Award },
    { title: "Accreditation", link: "/about/accreditation", icon: Eye }
  ];

  return (
    <PageLayout
      heroTitle={aboutContent?.title || "About NIT Nalanda"}
      heroSubtitle="Excellence in Technical Education and Research"
      heroDescription="Discover our journey of innovation, excellence, and commitment to shaping future leaders in technology and engineering."
      heroImage={aboutContent?.image_url}
      heroBadge="About Us"
      heroHeight="large"
      heroChildren={
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/about/vision-mission">
              <Target className="mr-2 h-4 w-4" />
              Our Vision
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20" asChild>
            <Link to="/about/awards">
              <Award className="mr-2 h-4 w-4" />
              Awards & Recognition
            </Link>
          </Button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Institution Overview */}
        <ContentWithImage
          title="Our Institution"
          content={aboutContent?.content || `
            National Institute of Technology Nalanda stands as a beacon of excellence in technical education and research. 
            Established with the vision to nurture innovative engineers and entrepreneurs, we have been committed to 
            providing world-class education and fostering research that addresses real-world challenges.
            
            Our institution has grown to become a premier center of learning, fostering innovation and developing 
            globally competent professionals who contribute significantly to society and industry.
          `}
          imageUrl="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          imagePosition="right"
        />

        {/* Vision and Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be a globally recognized institute of excellence in technical education, research, and innovation, 
                contributing to the advancement of knowledge and society.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-primary">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide quality technical education, promote research and innovation, and develop competent 
                professionals who can address global challenges and contribute to societal development.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="shadow-card">
          <CardContent className="p-8">
            <h3 className="text-3xl font-bold mb-8 text-center">NIT Nalanda at a Glance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">17+</div>
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
              {aboutQuickLinks.map((link, index) => {
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

        {/* Photo Gallery */}
        <DynamicGallery
          category="about"
          title="Campus Gallery"
          className="shadow-card"
        />
      </div>
    </PageLayout>
  );
};

export default About;