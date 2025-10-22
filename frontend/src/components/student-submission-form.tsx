import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

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
    department: ""
  });
  const [files, setFiles] = useState<{
    image?: File;
    content?: File;
  }>({});

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

  const departments = [
    "Computer Science & Engineering",
    "Information Technology", 
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Master of Computer Applications",
    "Bachelor of Computer Applications",
    "Master of Business Administration"
  ];

  const handleFileChange = (type: 'image' | 'content', file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [type]: file || undefined
    }));
  };

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${folder}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('student-submissions')
      .upload(fileName, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('student-submissions')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let imageUrl = null;
      let contentUrl = null;

      // Upload files if present
      if (files.image) {
        imageUrl = await uploadFile(files.image, 'images');
      }
      if (files.content) {
        contentUrl = await uploadFile(files.content, 'content');
      }

      // Submit to database
      const { error } = await supabase
        .from('student_submissions')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          department: formData.department,
          image_url: imageUrl,
          file_url: contentUrl
        });

      if (error) throw error;

      toast.success("Submission successful! Your work is pending review.");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        department: ""
      });
      setFiles({});
      onClose();
      
    } catch (error) {
      console.error('Error submitting work:', error);
      toast.error("Failed to submit your work. Please try again.");
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
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title || !formData.category || !formData.department}>
              {loading ? "Submitting..." : "Submit Work"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}