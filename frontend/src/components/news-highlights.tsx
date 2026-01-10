import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, ArrowRight, FileText, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/api';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  author?: string;
  image_url?: string;
  external_link?: string;
  pdf_link?: string;
  tags?: string[];
  is_featured: boolean;
  is_breaking: boolean;
  is_active: boolean;
  publish_date?: string;
  published_date: string;
  created_at: string;
}

const NewsHighlights = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      // Fetch news from API
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const directResponse = await fetch(`${API_BASE_URL}/news/`);

      if (directResponse.ok) {
        const directData = await directResponse.json();

        // Extract results from paginated response
        const newsItems = directData.results || directData;

        // Filter active news and sort by published date
        const activeNews = newsItems.filter((item: NewsItem) => item.is_active)
          .sort((a: NewsItem, b: NewsItem) =>
            new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
          .slice(0, 6);
        setNews(activeNews);
      } else {
        const errorText = await directResponse.text();
        console.error('Failed to fetch news:', directResponse.status, errorText);
      }
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

  const openNewsModal = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const closeNewsModal = () => {
    setSelectedNews(null);
    setIsModalOpen(false);
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

  // Always show the section, even if no news

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
          {/* Show message when no news available */}
          {news.length === 0 && (
            <div className="lg:col-span-3 text-center py-12">
              <p className="text-muted-foreground text-lg">
                No news available at the moment. Check back soon for updates!
              </p>
            </div>
          )}
          {/* Featured News */}
          {featuredNews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300 cursor-pointer" onClick={() => openNewsModal(featuredNews[0])}>
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
                    {featuredNews[0].description || featuredNews[0].content}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {featuredNews[0].external_link && (
                      <Button
                        className="group"
                        asChild
                      >
                        <a href={featuredNews[0].external_link} target="_blank" rel="noopener noreferrer">
                          Read Full Story
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    )}
                    {featuredNews[0].pdf_link && (
                      <Button
                        variant="outline"
                        className="group bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white border-transparent shadow-lg"
                        asChild
                      >
                        <a href={featuredNews[0].pdf_link} target="_blank" rel="noopener noreferrer">
                          View PDF
                          <FileText className="h-4 w-4 ml-2 group-hover:scale-110 transition-transform" />
                        </a>
                      </Button>
                    )}
                  </div>
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
                  <Card className="hover:shadow-card transition-all duration-300 cursor-pointer" onClick={() => openNewsModal(item)}>
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
                        {item.description || item.content}
                      </p>
                      <div className="flex flex-col gap-2">
                        {item.external_link && (
                          <a
                            href={item.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-primary text-sm font-medium hover:underline cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Read more</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                        {item.pdf_link && (
                          <a
                            href={item.pdf_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>View PDF</span>
                            <FileText className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // For now, scroll to top of news section
                  document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View All News
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* News Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold pr-8">
                  {selectedNews.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* News Meta Information */}
                <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedNews.publish_date || selectedNews.created_at)}
                  </div>
                  {selectedNews.author && (
                    <div>By {selectedNews.author}</div>
                  )}
                  <Badge className={getCategoryColor(selectedNews.category)}>
                    {selectedNews.category}
                  </Badge>
                  {selectedNews.is_featured && (
                    <Badge className="bg-yellow-500">Featured</Badge>
                  )}
                  {selectedNews.is_breaking && (
                    <Badge variant="destructive">Breaking</Badge>
                  )}
                </div>

                {/* News Image */}
                {selectedNews.image_url && (
                  <div className="w-full">
                    <img
                      src={selectedNews.image_url}
                      alt={selectedNews.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* News Description */}
                {selectedNews.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedNews.description}
                    </p>
                  </div>
                )}

                {/* News Content */}
                {selectedNews.content && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Full Content</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedNews.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Links */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  {selectedNews.external_link && (
                    <Button asChild>
                      <a
                        href={selectedNews.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read Full Story
                      </a>
                    </Button>
                  )}
                  {selectedNews.pdf_link && (
                    <Button
                      variant="outline"
                      className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white border-transparent shadow-lg"
                      asChild
                    >
                      <a
                        href={selectedNews.pdf_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View PDF Document
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsHighlights;