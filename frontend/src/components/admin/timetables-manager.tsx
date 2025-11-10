import { useState, useEffect } from "react";
import { api } from "@/lib/api";
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
import ErrorBoundary from "@/components/error-boundary";

interface Timetable {
  id: string;
  title: string;
  description: string;
  timetable_type: string;
  department: string;
  department_name?: string;
  department_code?: string;
  semester: string;
  academic_year: string;
  file_url?: string;
  image_url?: string;
  timetable_file?: string;
  timetable_image?: string;
  timetable_image_url?: string;
  timetable_file_url?: string;
  external_link?: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  valid_from?: string;
  valid_to?: string;
  created_at?: string;
  updated_at?: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

const TimetablesManager = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timetable_type: "class",
    department: "",
    semester: "",
    academic_year: "",
    external_link: "",
    is_active: true,
    is_featured: false,
    display_order: 0
  });

  useEffect(() => {
    // Test connectivity first
    testConnectivity();
    fetchTimetables();
    fetchDepartments();
  }, []);

  const testConnectivity = async () => {
    try {
      console.log('Testing connectivity to Django server...');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/departments/`);
      console.log('Connectivity test response:', response.status, response.statusText);
      if (response.ok) {
        console.log('✅ Django server is reachable');
      } else {
        console.log('❌ Django server returned error:', response.status);
      }
    } catch (error) {
      console.error('❌ Cannot reach Django server:', error);
      toast({
        title: "Connection Error",
        description: "Cannot connect to the server. Please check if the Django server is running on port 8000.",
        variant: "destructive",
      });
    }
  };

  const fetchTimetables = async () => {
    try {
      const response = await api.timetables.list();
      setTimetables(response.results || []);
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

  const fetchDepartments = async () => {
    try {
      const response = await api.departments.list();
      setDepartments(response.results || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      timetable_type: "class",
      department: "",
      semester: "",
      academic_year: "",
      external_link: "",
      is_active: true,
      is_featured: false,
      display_order: 0
    });
    setEditingTimetable(null);
    setCurrentImageUrl(null);
    
    // Clear file input
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };


  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('timetable_file', file);
      
      // For now, we'll still recommend external links for simplicity
      // But the infrastructure is ready for file uploads
      toast({
        title: "Info",
        description: "File upload infrastructure is ready. For now, please use external links (Google Drive, etc.) for easier sharing.",
        variant: "default",
      });
      return null;
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
    
    // Prevent multiple submissions
    if (uploading) {
      return;
    }
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.department) {
      toast({
        title: "Validation Error", 
        description: "Please select a department",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check authentication
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to continue",
          variant: "destructive",
        });
        return;
      }

      // Check if we have a file
      const fileInput = document.getElementById('file') as HTMLInputElement;
      const hasFile = fileInput?.files?.[0];

      if (hasFile) {
        // Check file size (10MB limit)
        const file = fileInput.files[0];
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        
        if (file.size > maxSize) {
          toast({
            title: "File Too Large",
            description: "Please select a file smaller than 10MB",
            variant: "destructive",
          });
          return;
        }
        
        // Use FormData for file uploads
        const submitFormData = new FormData();
        
        // Add all form fields to FormData
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            submitFormData.append(key, value.toString());
          }
        });

        // Add the file
        submitFormData.append('timetable_file', file);

        // Debug: Log what we're sending
        console.log('Submitting timetable data with file:');
        console.log('Form data entries:');
        for (let [key, value] of submitFormData.entries()) {
          console.log(`${key}:`, value);
        }
        console.log('Department ID:', formData.department);
        console.log('File:', fileInput.files[0]);
        console.log('Auth token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');

        if (editingTimetable) {
          console.log('Updating timetable:', editingTimetable.id);
          await api.timetables.update(editingTimetable.id, submitFormData);
        } else {
          console.log('Creating new timetable');
          await api.timetables.create(submitFormData);
        }
      } else {
        // Use JSON for non-file submissions
        console.log('Submitting timetable data without file:', formData);
        console.log('Auth token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
        
        if (editingTimetable) {
          console.log('Updating timetable:', editingTimetable.id);
          await api.timetables.update(editingTimetable.id, formData as any);
        } else {
          console.log('Creating new timetable');
          await api.timetables.create(formData as any);
        }
      }

      toast({
        title: "Success",
        description: editingTimetable ? "Timetable updated successfully" : "Timetable created successfully",
      });

      resetForm();
      setIsDialogOpen(false);
      fetchTimetables();
    } catch (error: any) {
      console.error("Error saving timetable:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
      console.error("Full error object:", error);
      
      // Show detailed validation errors
      let errorMessage = 'Unknown error';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ');
        } else {
          // Show field-specific errors
          const fieldErrors = Object.entries(error.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
          errorMessage = fieldErrors || 'Validation failed';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: `Failed to save timetable: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (timetable: Timetable) => {
    setEditingTimetable(timetable);
    
    // Try all possible image field variations
    const imageUrl = timetable.image_url || 
                     timetable.timetable_image_url || 
                     timetable.timetable_image || 
                     timetable.file_url || 
                     timetable.timetable_file_url || 
                     null;
    
    setCurrentImageUrl(imageUrl);
    
    setFormData({
      title: timetable.title,
      description: timetable.description,
      timetable_type: timetable.timetable_type,
      department: timetable.department,
      semester: timetable.semester,
      academic_year: timetable.academic_year,
      external_link: timetable.external_link || "",
      is_active: timetable.is_active,
      is_featured: timetable.is_featured,
      display_order: timetable.display_order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timetable?")) return;

    try {
      await api.timetables.delete(id);
      
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
      await api.timetables.update(id, { is_active: !currentStatus } as any);
      
      toast({
        title: "Success",
        description: `Timetable ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      fetchTimetables();
    } catch (error: any) {
      console.error("Error updating timetable:", error);
      toast({
        title: "Error",
        description: "Failed to update timetable status",
        variant: "destructive",
      });
    }
  };

  const filteredTimetables = timetables.filter(timetable =>
    timetable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (timetable.department_name || timetable.department).toLowerCase().includes(searchTerm.toLowerCase()) ||
    timetable.timetable_type.toLowerCase().includes(searchTerm.toLowerCase())
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
    <ErrorBoundary>
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-[90vw] md:w-[80vw]">
            <DialogHeader>
              <DialogTitle>{editingTimetable ? "Edit Timetable" : "Add New Timetable"}</DialogTitle>
              <DialogDescription>
                Upload and manage academic timetables for courses and exams.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 p-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  <Label htmlFor="timetable_type">Type</Label>
                  <Select value={formData.timetable_type} onValueChange={(value) => setFormData({ ...formData, timetable_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class Timetable</SelectItem>
                      <SelectItem value="exam">Exam Schedule</SelectItem>
                      <SelectItem value="event">Event Schedule</SelectItem>
                      <SelectItem value="lab">Lab Schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="external_link">External Link (Google Drive, etc.)</Label>
                  <Input
                    id="external_link"
                    value={formData.external_link}
                    onChange={(e) => {
                      setFormData({ ...formData, external_link: e.target.value });
                      // Clear file input if external link is provided
                      if (e.target.value.trim()) {
                        const fileInput = document.getElementById('file') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }
                    }}
                    placeholder="https://drive.google.com/..."
                    disabled={!!currentImageUrl}
                  />
                  {formData.external_link && (
                    <p className="text-xs text-green-600">
                      ✓ External link provided
                    </p>
                  )}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  OR
                </div>

                <div className="space-y-2">
                <Label htmlFor="file">Upload Timetable Image</Label>
                  
                  {currentImageUrl && (
                    <div className="space-y-2">
                      <div className="relative inline-block">
                        <img 
                          src={currentImageUrl} 
                          alt="Current timetable" 
                          className="max-w-xs max-h-32 object-contain border rounded"
                          onError={(e) => {
                            console.error('Image failed to load:', currentImageUrl);
                          }}
                        />
                      </div>
                      <div>
                        <a 
                          href={currentImageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <Input
                    id="file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                    disabled={uploading || !!formData.external_link.trim()}
                    onChange={(e) => {
                      // Clear external link if file is selected
                      if (e.target.files?.[0]) {
                        setFormData({ ...formData, external_link: "" });
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, GIF, BMP, WebP. Max size: 10MB
                  </p>
                  {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                  
                  {!currentImageUrl && !formData.external_link && (
                    <p className="text-xs text-amber-600">
                      Please provide either an external link OR upload an image
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading} className="w-full sm:w-auto">
                  {editingTimetable ? "Update Timetable" : "Create Timetable"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search timetables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
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
          <div className="overflow-x-auto">
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
                    <Badge variant={timetable.timetable_type === "exam" ? "destructive" : "default"}>
                      {timetable.timetable_type === "exam" ? "Exam" : timetable.timetable_type.charAt(0).toUpperCase() + timetable.timetable_type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{timetable.department_name || timetable.department}</TableCell>
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
          </div>
        </CardContent>
      </Card>
    </div>
    </ErrorBoundary>
  );
};

export default TimetablesManager;