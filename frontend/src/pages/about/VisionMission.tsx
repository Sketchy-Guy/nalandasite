import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Users, Lightbulb } from "lucide-react";

const VisionMission = () => {
  const { data: visionMission } = useQuery({
    queryKey: ['vision-mission'],
    queryFn: async () => {
      const { data } = await supabase
        .from('about_pages')
        .select('*')
        .eq('page_type', 'vision-mission')
        .eq('is_active', true)
        .single();
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vision & Mission
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Guiding Principles for Excellence in Education
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Vision */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-8">
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 mr-4" />
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
              </div>
              <div className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To be a globally recognized institute of excellence in technical education, research, and innovation, 
                  fostering an environment that nurtures creative minds and produces world-class engineers and technologists 
                  who contribute significantly to society and the nation's technological advancement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground p-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 mr-4" />
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">Educational Excellence</h3>
                    <p className="text-muted-foreground mb-4">
                      To provide quality technical education through innovative curriculum, 
                      modern teaching methodologies, and state-of-the-art infrastructure.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">Research & Innovation</h3>
                    <p className="text-muted-foreground mb-4">
                      To promote cutting-edge research and innovation that addresses 
                      contemporary challenges and contributes to technological advancement.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">Industry Collaboration</h3>
                    <p className="text-muted-foreground mb-4">
                      To foster strong partnerships with industry and research organizations 
                      for mutual growth and development.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">Social Responsibility</h3>
                    <p className="text-muted-foreground mb-4">
                      To develop socially conscious engineers who contribute to 
                      sustainable development and social welfare.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Values */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold">Our Core Values</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Excellence</h3>
                  <p className="text-muted-foreground">
                    Striving for the highest standards in all our endeavors.
                  </p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Integrity</h3>
                  <p className="text-muted-foreground">
                    Maintaining ethical practices and transparency in all activities.
                  </p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-primary">Innovation</h3>
                  <p className="text-muted-foreground">
                    Encouraging creative thinking and technological advancement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;