import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { metalsApi, type MetalPrice } from '../services/metalsApi';
import { PriceChart } from './PriceChart';

interface MetalDisplay extends MetalPrice {
  bidPrice: number;
  askPrice: number;
}

export function LivePricesFeed() {
  const { t } = useLanguage();
  const [metals, setMetals] = useState<MetalDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const prices = await metalsApi.getLatestPrices();
      
      // Convert to display format with bid/ask
      const displayPrices = prices.slice(0, 3).map(metal => {
        const { bid, ask } = metalsApi.calculateBidAsk(metal.usdPerOz);
        return {
          ...metal,
          bidPrice: bid,
          askPrice: ask
        };
      });
      
      setMetals(displayPrices);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch metal prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

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
              onClick={fetchPrices} 
              className="ml-2 p-1 rounded hover:bg-muted/50 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {loading && metals.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-accent" />
            <p className="mt-4 text-muted-foreground">Loading live prices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {metals.map((metal) => (
            <Card key={metal.symbol} className="border-2 hover:border-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{metal.name}</h3>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold ${
                    metal.changePercent >= 0 
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                      : 'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {metal.changePercent >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{metal.changePercent >= 0 ? '+' : ''}{metal.changePercent.toFixed(2)}%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('prices.bid')}</span>
                    <span className="text-2xl font-bold text-accent">
                      ${metal.bidPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('prices.ask')}</span>
                    <span className="text-2xl font-bold">
                      ${metal.askPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Per Troy Oz</span>
                      <span className="text-sm font-semibold">
                        ${metal.usdPerOz.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Per Gram</span>
                      <span className="text-sm font-semibold">
                        ${metal.perGram.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 24-Hour Price Chart */}
                <div className="mt-6 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">{t('prices.chart')}</div>
                  <PriceChart metalSymbol={metal.symbol} currentPrice={metal.usdPerOz} />
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>{t('prices.footer')}</p>
          <p className="mt-2">Data source: Metals-API | Updated: {new Date(metals[0]?.timestamp || Date.now()).toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
}

// Additional live gold prices widget
export function LiveGoldPrices() {
  const { t } = useLanguage();
  const [goldPrice, setGoldPrice] = useState<MetalDisplay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const prices = await metalsApi.getLatestPrices();
        const gold = prices.find(p => p.symbol === 'GOLD');
        
        if (gold) {
          const { bid, ask } = metalsApi.calculateBidAsk(gold.usdPerOz);
          setGoldPrice({
            ...gold,
            bidPrice: bid,
            askPrice: ask
          });
        }
      } catch (error) {
        console.error('Failed to fetch gold price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoldPrice();
    const interval = setInterval(fetchGoldPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });

  if (loading || !goldPrice) {
    return (
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-accent" />
            <p className="mt-4 text-muted-foreground">Loading gold prices...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{t('goldPrices.title')}</h3>
            <p className="text-sm text-muted-foreground">{t('goldPrices.purity')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('goldPrices.updated')}: {currentTime}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">{t('goldPrices.spot')}</div>
              <div className="text-3xl font-bold mb-1">${goldPrice.usdPerOz.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Per Troy Oz</div>
            </div>

            <div className="text-center p-6 rounded-lg bg-accent/10 border-2 border-accent">
              <div className="text-sm text-muted-foreground mb-2">{t('goldPrices.sell')}</div>
              <div className="text-3xl font-bold text-accent mb-1">${goldPrice.askPrice.toFixed(2)}</div>
              <div className="text-sm">{t('goldPrices.premium')}: +1.60%</div>
            </div>

            <div className="text-center p-6 rounded-lg bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">{t('goldPrices.buyback')}</div>
              <div className="text-3xl font-bold mb-1">${goldPrice.bidPrice.toFixed(2)}</div>
              <div className="text-sm text-accent">{t('goldPrices.bestRate')}</div>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>{t('goldPrices.footer')}</p>
            <p className="mt-2 text-xs">Live data from Metals-API</p>
          </div>
        </div>
      </div>
    </section>
  );
}
