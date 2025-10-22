import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from '@/components/ui/dialog';
// import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Play, X, Download } from 'lucide-react';

interface MediaItem {
  id: string;
  media_type: 'image' | 'video';
  image_url?: string;
  video_url?: string;
  media_url?: string;
  caption?: string;
  display_order: number;
}

interface MediaGalleryProps {
  media: MediaItem[] | string[];
  className?: string;
}

export function MediaGallery({ media, className = '' }: MediaGalleryProps) {

  // Download function for media files
  const downloadMedia = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Handle legacy string array format
  const mediaItems: MediaItem[] = media.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `legacy-${index}`,
        media_type: 'image' as const,
        image_url: item,
        media_url: item,
        caption: undefined, // No caption for legacy items
        display_order: index
      };
    }
    return item;
  });

  const getMediaUrl = (item: MediaItem) => {
    if (item.media_type === 'video') {
      return item.video_url || item.media_url;
    }
    return item.image_url || item.media_url;
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
      {mediaItems.map((item, index) => (
        <Dialog key={item.id || index}>
          <DialogTrigger asChild>
            <div className="relative group cursor-pointer overflow-hidden rounded-lg bg-muted">
              {item.media_type === 'video' ? (
                <div className="relative">
                  <video
                    src={getMediaUrl(item)}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-2xl border border-white/20 hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-black ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-md border border-white/20" 
                       style={{ background: 'linear-gradient(to right, rgba(239, 68, 68, 0.8), rgba(236, 72, 153, 0.8))' }}>
                    🎥 Video
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={getMediaUrl(item)}
                    alt={item.caption || `Gallery item ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-md border border-white/20"
                       style={{ background: 'linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))' }}>
                    📷 Photo
                  </div>
                </div>
              )}
              
              {item.caption && item.caption.trim() && item.caption !== 'Gallery Image' && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-3 backdrop-blur-sm">
                  <p className="text-foreground text-sm font-medium truncate">
                    {item.caption}
                  </p>
                </div>
              )}
            </div>
          </DialogTrigger>
          
          <DialogContent className="max-w-6xl max-h-[95vh] p-0 border-0 shadow-2xl bg-transparent backdrop-blur-3xl [&>button]:!hidden"
                         style={{
                           background: 'rgba(255, 255, 255, 0.05)',
                           backdropFilter: 'blur(25px)',
                           WebkitBackdropFilter: 'blur(25px)',
                           border: '1px solid rgba(255, 255, 255, 0.1)'
                         }}>
            <DialogTitle className="sr-only">
              Media Preview
            </DialogTitle>
            
            {/* Custom Control Buttons */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              {/* Download Button */}
              <button
                onClick={() => {
                  const url = getMediaUrl(item);
                  const urlParts = url.split('.');
                  const extension = urlParts[urlParts.length - 1] || (item.media_type === 'video' ? 'mp4' : 'jpg');
                  const filename = `${item.media_type}_${item.id}.${extension}`;
                  downloadMedia(url, filename);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
                aria-label="Download"
              >
                <Download className="h-4 w-4" />
              </button>
              
              {/* Custom Close Button */}
              <DialogClose asChild>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)'
                  }}
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>
            
            <div className="relative flex items-center justify-center min-h-[80vh] p-4">
              {/* Enhanced frosted glass background with multiple layers */}
              <div className="absolute inset-0 rounded-xl" 
                   style={{
                     background: `
                       radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
                       radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 60%),
                       radial-gradient(circle at 20% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                       linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)
                     `,
                     backdropFilter: 'blur(40px)',
                     WebkitBackdropFilter: 'blur(40px)',
                     border: '1px solid rgba(255, 255, 255, 0.15)',
                     boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                   }} />
              
              {/* Media content */}
              <div className="relative z-10 max-w-full max-h-full flex flex-col items-center">
                {item.media_type === 'video' ? (
                  <video
                    src={getMediaUrl(item)}
                    className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    }}
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={getMediaUrl(item)}
                    alt=""
                    className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                    style={{
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    }}
                  />
                )}
                
                {/* Enhanced caption with frosted glass background */}
                {item.caption && item.caption.trim() && item.caption !== 'Gallery Image' && (
                  <div className="mt-6 px-8 py-4 rounded-2xl shadow-lg"
                       style={{
                         background: 'rgba(255, 255, 255, 0.1)',
                         backdropFilter: 'blur(20px)',
                         WebkitBackdropFilter: 'blur(20px)',
                         border: '1px solid rgba(255, 255, 255, 0.2)',
                         boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.1)'
                       }}>
                    <p className="text-foreground text-sm font-medium text-center">
                      {item.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
