import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, FileText, Calendar, User, Download } from "lucide-react";

interface Publication {
  id: string;
  title: string;
  description: string;
  publication_type: string;
  author: string;
  department: string;
  publication_date: string;
  issue_number: string;
  file_url: string;
  cover_image_url: string;
  download_count: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function PublicationsManager() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publication_type: "magazine",
    author: "",
    department: "",
    publication_date: "",
    issue_number: "",
    file_url: "",
    cover_image_url: "",
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast.error('Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPublication) {
        const { error } = await supabase
          .from('publications')
          .update(formData)
          .eq('id', editingPublication.id);

        if (error) throw error;
        toast.success('Publication updated successfully');
      } else {
        const { error } = await supabase
          .from('publications')
          .insert([formData]);

        if (error) throw error;
        toast.success('Publication created successfully');
      }

      setIsDialogOpen(false);
      setEditingPublication(null);
      resetForm();
      fetchPublications();
    } catch (error) {
      console.error('Error saving publication:', error);
      toast.error('Failed to save publication');
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setFormData({
      title: publication.title,
      description: publication.description || "",
      publication_type: publication.publication_type,
      author: publication.author || "",
      department: publication.department || "",
      publication_date: publication.publication_date || "",
      issue_number: publication.issue_number || "",
      file_url: publication.file_url || "",
      cover_image_url: publication.cover_image_url || "",
      is_active: publication.is_active,
      is_featured: publication.is_featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Publication deleted successfully');
      fetchPublications();
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast.error('Failed to delete publication');
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      publication_type: "magazine",
      author: "",
      department: "",
      publication_date: "",
      issue_number: "",
      file_url: "",
      cover_image_url: "",
      is_active: true,
      is_featured: false,
    });
  };

  const publicationTypes = [
    { value: "magazine", label: "Magazine" },
    { value: "newsletter", label: "Newsletter" },
    { value: "journal", label: "Journal" },
    { value: "yearbook", label: "Yearbook" },
    { value: "report", label: "Report" },
    { value: "handbook", label: "Handbook" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading publications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Publications Manager</h1>
          <p className="text-muted-foreground">Manage campus magazines, newsletters, and other publications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPublication(null);
              resetForm();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPublication ? 'Edit Publication' : 'Add New Publication'}
              </DialogTitle>
              <DialogDescription>
                {editingPublication ? 'Update the publication details.' : 'Create a new publication entry.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publication_type">Type *</Label>
                  <Select
                    value={formData.publication_type}
                    onValueChange={(value) => setFormData({ ...formData, publication_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author/Editor</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publication_date">Publication Date</Label>
                  <Input
                    id="publication_date"
                    type="date"
                    value={formData.publication_date}
                    onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue_number">Issue Number</Label>
                  <Input
                    id="issue_number"
                    value={formData.issue_number}
                    onChange={(e) => setFormData({ ...formData, issue_number: e.target.value })}
                    placeholder="e.g., Vol 1, Issue 2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_url">PDF File URL</Label>
                <Input
                  id="file_url"
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  placeholder="https://example.com/publication.pdf"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPublication ? 'Update' : 'Create'} Publication
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Publications ({publications.length})
          </CardTitle>
          <CardDescription>
            Manage all campus publications including magazines, newsletters, and journals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {publications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No publications found. Create your first publication to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publications.map((publication) => (
                    <TableRow key={publication.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{publication.title}</div>
                          {publication.issue_number && (
                            <div className="text-sm text-muted-foreground">
                              {publication.issue_number}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {publication.publication_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          {publication.author && (
                            <div className="flex items-center gap-1 text-sm">
                              <User className="h-3 w-3" />
                              {publication.author}
                            </div>
                          )}
                          {publication.department && (
                            <div className="text-xs text-muted-foreground">
                              {publication.department}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {publication.publication_date && (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(publication.publication_date).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Download className="h-3 w-3" />
                          {publication.download_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={publication.is_active ? "default" : "secondary"}>
                            {publication.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {publication.is_featured && (
                            <Badge variant="outline" className="text-yellow-600">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(publication)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(publication.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}