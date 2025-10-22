import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Calendar, Download, FileText } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { api } from "@/lib/api";

interface Ordinance {
  id: string;
  title: string;
  description: string;
  category: string;
  effective_date: string;
  file_url?: string;
  is_active: boolean;
}

const OrdinancesPage = () => {
  const [ordinances, setOrdinances] = useState<Ordinance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrdinances();
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchOrdinances = async () => {
    try {
      const response = await api.academicServices.list();
      // Filter for ordinance-related services
      const ordinanceData = (response.results || []).filter((item: any) => 
        item.category?.toLowerCase().includes('ordinance') || 
        item.title?.toLowerCase().includes('ordinance') ||
        item.title?.toLowerCase().includes('regulation')
      );
      setOrdinances(ordinanceData);
    } catch (error) {
      console.error("Error fetching ordinances:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrdinances = ordinances.filter((ordinance) =>
    ordinance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ordinance.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
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
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Academic Ordinances</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Access official academic ordinances, regulations, and policies governing the institution's academic programs and procedures.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search ordinances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ordinances Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredOrdinances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrdinances.map((ordinance) => (
                <Card key={ordinance.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{ordinance.title}</CardTitle>
                        <CardDescription>{ordinance.description}</CardDescription>
                      </div>
                      <FileText className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Effective: {new Date(ordinance.effective_date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {ordinance.category}
                      </Badge>

                      {ordinance.file_url && (
                        <Button 
                          onClick={() => handleDownload(ordinance.file_url!, ordinance.title)}
                          className="w-full"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No ordinances found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms." : "Ordinances will be available here soon."}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrdinancesPage;
