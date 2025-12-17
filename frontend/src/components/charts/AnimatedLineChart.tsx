import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LineData {
  label: string;
  value: number;
}

interface AnimatedLineChartProps {
  data: LineData[];
  height?: number;
  color?: string;
}

const AnimatedLineChart = ({
  data,
  height = 200,
  color = "hsl(var(--primary))"
}: AnimatedLineChartProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const width = 100;
  const chartHeight = height - 20;
  const stepX = width / (data.length - 1);

  const points = data.map((item, index) => ({
    x: index * stepX,
    y: chartHeight - ((item.value - minValue) / range) * (chartHeight - 10) - 5
  }));

  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const prev = points[index - 1];
    const cp1x = prev.x + (point.x - prev.x) / 3;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) * 2 / 3;
    const cp2y = point.y;

    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, '');

  const areaPath = `${pathD} L ${width} ${chartHeight} L 0 ${chartHeight} Z`;
  const pathLength = 1000;

  return (
    <div ref={ref} className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--chart-2))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <motion.line
            key={i}
            x1="0"
            y1={5 + (i * (chartHeight - 10) / 4)}
            x2={width}
            y2={5 + (i * (chartHeight - 10) / 4)}
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.5 } : {}}
            transition={{ delay: i * 0.1 }}
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill="url(#lineGradient)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#strokeGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ pathLength }}
        />

        {/* Data points */}
        {points.map((point, index) => (
          <motion.g key={index}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="hsl(var(--background))"
              stroke={color}
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.5 + index * 0.1 }}
            />
            <motion.text
              x={point.x}
              y={point.y - 8}
              textAnchor="middle"
              className="text-[6px] fill-foreground font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              {data[index].value}
            </motion.text>
          </motion.g>
        ))}
      </svg>

      {/* Labels */}
      <div className="flex justify-between mt-1 px-1">
        {data.map((item, index) => (
          <motion.span
            key={index}
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            {item.label}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default AnimatedLineChart;
