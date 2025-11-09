import { useState } from 'react';
import { Plus, Upload, Download, Trash2, FileText, Search, Filter, Link, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface AcademicDownload {
  id: string;
  title: string;
  description: string | null;
  category: string;
  department: string | null;
  file_url: string | null;
  drive_url: string | null;
  file_type: string | null;
  file_size: number | null;
  download_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function DownloadsManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [uploadType, setUploadType] = useState<'file' | 'drive'>('file');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Application Forms',
    department: '',
    file: null as File | null,
    drive_url: '',
  });

  const categories = [
    'Application Forms',
    'Syllabi', 
    'Handbooks',
    'Regulations',
    'Academic Calendar',
    'Examination',
    'Admission',
    'General',
  ];

  // Fetch downloads using TanStack Query
  const { data: downloads = [], isLoading: loading } = useQuery({
    queryKey: ['academic-services'],
    queryFn: async () => {
      try {
        const response = await api.academicServices.list();
        return response.results || response || [];
      } catch (error) {
        console.error('Error fetching downloads:', error);
        return [];
      }
    },
    retry: 1,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.academicServices.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-services'] });
      toast.success('Document uploaded successfully');
      setFormData({
        title: '',
        description: '',
        category: 'Application Forms',
        department: '',
        file: null,
        drive_url: '',
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.academicServices.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-services'] });
      toast.success('Document updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.academicServices.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-services'] });
      toast.success('Document deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadType === 'file' && !formData.file) {
      toast.error('Please select an image file to upload');
      return;
    }
    
    if (uploadType === 'file' && formData.file) {
      // Check file size (5MB limit for images)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (formData.file.size > maxSize) {
        toast.error('Image file size must be less than 5MB');
        return;
      }
      
      // Check if it's actually an image
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(formData.file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, GIF, WebP, SVG)');
        return;
      }
    }
    
    if (uploadType === 'drive' && !formData.drive_url) {
      toast.error('Please provide a Google Drive URL for your document');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    if (formData.department) {
      submitData.append('department', formData.department);
    }
    
    if (uploadType === 'file' && formData.file) {
      submitData.append('file', formData.file);
    } else if (uploadType === 'drive') {
      submitData.append('drive_url', formData.drive_url);
    }

    createMutation.mutate(submitData);
  };

  const toggleActive = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({ id, data: { is_active: !currentStatus } });
  };

  const deleteDownload = (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    deleteMutation.mutate(id);
  };

  const filteredDownloads = downloads.filter((download: any) => {
    const matchesSearch = download.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         download.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || download.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Log downloads for debugging
  console.log('Downloads loaded:', downloads, 'Loading:', loading);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Downloads Manager</h1>
          <p className="text-muted-foreground">Manage academic documents and downloads</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 p-1">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Document Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Document Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter document title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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
                  <div>
                    <Label htmlFor="department">Department (Optional)</Label>
                    <Select 
                      value={formData.department || ""} 
                      onValueChange={(value) => setFormData({ ...formData, department: value === "all" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Computer Science & Engineering">Computer Science & Engineering</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Master of Computer Applications">Master of Computer Applications</SelectItem>
                        <SelectItem value="Bachelor of Computer Applications">Bachelor of Computer Applications</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Master of Business Administration">Master of Business Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the document"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              {/* Upload Type Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Upload Method</h3>
                <Tabs value={uploadType} onValueChange={(value) => setUploadType(value as 'file' | 'drive')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="file" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span className="hidden sm:inline">Image Upload</span>
                      <span className="sm:hidden">Image</span>
                    </TabsTrigger>
                    <TabsTrigger value="drive" className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      <span className="hidden sm:inline">Document Link</span>
                      <span className="sm:hidden">Docs</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="file" className="space-y-3 mt-4">
                    <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <Label htmlFor="file" className="block text-sm font-medium mb-2 text-blue-700">
                        Upload Image Files Only
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                        className="max-w-full"
                        accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                      />
                      <p className="text-xs text-blue-600 mt-2">
                        ✓ Supported: JPG, PNG, GIF, WebP, SVG (Max 5MB)
                      </p>
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                        <p className="font-medium">📄 For PDF, DOC, XLS, PPT files:</p>
                        <p>Please use the "Google Drive" tab and share the file link instead.</p>
                      </div>
                    </div>
                    {formData.file && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        ✓ Image selected: {formData.file.name}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="drive" className="space-y-3 mt-4">
                    <div className="border-2 border-dashed border-green-200 bg-green-50/50 rounded-lg p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Link className="h-5 w-5 text-green-600" />
                        <Label htmlFor="drive_url" className="text-sm font-medium text-green-700">
                          Google Drive Link for Documents
                        </Label>
                      </div>
                      <div className="mb-3 p-2 bg-green-100 border border-green-200 rounded text-xs text-green-700">
                        <p className="font-medium">📄 Recommended for:</p>
                        <p>PDF, DOC, XLS, PPT, and other document files</p>
                      </div>
                      <Input
                        id="drive_url"
                        type="url"
                        placeholder="https://drive.google.com/file/d/..."
                        value={formData.drive_url}
                        onChange={(e) => setFormData({ ...formData, drive_url: e.target.value })}
                        className="w-full"
                      />
                      <div className="mt-3 text-xs text-green-600 space-y-1">
                        <p>• Upload your document to Google Drive</p>
                        <p>• Set sharing to "Anyone with the link can view"</p>
                        <p>• Copy and paste the share link here</p>
                        <p>• Link should start with https://drive.google.com/</p>
                      </div>
                    </div>
                    {formData.drive_url && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        ✓ Google Drive document link added
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              
              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? 'Uploading...' : 'Upload Document'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredDownloads.length})</CardTitle>
          <CardDescription>
            Manage academic documents and downloadable files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDownloads.map((download: any) => (
                <TableRow key={download.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{download.title}</div>
                      {download.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {download.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{download.category}</Badge>
                  </TableCell>
                  <TableCell>{download.department || 'All'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {download.drive_url ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Link className="h-3 w-3" />
                          Drive
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          File
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {download.file_size ? formatFileSize(download.file_size) : 'N/A'}
                  </TableCell>
                  <TableCell>{download.download_count || 0}</TableCell>
                  <TableCell>
                    <Badge variant={download.is_active ? 'default' : 'secondary'}>
                      {download.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {(download.file_url || download.drive_url) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(download.file_url || download.drive_url, '_blank')}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(download.id, download.is_active)}
                        className="flex items-center gap-1"
                      >
                        <span className="hidden sm:inline">
                          {download.is_active ? 'Deactivate' : 'Activate'}
                        </span>
                        <span className="sm:hidden">
                          {download.is_active ? 'Off' : 'On'}
                        </span>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteDownload(download.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
          {filteredDownloads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No documents found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
