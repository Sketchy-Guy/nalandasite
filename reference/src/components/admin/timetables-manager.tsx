import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Calendar, Upload, Search, Download } from "lucide-react";

interface Timetable {
  id: string;
  title: string;
  description: string;
  type: string;
  department: string;
  semester: string;
  academic_year: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TimetablesManager = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "course",
    department: "",
    semester: "",
    academic_year: "",
    is_active: true
  });

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const { data, error } = await supabase
        .from("timetables")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTimetables(data || []);
    } catch (error) {
      console.error("Error fetching timetables:", error);
      toast({
        title: "Error",
        description: "Failed to load timetables",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "course",
      department: "",
      semester: "",
      academic_year: "",
      is_active: true
    });
    setEditingTimetable(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `timetable-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('timetables')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('timetables')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let fileUrl = editingTimetable?.file_url || "";
      
      // Handle file upload if new file is selected
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        const uploadedUrl = await handleFileUpload({ target: fileInput } as any);
        if (uploadedUrl) {
          fileUrl = uploadedUrl;
        } else {
          return; // Stop if upload failed
        }
      }

      const dataToSave = { ...formData, file_url: fileUrl };

      if (editingTimetable) {
        const { error } = await supabase
          .from("timetables")
          .update(dataToSave)
          .eq("id", editingTimetable.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Timetable updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("timetables")
          .insert([dataToSave]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Timetable created successfully",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchTimetables();
    } catch (error: any) {
      console.error("Error saving timetable:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save timetable",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (timetable: Timetable) => {
    setEditingTimetable(timetable);
    setFormData({
      title: timetable.title,
      description: timetable.description,
      type: timetable.type,
      department: timetable.department,
      semester: timetable.semester,
      academic_year: timetable.academic_year,
      is_active: timetable.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timetable?")) return;

    try {
      const { error } = await supabase
        .from("timetables")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Timetable deleted successfully",
      });
      fetchTimetables();
    } catch (error: any) {
      console.error("Error deleting timetable:", error);
      toast({
        title: "Error",
        description: "Failed to delete timetable",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("timetables")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Timetable ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      fetchTimetables();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update timetable status",
        variant: "destructive",
      });
    }
  };

  const filteredTimetables = timetables.filter(timetable =>
    timetable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timetable.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timetable.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timetables Manager</h1>
          <p className="text-muted-foreground">Manage course schedules and exam timetables</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Timetable
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTimetable ? "Edit Timetable" : "Add New Timetable"}</DialogTitle>
              <DialogDescription>
                Upload and manage academic timetables for courses and exams.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., CSE Semester 1 Timetable"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course">Course Schedule</SelectItem>
                      <SelectItem value="exam">Exam Timetable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">Computer Science</SelectItem>
                      <SelectItem value="IT">Information Technology</SelectItem>
                      <SelectItem value="MCA">Master of Computer Applications</SelectItem>
                      <SelectItem value="MBA">Master of Business Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    placeholder="e.g., Semester 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academic_year">Academic Year</Label>
                  <Input
                    id="academic_year"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    placeholder="e.g., 2024-25"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the timetable"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload Timetable File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                {editingTimetable?.file_url && (
                  <p className="text-sm text-muted-foreground">
                    Current file: <a href={editingTimetable.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View file</a>
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {editingTimetable ? "Update Timetable" : "Create Timetable"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search timetables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Timetables Table */}
      <Card>
        <CardHeader>
          <CardTitle>Timetables</CardTitle>
          <CardDescription>
            {filteredTimetables.length} timetable{filteredTimetables.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTimetables.map((timetable) => (
                <TableRow key={timetable.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{timetable.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={timetable.type === "exam" ? "destructive" : "default"}>
                      {timetable.type === "exam" ? "Exam" : "Course"}
                    </Badge>
                  </TableCell>
                  <TableCell>{timetable.department}</TableCell>
                  <TableCell>{timetable.semester}</TableCell>
                  <TableCell>
                    <Badge variant={timetable.is_active ? "default" : "secondary"}>
                      {timetable.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {timetable.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(timetable.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(timetable.id, timetable.is_active)}
                      >
                        {timetable.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(timetable)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(timetable.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetablesManager;