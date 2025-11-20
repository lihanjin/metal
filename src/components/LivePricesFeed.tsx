import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import {
  useTradeTickData,
  DEFAULT_SYMBOLS,
} from '../hooks/use-trade-tick-data';
import { PriceChart } from './PriceChart';

interface MetalDisplay {
  symbol: string;
  name: string;
  usdPerOz: number;
  perGram: number;
  changePercent: number;
  bidPrice: number;
  askPrice: number;
  timestamp: number;
  price: string;
}

// 计算买入/卖出价格的辅助函数
const calculateBidAsk = (spotPrice: number) => {
  const spread = 0.016; // 1.6% 价差
  const halfSpread = spread / 2;
  return {
    bid: spotPrice * (1 - halfSpread),
    ask: spotPrice * (1 + halfSpread),
  };
};

// 将金衡盎司转换为克的辅助函数
const ozToGrams = (pricePerOz: number) => {
  return pricePerOz / 31.1035;
};

// 贵金属代码到显示名称的映射
const metalNameMap: Record<string, string> = {
  GOLD: 'Gold',
  Silver: 'Silver',
  Platinum: 'EUR/USD',
  EURUSD: 'EUR/USD',
  USDJPY: 'USD/JPY',
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
};

export function LivePricesFeed() {
  const { t } = useLanguage();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 使用 hook 获取交易数据
  const { data, loading, refresh } = useTradeTickData();

  // 处理从 alltick API 返回的数据
  const metals = useMemo<MetalDisplay[]>(() => {
    if (!data) return [];

    // TODO: 根据实际 API 响应结构调整此处
    // 这是一个占位符 - 需要根据真实数据格式更新
    const tickData = data as any; // 临时转换为 any - 根据实际 API 响应调整

    // 示例转换（根据实际 API 响应调整）
    const processedData = DEFAULT_SYMBOLS.slice(0, 3).map((symbol, index) => {
      // 模拟数据 - 替换为从 tickData 提取的实际数据
      const spotPrice = 2000 + Math.random() * 100; // 占位符
      const { bid, ask } = calculateBidAsk(spotPrice);

      return {
        symbol: symbol.code,
        name: metalNameMap[symbol.code] || symbol.code,
        usdPerOz: spotPrice,
        perGram: ozToGrams(spotPrice),
        changePercent: (Math.random() - 0.5) * 4, // 占位符
        bidPrice: bid,
        askPrice: ask,
        timestamp: Date.now(),
        price: spotPrice.toString(),
      };
    });

    return processedData;
  }, [data]);
  console.log("🚀 ~ LivePricesFeed ~ metals:", metals)

  // 数据更新时更新时间戳
  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
    }
  }, [data]);

  const handleRefresh = () => {
    refresh();
  };

  return (
    <section id="live-prices" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t('prices.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('prices.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <button
              onClick={handleRefresh}
              className="ml-2 p-1 rounded hover:bg-muted/50 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {metals.map((metal) => (
            <Card
              key={metal.symbol}
              className="border-2 hover:border-accent/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{metal.name}</h3>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold ${
                      metal.changePercent >= 0
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {metal.changePercent >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>
                      {metal.changePercent >= 0 ? '+' : ''}
                      {metal.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t('prices.bid')}
                    </span>
                    <span className="text-2xl font-bold text-accent">
                      ${metal.bidPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t('prices.ask')}
                    </span>
                    <span className="text-2xl font-bold">
                      ${metal.askPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Per Troy Oz
                      </span>
                      <span className="text-sm font-semibold">
                        ${metal.usdPerOz.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Per Gram
                      </span>
                      <span className="text-sm font-semibold">
                        ${metal.perGram.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 24小时价格图表 */}
                <div className="mt-6 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">
                    {t('prices.chart')}
                  </div>
                  <PriceChart
                    metalSymbol={metal.symbol}
                    currentPrice={metal.usdPerOz}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>{t('prices.footer')}</p>
          <p className="mt-2">
            Data source: Metals-API | Updated:{' '}
            {new Date(metals[0]?.timestamp || Date.now()).toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
}

// 附加的黄金实时价格小部件
export function LiveGoldPrices() {
  const { t } = useLanguage();

  // 仅获取黄金价格
  const { data,  } = useTradeTickData([{ code: 'GOLD' }]);

  // 处理黄金价格数据
  const goldPrice = useMemo<MetalDisplay | null>(() => {
    if (!data) return null;
    return (data as any)?.data?.tick_list?.find((item: any) => item.code === 'GOLD');
  }, [data]);
  console.log("🚀 ~ LiveGoldPrices ~ goldPrice:", goldPrice)

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });


  return (
    <section className="py-12 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{t('goldPrices.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('goldPrices.purity')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('goldPrices.updated')}: {currentTime}
            </p>
          </div>

          <div className="">
            {/* <div className="text-center p-6 rounded-lg bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">
                {t('goldPrices.spot')}
              </div>
              <div className="text-3xl font-bold mb-1">
                ${goldPrice?.usdPerOz?.toFixed(2)||'--'}
              </div>
              <div className="text-sm text-muted-foreground">Per Troy Oz</div>
            </div> */}

            <div className="text-center p-6 rounded-lg bg-accent/10 border-2 border-accent">
              <div className="text-sm text-muted-foreground mb-2">
              {t('goldPrices.spot')}
              </div>
              <div className="text-3xl font-bold text-accent mb-1">
                $ {goldPrice?.price||'--'}
              </div>
              {/* <div className="text-sm">{t('goldPrices.premium')}: +1.60%</div> */}
            </div>

            {/* <div className="text-center p-6 rounded-lg bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">
                {t('goldPrices.buyback')}
              </div>
              <div className="text-3xl font-bold mb-1">
                ${goldPrice?.bidPrice?.toFixed(2)||'--'}
              </div>
              <div className="text-sm text-accent">
                {t('goldPrices.bestRate')}
              </div>
            </div> */}
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>{t('goldPrices.footer')}</p>
            <p className="mt-2 text-xs">Live data from Alltick-API</p>
          </div>
        </div>
      </div>
    </section>
  );
}
