import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function Products() {
  const { t } = useLanguage();

  const products = [
    {
      name: 'Gold Bar 1g',
      weight: '1 Gram',
      refinery: 'PAMP Suisse',
      pricePerGram: 650,
      total: 650,
      image: 'https://storage.googleapis.com/blink-core-storage/projects/passto-metal-gold-bullion-portal-2ygkmcpt/images/generated-image-1763535234380-0.webp'
    },
    {
      name: 'Gold Bar 1 Tael',
      weight: '1 Tael (37.5g)',
      refinery: 'Heraeus',
      pricePerGram: 640,
      total: 24000,
      image: 'https://storage.googleapis.com/blink-core-storage/projects/passto-metal-gold-bullion-portal-2ygkmcpt/images/generated-image-1763535234625-0.webp'
    },
    {
      name: 'Gold Bar 1kg',
      weight: '1 Kilogram',
      refinery: 'Metalor',
      pricePerGram: 630,
      total: 630000,
      image: 'https://storage.googleapis.com/blink-core-storage/projects/passto-metal-gold-bullion-portal-2ygkmcpt/images/generated-image-1763534334703-0.webp'
    },
    {
      name: 'Gold Grains',
      weight: 'Per Gram',
      refinery: 'Swiss Refineries',
      pricePerGram: 645,
      total: 645,
      image: 'https://storage.googleapis.com/blink-core-storage/projects/passto-metal-gold-bullion-portal-2ygkmcpt/images/generated-image-1763534853089-0.webp'
    }
  ];

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
          {products.map((product, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow group flex flex-col">
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
                      <span className="font-semibold">HKD {product.pricePerGram}</span>
                    </div>
                    {product.total && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t('products.total')}</span>
                        <span className="font-bold text-accent">HKD {product.total.toLocaleString()}</span>
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
