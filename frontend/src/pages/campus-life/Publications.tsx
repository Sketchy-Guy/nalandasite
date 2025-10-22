import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Download, Calendar, User, FileText, Newspaper, Book, Users, ExternalLink, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Publication {
  id: string;
  title: string;
  description: string;
  publication_type: string;
  issue_number?: string;
  publication_date?: string;
  cover_image_url?: string;
  file_url?: string;
  author?: string;
  department?: string;
  is_featured: boolean;
  is_active: boolean;
  download_count: number;
}

const Publications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('is_active', true)
        .order('publication_date', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPublicationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'magazine':
        return Book;
      case 'newsletter':
        return Newspaper;
      case 'journal':
        return BookOpen;
      case 'report':
        return FileText;
      default:
        return BookOpen;
    }
  };

  const getPublicationBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'magazine':
        return 'default';
      case 'newsletter':
        return 'secondary';
      case 'journal':
        return 'outline';
      case 'report':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = async (publication: Publication) => {
    if (!publication.file_url) return;
    
    try {
      // Increment download count
      await supabase
        .from('publications')
        .update({ download_count: publication.download_count + 1 })
        .eq('id', publication.id);
      
      // Trigger download
      window.open(publication.file_url, '_blank');
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  const featuredPublications = publications.filter(pub => pub.is_featured);
  const regularPublications = publications.filter(pub => !pub.is_featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">Campus Media</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Campus Publications
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore our rich collection of campus publications including magazines, newsletters, 
              journals, and reports. Stay connected with campus happenings and academic insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/activities">
                  <Calendar className="mr-2 h-4 w-4" />
                  Campus Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Student Clubs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Publications */}
      {featuredPublications.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary mr-3" />
                Featured Publications
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Highlighted publications showcasing the best of our campus content
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPublications.map((publication, index) => {
                const Icon = getPublicationIcon(publication.publication_type);
                return (
                  <motion.div
                    key={publication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="group hover:shadow-xl transition-all hover:border-primary/20">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <Badge variant={getPublicationBadgeColor(publication.publication_type)}>
                                {publication.publication_type}
                              </Badge>
                              <Badge variant="outline" className="ml-2">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl line-clamp-2">{publication.title}</CardTitle>
                        {publication.description && (
                          <CardDescription className="line-clamp-3">{publication.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex">
                          {publication.cover_image_url && (
                            <div className="w-24 h-32 rounded-lg overflow-hidden bg-muted mr-4 flex-shrink-0">
                              <img 
                                src={publication.cover_image_url} 
                                alt={publication.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1 space-y-2 text-sm">
                            {publication.issue_number && (
                              <div className="flex items-center text-muted-foreground">
                                <FileText className="h-4 w-4 mr-2" />
                                Issue {publication.issue_number}
                              </div>
                            )}
                            {publication.publication_date && (
                              <div className="flex items-center text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                {formatDate(publication.publication_date)}
                              </div>
                            )}
                            {publication.author && (
                              <div className="flex items-center text-muted-foreground">
                                <User className="h-4 w-4 mr-2" />
                                {publication.author}
                                {publication.department && ` - ${publication.department}`}
                              </div>
                            )}
                            <div className="flex items-center text-muted-foreground">
                              <Download className="h-4 w-4 mr-2" />
                              {publication.download_count} downloads
                            </div>
                          </div>
                        </div>

                        {publication.file_url && (
                          <Button 
                            className="w-full" 
                            onClick={() => handleDownload(publication)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Publication
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Regular Publications */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">All Publications</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our complete collection of campus publications
            </p>
          </motion.div>

          {regularPublications.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Publications Available</h3>
              <p className="text-muted-foreground">
                Campus publications will be available soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPublications.map((publication, index) => {
                const Icon = getPublicationIcon(publication.publication_type);
                return (
                  <motion.div
                    key={publication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Badge variant={getPublicationBadgeColor(publication.publication_type)}>
                            {publication.publication_type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{publication.title}</CardTitle>
                        {publication.description && (
                          <CardDescription className="line-clamp-2">
                            {publication.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          {publication.publication_date && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(publication.publication_date)}
                            </div>
                          )}
                          {publication.author && (
                            <div className="flex items-center text-muted-foreground">
                              <User className="h-4 w-4 mr-2" />
                              {publication.author}
                            </div>
                          )}
                          <div className="flex items-center text-muted-foreground">
                            <Download className="h-4 w-4 mr-2" />
                            {publication.download_count} downloads
                          </div>
                        </div>

                        {publication.file_url && (
                          <Button 
                            size="sm" 
                            className="w-full" 
                            onClick={() => handleDownload(publication)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Stay Informed & Engaged</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Keep up with campus news, academic insights, and student achievements 
              through our diverse range of publications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/activities">
                  <Calendar className="mr-2 h-4 w-4" />
                  Campus Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Student Organizations
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Publications;