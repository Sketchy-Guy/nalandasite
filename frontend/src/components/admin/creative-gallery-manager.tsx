import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Plus, Edit, Trash2, Eye, Star, Image as ImageIcon, FileText, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface CreativeWork {
  id: string;
  title: string;
  description: string;
  author_name: string;
  author_department: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  image_url?: string;
  content_url?: string;
  created_at: string;
}

const categories = [
  "Art & Design",
  "Photography",
  "Poetry & Literature",
  "Music & Dance",
  "Digital Media",
  "Innovation & Projects",
  "Digital Art",
  "Music Composition",
  "Writing",
  "Other"
];

const departments = [
  "Computer Science & Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "MBA",
  "MCA",
  "BCA",
  "Other"
];

// SubmissionCard component for approved submissions
const SubmissionCard = ({ 
  submission, 
  onToggleFeatured, 
  onDelete 
}: { 
  submission: any; 
  onToggleFeatured: (submission: any) => void; 
  onDelete: (id: string) => void; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="group"
  >
    <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 overflow-hidden">
      {submission.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={submission.image_url} 
            alt={submission.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {submission.is_featured && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate text-lg">{submission.title}</CardTitle>
            <CardDescription className="truncate">
              {submission.user_name || 'Unknown'} • {submission.department} • {submission.category}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {submission.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{submission.description}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
          <span>•</span>
          <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onToggleFeatured(submission)}
            className={submission.is_featured ? 'border-yellow-500 text-yellow-600' : ''}
          >
            <Star className={`w-4 h-4 mr-1 ${submission.is_featured ? 'fill-yellow-500' : ''}`} />
            {submission.is_featured ? 'Unfeature' : 'Feature'}
          </Button>

          {(submission.instagram_url || submission.youtube_url) && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                if (submission.instagram_url) {
                  window.open(submission.instagram_url, '_blank');
                } else if (submission.youtube_url) {
                  window.open(submission.youtube_url, '_blank');
                }
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          )}

          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDelete(submission.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export function CreativeGalleryManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<CreativeWork | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author_name: "",
    author_department: "",
    category: "",
    is_featured: false,
    is_active: true,
    image_url: "",
    content_url: "",
    instagram_url: "",
    youtube_url: ""
  });

  // Fetch creative works (manually curated)
  const { data: works = [], isLoading: loading } = useQuery({
    queryKey: ['creative-works'],
    queryFn: async () => {
      const response = await api.creativeWorks.list();
      return response.results || response;
    },
  });

  // Fetch approved submissions
  const { data: approvedSubmissions = [], isLoading: loadingSubmissions } = useQuery({
    queryKey: ['student-submissions', 'approved'],
    queryFn: async () => {
      const response = await api.studentSubmissions.approved();
      return response;
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.creativeWorks.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creative-works'] });
      toast.success('Creative work added successfully');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error creating creative work:', error);
      toast.error('Failed to add creative work');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.creativeWorks.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creative-works'] });
      toast.success('Creative work updated successfully');
      setDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Error updating creative work:', error);
      toast.error('Failed to update creative work');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.creativeWorks.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creative-works'] });
      toast.success('Creative work deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting creative work:', error);
      toast.error('Failed to delete creative work');
    }
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      return await api.creativeWorks.patch(id, { is_featured });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['creative-works'] });
      toast.success(data.is_featured ? 'Added to featured' : 'Removed from featured');
    },
    onError: (error: any) => {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update featured status');
    }
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      return await api.creativeWorks.patch(id, { is_active });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['creative-works'] });
      toast.success(data.is_active ? 'Activated' : 'Deactivated');
    },
    onError: (error: any) => {
      console.error('Error toggling active:', error);
      toast.error('Failed to update active status');
    }
  });

  // Submission management mutations
  const toggleSubmissionFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      return await api.studentSubmissions.patch(id, { is_featured });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['student-submissions', 'approved'] });
      toast.success(data.is_featured ? 'Submission featured' : 'Submission unfeatured');
    },
    onError: (error: any) => {
      console.error('Error toggling submission featured:', error);
      toast.error('Failed to update featured status');
    }
  });

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.studentSubmissions.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-submissions', 'approved'] });
      toast.success('Approved submission deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      author_name: "",
      author_department: "",
      category: "",
      is_featured: false,
      is_active: true,
      image_url: "",
      content_url: "",
      instagram_url: "",
      youtube_url: ""
    });
    setEditingWork(null);
  };

  const handleEdit = (work: CreativeWork) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      description: work.description || "",
      author_name: work.author_name,
      author_department: work.author_department || "",
      category: work.category,
      is_featured: work.is_featured,
      is_active: work.is_active,
      image_url: work.image_url || "",
      content_url: work.content_url || "",
      instagram_url: (work as any).instagram_url || "",
      youtube_url: (work as any).youtube_url || ""
    });
    setDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.creativeWorks.create(formData);
      setFormData(prev => ({ ...prev, image_url: response.image_url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.creativeWorks.create(formData);
      setFormData(prev => ({ ...prev, content_url: response.content_url }));
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.author_name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.instagram_url && !formData.youtube_url) {
      toast.error('Please provide at least one social media URL (Instagram or YouTube)');
      return;
    }

    if (editingWork) {
      updateMutation.mutate({ id: editingWork.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this creative work?')) return;
    deleteMutation.mutate(id);
  };

  const toggleFeatured = async (work: CreativeWork) => {
    toggleFeaturedMutation.mutate({ id: work.id, is_featured: !work.is_featured });
  };

  const toggleActive = async (work: CreativeWork) => {
    toggleActiveMutation.mutate({ id: work.id, is_active: !work.is_active });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading creative works...</p>
        </div>
      </div>
    );
  }

  const featuredWorks = works.filter((w: CreativeWork) => w.is_featured && w.is_active);
  const activeWorks = works.filter((w: CreativeWork) => w.is_active && !w.is_featured);
  const inactiveWorks = works.filter((w: CreativeWork) => !w.is_active);

  // Approved submissions statistics
  const featuredSubmissions = approvedSubmissions.filter((s: any) => s.is_featured);
  const regularSubmissions = approvedSubmissions.filter((s: any) => !s.is_featured);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 p-8 border-2 border-primary/10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 mb-4 shadow-lg">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold tracking-wide">SHOWCASE MANAGEMENT</span>
              </div>
              
              <h2 className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Creative Gallery Manager
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-3xl">
                Curate and manage both manual creative works and approved student submissions displayed on your homepage gallery
              </p>
            </div>
            
            <Button 
              onClick={handleCreate}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Creative Work
            </Button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{featuredWorks.length + featuredSubmissions.length}</div>
                <div className="text-sm text-muted-foreground">Featured Content</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{activeWorks.length}</div>
                <div className="text-sm text-muted-foreground">Manual Works</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{approvedSubmissions.length}</div>
                <div className="text-sm text-muted-foreground">Approved Submissions</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gray-500/20 bg-gray-500/5">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-600">{inactiveWorks.length}</div>
                <div className="text-sm text-muted-foreground">Inactive Works</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Purpose Explanation Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What is the Creative Gallery?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">📝 Purpose</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Showcase exceptional student creative work publicly</li>
                <li>Manually curate high-quality content for the homepage</li>
                <li>Feature outstanding artists, poets, photographers, and innovators</li>
                <li>Build the college's creative culture and brand</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-secondary">🎯 How It Works</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>Add works manually</strong> - Curated content by admins</li>
                <li><strong>Feature best works</strong> - Highlight exceptional pieces</li>
                <li><strong>Control visibility</strong> - Activate/deactivate anytime</li>
                <li><strong>Public display</strong> - Shows on homepage Creative Panel</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-background/50 rounded-lg border">
            <p className="text-sm">
              <strong className="text-primary">💡 Difference:</strong> This is for <strong>manually curated showcase content</strong>, 
              while the "Submissions Manager" is for <strong>student-submitted works awaiting review</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Featured Works */}
      {featuredWorks.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            Featured Works
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredWorks.map((work: CreativeWork) => (
              <WorkCard
                key={work.id}
                work={work}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFeatured={toggleFeatured}
                onToggleActive={toggleActive}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Works */}
      {activeWorks.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-green-500" />
            Active Works
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeWorks.map((work: CreativeWork) => (
              <WorkCard
                key={work.id}
                work={work}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFeatured={toggleFeatured}
                onToggleActive={toggleActive}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Works */}
      {inactiveWorks.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-muted-foreground">
            <FileText className="w-6 h-6" />
            Inactive Works
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveWorks.map((work: CreativeWork) => (
              <WorkCard
                key={work.id}
                work={work}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFeatured={toggleFeatured}
                onToggleActive={toggleActive}
              />
            ))}
          </div>
        </div>
      )}

      {/* Featured Approved Submissions */}
      {featuredSubmissions.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            Featured Approved Submissions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSubmissions.map((submission: any) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onToggleFeatured={(sub) => toggleSubmissionFeaturedMutation.mutate({ id: sub.id, is_featured: !sub.is_featured })}
                onDelete={(id) => {
                  if (confirm('Are you sure you want to delete this approved submission?')) {
                    deleteSubmissionMutation.mutate(id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Approved Submissions */}
      {regularSubmissions.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-blue-500" />
            Approved Submissions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularSubmissions.map((submission: any) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                onToggleFeatured={(sub) => toggleSubmissionFeaturedMutation.mutate({ id: sub.id, is_featured: !sub.is_featured })}
                onDelete={(id) => {
                  if (confirm('Are you sure you want to delete this approved submission?')) {
                    deleteSubmissionMutation.mutate(id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {works.length === 0 && (
        <Card className="p-12 text-center">
          <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No Creative Works Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start building your creative gallery by adding exceptional student works
          </p>
          <Button onClick={handleCreate} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Work
          </Button>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWork ? 'Edit Creative Work' : 'Add Creative Work'}
            </DialogTitle>
            <DialogDescription>
              {editingWork ? 'Update the details of this creative work' : 'Add a new creative work to the gallery'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter work title"
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the creative work..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Author Name *</Label>
                <Input
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Creator's name"
                />
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={formData.author_department} onValueChange={(value) => setFormData(prev => ({ ...prev, author_department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="Enter image URL or upload file"
              />
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1"
                />
                {uploadingImage && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg mt-2" />
              )}
            </div>

            <div className="space-y-2">
              <Label>Content File URL (Optional)</Label>
              <Input
                value={formData.content_url}
                onChange={(e) => setFormData(prev => ({ ...prev, content_url: e.target.value }))}
                placeholder="Enter content file URL"
              />
              <div className="flex gap-2">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="flex-1"
                />
                {uploadingFile && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>
              {formData.content_url && (
                <p className="text-sm text-green-600">✓ File uploaded</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Instagram URL *</Label>
              <Input
                value={formData.instagram_url}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                placeholder="Enter Instagram post/reel URL"
              />
            </div>

            <div className="space-y-2">
              <Label>YouTube URL *</Label>
              <Input
                value={formData.youtube_url}
                onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                placeholder="Enter YouTube video URL"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              * Please provide at least one social media URL (Instagram or YouTube)
            </p>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <Label>Feature this work</Label>
                <p className="text-xs text-muted-foreground">Show prominently on homepage</p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <Label>Active</Label>
                <p className="text-xs text-muted-foreground">Visible on public gallery</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={createMutation.isPending || updateMutation.isPending || !formData.title || !formData.author_name || !formData.category || (!formData.instagram_url && !formData.youtube_url)}>
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (editingWork ? 'Update' : 'Create')} Work
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WorkCard({ 
  work, 
  onEdit, 
  onDelete, 
  onToggleFeatured, 
  onToggleActive 
}: { 
  work: CreativeWork;
  onEdit: (work: CreativeWork) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (work: CreativeWork) => void;
  onToggleActive: (work: CreativeWork) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
    >
      <Card className={`overflow-hidden border-2 ${!work.is_active ? 'opacity-60' : ''} hover:shadow-xl transition-all`}>
        <div className={`h-2 ${work.is_featured ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-primary to-secondary'}`} />
        
        {work.image_url ? (
          <img src={work.image_url} alt={work.title} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate text-lg">{work.title}</CardTitle>
              <CardDescription className="truncate">
                {work.author_name} • {work.category}
              </CardDescription>
            </div>
            {work.is_featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 flex-shrink-0">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {work.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{work.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(work)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onToggleFeatured(work)}
              className={work.is_featured ? 'border-yellow-500 text-yellow-600' : ''}
            >
              <Star className={`w-4 h-4 mr-1 ${work.is_featured ? 'fill-yellow-500' : ''}`} />
              {work.is_featured ? 'Unfeature' : 'Feature'}
            </Button>

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onToggleActive(work)}
              className={work.is_active ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}
            >
              <Eye className="w-4 h-4 mr-1" />
              {work.is_active ? 'Active' : 'Inactive'}
            </Button>

            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onDelete(work.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
