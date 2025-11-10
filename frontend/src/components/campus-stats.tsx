import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, GraduationCap, BookOpen, Building, Star, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import nitByNumbersImg from '@/assets/nitbynumbers.jpg';

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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/campus-stats/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const statsArray = data.results || data;
        
        // If no stats in database, use default stats
        if (!statsArray || statsArray.length === 0) {
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
          setStats(statsArray);
        }
      } else {
        throw new Error('Failed to fetch campus statistics');
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
    const iconClass = "h-8 w-8 text-white";
    switch (iconName?.toLowerCase()) {
      case 'users':
        return <Users className={iconClass} />;
      case 'graduationcap':
      case 'graduation-cap':
        return <GraduationCap className={iconClass} />;
      case 'award':
        return <Award className={iconClass} />;
      case 'trophy':
        return <Award className={iconClass} />;
      case 'trending-up':
      case 'trendingup':
        return <TrendingUp className={iconClass} />;
      case 'bookopen':
      case 'book-open':
        return <BookOpen className={iconClass} />;
      case 'building':
        return <Building className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'target':
        return <Target className={iconClass} />;
      default:
        return <TrendingUp className={iconClass} />;
    }
  };

  const getIconGradient = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'users':
        return 'from-blue-500 to-purple-500';
      case 'graduationcap':
      case 'graduation-cap':
        return 'from-green-500 to-teal-500';
      case 'award':
      case 'trophy':
        return 'from-yellow-500 to-orange-500';
      case 'trending-up':
      case 'trendingup':
        return 'from-lime-500 to-green-500';
      case 'bookopen':
      case 'book-open':
        return 'from-emerald-500 to-cyan-500';
      case 'building':
        return 'from-gray-500 to-slate-600';
      case 'star':
        return 'from-amber-500 to-yellow-500';
      case 'target':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-blue-500 to-purple-500';
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
    <section className="py-16 relative overflow-hidden">
      {/* Background image with opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${nitByNumbersImg})` }}
      ></div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-muted/15 to-muted/25 pointer-events-none"></div>
      
      {/* Additional glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
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
              className="h-full"
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/15 hover:border-white/30 shadow-lg hover:shadow-xl h-full">
                <CardContent className="p-6 relative h-full flex flex-col justify-between min-h-[280px]">
                  
                  {/* Content with relative positioning */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Top section - Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${getIconGradient(stat.icon)} shadow-md border border-white/30 hover:shadow-lg transition-all duration-300`}>
                        {getIcon(stat.icon)}
                      </div>
                    </div>
                    
                    {/* Middle section - Value and Title */}
                    <div className="flex-grow flex flex-col justify-center">
                      <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        {stat.stat_value}
                      </div>
                      <div className="text-lg font-semibold text-foreground mb-2">
                        {stat.stat_name}
                      </div>
                    </div>
                    
                    {/* Bottom section - Description */}
                    <div className="mt-auto">
                      {stat.description && (
                        <p className="text-sm text-muted-foreground">
                          {stat.description}
                        </p>
                      )}
                    </div>
                  </div>
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