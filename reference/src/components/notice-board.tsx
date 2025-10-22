import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
}

const NoticeBoard = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentNotice, setCurrentNotice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notices.length > 1) {
      const timer = setInterval(() => {
        setCurrentNotice((prev) => (prev + 1) % notices.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [notices.length]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'sports':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'financial':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'facility':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
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
              Latest Notices & Updates
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="animate-pulse h-64 bg-muted"></Card>
            <Card className="animate-pulse h-64 bg-muted"></Card>
          </div>
        </div>
      </section>
    );
  }

  if (notices.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Notices Available</h2>
            <p className="text-muted-foreground">Check back later for updates and announcements.</p>
          </div>
        </div>
      </section>
    );
  }

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
            Latest Notices & Updates
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay informed with the latest announcements and important updates
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Notice */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full shadow-elegant hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Featured Notice</h3>
                  <div className="flex items-center space-x-2">
                    {notices[currentNotice]?.is_new && (
                      <Badge className="bg-red-500 text-white animate-pulse-glow">
                        NEW
                      </Badge>
                    )}
                    <Badge className={getPriorityColor(notices[currentNotice]?.priority || 'medium')}>
                      {notices[currentNotice]?.priority}
                    </Badge>
                  </div>
                </div>

                <motion.div
                  key={currentNotice}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h4 className="text-lg font-semibold text-foreground line-clamp-2">
                    {notices[currentNotice]?.title}
                  </h4>
                  <p className="text-muted-foreground line-clamp-3">
                    {notices[currentNotice]?.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(notices[currentNotice]?.created_at || '')}
                      </div>
                      <Badge variant="outline" className={getCategoryColor(notices[currentNotice]?.category || '')}>
                        {notices[currentNotice]?.category}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      Read More
                    </Button>
                  </div>
                </motion.div>

                {/* Navigation for featured notice */}
                {notices.length > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentNotice((prev) => (prev - 1 + notices.length) % notices.length)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex space-x-1">
                      {notices.slice(0, 5).map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentNotice === index ? 'bg-primary' : 'bg-muted'
                          }`}
                          onClick={() => setCurrentNotice(index)}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentNotice((prev) => (prev + 1) % notices.length)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Notices List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full shadow-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Recent Notices</h3>
                <div className="space-y-4">
                  {notices.slice(0, 4).map((notice, index) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-primary pl-4 py-2 hover:bg-muted/50 transition-colors rounded-r-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground line-clamp-1 mb-1">
                            {notice.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {notice.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notice.created_at)}
                            </span>
                            <Badge variant="outline" className={getCategoryColor(notice.category)}>
                              {notice.category}
                            </Badge>
                          </div>
                        </div>
                        {notice.is_new && (
                          <Badge className="bg-red-500 text-white ml-2">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <Button className="w-full mt-6" variant="outline">
                  View All Notices
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NoticeBoard;