import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Search } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

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
  external_link?: string;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  valid_from?: string;
  valid_to?: string;
  created_at: string;
  updated_at: string;
}

const TimetablePage = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await api.timetables.list();
      setTimetables(response.results || []);
    } catch (error) {
      console.error("Error fetching timetables:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTimetables = timetables.filter((timetable) => {
    const matchesSearch = timetable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timetable.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || timetable.timetable_type === typeFilter;
    const matchesDepartment = departmentFilter === "all" || timetable.department === departmentFilter;
    
    return matchesSearch && matchesType && matchesDepartment;
  });

  const handleDownload = async (fileUrl: string, title: string) => {
    if (fileUrl) {
      // For external links (Google Drive, etc.), open in new tab
      if (fileUrl.includes('drive.google.com') || fileUrl.includes('dropbox.com') || fileUrl.includes('onedrive.com')) {
        window.open(fileUrl, '_blank');
        return;
      }

      try {
        // Determine file extension from URL
        let extension = '.pdf'; // default
        const urlMatch = fileUrl.match(/\.([a-zA-Z0-9]+)(\?|$)/);
        if (urlMatch) {
          extension = `.${urlMatch[1]}`;
        }

        // For images and files from same domain, use fetch to force download
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        
        // Create blob URL and download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${title}${extension}`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up blob URL
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to opening in new tab
        window.open(fileUrl, '_blank');
      }
    }
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
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
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
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Academic Timetables</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Access course schedules, exam timetables, and important academic calendar information for all departments and semesters.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search timetables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="class">Class Timetable</SelectItem>
                <SelectItem value="exam">Exam Schedule</SelectItem>
                <SelectItem value="event">Event Schedule</SelectItem>
                <SelectItem value="lab">Lab Schedule</SelectItem>
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

      {/* Timetables Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredTimetables.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Timetables Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || typeFilter !== "all" || departmentFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Timetables will be uploaded here soon."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTimetables.map((timetable) => (
                <Card key={timetable.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{timetable.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {timetable.description}
                        </CardDescription>
                      </div>
                      <Badge variant={timetable.timetable_type === "exam" ? "destructive" : "default"}>
                        {timetable.timetable_type === "exam" ? "Exam" : timetable.timetable_type?.charAt(0).toUpperCase() + timetable.timetable_type?.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {timetable.department && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Department:</span>
                          <Badge variant="outline">{timetable.department_name || timetable.department}</Badge>
                        </div>
                      )}
                      {timetable.semester && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Semester:</span>
                          <Badge variant="outline">{timetable.semester}</Badge>
                        </div>
                      )}
                      {timetable.academic_year && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Academic Year:</span>
                          <Badge variant="outline">{timetable.academic_year}</Badge>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => handleDownload(timetable.image_url || timetable.external_link || timetable.file_url || '', timetable.title)}
                      className="w-full"
                      disabled={!timetable.image_url && !timetable.external_link && !timetable.file_url}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Timetable
                    </Button>
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

export default TimetablePage;