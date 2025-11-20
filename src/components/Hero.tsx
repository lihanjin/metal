import { Shield, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { openWhatsApp } from '@/lib/utils';

export function Hero() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
              {t('hero.title').split(' ')[0]}
            </span>{' '}
            <span className="text-accent">{t('hero.title').split(' ')[1]}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-semibold"
            >
              <Shield className="h-4 w-4 mr-2" />
              <div>
                <div className="font-bold">{t('hero.badge1')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('hero.badge1desc')}
                </div>
              </div>
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-semibold"
            >
              <Award className="h-4 w-4 mr-2" />
              <div>
                <div className="font-bold">{t('hero.badge2')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('hero.badge2desc')}
                </div>
              </div>
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <div>
                <div className="font-bold">{t('hero.badge3')}</div>
                <div className="text-xs text-muted-foreground">
                  {t('hero.badge3desc')}
                </div>
              </div>
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              onClick={openWhatsApp}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg"
            >
              {t('hero.cta1')}
            </Button>
            <Button
              onClick={() => scrollToSection('products')}
              size="lg"
              variant="outline"
              className="font-semibold"
            >
              {t('hero.cta2')}
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>{t('hero.feature1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>{t('hero.feature2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>{t('hero.feature3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
