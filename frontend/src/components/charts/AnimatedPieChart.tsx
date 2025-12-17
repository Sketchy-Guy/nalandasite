import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface PieData {
  label: string;
  value: number;
  color: string;
}

interface AnimatedPieChartProps {
  data: PieData[];
  size?: number;
}

const AnimatedPieChart = ({ data, size = 280 }: AnimatedPieChartProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercent = 0;

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {data.map((item, index) => {
          const percent = item.value / total;
          const strokeDasharray = `${circumference * percent} ${circumference}`;
          const strokeDashoffset = -circumference * cumulativePercent;
          cumulativePercent += percent;

          return (
            <motion.circle
              key={item.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={40}
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={isInView ? { strokeDashoffset } : {}}
              transition={{
                duration: 1.5,
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="drop-shadow-lg"
            />
          );
        })}
      </svg>
      
      {/* Center text */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <span className="text-3xl font-bold text-foreground">{total}</span>
        <span className="text-sm text-muted-foreground">Total</span>
      </motion.div>
    </div>
  );
};

export default AnimatedPieChart;
