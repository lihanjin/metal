import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTradeTickData } from '../hooks/use-trade-tick-data';

// 将金衡盎司转换为克的辅助函数
const ozToGrams = (pricePerOz: number) => {
  return pricePerOz / 31.1035;
};

// 产品配置（固定信息）
const productConfigs = [
  {
    name: 'Gold Bar 1g',
    weight: '1 Gram',
    weightInGrams: 1,
    refinery: 'PAMP Suisse',
    premium: 0.05, // 5% 溢价
    image: 'https://storage.googleapis.com/blink-core-storage/projects/passto-metal-gold-bullion-portal-2ygkmcpt/images/generated-image-1763535234380-0.webp'
  },
  {
    name: 'Gold Bar 1 Tael',
    weight: '1 Tael (37.5g)',
    weightInGrams: 37.5,
    refinery: 'Heraeus',
    premium: 0.03, // 3% 溢价
    image: 'https://storage.googleapis.com/blink-core-storage/projects/passto-metal-gold-bullion-portal-2ygkmcpt/images/generated-image-1763535234625-0.webp'
  },
  {
    name: 'Gold Bar 1kg',
    weight: '1 Kilogram',
    weightInGrams: 1000,
    refinery: 'Metalor',
    premium: 0.02, // 2% 溢价
    image: 'https://storage.googleapis.com/blink-core-storage/projects/passto-metal-gold-bullion-portal-2ygkmcpt/images/generated-image-1763534334703-0.webp'
  },
  {
    name: 'Gold Grains',
    weight: 'Per Gram',
    weightInGrams: 1,
    refinery: 'Swiss Refineries',
    premium: 0.06, // 6% 溢价
    image: 'https://storage.googleapis.com/blink-core-storage/projects/passto-metal-gold-bullion-portal-2ygkmcpt/images/generated-image-1763534853089-0.webp'
  }
];

export function Products() {
  const { t } = useLanguage();
  
  // 获取黄金价格数据
  const { data, loading } = useTradeTickData();

  // 处理产品数据，根据实时价格计算
  const products = useMemo(() => {
    // 从接口数据中获取黄金价格
    let goldPricePerOz = 0;
    
    if (data && (data as any)?.data?.tick_list) {
      const goldTick = (data as any).data.tick_list.find(
        (item: any) => item.code === 'GOLD'
      );
      if (goldTick) {
        goldPricePerOz = parseFloat(goldTick.price);
      }
    }

    // 如果没有数据，返回默认值（显示 --）
    if (goldPricePerOz === 0) {
      return productConfigs.map(config => ({
        ...config,
        pricePerGram: '--',
        total: '--',
      }));
    }

    // 计算每克价格（美元）
    const pricePerGramUSD = ozToGrams(goldPricePerOz);
    
    // 转换为产品数据
    return productConfigs.map(config => {
      // 计算每克价格（含溢价，美元）
      const pricePerGram = pricePerGramUSD * (1 + config.premium);
      
      // 计算总价（美元）
      const total = pricePerGram * config.weightInGrams;

      return {
        ...config,
        pricePerGram: Math.round(pricePerGram * 100) / 100, // 保留两位小数
        total: Math.round(total * 100) / 100, // 保留两位小数
      };
    });
  }, [data]);

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('products.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((product) => (
            <Card key={product.name} className="overflow-hidden hover:shadow-xl transition-shadow group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground font-bold">
                  999.9
                </Badge>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{product.weight}</p>
                  <p className="text-sm text-muted-foreground mb-4">{product.refinery}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('products.perGram')}</span>
                      <span className="font-semibold">
                        {typeof product.pricePerGram === 'string' 
                          ? '--' 
                          : `$${product.pricePerGram.toFixed(2)}`}
                      </span>
                    </div>
                    {product.total && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t('products.total')}</span>
                        <span className="font-bold text-accent">
                          {typeof product.total === 'string' 
                            ? '--' 
                            : `$${product.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  {t('products.cta')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          {t('products.footer')}
        </div>
      </div>
    </section>
  );
}
