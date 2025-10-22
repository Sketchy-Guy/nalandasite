import { Trophy, Medal, Award, ChevronRight, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ToppersBoard = () => {
  const toppers = [
    {
      id: 1,
      name: "Priya Sharma",
      department: "Computer Science Engineering",
      cgpa: "9.85",
      year: "2024",
      achievements: ["Gold Medalist", "Best Project Award"],
      image: "/api/placeholder/150/150",
      rank: 1
    },
    {
      id: 2,
      name: "Arjun Patel",
      department: "Electronics & Communication",
      cgpa: "9.78",
      year: "2024",
      achievements: ["Silver Medalist", "Research Excellence"],
      image: "/api/placeholder/150/150",
      rank: 2
    },
    {
      id: 3,
      name: "Ananya Singh",
      department: "Mechanical Engineering",
      cgpa: "9.72",
      year: "2024",
      achievements: ["Bronze Medalist", "Innovation Award"],
      image: "/api/placeholder/150/150",
      rank: 3
    }
  ];

  const recentToppers = [
    { name: "Rohit Kumar", department: "Civil Engineering", cgpa: "9.65", year: "2024" },
    { name: "Kavya Reddy", department: "Electrical Engineering", cgpa: "9.61", year: "2024" },
    { name: "Vikram Joshi", department: "Chemical Engineering", cgpa: "9.58", year: "2024" },
    { name: "Sneha Gupta", department: "Information Technology", cgpa: "9.55", year: "2024" }
  ];

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
                    {/* Student Image Placeholder */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-primary" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">{topper.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{topper.department}</p>
                    
                    <div className="space-y-3">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <div className="text-2xl font-bold text-primary">{topper.cgpa}</div>
                        <div className="text-xs text-muted-foreground">CGPA</div>
                      </div>

                      <div className="space-y-2">
                        {topper.achievements.map((achievement, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
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
              <Button className="btn-academic-primary">
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

            <Button variant="outline" className="w-full btn-academic-secondary">
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