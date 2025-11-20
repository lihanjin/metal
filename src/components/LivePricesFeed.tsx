import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { PriceChart } from './PriceChart';
import useKlineData, { KlineType } from '@/hooks/use-kline-data';
import { useTradeTickData } from '@/hooks/use-trade-tick-data';

// 贵金属显示数据类型
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
  Gold: 'Gold',
  Silver: 'Silver',
  Platinum: 'Platinum',
};

export function LivePricesFeed() {
  const { t } = useLanguage();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 获取三个品种的K线数据
  const { data: goldData, loading: goldLoading, refresh: goldRefresh } = useKlineData({
    code: 'GOLD',
    kline_type: KlineType.ONE_MINUTE,
  });

  const { data: silverData, loading: silverLoading, refresh: silverRefresh } = useKlineData({
    code: 'Silver',
    kline_type: KlineType.ONE_MINUTE,
  });

  const { data: platinumData, loading: platinumLoading, refresh: platinumRefresh } = useKlineData({
    code: 'Platinum',
    kline_type: KlineType.ONE_MINUTE,
  });

  // 合并 loading 状态
  const loading = goldLoading || silverLoading || platinumLoading;

  // 处理K线数据，转换为显示格式
  const metals = useMemo<MetalDisplay[]>(() => {
    // 创建默认的空数据
    const createEmptyMetal = (code: string): MetalDisplay => ({
      symbol: code,
      name: metalNameMap[code] || code,
      usdPerOz: 0,
      perGram: 0,
      changePercent: 0,
      bidPrice: 0,
      askPrice: 0,
      timestamp: Date.now(),
      price: '--',
    });

    const processKlineData = (klineData: any, code: string): MetalDisplay => {
      // 如果没有数据，返回空数据
      if (!klineData?.data?.kline_list || klineData.data.kline_list.length === 0) {
        return createEmptyMetal(code);
      }

      const klineList = klineData.data.kline_list;
      const latestKline = klineList[klineList.length - 1]; // 最新一根K线
      const previousKline = klineList[klineList.length - 2]; // 前一根K线

      // 当前价格使用最新K线的收盘价
      const currentPrice = parseFloat(latestKline.close_price);
      const { bid, ask } = calculateBidAsk(currentPrice);

      // 计算涨跌幅（与前一根K线对比）
      let changePercent = 0;
      if (previousKline) {
        const previousPrice = parseFloat(previousKline.close_price);
        changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
      }

      return {
        symbol: code,
        name: metalNameMap[code] || code,
        usdPerOz: currentPrice,
        perGram: ozToGrams(currentPrice),
        changePercent,
        bidPrice: bid,
        askPrice: ask,
        timestamp: parseInt(latestKline.timestamp) * 1000, // 转换为毫秒
        price: latestKline.close_price,
      };
    };

    // 始终返回三个品种，即使没有数据也显示
    return [
      processKlineData(goldData, 'GOLD'),
      processKlineData(silverData, 'Silver'),
      processKlineData(platinumData, 'Platinum'),
    ];
  }, [goldData, silverData, platinumData]);

  // 数据更新时更新时间戳（只要有任何一个品种有数据就更新）
  useEffect(() => {
    if (metals.some(m => m.price !== '--')) {
      setLastUpdate(new Date());
    }
  }, [metals]);

  // 刷新所有品种的数据
  const handleRefresh = () => {
    goldRefresh();
    silverRefresh();
    platinumRefresh();
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
          {loading && metals.every(m => m.price === '--') ? (
            // 加载状态 - 显示3个骨架屏
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-2">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-7 bg-muted rounded w-24 mb-4"></div>
                      <div className="h-8 bg-muted rounded w-32 mb-4"></div>
                      <div className="h-8 bg-muted rounded w-32 mb-4"></div>
                      <div className="h-32 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            // 显示实际数据（包括空数据）
            metals.map((metal) => (
              <Card
                key={metal.symbol}
                className="border-2 hover:border-accent/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{metal.name}</h3>
                    {metal.price !== '--' ? (
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
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold bg-muted/50 text-muted-foreground">
                        <span>--</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {t('prices.bid')}
                      </span>
                      <span className="text-2xl font-bold text-accent">
                        {metal.price === '--' ? '--' : `$${metal.bidPrice.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {t('prices.ask')}
                      </span>
                      <span className="text-2xl font-bold">
                        {metal.price === '--' ? '--' : `$${metal.askPrice.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          Per Troy Oz
                        </span>
                        <span className="text-sm font-semibold">
                          {metal.price === '--' ? '--' : `$${metal.usdPerOz.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Per Gram
                        </span>
                        <span className="text-sm font-semibold">
                          {metal.price === '--' ? '--' : `$${metal.perGram.toFixed(2)}`}
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
            ))
          )}
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>{t('prices.footer')}</p>
          <p className="mt-2">
            Data source: Alltick-API | Updated:{' '}
            {metals.some(m => m.price !== '--') 
              ? new Date(metals.find(m => m.price !== '--')?.timestamp || Date.now()).toLocaleString()
              : '--'}
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
  const { data } = useTradeTickData([{ code: 'GOLD' }]);

  // 处理黄金价格数据
  const goldPrice = useMemo<MetalDisplay | null>(() => {
    if (!data) return null;
    return (data as any)?.data?.tick_list?.find(
      (item: any) => item.code === 'GOLD'
    );
  }, [data]);

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
                ${goldPrice?.usdPerOz?||'--'}
              </div>
              <div className="text-sm text-muted-foreground">Per Troy Oz</div>
            </div> */}

            <div className="text-center p-6 rounded-lg bg-accent/10 border-2 border-accent">
              <div className="text-sm text-muted-foreground mb-2">
                {t('goldPrices.spot')}
              </div>
              <div className="text-3xl font-bold text-accent mb-1">
                $ {goldPrice?.price || '--'}
              </div>
              {/* <div className="text-sm">{t('goldPrices.premium')}: +1.60%</div> */}
            </div>

            {/* <div className="text-center p-6 rounded-lg bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">
                {t('goldPrices.buyback')}
              </div>
              <div className="text-3xl font-bold mb-1">
                ${goldPrice?.bidPrice?||'--'}
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
