import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Palette, Sparkles, Plus, Instagram, Youtube, ExternalLink, Play, Camera, Music, Pen, ChevronRight, TrendingUp, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { StudentSubmissionForm } from "./student-submission-form";

interface CreativeWork {
  id: string;
  title: string;
  author_name: string;
  author_department: string;
  category: string;
  description: string;
  image_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  is_featured: boolean;
  source: 'submission' | 'creative_work';
}

const CreativePanel = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  // Utility functions for social media URL handling
  const extractInstagramId = (url: string) => {
    if (!url || typeof url !== 'string') return null;
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/tv\/([A-Za-z0-9_-]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const extractYouTubeId = (url: string) => {
    if (!url || typeof url !== 'string') return null;
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([A-Za-z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([A-Za-z0-9_-]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const handleSocialMediaClick = (work: CreativeWork) => {
    // Prioritize Instagram if both are available
    if (work.instagram_url) {
      window.open(work.instagram_url, '_blank');
    } else if (work.youtube_url) {
      window.open(work.youtube_url, '_blank');
    }
  };

  // Fetch approved student submissions for the creative panel
  const { data: approvedSubmissions = [], isLoading: loadingSubmissions, refetch: refetchSubmissions } = useQuery({
    queryKey: ['student-submissions', 'approved'],
    queryFn: async () => {
      const response = await api.studentSubmissions.approved();
      return response;
    },
  });

  // Fetch creative works (manually curated gallery items)
  const { data: creativeWorks = [], isLoading: loadingCreativeWorks, refetch: refetchCreativeWorks } = useQuery({
    queryKey: ['creative-works'],
    queryFn: async () => {
      const response = await api.creativeWorks.list({ is_active: true });
      return response.results || response;
    },
  });

  // Combine both data sources for display
  const allWorks = [
    ...approvedSubmissions.map((submission: any) => ({
      id: submission.id,
      title: submission.title,
      author_name: submission.user_name || 'Unknown',
      author_department: submission.department || 'Unknown Department',
      category: submission.category,
      description: submission.description || '',
      image_url: submission.image_url,
      instagram_url: submission.instagram_url,
      youtube_url: submission.youtube_url,
      is_featured: submission.is_featured,
      source: 'submission' as const
    })),
    ...creativeWorks.map((work: any) => ({
      id: work.id,
      title: work.title,
      author_name: work.author_name,
      author_department: work.author_department || 'Unknown Department',
      category: work.category,
      description: work.description || '',
      image_url: work.image_url,
      instagram_url: work.instagram_url,
      youtube_url: work.youtube_url,
      is_featured: work.is_featured,
      source: 'creative_work' as const
    }))
  ].sort((a, b) => {
    // Sort by featured first, then by creation date (newest first)
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });

  const loading = loadingSubmissions || loadingCreativeWorks;

  const refetchAll = () => {
    refetchSubmissions();
    refetchCreativeWorks();
  };

  const categories = [
    { id: "all", name: "All", icon: Palette },
    { id: "Digital Art", name: "Digital Art", icon: Palette },
    { id: "Photography", name: "Photography", icon: Camera },
    { id: "Music Composition", name: "Music", icon: Music },
    { id: "Writing", name: "Writing", icon: Pen }
  ];

  const filteredWorks = activeCategory === "all" 
    ? allWorks 
    : allWorks.filter(work => work.category === activeCategory);

  const featuredWorks = allWorks.filter(work => work.is_featured);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Student Creativity Hub</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Showcase Your Talent
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and celebrate the creative excellence of our student community
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveCategory(category.id)}
                className={`
                  group transition-all duration-300
                  ${isActive ? 'shadow-lg scale-105' : 'hover:scale-105'}
                `}
              >
                <IconComponent className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                {category.name}
              </Button>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Featured Showcase */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Featured Creations</h3>
              <Badge variant="outline" className="text-sm">
                {filteredWorks.length} Works
              </Badge>
            </div>
            
            {loading ? (
              <div className="text-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Sparkles className="h-12 w-12 text-primary" />
                </motion.div>
                <p className="text-muted-foreground mt-4">Loading creative works...</p>
              </div>
            ) : filteredWorks.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="text-center py-16">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Palette className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">No Creative Works Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to submit your creative work to the community!
                  </p>
                  <Button 
                    onClick={() => user ? setIsSubmissionFormOpen(true) : toast("Please login to submit your work")}
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Submit Your Work
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorks.slice(0, 9).map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full border-2 hover:border-primary/50">
                    {/* Enhanced Media Section */}
                    <div 
                      className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/30"
                      onClick={() => handleSocialMediaClick(work)}
                    >
                      {/* Social Media Preview */}
                      {work.instagram_url || work.youtube_url ? (
                        <div className="relative w-full h-full">
                          {/* Instagram Preview - Prioritized */}
                          {work.instagram_url && (
                            <>
                              {(() => {
                                const instagramId = extractInstagramId(work.instagram_url);
                                return instagramId ? (
                                  <div className="w-full h-full relative">
                                    <iframe
                                      src={`https://www.instagram.com/p/${instagramId}/embed/`}
                                      title="Instagram post preview"
                                      className="w-full h-full border-0 pointer-events-none"
                                      frameBorder="0"
                                      scrolling="no"
                                    />
                                    {/* Play overlay for Instagram */}
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="bg-white/90 rounded-full p-3">
                                        <Instagram className="w-8 h-8 text-pink-600" />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
                                    <div className="text-white text-center">
                                      <Instagram className="h-16 w-16 mx-auto mb-2" />
                                      <p className="text-sm font-medium">Instagram Content</p>
                                      <p className="text-xs opacity-75">Click to view</p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </>
                          )}

                          {/* YouTube Preview - If no Instagram */}
                          {!work.instagram_url && work.youtube_url && (
                            <>
                              {(() => {
                                const youtubeId = extractYouTubeId(work.youtube_url);
                                return youtubeId ? (
                                  <div className="w-full h-full relative">
                                    <img
                                      src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                                      alt={work.title}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      onError={(e) => {
                                        e.currentTarget.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                                      }}
                                    />
                                    {/* Play overlay for YouTube */}
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="bg-white/90 rounded-full p-3">
                                        <Youtube className="w-8 h-8 text-red-600" />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
                                    <div className="text-white text-center">
                                      <Youtube className="h-16 w-16 mx-auto mb-2" />
                                      <p className="text-sm font-medium">YouTube Content</p>
                                      <p className="text-xs opacity-75">Click to view</p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </>
                          )}
                        </div>
                      ) : work.image_url ? (
                        /* Fallback to regular image */
                        <img 
                          src={work.image_url} 
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        /* Default placeholder */
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Palette className="w-16 h-16 text-primary/40 group-hover:rotate-12 transition-transform" />
                        </div>
                      )}

                      {/* Social Media Type Indicator */}
                      {(work.instagram_url || work.youtube_url) && (
                        <div className="absolute top-3 right-3 flex gap-1">
                          {work.instagram_url && (
                            <Badge variant="secondary" className="bg-pink-600 text-white">
                              <Instagram className="w-3 h-3" />
                            </Badge>
                          )}
                          {work.youtube_url && (
                            <Badge variant="secondary" className="bg-red-600 text-white">
                              <Youtube className="w-3 h-3" />
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Featured Badge */}
                      {work.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}

                      {/* Enhanced Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                        <Button size="sm" variant="secondary" className="gap-2">
                          {work.instagram_url || work.youtube_url ? (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              Open {work.instagram_url ? 'Instagram' : 'YouTube'}
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              View Details
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-5">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                            {work.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">by {work.author_name}</p>
                          <p className="text-xs text-muted-foreground/70">{work.author_department}</p>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {work.description}
                        </p>

                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="secondary" className="text-xs font-medium">
                            {work.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
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

          {/* Sidebar - Top Creators & Stats */}
          <div className="space-y-6">
            {/* Submit Work CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 border-2 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/20 mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Share Your Talent</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit your creative work and inspire others
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
                    onClick={() => user ? setIsSubmissionFormOpen(true) : toast("Please login to submit your work")}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Submit Your Work
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Creators */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">Top Creators</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Aditi Sharma", works: 12, likes: 1456 },
                      { name: "Maya Singh", works: 8, likes: 1203 },
                      { name: "Raj Patel", works: 6, likes: 987 },
                      { name: "Vikash Joshi", works: 5, likes: 834 }
                    ].map((creator, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                          ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' : ''}
                          ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' : ''}
                          ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' : ''}
                          ${index === 3 ? 'bg-primary/20 text-primary' : ''}
                        `}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{creator.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{creator.works} works</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-current text-red-500" />
                              {creator.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Creative Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold mb-4">This Month</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">147</div>
                      <div className="text-xs text-muted-foreground mt-1">New Works</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 text-center">
                      <div className="text-2xl font-bold text-yellow-600">89</div>
                      <div className="text-xs text-muted-foreground mt-1">Creators</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 text-center">
                      <div className="text-2xl font-bold text-green-600">12K</div>
                      <div className="text-xs text-muted-foreground mt-1">Views</div>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-red-500/10 to-pink-500/5 border border-red-500/20 text-center">
                      <div className="text-2xl font-bold text-red-600">3.2K</div>
                      <div className="text-xs text-muted-foreground mt-1">Likes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Submission Form Dialog - Outside grid for proper overlay */}
      <StudentSubmissionForm 
        isOpen={isSubmissionFormOpen} 
        onClose={() => {
          setIsSubmissionFormOpen(false);
          refetchAll(); // Refresh works after submission
        }} 
      />
    </section>
  );
};

export default CreativePanel;