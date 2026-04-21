import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const videos = [
  {
    id: 1,
    embedId: '-blXRzxR0sE',
    title: 'Nalanda Institute of Technology, Bhubaneswar | Campus Tour | Placements | Admissions Open 2026',
    description: 'Discover excellence in education at NIT Bhubaneswar — a premier destination for aspiring engineers and future innovators.',
    available: true,
  },
  {
    id: 2,
    embedId: null,
    title: 'Coming Soon',
    description: 'Another exciting video about our campus life and achievements is on its way.',
    available: false,
  },
  {
    id: 3,
    embedId: null,
    title: 'Coming Soon',
    description: 'Stay tuned for more highlights from Nalanda Institute of Technology.',
    available: false,
  },
];

const VideoHighlights = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary mb-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            Watch &amp; Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            NIT Bhubaneswar in Action
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what life, learning, and success look like at Nalanda Institute of Technology.
          </p>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="flex flex-col rounded-2xl overflow-hidden shadow-lg border border-border/50 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Video / Placeholder */}
              {video.available && video.embedId ? (
                <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 */ }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.embedId}?si=gsQ4KAHRXfoGOtxn&rel=0&modestbranding=1`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full bg-gradient-to-br from-muted/60 to-muted flex flex-col items-center justify-center" style={{ paddingTop: '56.25%' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary/50 ml-0.5" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Coming Soon</span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className={`font-semibold text-base leading-snug mb-2 line-clamp-2 ${video.available ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoHighlights;
