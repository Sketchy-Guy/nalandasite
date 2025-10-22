import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ContentWithImageProps {
  title: string;
  content: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'bottom';
  imageAspect?: number;
  children?: React.ReactNode;
  className?: string;
}

export function ContentWithImage({
  title,
  content,
  imageUrl,
  imagePosition = 'right',
  imageAspect = 16/9,
  children,
  className = ''
}: ContentWithImageProps) {
  const isHorizontal = imagePosition === 'left' || imagePosition === 'right';
  
  return (
    <Card className={`overflow-hidden shadow-card ${className}`}>
      <CardContent className="p-0">
        <div className={`grid ${isHorizontal ? 'md:grid-cols-2' : 'grid-cols-1'} gap-0`}>
          {/* Content Section */}
          <motion.div
            className={`p-8 flex flex-col justify-center ${
              imagePosition === 'right' ? 'order-1' : 
              imagePosition === 'left' ? 'order-2' : 
              imagePosition === 'bottom' ? 'order-1' : 'order-2'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {title}
            </h3>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="leading-relaxed mb-6">
                {content}
              </p>
            </div>
            {children}
          </motion.div>

          {/* Image Section */}
          {imageUrl && (
            <motion.div
              className={`${
                imagePosition === 'left' ? 'order-1' : 
                imagePosition === 'right' ? 'order-2' : 
                imagePosition === 'top' ? 'order-1' : 'order-2'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <AspectRatio ratio={imageAspect} className="bg-muted">
                <img
                  src={imageUrl}
                  alt={title}
                  className="object-cover w-full h-full rounded-lg"
                  loading="lazy"
                />
              </AspectRatio>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}