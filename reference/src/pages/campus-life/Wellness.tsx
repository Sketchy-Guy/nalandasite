import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Clock, Users, MapPin, Phone, Mail, Calendar, Activity, Stethoscope, Brain, Dumbbell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface WellnessProgram {
  id: string;
  name: string;
  description: string;
  program_type: string;
  instructor?: string;
  schedule?: string;
  duration_minutes?: number;
  max_participants?: number;
  location?: string;
  fee?: number;
  image_url?: string;
  registration_required: boolean;
  is_active: boolean;
}

const Wellness = () => {
  const [programs, setPrograms] = useState<WellnessProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('wellness_programs')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching wellness programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgramIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fitness':
        return Dumbbell;
      case 'mental':
      case 'counseling':
        return Brain;
      case 'medical':
      case 'health':
        return Stethoscope;
      default:
        return Activity;
    }
  };

  const getProgramBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fitness':
        return 'default';
      case 'mental':
      case 'counseling':
        return 'secondary';
      case 'medical':
      case 'health':
        return 'destructive';
      default:
        return 'outline';
    }
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
            <Badge variant="outline" className="mb-4">Wellness & Health</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Wellness Community Centre
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your health and well-being are our priority. Discover comprehensive wellness programs, 
              fitness facilities, and mental health support designed to keep you healthy and balanced.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/sports">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Fitness Center
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/activities">
                  <Calendar className="mr-2 h-4 w-4" />
                  Wellness Events
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wellness Programs */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Wellness Programs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our comprehensive wellness programs designed for your physical and mental well-being
            </p>
          </motion.div>

          {programs.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Programs Available</h3>
              <p className="text-muted-foreground">
                Wellness programs information will be available soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => {
                const Icon = getProgramIcon(program.program_type);
                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="group hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <Badge variant={getProgramBadgeColor(program.program_type)}>
                            {program.program_type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        {program.description && (
                          <CardDescription>{program.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {program.image_url && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={program.image_url} 
                              alt={program.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          {program.instructor && (
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              Instructor: {program.instructor}
                            </div>
                          )}
                          {program.schedule && (
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {program.schedule}
                            </div>
                          )}
                          {program.duration_minutes && (
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              Duration: {program.duration_minutes} minutes
                            </div>
                          )}
                          {program.location && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {program.location}
                            </div>
                          )}
                          {program.max_participants && (
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              Max participants: {program.max_participants}
                            </div>
                          )}
                        </div>

                        {program.fee !== undefined && program.fee > 0 && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <div className="font-medium text-primary">₹{program.fee}</div>
                            <div className="text-sm text-muted-foreground">Program Fee</div>
                          </div>
                        )}

                        {program.registration_required && (
                          <div className="flex items-center text-sm text-orange-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Registration required
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

      {/* Services Overview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Wellness Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive health and wellness support for all students
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Stethoscope className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Medical Services</CardTitle>
                <CardDescription>
                  On-campus medical facility with qualified healthcare professionals
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Mental Health Support</CardTitle>
                <CardDescription>
                  Counseling services and mental wellness programs for student support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Fitness Programs</CardTitle>
                <CardDescription>
                  Yoga, meditation, fitness classes, and wellness workshops
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
            <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Prioritize Your Well-being</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take charge of your health and wellness journey. Our comprehensive programs and 
              services are designed to support your physical, mental, and emotional well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/campus-life/sports">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Fitness Facilities
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/campus-life/activities">
                  <Calendar className="mr-2 h-4 w-4" />
                  Wellness Events
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Wellness;