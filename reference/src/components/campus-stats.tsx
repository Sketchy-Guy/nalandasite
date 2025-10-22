import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface CampusStat {
  id: string;
  stat_name: string;
  stat_value: string;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
}

const CampusStats = () => {
  const [stats, setStats] = useState<CampusStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('campus_stats')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      
      // If no stats in database, use default stats
      if (!data || data.length === 0) {
        setStats([
          {
            id: 'default-1',
            stat_name: 'Students Enrolled',
            stat_value: '5000+',
            description: 'Active students across all programs',
            icon: 'users',
            display_order: 1,
            is_active: true
          },
          {
            id: 'default-2',
            stat_name: 'Faculty Members',
            stat_value: '200+',
            description: 'Experienced faculty across departments',
            icon: 'graduation-cap',
            display_order: 2,
            is_active: true
          },
          {
            id: 'default-3',
            stat_name: 'Awards Won',
            stat_value: '50+',
            description: 'Recognition for excellence',
            icon: 'award',
            display_order: 3,
            is_active: true
          },
          {
            id: 'default-4',
            stat_name: 'Placement Rate',
            stat_value: '95%',
            description: 'Successful career placement',
            icon: 'trending-up',
            display_order: 4,
            is_active: true
          }
        ]);
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching campus stats:', error);
      // Use fallback stats
      setStats([
        {
          id: 'default-1',
          stat_name: 'Students Enrolled',
          stat_value: '5000+',
          description: 'Active students across all programs',
          icon: 'users',
          display_order: 1,
          is_active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'users':
        return <Users className="h-8 w-8" />;
      case 'graduation-cap':
        return <GraduationCap className="h-8 w-8" />;
      case 'award':
        return <Award className="h-8 w-8" />;
      case 'trending-up':
        return <TrendingUp className="h-8 w-8" />;
      default:
        return <TrendingUp className="h-8 w-8" />;
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="h-8 w-8 bg-muted rounded mx-auto mb-4"></div>
                  <div className="h-8 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            NIT by Numbers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our achievements and growth in numbers that speak of our commitment to excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center hover:shadow-elegant transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center">
                    {getIcon(stat.icon)}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {stat.stat_value}
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-1">
                    {stat.stat_name}
                  </div>
                  {stat.description && (
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampusStats;