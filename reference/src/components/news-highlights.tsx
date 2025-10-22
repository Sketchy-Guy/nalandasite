import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  category: string;
  author?: string;
  image_url?: string;
  external_url?: string;
  is_featured: boolean;
  is_breaking: boolean;
  publish_date?: string;
  created_at: string;
}

const NewsHighlights = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'achievement':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'event':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'announcement':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'research':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest News & Highlights
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return null;
  }

  const featuredNews = news.filter(item => item.is_featured).slice(0, 1);
  const regularNews = news.filter(item => !item.is_featured).slice(0, 5);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest News & Highlights
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest achievements, events, and announcements from NIT Nalanda
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured News */}
          {featuredNews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300">
                {featuredNews[0].image_url && (
                  <div className="h-64 lg:h-80 relative overflow-hidden">
                    <img 
                      src={featuredNews[0].image_url} 
                      alt={featuredNews[0].title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {featuredNews[0].is_breaking && (
                        <Badge className="bg-red-500 text-white animate-pulse">
                          BREAKING
                        </Badge>
                      )}
                      <Badge className={getCategoryColor(featuredNews[0].category)}>
                        {featuredNews[0].category}
                      </Badge>
                    </div>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(featuredNews[0].publish_date || featuredNews[0].created_at)}
                    {featuredNews[0].author && (
                      <>
                        <span className="mx-2">•</span>
                        <span>By {featuredNews[0].author}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {featuredNews[0].title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {featuredNews[0].summary || featuredNews[0].content}
                  </p>
                  <Button 
                    className="group"
                    onClick={() => {
                      if (featuredNews[0].external_url) {
                        window.open(featuredNews[0].external_url, '_blank');
                      }
                    }}
                  >
                    Read Full Story
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Regular News List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={featuredNews.length > 0 ? "" : "lg:col-span-3"}
          >
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Recent Updates</h3>
              {regularNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-card transition-all duration-300 cursor-pointer group"
                        onClick={() => {
                          if (item.external_url) {
                            window.open(item.external_url, '_blank');
                          }
                        }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.publish_date || item.created_at)}
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.summary || item.content}
                      </p>
                      {item.external_url && (
                        <div className="flex items-center text-primary text-sm font-medium">
                          <span>Read more</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              <Button variant="outline" className="w-full">
                View All News
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsHighlights;