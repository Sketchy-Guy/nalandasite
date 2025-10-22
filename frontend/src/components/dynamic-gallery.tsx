import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaGallery } from './media-gallery';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon } from 'lucide-react';

interface DynamicGalleryProps {
  category: string;
  subcategory?: string;
  departmentId?: string;
  title?: string;
  maxImages?: number;
  className?: string;
}

interface GalleryPhoto {
  id: string;
  media_type: 'image' | 'video';
  image_url?: string;
  video_url?: string;
  media_url?: string;
  caption?: string;
  display_order: number;
}

export function DynamicGallery({ 
  category, 
  subcategory,
  departmentId,
  title = 'Photo Gallery',
  maxImages = 12,
  className = ''
}: DynamicGalleryProps) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, [category, subcategory, departmentId]);

  const fetchPhotos = async () => {
    try {
      if (departmentId) {
        // Fetch department gallery images
        const data = await api.departmentGalleryImages.list({ department: departmentId });
        const galleryImages = data.results || data || [];
        
        // Convert to MediaGallery format
        const photos = galleryImages.slice(0, maxImages).map((img: any) => ({
          id: img.id,
          media_type: img.media_type || 'image',
          image_url: img.image_url,
          video_url: img.video_url,
          media_url: img.media_url || img.image_url || img.video_url,
          caption: img.caption || 'Gallery Image',
          display_order: img.display_order || 0
        }));
        
        setPhotos(photos);
      } else {
        // For other categories, you might want to implement a different API call
        // For now, just set empty array
        setPhotos([]);
      }
    } catch (error) {
      console.error('Error fetching gallery photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (photos.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No media available in this gallery.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {title}
            </CardTitle>
            <Badge variant="secondary">
              {photos.length} {photos.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <MediaGallery media={photos} />
        </CardContent>
      </Card>
    </motion.div>
  );
}