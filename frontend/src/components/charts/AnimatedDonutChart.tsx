import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface AnimatedDonutChartProps {
  data: DonutData[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

const AnimatedDonutChart = ({ 
  data, 
  size = 200, 
  strokeWidth = 24,
  centerLabel,
  centerValue
}: AnimatedDonutChartProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercent = 0;

  return (
    <div ref={ref} className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        
        {/* Data segments */}
        {data.map((item, index) => {
          const percent = item.value / total;
          const strokeDasharray = `${circumference * percent - 4} ${circumference}`;
          const rotation = cumulativePercent * 360;
          cumulativePercent += percent;

          return (
            <motion.circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ 
                strokeDashoffset: circumference,
                rotate: rotation
              }}
              animate={isInView ? { 
                strokeDashoffset: 0,
                rotate: rotation
              } : {}}
              transition={{
                duration: 1.2,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              style={{
                transformOrigin: 'center',
                transform: `rotate(${rotation}deg)`
              }}
            />
          );
        })}
      </svg>
      
      {/* Center content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {centerValue && (
          <span className="text-2xl font-bold text-foreground">{centerValue}</span>
        )}
        {centerLabel && (
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        )}
      </motion.div>
    </div>
  );
};

export default AnimatedDonutChart;
