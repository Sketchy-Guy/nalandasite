import { useState, useEffect } from 'react';
import { Plus, Upload, Download, Trash2, FileText, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AcademicDownload {
  id: string;
  title: string;
  description: string | null;
  category: string;
  department: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  download_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function DownloadsManager() {
  const [downloads, setDownloads] = useState<AcademicDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    department: '',
    file: null as File | null,
  });

  const categories = [
    'General',
    'Syllabus',
    'Forms',
    'Handbooks',
    'Guidelines',
    'Examination',
    'Admission',
    'Academic Calendar',
  ];

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_downloads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDownloads(data || []);
    } catch (error) {
      console.error('Error fetching downloads:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch downloads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${formData.title.replace(/[^a-zA-Z0-9]/g, '-')}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('academic-documents')
        .upload(fileName, formData.file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('academic-documents')
        .getPublicUrl(fileName);

      // Insert download record
      const { error: insertError } = await supabase
        .from('academic_downloads')
        .insert({
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          department: formData.department || null,
          file_url: urlData.publicUrl,
          file_type: formData.file.type,
          file_size: formData.file.size,
        });

      if (insertError) throw insertError;

      toast({
        title: 'Success',
        description: 'Download uploaded successfully',
      });

      setFormData({
        title: '',
        description: '',
        category: 'General',
        department: '',
        file: null,
      });
      setIsDialogOpen(false);
      fetchDownloads();
    } catch (error) {
      console.error('Error uploading download:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload download',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('academic_downloads')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Download ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      fetchDownloads();
    } catch (error) {
      console.error('Error updating download status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update download status',
        variant: 'destructive',
      });
    }
  };

  const deleteDownload = async (id: string) => {
    if (!confirm('Are you sure you want to delete this download?')) return;

    try {
      const { error } = await supabase
        .from('academic_downloads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Download deleted successfully',
      });

      fetchDownloads();
    } catch (error) {
      console.error('Error deleting download:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete download',
        variant: 'destructive',
      });
    }
  };

  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch = download.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         download.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || download.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
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
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  required
                />
              </div>
              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? 'Uploading...' : 'Upload Document'}
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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search downloads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
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
          <CardTitle>Downloads ({filteredDownloads.length})</CardTitle>
          <CardDescription>
            Manage academic documents and downloadable files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDownloads.map((download) => (
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
                    {download.file_size ? formatFileSize(download.file_size) : 'Unknown'}
                  </TableCell>
                  <TableCell>{download.download_count}</TableCell>
                  <TableCell>
                    <Badge variant={download.is_active ? 'default' : 'secondary'}>
                      {download.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {download.file_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(download.file_url!, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(download.id, download.is_active)}
                      >
                        {download.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteDownload(download.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDownloads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No downloads found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}