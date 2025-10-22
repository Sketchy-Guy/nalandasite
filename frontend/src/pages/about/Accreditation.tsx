import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Star, Award, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Accreditation = () => {
  const { data: accreditations } = useQuery({
    queryKey: ['accreditations'],
    queryFn: async () => {
      const { data } = await supabase
        .from('accreditation_info')
        .select('*')
        .eq('is_active', true)
        .order('accreditation_type');
      return data || [];
    }
  });

  const accreditationLinks = [
    {
      type: 'naac',
      title: 'NAAC A+ Details',
      path: '/about/accreditation/naac',
      icon: <Star className="h-6 w-6" />,
      color: 'bg-primary text-primary-foreground'
    },
    {
      type: 'nba',
      title: 'NBA Accreditation',
      path: '/about/accreditation/nba',
      icon: <Award className="h-6 w-6" />,
      color: 'bg-secondary text-secondary-foreground'
    },
    {
      type: 'siro',
      title: 'SIRO Recognition',
      path: '/about/accreditation/siro',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-accent text-accent-foreground'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Accreditation
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Quality Assurance & Recognition
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Introduction */}
          <Card className="mb-12">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Quality Assurance</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Our commitment to quality education is validated by prestigious accreditations and recognitions 
                from national and international bodies. These certifications ensure that our programs meet 
                the highest standards of educational excellence.
              </p>
            </CardContent>
          </Card>

          {/* Quick Access Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {accreditationLinks.map((link) => (
              <Link key={link.type} to={link.path}>
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${link.color}`}>
                      {link.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{link.title}</h3>
                    <Button variant="outline" size="sm" className="mt-4">
                      Learn More <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Accreditation Overview */}
          {accreditations && accreditations.length > 0 ? (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center mb-8">Our Accreditations</h3>
              
              {accreditations.map((accreditation) => (
                <Card key={accreditation.id} className="overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-2xl font-bold text-foreground mb-2">
                          {accreditation.title}
                        </h4>
                        {accreditation.grade_rating && (
                          <Badge className="mb-3">
                            Grade: {accreditation.grade_rating}
                          </Badge>
                        )}
                        {accreditation.validity_period && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Valid Period: {accreditation.validity_period}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-primary">
                        <Shield className="h-12 w-12" />
                      </div>
                    </div>
                    
                    {accreditation.description && (
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {accreditation.description}
                      </p>
                    )}
                    
                    {accreditation.benefits && (
                      <div className="bg-primary/5 p-4 rounded-lg mb-4">
                        <h5 className="font-semibold mb-2 text-primary">Benefits:</h5>
                        <p className="text-muted-foreground text-sm">
                          {accreditation.benefits}
                        </p>
                      </div>
                    )}
                    
                    {accreditation.certificate_url && (
                      <div className="pt-4">
                        <Button asChild variant="outline" size="sm">
                          <a href={accreditation.certificate_url} target="_blank" rel="noopener noreferrer">
                            View Certificate <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-muted-foreground">Accreditation Details</h3>
                <p className="text-muted-foreground mb-6">
                  Detailed accreditation information will be available here.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {accreditationLinks.map((link) => (
                    <Link key={link.type} to={link.path}>
                      <Button variant="outline" className="w-full">
                        {link.title}
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quality Assurance Framework */}
          <Card className="mt-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Quality Assurance Framework</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-primary">Continuous Improvement</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      <span className="text-muted-foreground">Regular curriculum updates based on industry needs</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      <span className="text-muted-foreground">Faculty development programs and training</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      <span className="text-muted-foreground">Student feedback integration in course design</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-primary">Assessment & Monitoring</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      <span className="text-muted-foreground">Annual self-assessment reports</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      <span className="text-muted-foreground">External peer review processes</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2"></div>
                      <span className="text-muted-foreground">Performance indicator tracking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Accreditation;