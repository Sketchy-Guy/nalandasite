import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Users, Award, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DepartmentHero } from './department-hero';
import { FacultyCard } from './faculty-card';
import { PhotoGallery } from './photo-gallery';
import { PageLayout } from './page-layout';
import { ContentWithImage } from './content-with-image';
import { DynamicGallery } from './dynamic-gallery';
import { motion } from 'framer-motion';
import Header from './header';
import Footer from './footer';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  head_name: string;
  contact_email: string;
  hero_image_url: string;
  gallery_images: string[];
  mission: string;
  vision: string;
  facilities: string[];
  programs_offered: string[];
  achievements: string[];
  location_details: string;
}

interface Faculty {
  id: string;
  full_name: string;
  email: string;
  designation: string;
  qualifications: string;
  research_areas: string[];
  photo_url: string;
}

interface DepartmentTemplateProps {
  departmentCode: string;
  fallbackData?: Partial<Department>;
}

export function DepartmentTemplate({ departmentCode, fallbackData }: DepartmentTemplateProps) {
  const [department, setDepartment] = useState<Department | null>(null);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        // Fetch department data
        const { data: deptData } = await supabase
          .from('departments')
          .select('*')
          .eq('code', departmentCode.toUpperCase())
          .single();

        if (deptData) {
          setDepartment(deptData);
        } else if (fallbackData) {
          setDepartment({
            id: '',
            code: departmentCode.toUpperCase(),
            name: fallbackData.name || departmentCode,
            description: fallbackData.description || '',
            head_name: fallbackData.head_name || '',
            contact_email: fallbackData.contact_email || '',
            hero_image_url: fallbackData.hero_image_url || '',
            gallery_images: fallbackData.gallery_images || [],
            mission: fallbackData.mission || '',
            vision: fallbackData.vision || '',
            facilities: fallbackData.facilities || [],
            programs_offered: fallbackData.programs_offered || [],
            achievements: fallbackData.achievements || [],
            location_details: fallbackData.location_details || ''
          });
        }

        // Fetch faculty data
        const { data: facultyData } = await supabase
          .from('profiles')
          .select(`
            id, full_name, email, designation, qualifications, research_areas, photo_url,
            faculty_departments!inner(department_id, is_hod)
          `)
          .eq('role_type', 'faculty')
          .eq('faculty_departments.department_id', deptData?.id);

        if (facultyData) {
          setFaculty(facultyData);
        }
      } catch (error) {
        console.error('Error fetching department data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [departmentCode, fallbackData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Department Not Found</h1>
          <p className="text-muted-foreground">The requested department could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Enhanced Hero Section */}
        <DepartmentHero 
          title={department.name}
          description={department.description}
          imageUrl={department.hero_image_url}
        />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Department Overview */}
            <ContentWithImage
              title="Department Overview"
              content={department.description || "Our department is committed to excellence in education, research, and innovation."}
              imageUrl={department.hero_image_url || "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
              imagePosition="right"
            />

            {/* Mission & Vision */}
            {(department.mission || department.vision) && (
              <div className="grid md:grid-cols-2 gap-8">
                {department.mission && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full shadow-card hover:shadow-elegant transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Our Mission
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{department.mission}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                {department.vision && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full shadow-card hover:shadow-elegant transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-primary" />
                          Our Vision
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{department.vision}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}

            {/* Programs Offered */}
            {department.programs_offered && department.programs_offered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Programs Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {department.programs_offered.map((program, index) => (
                        <div key={index} className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                          <Badge variant="secondary" className="w-full justify-center">{program}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Facilities */}
            {department.facilities && department.facilities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>State-of-the-Art Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {department.facilities.map((facility, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                          <h4 className="font-semibold text-sm text-foreground">{facility}</h4>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Faculty */}
            {faculty.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Our Faculty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {faculty.map((member) => (
                        <FacultyCard key={member.id} faculty={member} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Achievements */}
            {department.achievements && department.achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Our Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {department.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                          <span className="text-muted-foreground leading-relaxed">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Department Gallery */}
            <DynamicGallery
              category="departments"
              subcategory={departmentCode.toLowerCase()}
              title="Department Gallery"
              className="shadow-card"
            />

            {/* Legacy Gallery (fallback) */}
            {department.gallery_images && department.gallery_images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Photo Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PhotoGallery images={department.gallery_images} />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {department.head_name && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Head of Department</p>
                            <p className="font-semibold">{department.head_name}</p>
                          </div>
                        </div>
                      )}
                      
                      {department.contact_email && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold">
                              <a href={`mailto:${department.contact_email}`} className="text-primary hover:underline">
                                {department.contact_email}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {department.location_details && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-semibold">{department.location_details}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}