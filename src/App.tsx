import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LivePricesFeed, LiveGoldPrices } from './components/LivePricesFeed';
import { Commitments } from './components/Commitments';
import { Products } from './components/Products';
import { Buyback } from './components/Buyback';
import { Converter } from './components/Converter';
import { About } from './components/About';
import { Footer } from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <Header />
          <main>
            <Hero />
            <LivePricesFeed />
            <LiveGoldPrices />
            <Commitments />
            <Products />
            <Buyback />
            <Converter />
            <About />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
