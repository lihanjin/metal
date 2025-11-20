import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { KlineItem } from '@/hooks/use-kline-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { AreaChart, Area, XAxis, YAxis } from 'recharts';

interface PriceChartProps {
  klineList: KlineItem[];
}

export function PriceChart({ klineList }: PriceChartProps) {
  const { t } = useLanguage();
  const history = useMemo(() => {
    return (klineList || []).map((k) => ({
      timestamp: parseInt(k.timestamp) * 1000,
      price: parseFloat(k.close_price),
    }));
  }, [klineList]);

  if (history.length === 0) {
    return (
      <div className="h-24 bg-muted/50 rounded flex items-center justify-center text-xs text-muted-foreground">
        {t('prices.chartLoading')}
      </div>
    );
  }

  const isPositive = history[history.length - 1].price >= history[0].price;
  const config = { price: { label: t('prices.price'), color: isPositive ? '#10b981' : '#ef4444' } };

  return (
    <ChartContainer config={config} className="h-24 aspect-auto">
      <AreaChart data={history} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-price)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-price)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          hide={true}
        />
        <YAxis
          domain={["dataMin", "dataMax"]}
          hide={true}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="price" stroke="var(--color-price)" fill="url(#priceGradient)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ChartContainer>
  );
}
