import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Rocket, Users, Target, Award, Brain, Zap, Code } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface InnovationProject {
  id: string;
  title: string;
  author_name: string;
  author_department: string;
  description: string;
  category: string;
  image_url?: string;
  is_featured: boolean;
}

export default function Innovation() {
  const [projects, setProjects] = useState<InnovationProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInnovationProjects();
  }, []);

  const fetchInnovationProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('creative_works')
        .select('*')
        .eq('is_active', true)
        .in('category', ['innovation', 'technology', 'research', 'startup'])
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching innovation projects:', error);
      toast.error('Failed to load innovation projects');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'innovation': Lightbulb,
      'technology': Code,
      'research': Brain,
      'startup': Rocket,
    };
    const IconComponent = iconMap[category.toLowerCase()] || Lightbulb;
    return <IconComponent className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'innovation': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'technology': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'research': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'startup': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colorMap[category.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-full">
              <Lightbulb className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Innovation & Entrepreneurship
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fostering creativity, innovation, and entrepreneurial spirit among students. 
            Explore groundbreaking projects, research initiatives, and startup ventures from our talented community.
          </p>
        </div>

        {/* Innovation Pillars */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <CardTitle className="text-yellow-600 dark:text-yellow-400">Innovation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Creative solutions to real-world problems
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-800">
            <CardHeader>
              <Code className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-blue-600 dark:text-blue-400">Technology</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cutting-edge tech developments
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow border-purple-200 dark:border-purple-800">
            <CardHeader>
              <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <CardTitle className="text-purple-600 dark:text-purple-400">Research</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Scientific breakthroughs and discoveries
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
            <CardHeader>
              <Rocket className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-green-600 dark:text-green-400">Startups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Entrepreneurial ventures and business ideas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Innovation Showcase</h2>
            <p className="text-muted-foreground">
              Discover the latest innovations, research projects, and entrepreneurial ventures from our students.
            </p>
          </div>

          {projects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Innovation Projects Yet</h3>
                <p className="text-muted-foreground">
                  Innovation projects and research initiatives will be showcased here as they become available.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Featured Projects */}
              {projects.filter(p => p.is_featured).length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Award className="h-6 w-6 text-yellow-500" />
                    Featured Projects
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.filter(p => p.is_featured).map((project) => (
                      <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-yellow-200 dark:border-yellow-800">
                        {project.image_url && (
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                        
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                              {project.title}
                            </CardTitle>
                            <Badge className={`ml-2 ${getCategoryColor(project.category)} capitalize whitespace-nowrap flex items-center gap-1`}>
                              {getCategoryIcon(project.category)}
                              {project.category}
                            </Badge>
                          </div>
                          <CardDescription>
                            By {project.author_name} • {project.author_department}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground line-clamp-3">
                            {project.description}
                          </p>
                          <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                            View Project
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All Projects */}
              <div>
                <h3 className="text-2xl font-bold mb-6">All Innovation Projects</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.filter(p => !p.is_featured).map((project) => (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      {project.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                            {project.title}
                          </CardTitle>
                          <Badge className={`ml-2 ${getCategoryColor(project.category)} capitalize whitespace-nowrap flex items-center gap-1`}>
                            {getCategoryIcon(project.category)}
                            {project.category}
                          </Badge>
                        </div>
                        <CardDescription>
                          By {project.author_name} • {project.author_department}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-yellow-600 dark:text-yellow-400">Join the Innovation Community</CardTitle>
            <CardDescription>
              Have an innovative idea or project? Share it with the community!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Whether you're working on cutting-edge research, developing new technology, or starting your own venture, 
              we want to showcase your work and connect you with like-minded innovators.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                Submit Your Project
              </Button>
              <Button variant="outline" className="border-yellow-300 text-yellow-600 hover:bg-yellow-50">
                Join Innovation Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}