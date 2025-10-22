import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';

interface EnhancedHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  badge?: string;
  children?: React.ReactNode;
  height?: 'small' | 'medium' | 'large';
  gradient?: boolean;
}

export function EnhancedHero({ 
  title, 
  subtitle, 
  description, 
  imageUrl, 
  badge,
  children,
  height = 'medium',
  gradient = true 
}: EnhancedHeroProps) {
  const getHeight = () => {
    switch (height) {
      case 'small': return 'h-[40vh] min-h-[300px]';
      case 'large': return 'h-[80vh] min-h-[600px]';
      default: return 'h-[60vh] min-h-[400px]';
    }
  };

  return (
    <section className={`relative ${getHeight()} overflow-hidden flex items-center`}>
      {/* Background Image */}
      {imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      {/* Gradient Background (fallback or overlay) */}
      {gradient && (
        <div className={`absolute inset-0 ${imageUrl ? 'bg-gradient-to-r from-black/60 to-black/30' : 'hero-gradient'}`} />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {badge && (
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {badge}
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {title}
            </h1>
            
            {subtitle && (
              <h2 className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
                {subtitle}
              </h2>
            )}
            
            {description && (
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/80 leading-relaxed">
                {description}
              </p>
            )}
            
            {children}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Explore</span>
          <ChevronDown className="h-5 w-5" />
        </div>
      </motion.div>
    </section>
  );
}