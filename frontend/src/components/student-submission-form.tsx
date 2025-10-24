import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X, Instagram, Youtube, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StudentSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudentSubmissionForm({ isOpen, onClose }: StudentSubmissionFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    department: "",
    instagram_url: "",
    youtube_url: ""
  });
  const [files, setFiles] = useState<{
    image?: File;
    content?: File;
  }>({});
  
  const [socialMediaPreview, setSocialMediaPreview] = useState<{
    type: 'instagram' | 'youtube' | null;
    url: string;
    embedId?: string;
    isPrivate?: boolean;
  }>({ type: null, url: '' });

  const categories = [
    "Digital Art",
    "Photography", 
    "Music Composition",
    "Writing",
    "Design",
    "Video",
    "Innovation",
    "Technology",
    "Research",
    "Startup"
  ];

  // Fetch departments from API
  const { data: departments = [], isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.departments.list();
      return response.results || response;
    },
  });

  const queryClient = useQueryClient();

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

  const updateSocialMediaPreview = () => {
    // Prioritize Instagram if both are provided
    if (formData.instagram_url) {
      const instagramId = extractInstagramId(formData.instagram_url);
      if (instagramId) {
        setSocialMediaPreview({
          type: 'instagram',
          url: formData.instagram_url,
          embedId: instagramId
        });
      } else {
        setSocialMediaPreview({
          type: 'instagram',
          url: formData.instagram_url,
          isPrivate: true
        });
      }
    } else if (formData.youtube_url) {
      const youtubeId = extractYouTubeId(formData.youtube_url);
      if (youtubeId) {
        setSocialMediaPreview({
          type: 'youtube',
          url: formData.youtube_url,
          embedId: youtubeId
        });
      } else {
        setSocialMediaPreview({
          type: 'youtube',
          url: formData.youtube_url,
          isPrivate: true
        });
      }
    } else {
      setSocialMediaPreview({ type: null, url: '' });
    }
  };

  // Update preview when URLs change
  useEffect(() => {
    updateSocialMediaPreview();
  }, [formData.instagram_url, formData.youtube_url]);

  const handleFileChange = (type: 'image' | 'content', file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [type]: file || undefined
    }));
  };

  // Submission mutation
  const submitMutation = useMutation({
    mutationFn: async (submissionData: FormData) => {
      return await api.studentSubmissions.create(submissionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-submissions'] });
      toast.success("Submission successful! Your work is pending review.");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        department: "",
        instagram_url: "",
        youtube_url: ""
      });
      setFiles({});
      onClose();
    },
    onError: (error: any) => {
      console.error('Error submitting work:', error);
      toast.error("Failed to submit your work. Please try again.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create FormData for file upload
      const submissionData = new FormData();
      submissionData.append('title', formData.title);
      submissionData.append('description', formData.description);
      submissionData.append('category', formData.category);
      submissionData.append('department', formData.department);
      
      // Add social media URLs if present
      if (formData.instagram_url) {
        submissionData.append('instagram_url', formData.instagram_url);
      }
      if (formData.youtube_url) {
        submissionData.append('youtube_url', formData.youtube_url);
      }
      
      // Add files if present
      if (files.image) {
        submissionData.append('image', files.image);
      }
      if (files.content) {
        submissionData.append('file', files.content);
      }

      // Submit using mutation
      submitMutation.mutate(submissionData);
      
    } catch (error) {
      console.error('Error preparing submission:', error);
      toast.error("Failed to prepare submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Creative Work</DialogTitle>
          <DialogDescription>
            Share your creativity with the community. Submissions will be reviewed before appearing publicly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Enter title of your work"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {loadingDepartments ? (
                  <SelectItem value="" disabled>Loading departments...</SelectItem>
                ) : (
                  departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your work, inspiration, techniques used..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL *</Label>
              <Input
                id="instagram_url"
                value={formData.instagram_url}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                placeholder="Enter Instagram post/reel URL"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube URL *</Label>
              <Input
                id="youtube_url"
                value={formData.youtube_url}
                onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                placeholder="Enter YouTube video URL"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            * Please provide at least one social media URL (Instagram or YouTube)
          </p>

          {/* Social Media Preview or File Upload Section */}
          {socialMediaPreview.type ? (
            <div className="space-y-4">
              {/* Privacy Warning */}
              {socialMediaPreview.isPrivate && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    The {socialMediaPreview.type === 'instagram' ? 'Instagram' : 'YouTube'} content appears to be private or the URL format is invalid. 
                    Please make sure your {socialMediaPreview.type === 'instagram' ? 'Instagram post' : 'YouTube video'} is public for proper preview.
                  </AlertDescription>
                </Alert>
              )}

              {/* Social Media Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {socialMediaPreview.type === 'instagram' ? (
                      <Instagram className="h-5 w-5 text-pink-600" />
                    ) : (
                      <Youtube className="h-5 w-5 text-red-600" />
                    )}
                    {socialMediaPreview.type === 'instagram' ? 'Instagram' : 'YouTube'} Preview
                  </CardTitle>
                  <CardDescription>
                    {socialMediaPreview.type === 'instagram' 
                      ? 'Instagram post will be embedded' 
                      : 'YouTube video will be embedded'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {socialMediaPreview.embedId && !socialMediaPreview.isPrivate ? (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      {socialMediaPreview.type === 'instagram' ? (
                        <div className="w-full h-full relative">
                          <iframe
                            src={`https://www.instagram.com/p/${socialMediaPreview.embedId}/embed/`}
                            title="Instagram post preview"
                            className="w-full h-full border-0"
                            frameBorder="0"
                            scrolling="no"
                            onError={() => {
                              // Fallback to styled preview if embed fails
                              setSocialMediaPreview(prev => ({ ...prev, isPrivate: true }));
                            }}
                          />
                          {/* Fallback overlay for loading */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center opacity-20 pointer-events-none">
                            <div className="text-white text-center">
                              <Instagram className="h-8 w-8 mx-auto mb-1" />
                              <p className="text-xs">Loading...</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <iframe
                          src={`https://www.youtube.com/embed/${socialMediaPreview.embedId}`}
                          title="YouTube video preview"
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        {socialMediaPreview.type === 'instagram' ? (
                          <Instagram className="h-12 w-12 mx-auto mb-2" />
                        ) : (
                          <Youtube className="h-12 w-12 mx-auto mb-2" />
                        )}
                        <p className="text-sm">Preview not available</p>
                        <p className="text-xs">Check URL format and privacy settings</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* File Upload Section - Only shown when no social media URLs */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cover Image</CardTitle>
                  <CardDescription>Upload a preview image (optional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('image', e.target.files?.[0] || null)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {files.image ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm truncate">{files.image.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleFileChange('image', null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload image</p>
                        </div>
                      )}
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Content File</CardTitle>
                  <CardDescription>Upload your work file (optional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange('content', e.target.files?.[0] || null)}
                      className="hidden"
                      id="content-upload"
                    />
                    <label htmlFor="content-upload" className="cursor-pointer">
                      {files.content ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm truncate">{files.content.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleFileChange('content', null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload file</p>
                        </div>
                      )}
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || submitMutation.isPending || !formData.title || !formData.category || !formData.department || (!formData.instagram_url && !formData.youtube_url)}>
              {loading || submitMutation.isPending ? "Submitting..." : "Submit Work"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}