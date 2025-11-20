import { useEffect, useState } from 'react';
import { metalsApi, type PriceHistory } from '../services/metalsApi';

interface PriceChartProps {
  metalSymbol: string;
  currentPrice: number;
}

export function PriceChart({ metalSymbol, currentPrice }: PriceChartProps) {
  const [history, setHistory] = useState<PriceHistory[]>([]);

  useEffect(() => {
    // Generate 24-hour mock history for visualization
    const mockHistory = metalsApi.generateMockHistory(currentPrice, 24);
    setHistory(mockHistory);
  }, [currentPrice]);

  if (history.length === 0) {
    return (
      <div className="h-24 bg-muted/50 rounded flex items-center justify-center text-xs text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  // Calculate min/max for scaling
  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;

  // Generate SVG path for the price line
  const width = 100;
  const height = 100;
  const points = history.map((h, i) => {
    const x = (i / (history.length - 1)) * width;
    const normalizedPrice = ((h.price - minPrice) / priceRange);
    const y = height - (normalizedPrice * height);
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(' L ')}`;

  // Create area fill path
  const areaPath = `${pathData} L ${width},${height} L 0,${height} Z`;

  // Determine trend color
  const isPositive = history[history.length - 1].price >= history[0].price;
  const trendColor = isPositive ? '#10b981' : '#ef4444'; // green or red
  const trendColorLight = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';

  return (
    <div className="h-24 relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Area fill */}
        <path
          d={areaPath}
          fill={trendColorLight}
          opacity="0.3"
        />
        
        {/* Price line */}
        <path
          d={pathData}
          fill="none"
          stroke={trendColor}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Grid lines for reference */}
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Price labels */}
      <div className="absolute top-0 right-0 text-[10px] text-muted-foreground">
        ${maxPrice.toFixed(2)}
      </div>
      <div className="absolute bottom-0 right-0 text-[10px] text-muted-foreground">
        ${minPrice.toFixed(2)}
      </div>
    </div>
  );
}
