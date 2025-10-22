import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Eye, Star, Clock, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  submitted_at: string;
  reviewed_at?: string;
  review_comments?: string;
  user_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export function SubmissionsManager() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewComments, setReviewComments] = useState("");
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('student_submissions')
        .select(`
          *,
          profiles!student_submissions_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data as Submission[]) || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (submission: Submission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission);
    setReviewAction(action);
    setIsFeatured(false);
    setReviewComments("");
    setReviewDialog(true);
  };

  const submitReview = async () => {
    if (!selectedSubmission) return;

    try {
      const { error } = await supabase
        .from('student_submissions')
        .update({
          status: reviewAction,
          is_featured: reviewAction === 'approve' ? isFeatured : false,
          review_comments: reviewComments,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      toast.success(`Submission ${reviewAction}d successfully`);
      setReviewDialog(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Error reviewing submission:', error);
      toast.error('Failed to review submission');
    }
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
              <span className="font-medium">{submission.profiles?.full_name || 'Unknown'}</span>
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

        <div className="flex items-center gap-2">
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
          <div className="grid gap-4">
            {approvedSubmissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid gap-4">
            {rejectedSubmissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission
            </DialogTitle>
            <DialogDescription>
              {selectedSubmission?.title} by {selectedSubmission?.profiles?.full_name}
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