import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Trophy, Medal, Award, GraduationCap, Filter, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import Header from "@/components/header";
import Footer from "@/components/footer";

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

const ToppersPage = () => {
  const [searchParams] = useSearchParams();
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Get filter type from URL params (all or recent)
  const filterType = searchParams.get('filter') || 'all';

  const fetchToppers = async () => {
    try {
      const response = await api.toppers.list({ page_size: 1000 });
      let filteredToppers = (response.results || [])
        .filter((topper: Topper) => topper.is_active);

      // Apply filter based on URL parameter
      if (filterType === 'recent') {
        // Show only toppers from the last 2 years (recent semester exams)
        const currentYear = new Date().getFullYear();
        filteredToppers = filteredToppers.filter((topper: Topper) =>
          topper.year >= currentYear - 1
        );
      }

      // Sort by year (desc) then rank (asc)
      filteredToppers.sort((a: Topper, b: Topper) => {
        if (a.year !== b.year) {
          return b.year - a.year;
        }
        return a.rank - b.rank;
      });

      setToppers(filteredToppers);
    } catch (error) {
      console.error('Error fetching toppers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToppers();
    // Scroll to top when component mounts or filter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filterType]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-academic-gold" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <GraduationCap className="w-6 h-6 text-primary" />;
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

  // Filter toppers based on selected filters
  const filteredToppers = toppers.filter(topper => {
    const yearMatch = selectedYear === "all" || topper.year.toString() === selectedYear;
    const deptMatch = selectedDepartment === "all" || topper.department === selectedDepartment;
    return yearMatch && deptMatch;
  });

  // Get unique years and departments for filters
  const availableYears = [...new Set(toppers.map(t => t.year))].sort((a, b) => b - a);
  const availableDepartments = [...new Set(toppers.map(t => t.department))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section with Video Background */}
        <section className="py-16 relative overflow-hidden">
          {/* Video Background */}
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/src/assets/nitdroneshot1.mp4" type="video/mp4" />
          </video>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-muted/15 to-muted/25 pointer-events-none"></div>

          {/* Glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
              <p className="mt-4 text-foreground drop-shadow-md">Loading toppers...</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Video Background */}
      <section className="py-16 relative overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/src/assets/nitdroneshot1.mp4" type="video/mp4" />
        </video>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-muted/15 to-muted/25 pointer-events-none"></div>

        {/* Glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-academic-gold mr-3" />
              <h1 className="text-4xl lg:text-5xl font-bold heading-academic text-foreground drop-shadow-lg">
                {filterType === 'recent' ? 'Recent Academic Achievers' : 'Academic Excellence Hall of Fame'}
              </h1>
            </div>
            <p className="text-lg text-foreground/90 max-w-3xl mx-auto drop-shadow-md">
              {filterType === 'recent'
                ? 'Celebrating our outstanding students from recent semester examinations'
                : 'Honoring our exceptional students who have achieved remarkable academic success from 2016 to 2025'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-16">

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <Users className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {availableDepartments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary">{filteredToppers.length}</div>
              <div className="text-sm text-muted-foreground">Total Toppers</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-academic-gold">
                {availableYears.length}
              </div>
              <div className="text-sm text-muted-foreground">Years Covered</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-academic-green">
                {filteredToppers.length > 0 ? (filteredToppers.reduce((sum, t) => sum + t.cgpa, 0) / filteredToppers.length).toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-muted-foreground">Average CGPA</div>
            </CardContent>
          </Card>
        </div>

        {/* Toppers Grid */}
        {filteredToppers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredToppers.map((topper, index) => (
              <Card
                key={topper.id}
                className="relative overflow-hidden shadow-elegant hover:shadow-lg transition-smooth animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Rank Badge */}
                <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${getRankColor(topper.rank)}`}>
                  {getRankIcon(topper.rank)}
                </div>

                <CardContent className="p-6 text-center">
                  {/* Student Image */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                    {topper.photo_url ? (
                      <img
                        src={topper.photo_url}
                        alt={topper.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-primary" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-2">{topper.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{topper.department}</p>

                  <div className="space-y-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="text-xl font-bold text-primary">{topper.cgpa}</div>
                      <div className="text-xs text-muted-foreground">CGPA</div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline" className="text-xs">
                        Rank {topper.rank}
                      </Badge>
                      <span className="text-muted-foreground">
                        {topper.year}
                      </span>
                    </div>

                    {topper.achievements && topper.achievements.length > 0 && (
                      <div className="space-y-1">
                        {topper.achievements.slice(0, 2).map((achievement, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs block">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No toppers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ToppersPage;
