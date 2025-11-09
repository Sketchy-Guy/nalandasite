import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, FileText, Calendar, Search, Filter, File } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface AcademicDownload {
  id: string;
  title: string;
  description: string;
  file_url: string;
  drive_url?: string;
  file_size: number;
  file_type: string;
  category: string;
  department: string;
  download_count: number;
  created_at: string;
}

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState<AcademicDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await api.academicServices.list();
      // Get all active academic services (documents)
      const downloadData = (response.results || []).filter((item: any) => 
        item.is_active !== false
      );
      setDownloads(downloadData);
    } catch (error) {
      console.error("Error fetching downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch = download.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         download.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || download.category === categoryFilter;
    const matchesDepartment = departmentFilter === "all" || download.department === departmentFilter;
    
    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const handleDownload = async (downloadItem: AcademicDownload) => {
    const url = downloadItem.file_url || downloadItem.drive_url;
    if (url) {
      // For Google Drive links, open in new tab; for files, trigger download
      if (downloadItem.drive_url) {
        window.open(downloadItem.drive_url, '_blank');
      } else if (downloadItem.file_url) {
        const link = document.createElement('a');
        link.href = downloadItem.file_url;
        link.download = downloadItem.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Update download count
      try {
        await api.academicServices.update(downloadItem.id, { 
          download_count: (downloadItem.download_count || 0) + 1 
        });
        // Update local state
        setDownloads(prev => prev.map(item => 
          item.id === downloadItem.id 
            ? { ...item, download_count: (item.download_count || 0) + 1 }
            : item
        ));
      } catch (error) {
        console.error('Error updating download count:', error);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    return <File className="h-5 w-5 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Download className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Academic Downloads</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Access academic forms, syllabi, handbooks, and other important documents for students, faculty, and staff.
          </p>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-8 bg-accent/20 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Document Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-primary">Application Forms</h3>
              <p className="text-sm text-muted-foreground">Admission, scholarship, and other application forms</p>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-primary">Syllabi</h3>
              <p className="text-sm text-muted-foreground">Course syllabi for all departments and programs</p>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-primary">Handbooks</h3>
              <p className="text-sm text-muted-foreground">Student and faculty handbooks, guides</p>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm">
              <h3 className="font-medium text-primary">Regulations</h3>
              <p className="text-sm text-muted-foreground">Academic regulations and policies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Application Forms">Application Forms</SelectItem>
                <SelectItem value="Syllabi">Syllabi</SelectItem>
                <SelectItem value="Handbooks">Handbooks</SelectItem>
                <SelectItem value="Regulations">Regulations</SelectItem>
                <SelectItem value="Academic Calendar">Academic Calendar</SelectItem>
                <SelectItem value="Examination">Examination</SelectItem>
                <SelectItem value="Admission">Admission</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="CSE">Computer Science</SelectItem>
                <SelectItem value="IT">Information Technology</SelectItem>
                <SelectItem value="MCA">Master of Computer Applications</SelectItem>
                <SelectItem value="MBA">Master of Business Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredDownloads.length === 0 ? (
            <div className="text-center py-12">
              <Download className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Documents Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== "all" || departmentFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Documents will be uploaded here soon."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDownloads.map((download) => (
                <Card key={download.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {getFileIcon(download.file_type)}
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{download.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {download.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{download.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* File Info */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{download.file_type}</span>
                        {download.file_size && <span>{formatFileSize(download.file_size)}</span>}
                      </div>

                      {/* Department */}
                      {download.department && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Department:</span>
                          <Badge variant="outline">{download.department}</Badge>
                        </div>
                      )}

                      {/* Download Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{download.download_count} downloads</span>
                      </div>

                      <Button 
                        onClick={() => handleDownload(download)}
                        className="w-full"
                        disabled={!download.file_url && !download.drive_url}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {download.drive_url ? 'Open Link' : 'Download'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default DownloadsPage;