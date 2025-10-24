import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Eye, Star, Clock, FileText, Sparkles, Instagram, Youtube, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  image_url?: string;
  file_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  submitted_at: string;
  reviewed_at?: string;
  review_comments?: string;
  user_name?: string;
  user_email?: string;
}

export function SubmissionsManager() {
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [previewDialog, setPreviewDialog] = useState(false);

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
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewComments, setReviewComments] = useState("");
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [isFeatured, setIsFeatured] = useState(false);

  // Fetch all submissions
  const { data: submissions = [], isLoading: loading } = useQuery({
    queryKey: ['student-submissions'],
    queryFn: async () => {
      const response = await api.studentSubmissions.list();
      return response.results || response;
    },
  });

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ id, action, is_featured, review_comments }: {
      id: string;
      action: 'approve' | 'reject';
      is_featured: boolean;
      review_comments: string;
    }) => {
      return await api.studentSubmissions.review(id, {
        action,
        is_featured: action === 'approve' ? is_featured : false,
        review_comments
      });
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['student-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['student-submissions', 'approved'] });
      queryClient.invalidateQueries({ queryKey: ['creative-works'] });
      
      toast.success(`Submission ${reviewAction}d successfully`);
      setReviewDialog(false);
    },
    onError: (error: any) => {
      console.error('Error reviewing submission:', error);
      toast.error('Failed to review submission');
    }
  });

  const handleReview = (submission: Submission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    setReviewAction(action);
    setIsFeatured(false);
    setReviewComments("");
    setReviewDialog(true);
  };

  const submitReview = async () => {
    if (!selectedSubmission) return;

    reviewMutation.mutate({
      id: selectedSubmission.id,
      action: reviewAction,
      is_featured: isFeatured,
      review_comments: reviewComments
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const SubmissionCard = ({ submission }: { submission: Submission }) => (
    <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden group">
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl group-hover:text-primary transition-colors truncate">
              {submission.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span className="font-medium">{submission.user_name || 'Unknown'}</span>
              <span>•</span>
              <span className="truncate">{submission.department}</span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <Badge className={`${getStatusColor(submission.status)} capitalize font-semibold`}>
              {submission.status}
            </Badge>
            {submission.is_featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Category: {submission.category}</span>
          <span>•</span>
          <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
        </div>
        
        {submission.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {submission.description}
          </p>
        )}

        {/* Enhanced Content Preview Section */}
        <div className="space-y-3">
          {/* Social Media Content */}
          {(submission.instagram_url || submission.youtube_url) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Social Media Content:</h4>
              <div className="flex gap-2">
                {submission.instagram_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setPreviewDialog(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </Button>
                )}
                {submission.youtube_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setPreviewDialog(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Youtube className="h-4 w-4 text-red-600" />
                    YouTube
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* File Content */}
          {(submission.image_url || submission.file_url) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Uploaded Files:</h4>
              <div className="flex gap-2">
                {submission.image_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(submission.image_url, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Image
                  </Button>
                )}
                {submission.file_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(submission.file_url, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View File
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Preview All Button */}
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              setSelectedSubmission(submission);
              setPreviewDialog(true);
            }}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            Full Preview
          </Button>
        </div>

        {submission.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleReview(submission, 'approve')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleReview(submission, 'reject')}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        {submission.review_comments && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Review Comments:</strong> {submission.review_comments}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading submissions...</h2>
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');


  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 p-8 border-2 border-primary/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 mb-6 shadow-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold tracking-wide">STUDENT CREATIVITY HUB</span>
          </div>
          
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Submissions Manager
          </h2>
          
          <div className="space-y-3 text-muted-foreground">
            <p className="text-lg font-medium">
              Review, approve, and showcase exceptional student creative work
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Approve Quality Work</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Feature Best Submissions</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur">
                <Eye className="w-4 h-4 text-blue-500" />
                <span>Public Gallery Display</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-bl-full" />
            <CardContent className="p-6 text-center relative z-10">
              <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <div className="text-4xl font-bold text-yellow-600 mb-1">{pendingSubmissions.length}</div>
              <div className="text-sm font-medium text-muted-foreground">Pending Review</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-bl-full" />
            <CardContent className="p-6 text-center relative z-10">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <div className="text-4xl font-bold text-green-600 mb-1">{approvedSubmissions.length}</div>
              <div className="text-sm font-medium text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="relative overflow-hidden border-2 hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/10 rounded-bl-full" />
            <CardContent className="p-6 text-center relative z-10">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <div className="text-4xl font-bold text-red-600 mb-1">{rejectedSubmissions.length}</div>
              <div className="text-sm font-medium text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Pending Submissions</h3>
                <p className="text-muted-foreground">All submissions have been reviewed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingSubmissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedSubmissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Approved Submissions</h3>
                <p className="text-muted-foreground">
                  {submissions.length === 0 
                    ? "No submissions have been received yet."
                    : "No submissions have been approved yet. Check the pending tab to review submissions."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {approvedSubmissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedSubmissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Rejected Submissions</h3>
                <p className="text-muted-foreground">
                  {submissions.length === 0 
                    ? "No submissions have been received yet."
                    : "No submissions have been rejected."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {rejectedSubmissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Enhanced Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Submission Preview: {selectedSubmission?.title}
            </DialogTitle>
            <DialogDescription>
              By {selectedSubmission?.user_name} • {selectedSubmission?.department} • {selectedSubmission?.category}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                  <Badge className={`${getStatusColor(selectedSubmission.status)} capitalize`}>
                    {selectedSubmission.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Submitted</h4>
                  <p className="text-sm">{new Date(selectedSubmission.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Description */}
              {selectedSubmission.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedSubmission.description}
                  </p>
                </div>
              )}

              {/* Social Media Previews */}
              {(selectedSubmission.instagram_url || selectedSubmission.youtube_url) && (
                <div className="space-y-4">
                  <h4 className="font-medium">Social Media Content</h4>
                  
                  {/* Instagram Preview - Prioritized */}
                  {selectedSubmission.instagram_url && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-5 w-5 text-pink-600" />
                        <span className="font-medium">Instagram Content</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedSubmission.instagram_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open Original
                        </Button>
                      </div>
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        {(() => {
                          const instagramId = extractInstagramId(selectedSubmission.instagram_url!);
                          return instagramId ? (
                            <iframe
                              src={`https://www.instagram.com/p/${instagramId}/embed/`}
                              title="Instagram post preview"
                              className="w-full h-full border-0"
                              frameBorder="0"
                              scrolling="no"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
                              <div className="text-white text-center">
                                <Instagram className="h-12 w-12 mx-auto mb-2" />
                                <p className="text-sm">Instagram Content</p>
                                <p className="text-xs opacity-75">Preview not available</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* YouTube Preview */}
                  {selectedSubmission.youtube_url && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-600" />
                        <span className="font-medium">YouTube Content</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedSubmission.youtube_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Open Original
                        </Button>
                      </div>
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        {(() => {
                          const youtubeId = extractYouTubeId(selectedSubmission.youtube_url!);
                          return youtubeId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${youtubeId}`}
                              title="YouTube video preview"
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <div className="text-center text-muted-foreground">
                                <Youtube className="h-12 w-12 mx-auto mb-2" />
                                <p className="text-sm">YouTube Content</p>
                                <p className="text-xs">Preview not available</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* File Previews */}
              {(selectedSubmission.image_url || selectedSubmission.file_url) && (
                <div className="space-y-4">
                  <h4 className="font-medium">Uploaded Files</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSubmission.image_url && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Cover Image</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(selectedSubmission.image_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View Full
                          </Button>
                        </div>
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={selectedSubmission.image_url} 
                            alt="Submission preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {selectedSubmission.file_url && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Content File</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(selectedSubmission.file_url, '_blank')}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                        <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">File Available</p>
                            <p className="text-xs">Click download to view</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Review Comments */}
              {selectedSubmission.review_comments && (
                <div>
                  <h4 className="font-medium mb-2">Review Comments</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedSubmission.review_comments}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setPreviewDialog(false);
                      handleReview(selectedSubmission, 'approve');
                    }}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setPreviewDialog(false);
                      handleReview(selectedSubmission, 'reject');
                    }}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission
            </DialogTitle>
            <DialogDescription>
              {selectedSubmission?.title} by {selectedSubmission?.user_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {reviewAction === 'approve' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Feature this submission?</label>
                <Select value={isFeatured.toString()} onValueChange={(value) => setIsFeatured(value === 'true')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No, regular approval</SelectItem>
                    <SelectItem value="true">Yes, feature on homepage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Review Comments (optional)</label>
              <Textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Add comments for the student..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReviewDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={submitReview}
                className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                variant={reviewAction === 'reject' ? 'destructive' : 'default'}
              >
                {reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}