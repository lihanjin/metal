import { DollarSign, Package, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';

export function Commitments() {
  const { t } = useLanguage();

  const commitments = [
    {
      icon: DollarSign,
      title: t('commitments.pricing.title'),
      desc: t('commitments.pricing.desc'),
      points: [
        t('commitments.pricing.point1'),
        t('commitments.pricing.point2'),
        t('commitments.pricing.point3'),
      ]
    },
    {
      icon: Package,
      title: t('commitments.stock.title'),
      desc: t('commitments.stock.desc'),
      points: [
        t('commitments.stock.point1'),
        t('commitments.stock.point2'),
        t('commitments.stock.point3'),
      ]
    },
    {
      icon: ShieldCheck,
      title: t('commitments.secure.title'),
      desc: t('commitments.secure.desc'),
      points: [
        t('commitments.secure.point1'),
        t('commitments.secure.point2'),
        t('commitments.secure.point3'),
      ]
    }
  ];

  return (
    <section id="commitments" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('commitments.title')}
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            {t('commitments.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {commitments.map((commitment, idx) => {
            const Icon = commitment.icon;
            return (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{commitment.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {commitment.desc}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {commitment.points.map((point, i) => (
                      <li key={i} className="flex items-center justify-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
