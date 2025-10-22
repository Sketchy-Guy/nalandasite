import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Search } from "lucide-react";

interface Timetable {
  id: string;
  title: string;
  description: string;
  type: string;
  department: string;
  semester: string;
  academic_year: string;
  file_url: string;
  created_at: string;
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
      const { data, error } = await supabase
        .from("timetables")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTimetables(data || []);
    } catch (error) {
      console.error("Error fetching timetables:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTimetables = timetables.filter((timetable) => {
    const matchesSearch = timetable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timetable.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || timetable.type === typeFilter;
    const matchesDepartment = departmentFilter === "all" || timetable.department === departmentFilter;
    
    return matchesSearch && matchesType && matchesDepartment;
  });

  const handleDownload = (fileUrl: string, title: string) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                <SelectItem value="course">Course Schedule</SelectItem>
                <SelectItem value="exam">Exam Timetable</SelectItem>
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
                      <Badge variant={timetable.type === "exam" ? "destructive" : "default"}>
                        {timetable.type === "exam" ? "Exam" : "Course"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {timetable.department && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Department:</span>
                          <Badge variant="outline">{timetable.department}</Badge>
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
                      onClick={() => handleDownload(timetable.file_url, timetable.title)}
                      className="w-full"
                      disabled={!timetable.file_url}
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
    </div>
  );
};

export default TimetablePage;