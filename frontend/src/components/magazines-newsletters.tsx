import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, ChevronRight, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface Magazine {
  id: string;
  title: string;
  description: string;
  cover_image?: string;
  cover_image_url?: string;
  file?: string;
  file_url?: string;
  download_url?: string;
  issue_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function MagazinesNewsletters() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const data = await api.magazines.list({ is_active: true });
      clearTimeout(timeoutId);
      
      // Sort by issue_date and limit to 6
      const sortedMagazines = (data.results || [])
        .sort((a, b) => new Date(b.issue_date || '').getTime() - new Date(a.issue_date || '').getTime())
        .slice(0, 6);
      setMagazines(sortedMagazines);
    } catch (error) {
      console.error('Error fetching magazines:', error);
      // Set empty array on error to prevent infinite loading
      setMagazines([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = useMemo(() => {
    return (dateStr: string) => {
      if (!dateStr) return 'No date';
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Magazines & Newsletters
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-64 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-48 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="h-64">
                  <div className="h-32 bg-muted rounded-t-lg"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-3 bg-muted rounded w-20"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded w-12"></div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Magazines & Newsletters
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with our latest publications, featuring campus news, achievements, and scholarly articles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {magazines.map((magazine, index) => (
            <motion.div
              key={magazine.id}
              initial={{ opacity: 0, x: -50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-[1.02] hover:-translate-y-1">
                <div className="relative">
                  {magazine.cover_image_url ? (
                    <img
                      src={magazine.cover_image_url}
                      alt={magazine.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-primary flex items-center justify-center">
                      <FileText className="h-12 w-12 text-white" />
                    </div>
                  )}
                  {index === 0 && (
                    <Badge className="absolute top-2 right-2 bg-primary text-white">
                      Latest
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {magazine.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {magazine.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(magazine.issue_date)}
                    </div>
                    <div className="flex gap-2">
                      {magazine.download_url && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => window.open(magazine.download_url, '_blank')}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                      {magazine.download_url && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => window.open(magazine.download_url, '_blank')}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white shadow-lg transition-shadow duration-200"
          >
            View All Publications
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}