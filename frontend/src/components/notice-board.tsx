import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/api';

interface Notice {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  is_new: boolean;
  is_active: boolean;
  is_featured: boolean;
  link?: string;
  created_at: string;
}

const NoticeBoard = () => {
  const [featuredNotices, setFeaturedNotices] = useState<Notice[]>([]);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [currentNotice, setCurrentNotice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      // Fetch featured notices for carousel
      const featuredResponse = await api.notices.list({
        is_active: true,
        is_featured: true,
        ordering: '-updated_at',  // Most recently updated first
        limit: 10
      });

      // Fetch recent notices for sidebar (all active notices, newest first)
      const recentResponse = await api.notices.list({
        is_active: true,
        ordering: '-updated_at',  // Most recently updated first
        limit: 8
      });

      // Fetch all notices for "View All" functionality
      const allResponse = await api.notices.list({
        is_active: true,
        ordering: '-updated_at',  // Most recently updated first
        limit: 50  // Get more notices for "View All"
      });

      const featuredData = Array.isArray(featuredResponse) ? featuredResponse : (featuredResponse.results || []);
      const recentData = Array.isArray(recentResponse) ? recentResponse : (recentResponse.results || []);
      const allData = Array.isArray(allResponse) ? allResponse : (allResponse.results || []);

      setFeaturedNotices(featuredData);
      setRecentNotices(recentData);
      setAllNotices(allData);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (featuredNotices.length > 1) {
      const timer = setInterval(() => {
        setCurrentNotice((prev) => (prev + 1) % featuredNotices.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [featuredNotices.length]);


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

  const handleNoticeClick = (notice: Notice) => {
    setSelectedNotice(notice);
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

  if (featuredNotices.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Featured Notices</h2>
            <p className="text-muted-foreground">No notices have been marked as featured yet. Check back later for important announcements.</p>
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
                    {featuredNotices[currentNotice]?.is_new && (
                      <Badge className="bg-red-500 text-white animate-pulse-glow">
                        NEW
                      </Badge>
                    )}
                    <Badge className={getPriorityColor(featuredNotices[currentNotice]?.priority || 'medium')}>
                      {featuredNotices[currentNotice]?.priority}
                    </Badge>
                  </div>
                </div>


                <motion.div
                  key={currentNotice}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4 cursor-pointer"
                  onClick={() => handleNoticeClick(featuredNotices[currentNotice])}
                >
                  <h4 className="text-lg font-semibold text-foreground line-clamp-2">
                    {featuredNotices[currentNotice]?.title}
                  </h4>
                  <p className="text-muted-foreground line-clamp-3">
                    {featuredNotices[currentNotice]?.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(featuredNotices[currentNotice]?.created_at || '')}
                      </div>
                      <Badge variant="outline" className={getCategoryColor(featuredNotices[currentNotice]?.category || '')}>
                        {featuredNotices[currentNotice]?.category}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNoticeClick(featuredNotices[currentNotice]);
                      }}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      View Details
                    </Button>
                  </div>
                </motion.div>

                {/* Navigation for featured notice */}
                {featuredNotices.length > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentNotice((prev) => (prev - 1 + featuredNotices.length) % featuredNotices.length)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex space-x-1">
                      {featuredNotices.slice(0, 5).map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${currentNotice === index ? 'bg-primary' : 'bg-muted'
                            }`}
                          onClick={() => setCurrentNotice(index)}
                        />
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentNotice((prev) => (prev + 1) % featuredNotices.length)}
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
                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                  {recentNotices.slice(0, 8).map((notice, index) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="border-l-4 border-primary pl-4 py-2 transition-colors rounded-r-lg hover:bg-muted/50 cursor-pointer hover:border-l-primary"
                      onClick={() => handleNoticeClick(notice)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground line-clamp-1">
                              {notice.title}
                            </h4>
                            {notice.link && (
                              <Badge variant="secondary" className="text-xs">
                                📎 Link
                              </Badge>
                            )}
                          </div>
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

                <Button
                  className="w-full mt-6"
                  variant="outline"
                  onClick={() => setShowAllNotices(true)}
                >
                  View All Notices ({allNotices.length})
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* View All Notices Modal */}
      <Dialog open={showAllNotices} onOpenChange={setShowAllNotices}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              All Notices ({allNotices.length})
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] space-y-4 pr-2">
            {allNotices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border rounded-lg p-4 transition-colors hover:bg-muted/50 cursor-pointer border-primary/20"
                onClick={() => handleNoticeClick(notice)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">
                        {notice.title}
                      </h4>
                      {notice.is_featured && (
                        <Badge className="bg-yellow-500 text-white text-xs">
                          ⭐ Featured
                        </Badge>
                      )}
                      {notice.is_new && (
                        <Badge className="bg-red-500 text-white text-xs">
                          NEW
                        </Badge>
                      )}
                      {notice.link && (
                        <Badge variant="secondary" className="text-xs">
                          📎 Link
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {notice.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(notice.created_at)}
                        </div>
                        <Badge variant="outline" className={getCategoryColor(notice.category)}>
                          {notice.category}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(notice.priority)}`}>
                          {notice.priority}
                        </Badge>
                      </div>

                      {notice.link && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Open Link
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notice Detail Dialog */}
      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notice Details
            </DialogTitle>
          </DialogHeader>

          {selectedNotice && (
            <div className="space-y-4">
              {/* Title and Badges */}
              <div>
                <div className="flex items-start gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-foreground flex-1">
                    {selectedNotice.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedNotice.is_featured && (
                      <Badge className="bg-yellow-500 text-white">
                        ⭐ Featured
                      </Badge>
                    )}
                    {selectedNotice.is_new && (
                      <Badge className="bg-red-500 text-white">
                        NEW
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(selectedNotice.created_at)}
                  </div>
                  <Badge variant="outline" className={getCategoryColor(selectedNotice.category)}>
                    {selectedNotice.category}
                  </Badge>
                  <Badge className={getPriorityColor(selectedNotice.priority)}>
                    {selectedNotice.priority} Priority
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedNotice.description}
                </p>
              </div>

              {/* Link Action */}
              {selectedNotice.link && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">This notice has an external link</span>
                    </div>
                    <Button
                      onClick={() => {
                        window.open(selectedNotice.link, '_blank', 'noopener,noreferrer');
                        setSelectedNotice(null);
                      }}
                      className="gap-2"
                    >
                      Open Link
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NoticeBoard;