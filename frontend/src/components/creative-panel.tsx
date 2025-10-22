import { useState, useEffect } from "react";
import { Palette, Camera, Music, Pen, ChevronRight, Heart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { StudentSubmissionForm } from "@/components/student-submission-form";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface CreativeWork {
  id: string;
  title: string;
  author_name: string;
  author_department: string;
  category: string;
  description: string;
  image_url?: string;
  is_featured: boolean;
}

const CreativePanel = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [creativeWorks, setCreativeWorks] = useState<CreativeWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  useEffect(() => {
    fetchCreativeWorks();
  }, []);

  const fetchCreativeWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('student_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our interface
      const transformedWorks = data?.map(work => ({
        id: work.id,
        title: work.title,
        author_name: work.user_id, // This will be enhanced with profile data later
        author_department: work.department || 'Unknown Department',
        category: work.category,
        description: work.description || '',
        image_url: work.image_url,
        is_featured: work.is_featured
      })) || [];

      setCreativeWorks(transformedWorks);
    } catch (error) {
      console.error('Error fetching creative works:', error);
      // Fallback to empty array if there's an error
      setCreativeWorks([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All", icon: Palette },
    { id: "Digital Art", name: "Digital Art", icon: Palette },
    { id: "Photography", name: "Photography", icon: Camera },
    { id: "Music Composition", name: "Music", icon: Music },
    { id: "Writing", name: "Writing", icon: Pen }
  ];

  const filteredWorks = activeCategory === "all" 
    ? creativeWorks 
    : creativeWorks.filter(work => work.category === activeCategory);

  const featuredWorks = creativeWorks.filter(work => work.is_featured);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Palette className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl lg:text-4xl font-bold heading-academic">
              Student Creativity Hub
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcasing the artistic talents and creative expressions of our brilliant students
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="transition-smooth"
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Featured Showcase */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-semibold mb-6">Featured Creations</h3>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading creative works...</p>
              </div>
            ) : filteredWorks.length === 0 ? (
              <div className="text-center py-8">
                <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Creative Works Yet</h3>
                <p className="text-muted-foreground">
                  Be the first to submit your creative work to the community!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorks.slice(0, 6).map((work, index) => (
                <Card 
                  key={work.id} 
                  className="group overflow-hidden shadow-card hover:shadow-elegant transition-smooth cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/40 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Palette className="w-12 h-12 text-primary/60" />
                    </div>
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2" />
                        <span className="text-sm">View Details</span>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {work.is_featured && (
                      <Badge className="absolute top-3 left-3 bg-academic-gold text-white">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg leading-tight">{work.title}</h4>
                        <p className="text-sm text-muted-foreground">by {work.author_name}</p>
                        <p className="text-xs text-muted-foreground">{work.author_department}</p>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {work.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {work.category}
                        </Badge>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          {work.image_url && (
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}

            {!loading && filteredWorks.length > 0 && (
              <div className="text-center mt-8">
                <Button className="btn-academic-primary">
                  Explore All Creations
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar - Top Creators & Recent */}
          <div className="space-y-6">
            {/* Top Creators */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Creators</h3>
              <div className="space-y-3">
                {[
                  { name: "Aditi Sharma", works: 12, likes: 1456 },
                  { name: "Maya Singh", works: 8, likes: 1203 },
                  { name: "Raj Patel", works: 6, likes: 987 },
                  { name: "Vikash Joshi", works: 5, likes: 834 }
                ].map((creator, index) => (
                  <Card key={index} className="card-gradient hover:shadow-card transition-smooth">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{creator.name}</h4>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{creator.works} works</span>
                            <span>•</span>
                            <span>{creator.likes} likes</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Creative Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-4">This Month</h3>
              <div className="grid grid-cols-2 gap-3">
                <Card className="card-gradient text-center">
                  <CardContent className="p-4">
                    <div className="text-xl font-bold text-primary">147</div>
                    <div className="text-xs text-muted-foreground">New Works</div>
                  </CardContent>
                </Card>
                <Card className="card-gradient text-center">
                  <CardContent className="p-4">
                    <div className="text-xl font-bold text-academic-gold">89</div>
                    <div className="text-xs text-muted-foreground">Creators</div>
                  </CardContent>
                </Card>
                <Card className="card-gradient text-center">
                  <CardContent className="p-4">
                    <div className="text-xl font-bold text-academic-green">12K</div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </CardContent>
                </Card>
                <Card className="card-gradient text-center">
                  <CardContent className="p-4">
                    <div className="text-xl font-bold text-primary">3.2K</div>
                    <div className="text-xs text-muted-foreground">Likes</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full btn-academic-secondary"
              onClick={() => user ? setIsSubmissionFormOpen(true) : toast("Please login to submit your work")}
            >
              Submit Your Work
            </Button>
            
            <StudentSubmissionForm 
              isOpen={isSubmissionFormOpen} 
              onClose={() => {
                setIsSubmissionFormOpen(false);
                fetchCreativeWorks(); // Refresh works after submission
              }} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativePanel;