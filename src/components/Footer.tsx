import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-2xl font-black mb-4">
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>PASSTO</span>
              <span className="text-accent">METAL</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#products" className="text-muted-foreground hover:text-accent transition-colors">
                  {t('footer.services.products')}
                </a>
              </li>
              <li>
                <a href="#buyback" className="text-muted-foreground hover:text-accent transition-colors">
                  {t('footer.services.buyback')}
                </a>
              </li>
              <li>
                <a href="#converter" className="text-muted-foreground hover:text-accent transition-colors">
                  {t('footer.services.converter')}
                </a>
              </li>
              <li>
                <a href="#about" className="text-muted-foreground hover:text-accent transition-colors">
                  {t('footer.services.about')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                <a href="tel:+85212345678" className="text-muted-foreground hover:text-accent transition-colors">
                  +852 6949 7914
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                <a href="mailto:info@passtometal.com" className="text-muted-foreground hover:text-accent transition-colors">
                  info@passtometal.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-accent flex-shrink-0" />
                <span className="text-muted-foreground">
                  Hong Kong
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>
              {t('footer.copyright')}
            </div>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-accent transition-colors">
                {t('footer.legal.privacy')}
              </a>
              <a href="#terms" className="hover:text-accent transition-colors">
                {t('footer.legal.terms')}
              </a>
              <a href="#compliance" className="hover:text-accent transition-colors">
                {t('footer.legal.compliance')}
              </a>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-muted-foreground">
            {t('footer.license')}
          </div>
        </div>
      </div>
    </footer>
  );
}