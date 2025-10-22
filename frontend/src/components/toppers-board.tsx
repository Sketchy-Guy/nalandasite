import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Medal, Award, ChevronRight, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface Topper {
  id: string;
  name: string;
  department: string;
  cgpa: number;
  year: number;
  rank: number;
  achievements?: string[];
  photo_url?: string;
  is_active: boolean;
}

const ToppersBoard = () => {
  const navigate = useNavigate();
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [recentToppers, setRecentToppers] = useState<Topper[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchToppers = async () => {
    try {
      const response = await api.toppers.list();
      // Filter active toppers and sort by year (desc) then rank (asc)
      const activeToppers = (response.results || [])
        .filter((topper: Topper) => topper.is_active)
        .sort((a: Topper, b: Topper) => {
          if (a.year !== b.year) {
            return b.year - a.year; // Latest year first
          }
          return a.rank - b.rank; // Lower rank first (1, 2, 3...)
        });
      
      setToppers(activeToppers.slice(0, 3)); // Top 3 for featured section
      setRecentToppers(activeToppers.slice(3, 7)); // Ranks 4-7 for recent achievers
    } catch (error) {
      console.error('Error fetching toppers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToppers();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-8 h-8 text-academic-gold" />;
      case 2: return <Medal className="w-8 h-8 text-gray-400" />;
      case 3: return <Award className="w-8 h-8 text-orange-500" />;
      default: return <GraduationCap className="w-8 h-8 text-primary" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
      case 2: return "bg-gradient-to-br from-gray-300 to-gray-500 text-white";
      case 3: return "bg-gradient-to-br from-orange-400 to-orange-600 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-academic-gold mr-3" />
              <h2 className="text-3xl lg:text-4xl font-bold heading-academic">
                Academic Excellence
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading our outstanding students...
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6 text-center">
                      <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4"></div>
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-academic-gold mr-3" />
            <h2 className="text-3xl lg:text-4xl font-bold heading-academic">
              Academic Excellence
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrating our outstanding students who have achieved remarkable academic success
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Top 3 Toppers - Featured */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {toppers.map((topper) => (
                <Card 
                  key={topper.id} 
                  className={`relative overflow-hidden shadow-elegant hover:shadow-lg transition-smooth animate-fade-in-up`}
                  style={{ animationDelay: `${topper.rank * 0.2}s` }}
                >
                  {/* Rank Badge */}
                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(topper.rank)}`}>
                    {getRankIcon(topper.rank)}
                  </div>

                  <CardContent className="p-6 text-center">
                    {/* Student Image */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                      {topper.photo_url ? (
                        <img 
                          src={topper.photo_url} 
                          alt={topper.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <GraduationCap className="w-12 h-12 text-primary" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2">{topper.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{topper.department}</p>
                    
                    <div className="space-y-3">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">{topper.cgpa}</div>
                        <div className="text-xs text-muted-foreground">CGPA</div>
                      </div>

                      <div className="space-y-2">
                        {topper.achievements && topper.achievements.length > 0 ? (
                          topper.achievements.map((achievement, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Academic Excellence
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Class of {topper.year}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                className="btn-academic-primary"
                onClick={() => {
                  navigate('/academics/toppers');
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                }}
              >
                View All Toppers
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Recent Achievers - Side Panel */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 text-primary mr-2" />
              Recent Achievers
            </h3>
            
            <div className="space-y-3">
              {recentToppers.map((student, index) => (
                <Card key={index} className="card-gradient hover:shadow-card transition-smooth">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">
                          {index + 4}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{student.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{student.department}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-medium text-primary">
                            CGPA: {student.cgpa}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {student.year}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full btn-academic-secondary"
              onClick={() => {
                navigate('/academics/toppers?filter=recent');
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
              }}
            >
              View Complete List
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="card-gradient text-center shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">First Class</div>
            </CardContent>
          </Card>
          <Card className="card-gradient text-center shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-academic-gold">250+</div>
              <div className="text-sm text-muted-foreground">Gold Medals</div>
            </CardContent>
          </Card>
          <Card className="card-gradient text-center shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-academic-green">9.2</div>
              <div className="text-sm text-muted-foreground">Avg CGPA</div>
            </CardContent>
          </Card>
          <Card className="card-gradient text-center shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Pass Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ToppersBoard;