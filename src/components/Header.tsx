import { Moon, Sun, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { useState } from 'react';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
     const y = element.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-12 items-center justify-between border-b text-sm">
          <div className="text-muted-foreground">
            {t('header.tagline')}
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${t('header.phone')}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{t('header.phone')}</span>
            </a>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 text-2xl font-black tracking-tight hover:opacity-80 transition-colors"
          >
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>PASSTO</span>
            <span className="text-accent">METAL</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="text-sm font-medium hover:text-accent transition-colors">
              {t('nav.home')}
            </button>
            <button onClick={() => scrollToSection('products')} className="text-sm font-medium hover:text-accent transition-colors">
              {t('nav.products')}
            </button>
            <button onClick={() => scrollToSection('buyback')} className="text-sm font-medium hover:text-accent transition-colors">
              {t('nav.buyback')}
            </button>
            <button onClick={() => scrollToSection('converter')} className="text-sm font-medium hover:text-accent transition-colors">
              {t('nav.converter')}
            </button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-accent transition-colors">
              {t('nav.about')}
            </button>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="font-semibold"
            >
              {language === 'en' ? '繁體中文' : 'EN'}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="w-9 px-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <button onClick={() => scrollToSection('home')} className="text-left font-medium hover:text-accent transition-colors">
                {t('nav.home')}
              </button>
              <button onClick={() => scrollToSection('products')} className="text-left font-medium hover:text-accent transition-colors">
                {t('nav.products')}
              </button>
              <button onClick={() => scrollToSection('buyback')} className="text-left font-medium hover:text-accent transition-colors">
                {t('nav.buyback')}
              </button>
              <button onClick={() => scrollToSection('converter')} className="text-left font-medium hover:text-accent transition-colors">
                {t('nav.converter')}
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left font-medium hover:text-accent transition-colors">
                {t('nav.about')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
