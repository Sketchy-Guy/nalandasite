import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, Leaf, Globe, TrendingUp } from 'lucide-react';

interface SocialInitiative {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  start_date: string;
  end_date: string;
  impact_metrics: string;
  participants_count: number;
  organizer: string;
  status: string;
  gallery_images: string[];
  is_featured: boolean;
}

export default function SocialConsciousness() {
  const [initiatives, setInitiatives] = useState<SocialInitiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    const { data, error } = await supabase
      .from('social_initiatives')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching social initiatives:', error);
    } else {
      setInitiatives(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const featuredInitiatives = initiatives.filter(initiative => initiative.is_featured);
  const activeInitiatives = initiatives.filter(initiative => initiative.status === 'active');
  const completedInitiatives = initiatives.filter(initiative => initiative.status === 'completed');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'community_service':
        return <Heart className="h-6 w-6 text-red-500" />;
      case 'environment':
        return <Leaf className="h-6 w-6 text-green-500" />;
      case 'education':
        return <Globe className="h-6 w-6 text-blue-500" />;
      default:
        return <Users className="h-6 w-6 text-primary" />;
    }
  };

  const totalParticipants = initiatives.reduce((sum, initiative) => sum + (initiative.participants_count || 0), 0);
  const totalInitiatives = initiatives.length;
  const activeCount = activeInitiatives.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-green-500/20 to-blue-500/20 flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Social Consciousness</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Building a better world through community service, environmental initiatives, and social impact programs.
              Join us in making a difference in society.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Impact Statistics */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-primary">{totalParticipants.toLocaleString()}</h3>
              <p className="text-muted-foreground">Total Participants</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-green-500">{totalInitiatives}</h3>
              <p className="text-muted-foreground">Total Initiatives</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <Heart className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-red-500">{activeCount}</h3>
              <p className="text-muted-foreground">Active Programs</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <Globe className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold text-blue-500">5+</h3>
              <p className="text-muted-foreground">Communities Served</p>
            </Card>
          </div>
        </section>

        {/* Featured Initiatives */}
        {featuredInitiatives.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredInitiatives.map((initiative) => (
                <Card key={initiative.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {initiative.image_url && (
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${initiative.image_url})` }} />
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(initiative.category)}
                        <Badge variant="secondary">{initiative.category.replace('_', ' ')}</Badge>
                      </div>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <CardTitle className="text-lg">{initiative.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{initiative.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={initiative.status === 'active' ? 'default' : 'secondary'}>
                          {initiative.status}
                        </Badge>
                      </div>
                      
                      {initiative.participants_count > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Participants:</span>
                          <span className="font-medium">{initiative.participants_count}</span>
                        </div>
                      )}
                      
                      {initiative.organizer && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Organizer:</span>
                          <span className="font-medium">{initiative.organizer}</span>
                        </div>
                      )}
                    </div>

                    {initiative.impact_metrics && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium mb-1">Impact:</p>
                        <p className="text-sm text-muted-foreground">{initiative.impact_metrics}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Active Initiatives */}
        {activeInitiatives.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Active Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeInitiatives.map((initiative) => (
                <Card key={initiative.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {initiative.image_url && (
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${initiative.image_url})` }} />
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(initiative.category)}
                      <Badge variant="secondary">{initiative.category.replace('_', ' ')}</Badge>
                    </div>
                    <CardTitle className="text-lg">{initiative.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{initiative.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      {initiative.start_date && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Started:</span>
                          <span>{new Date(initiative.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {initiative.participants_count > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Participants:</span>
                          <span className="font-medium">{initiative.participants_count}</span>
                        </div>
                      )}
                    </div>

                    {initiative.impact_metrics && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium mb-1 text-green-800">Current Impact:</p>
                        <p className="text-sm text-green-700">{initiative.impact_metrics}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Completed Initiatives */}
        {completedInitiatives.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-center">Completed Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {completedInitiatives.slice(0, 8).map((initiative) => (
                <Card key={initiative.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {initiative.image_url && (
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${initiative.image_url})` }} />
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(initiative.category)}
                      <Badge variant="outline" className="text-xs">{initiative.category.replace('_', ' ')}</Badge>
                    </div>
                    <CardTitle className="text-sm">{initiative.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {initiative.impact_metrics && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{initiative.impact_metrics}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}