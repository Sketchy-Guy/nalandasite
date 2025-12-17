import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface AnimatedBarChartProps {
  data: BarData[];
  maxValue?: number;
  height?: number;
}

const AnimatedBarChart = ({ data, maxValue, height = 250 }: AnimatedBarChartProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const max = maxValue || Math.max(...data.map(d => d.value));

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-end justify-between gap-3 md:gap-6" style={{ height }}>
        {data.map((item, index) => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              className="w-full rounded-t-lg relative overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={isInView ? { 
                height: `${(item.value / max) * 100}%`,
                opacity: 1 
              } : {}}
              transition={{ 
                duration: 1,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{ 
                background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}88 100%)`,
                minHeight: isInView ? '20px' : '0px'
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={isInView ? { x: '100%' } : {}}
                transition={{ 
                  duration: 1.5,
                  delay: index * 0.15 + 0.5,
                  ease: "easeInOut"
                }}
              />
              <motion.span
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15 + 0.8 }}
              >
                {item.value}
              </motion.span>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-3 md:gap-6 mt-4 border-t border-border pt-4">
        {data.map((item, index) => (
          <motion.div
            key={`label-${item.label}`}
            className="flex-1 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <span className="text-xs md:text-sm text-muted-foreground font-medium">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedBarChart;
