import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import awardCeremony from '@/assets/award-ceremony.jpg';

interface HeroImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const HeroSection = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await api.heroImages.list({ 
        is_active: true, 
        ordering: 'display_order',
        _t: Date.now() // Cache busting
      });
      
      const data = Array.isArray(response) ? response : (response.results || []);
      
      // Debug: Log the received data
      console.log('Hero Section - Received data:', data);
      console.log('Hero Section - Active images only:', data.filter(img => img.is_active));
      
      // If no images in database, use default images
      if (!data || data.length === 0) {
        setHeroImages([
          {
            id: 'default-1',
            title: 'Excellence in Education',
            description: 'Nalanda Institute of Technology - Shaping Future Leaders with Award-Winning Excellence',
            image_url: awardCeremony,
            display_order: 1,
            is_active: true
          }
        ]);
      } else {
        // Additional safety filter to ensure only active images
        const activeImages = data.filter(img => img.is_active === true);
        setHeroImages(activeImages);
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
      // Fallback to default image
      setHeroImages([
        {
          id: 'default-1',
          title: 'Excellence in Education',
          description: 'Nalanda Institute of Technology - Shaping Future Leaders with Award-Winning Excellence',
          image_url: awardCeremony,
          display_order: 1,
          is_active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPlaying && heroImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <section className="relative h-[70vh] bg-gradient-primary animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Hero Images */}
      <div className="relative w-full h-full">
        {heroImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.1 
            }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image.image_url})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              Award-Winning Institution
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {heroImages[currentSlide]?.title}
            </h1>
            {heroImages[currentSlide]?.description && (
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90">
                {heroImages[currentSlide].description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      {heroImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-20 right-4 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-0.5 h-8 bg-white/50"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;