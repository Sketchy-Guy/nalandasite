import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Award, Calendar, Mail, User, GraduationCap, Vote, Shield, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface StudentGovernance {
  id: string;
  position: string;
  student_name: string;
  department?: string;
  year?: number;
  bio?: string;
  photo_url?: string;
  term_start?: string;
  term_end?: string;
  contact_email?: string;
  responsibilities: string[];
  is_active: boolean;
}

const Governance = () => {
  const [members, setMembers] = useState<StudentGovernance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('student_governance')
        .select('*')
        .eq('is_active', true)
        .order('position');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching governance members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position: string) => {
    const lower = position.toLowerCase();
    if (lower.includes('president') || lower.includes('chairperson')) return Award;
    if (lower.includes('secretary')) return BookOpen;
    if (lower.includes('treasurer')) return Shield;
    return Users;
  };

  const getPositionBadgeColor = (position: string) => {
    const lower = position.toLowerCase();
    if (lower.includes('president') || lower.includes('chairperson')) return 'default';
    if (lower.includes('vice')) return 'secondary';
    if (lower.includes('secretary')) return 'outline';
    return 'secondary';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">Student Leadership</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Student Governance
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Empowering student voices through democratic representation. Our student council works 
              tirelessly to ensure your concerns are heard and your campus experience is exceptional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/activities">
                  <Vote className="mr-2 h-4 w-4" />
                  Student Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Join Clubs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Student Council Members */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Student Council Members</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet your elected representatives who work to make your voice heard
            </p>
          </motion.div>

          {members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Council Members Listed</h3>
              <p className="text-muted-foreground">
                Student governance information will be available soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, index) => {
                const Icon = getPositionIcon(member.position);
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          {member.photo_url ? (
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                              <img 
                                src={member.photo_url} 
                                alt={member.student_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon className="h-10 w-10 text-primary" />
                            </div>
                          )}
                        </div>
                        <Badge variant={getPositionBadgeColor(member.position)} className="mb-2">
                          {member.position}
                        </Badge>
                        <CardTitle className="text-lg">{member.student_name}</CardTitle>
                        {member.department && (
                          <CardDescription className="flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            {member.department}
                            {member.year && ` - Year ${member.year}`}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {member.bio && (
                          <p className="text-sm text-muted-foreground text-center">
                            {member.bio}
                          </p>
                        )}

                        {/* Term Information */}
                        {(member.term_start || member.term_end) && (
                          <div className="bg-muted/50 p-3 rounded-lg text-center">
                            <div className="flex items-center justify-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              Term: {member.term_start && new Date(member.term_start).getFullYear()}
                              {member.term_end && ` - ${new Date(member.term_end).getFullYear()}`}
                            </div>
                          </div>
                        )}

                        {/* Responsibilities */}
                        {member.responsibilities && member.responsibilities.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-center">Key Responsibilities</h4>
                            <div className="space-y-1">
                              {member.responsibilities.slice(0, 3).map((responsibility, idx) => (
                                <div key={idx} className="text-sm text-muted-foreground flex items-start">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                                  {responsibility}
                                </div>
                              ))}
                              {member.responsibilities.length > 3 && (
                                <div className="text-sm text-muted-foreground text-center">
                                  +{member.responsibilities.length - 3} more responsibilities
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Contact Information */}
                        {member.contact_email && (
                          <div className="border-t pt-4 text-center">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${member.contact_email}`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Contact
                              </a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Governance Overview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How Student Governance Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understanding our democratic processes and how students can participate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Vote className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Elections</CardTitle>
                <CardDescription>
                  Annual democratic elections where students vote for their representatives
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Representation</CardTitle>
                <CardDescription>
                  Council members represent student interests in academic and administrative matters
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Initiatives</CardTitle>
                <CardDescription>
                  Student-led initiatives and programs that enhance campus life and learning
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Award className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Get Involved in Student Leadership</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Shape your campus experience and make a difference. Join student governance, 
              participate in elections, or contribute to student-led initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/activities">
                  <Calendar className="mr-2 h-4 w-4" />
                  Student Activities
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/clubs">
                  <Users className="mr-2 h-4 w-4" />
                  Join Student Clubs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Governance;