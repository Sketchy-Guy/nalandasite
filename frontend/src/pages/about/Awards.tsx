import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Medal, Star } from "lucide-react";

const Awards = () => {
  const { data: awards } = useQuery({
    queryKey: ['awards-achievements'],
    queryFn: async () => {
      const { data } = await supabase
        .from('awards_achievements')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      return data || [];
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'institutional':
        return <Trophy className="h-6 w-6" />;
      case 'academic':
        return <Award className="h-6 w-6" />;
      case 'research':
        return <Star className="h-6 w-6" />;
      default:
        return <Medal className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'institutional':
        return 'bg-primary text-primary-foreground';
      case 'academic':
        return 'bg-secondary text-secondary-foreground';
      case 'research':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Awards & Achievements
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Recognition of Excellence and Innovation
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
              <Trophy className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Celebrating Excellence</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Our commitment to excellence has been recognized through various prestigious awards and 
                accreditations. These achievements reflect our dedication to quality education, research, 
                and contribution to society.
              </p>
            </CardContent>
          </Card>

          {/* Key Achievements */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-primary">NAAC A+</h3>
                <p className="text-muted-foreground">Highest grade in National Assessment and Accreditation</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-secondary">NBA Accredited</h3>
                <p className="text-muted-foreground">National Board of Accreditation recognition</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-accent">SIRO Recognition</h3>
                <p className="text-muted-foreground">Scientific and Industrial Research Organization</p>
              </CardContent>
            </Card>
          </div>

          {/* Awards List */}
          {awards && awards.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center mb-8">All Awards & Recognitions</h3>
              
              <div className="grid gap-6">
                {awards.map((award) => (
                  <Card key={award.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="md:flex">
                        {award.image_url && (
                          <div className="md:w-1/4 bg-gradient-to-br from-primary/5 to-primary/10">
                            <img 
                              src={award.image_url} 
                              alt={award.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className={award.image_url ? "md:w-3/4 p-8" : "p-8"}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <div className="text-primary mr-3">
                                {getCategoryIcon(award.category)}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-foreground mb-2">
                                  {award.title}
                                </h4>
                                <Badge className={getCategoryColor(award.category)}>
                                  {award.category.charAt(0).toUpperCase() + award.category.slice(1)}
                                </Badge>
                              </div>
                            </div>
                            
                            {award.award_date && (
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  {new Date(award.award_date).getFullYear()}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {award.description && (
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {award.description}
                            </p>
                          )}
                          
                          {award.certificate_url && (
                            <a 
                              href={award.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              View Certificate →
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Medal className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-muted-foreground">More Awards Coming Soon</h3>
                <p className="text-muted-foreground">
                  Our commitment to excellence continues, and more recognitions are on the way.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Awards;