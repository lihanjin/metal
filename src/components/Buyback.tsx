import { Upload, Search, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { openWhatsApp } from '@/lib/utils';

export function Buyback() {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      icon: Upload,
      title: t('buyback.step1.title'),
      desc: t('buyback.step1.desc'),
      points: [
        t('buyback.step1.point1'),
        t('buyback.step1.point2'),
        t('buyback.step1.point3'),
      ],
    },
    {
      number: '02',
      icon: Search,
      title: t('buyback.step2.title'),
      desc: t('buyback.step2.desc'),
      points: [
        t('buyback.step2.point1'),
        t('buyback.step2.point2'),
        t('buyback.step2.point3'),
      ],
    },
    {
      number: '03',
      icon: DollarSign,
      title: t('buyback.step3.title'),
      desc: t('buyback.step3.desc'),
      points: [
        t('buyback.step3.point1'),
        t('buyback.step3.point2'),
        t('buyback.step3.point3'),
      ],
    },
  ];

  return (
    <section id="buyback" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('buyback.title')}
          </h2>
          <p className="text-muted-foreground">{t('buyback.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-5xl font-black text-accent/20">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.desc}</p>
                      <ul className="space-y-2 text-sm">
                        {step.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-accent/20">
          <CardContent className="p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t('buyback.cta.title')}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('buyback.cta.subtitle')}
            </p>
            <Button
              onClick={openWhatsApp}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
            >
              {t('buyback.cta.button')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
