import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Award, ExternalLink, CheckCircle } from "lucide-react";

const NAAC = () => {
  const { data: naacInfo } = useQuery({
    queryKey: ['naac-accreditation'],
    queryFn: async () => {
      const { data } = await supabase
        .from('accreditation_info')
        .select('*')
        .eq('accreditation_type', 'naac')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  const naacCriteria = [
    {
      title: "Curricular Aspects",
      description: "Academic programs, curriculum design, and implementation",
      score: "3.5/4.0"
    },
    {
      title: "Teaching-Learning and Evaluation",
      description: "Teaching methodologies, student assessment, and learning outcomes",
      score: "3.6/4.0"
    },
    {
      title: "Research, Innovation and Extension",
      description: "Research activities, innovation initiatives, and community engagement",
      score: "3.4/4.0"
    },
    {
      title: "Infrastructure and Learning Resources",
      description: "Physical infrastructure, library resources, and ICT facilities",
      score: "3.7/4.0"
    },
    {
      title: "Student Support and Progression",
      description: "Student services, career guidance, and progression tracking",
      score: "3.5/4.0"
    },
    {
      title: "Governance, Leadership and Management",
      description: "Institutional governance, leadership quality, and management practices",
      score: "3.6/4.0"
    },
    {
      title: "Institutional Values and Best Practices",
      description: "Core values, ethics, and institutional best practices",
      score: "3.8/4.0"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-foreground/20 p-4 rounded-full">
                <Star className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              NAAC A+ Accreditation
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              National Assessment and Accreditation Council
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Overview */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center items-center mb-4">
                  <Award className="h-12 w-12 text-primary mr-4" />
                  <div>
                    <h2 className="text-3xl font-bold">Grade A+ Achievement</h2>
                    <p className="text-primary font-semibold">
                      {naacInfo?.grade_rating || "CGPA: 3.58/4.0"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed text-center">
                  {naacInfo?.description || `
                    The National Institute of Technology Nalanda has been awarded the prestigious NAAC A+ grade, 
                    recognizing our commitment to excellence in higher education. This accreditation validates 
                    our quality standards in teaching, research, infrastructure, and overall institutional management.
                  `}
                </p>
              </div>
              
              {naacInfo?.validity_period && (
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Valid Period: {naacInfo.validity_period}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seven Criteria Assessment */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Seven Criteria Assessment</h3>
            
            <div className="grid gap-6">
              {naacCriteria.map((criteria, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <CheckCircle className="h-6 w-6 text-primary mr-3" />
                          <h4 className="text-lg font-bold text-foreground">
                            Criteria {index + 1}: {criteria.title}
                          </h4>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {criteria.description}
                        </p>
                      </div>
                      <div className="ml-6 text-right">
                        <div className="bg-primary/10 px-3 py-1 rounded-full">
                          <span className="text-primary font-bold text-sm">
                            {criteria.score}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Strengths */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-primary">Key Strengths</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Star className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Excellent faculty-student ratio and qualified teaching staff</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Modern infrastructure and well-equipped laboratories</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Strong industry connections and placement support</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Robust research and innovation ecosystem</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Comprehensive student support services</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-primary">Benefits of NAAC A+</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Recognition of quality education standards</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Enhanced credibility with students and employers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Eligibility for government funding and grants</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">International recognition and collaboration opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <span className="text-muted-foreground">Continuous improvement framework</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Plan */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6">Continuous Improvement Action Plan</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">Academic Excellence</h4>
                  <p className="text-sm text-muted-foreground">
                    Enhance curriculum and teaching methodologies based on NAAC recommendations
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-semibold mb-2">Infrastructure Development</h4>
                  <p className="text-sm text-muted-foreground">
                    Continue upgrading facilities and learning resources
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">Quality Assurance</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintain and exceed quality standards through regular monitoring
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate and Documentation */}
          {naacInfo?.certificate_url && (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Official Documentation</h3>
                <p className="text-muted-foreground mb-6">
                  Access our official NAAC accreditation certificate and related documents.
                </p>
                <Button asChild size="lg">
                  <a href={naacInfo.certificate_url} target="_blank" rel="noopener noreferrer">
                    View NAAC Certificate <ExternalLink className="h-5 w-5 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NAAC;