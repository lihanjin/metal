import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header & Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.buyback': 'Buyback',
    'nav.converter': 'Converter',
    'nav.about': 'About',
    'header.tagline': 'Licensed Hong Kong Dealer • Est. 2023',
    'header.phone': '+852 6949 7914',
    
    // Hero Section
    'hero.title': 'PASSTO METAL',
    'hero.subtitle': 'Trusted precious metals retailer specializing in high-purity 9999 fine gold bars and coins. Instant quotations, secure transactions, and transparent trading for all investors.',
    'hero.badge1': 'Best Rates',
    'hero.badge1desc': 'Highest buyback pricing',
    'hero.badge2': 'Licensed',
    'hero.badge2desc': 'HK Customs certified',
    'hero.badge3': '999.9 Pure',
    'hero.badge3desc': 'Certified gold only',
    'hero.cta1': 'Request Live Quote',
    'hero.cta2': 'View Products',
    'hero.feature1': 'Secure Trading',
    'hero.feature2': 'LBMA Partners',
    'hero.feature3': 'Stock Available',
    
    // Live Prices Feed
    'prices.title': 'Live Precious Metals Feed',
    'prices.subtitle': 'Real-time Bid/Ask Prices',
    'prices.bid': 'Bid Price',
    'prices.ask': 'Ask Price',
    'prices.change': 'Daily Change',
    'prices.chart': '24-Hour Price Trend',
    'prices.chartReady': 'Chart Ready',
    'prices.apiPending': 'API Integration Pending',
    'prices.footer': 'Live Market Data • Updates every 3 seconds',
    
    // Gold Prices Widget
    'goldPrices.title': 'Live Gold Prices (HKD/oz)',
    'goldPrices.purity': '999.9 Fine Gold • London Spot Reference',
    'goldPrices.updated': 'Updated',
    'goldPrices.spot': 'International Spot',
    'goldPrices.sell': 'Our Sell Price',
    'goldPrices.premium': 'Premium',
    'goldPrices.buyback': 'Our Buyback Price',
    'goldPrices.bestRate': 'Best Market Rate',
    'goldPrices.footer': 'Live Market Data • Prices update every 5 seconds',
    
    // Commitments Section
    'commitments.title': 'Our Commitments',
    'commitments.subtitle': 'Three pillars of excellence that set us apart in the precious metals market',
    'commitments.pricing.title': 'Optimal Pricing',
    'commitments.pricing.desc': 'Industry-leading buyback rates with transparent pricing tied to real-time international spot markets.',
    'commitments.pricing.point1': 'Highest buyback rates',
    'commitments.pricing.point2': 'No hidden fees',
    'commitments.pricing.point3': 'Daily price updates',
    'commitments.stock.title': 'Guaranteed Stock',
    'commitments.stock.desc': 'Extensive inventory of certified 999.9 fine gold bars and grains from renowned international refineries.',
    'commitments.stock.point1': 'Ready stock available',
    'commitments.stock.point2': 'Multiple weight options',
    'commitments.stock.point3': 'Immediate delivery',
    'commitments.secure.title': 'Secure Trading',
    'commitments.secure.desc': 'Licensed dealer with professional XRF assay equipment ensuring authenticity and purity verification.',
    'commitments.secure.point1': 'Licensed & regulated',
    'commitments.secure.point2': 'XRF testing',
    'commitments.secure.point3': 'Secure transactions',
    
    // Products Section
    'products.title': 'Premium Products',
    'products.subtitle': 'Certified 999.9 fine gold from world-renowned refineries',
    'products.perGram': 'Per Gram',
    'products.total': 'Total',
    'products.cta': 'Request Quote',
    'products.footer': 'All products in stock • Ready for immediate delivery',
    
    // Buyback Section
    'buyback.title': 'Buyback Process',
    'buyback.subtitle': 'Simple, transparent, and secure gold buyback in three easy steps',
    'buyback.step1.title': 'Submit Your Gold',
    'buyback.step1.desc': 'Contact us with details of your gold items (weight, purity, form). Upload photos if available.',
    'buyback.step1.point1': 'Gold bars',
    'buyback.step1.point2': 'Gold grains',
    'buyback.step1.point3': 'Certified products',
    'buyback.step2.title': 'Professional Assay',
    'buyback.step2.desc': 'Our certified XRF equipment verifies purity and weight. Get instant results with complete transparency.',
    'buyback.step2.point1': 'XRF testing',
    'buyback.step2.point2': 'Weight verification',
    'buyback.step2.point3': 'Purity certification',
    'buyback.step3.title': 'Instant Payment',
    'buyback.step3.desc': 'Accept our competitive quote and receive immediate payment via bank transfer or cash.',
    'buyback.step3.point1': 'Best market rates',
    'buyback.step3.point2': 'No hidden fees',
    'buyback.step3.point3': 'Same-day settlement',
    'buyback.cta.title': 'Ready to Get the Best Price for Your Gold?',
    'buyback.cta.subtitle': 'Start your buyback process today and experience our industry-leading rates and professional service.',
    'buyback.cta.button': 'Request Live Quote Now',
    'buyback.cta.badge': 'Free Tool',
    
    // Converter Section
    'converter.title': 'Weight Converter',
    'converter.subtitle': 'Easily convert between grams, tael, and troy ounces',
    'converter.from': 'From',
    'converter.to': 'To',
    'converter.grams': 'Grams (g)',
    'converter.tael': 'Tael (両)',
    'converter.ounce': 'Troy Ounce (oz)',
    'converter.ref1': '1 Tael = 37.5 Grams',
    'converter.ref2': '1 Troy Ounce = 31.1035 Grams',
    'converter.ref3': '1 Tael ≈ 1.323 Troy Ounces',
    
    // About Section
    'about.title': 'About PASSTO METAL',
    'about.content': 'PASSTO METAL was established in August 2023, headquartered in Hong Kong. We are a trusted gold retailer specializing in the sale and buyback of high-purity physical gold bars and coins. As a group entity operating through Carbon SP3 Limited, which holds the Hong Kong Precious Metals and Stones Dealer Category B registration (No. BB231102926), we strictly comply with the Anti-Money Laundering and Counter-Terrorist Financing Ordinance (Cap. 615), ensuring a safe and compliant trading environment for our clients. We focus on 9999 fineness gold products, catering to individual investors who prioritize security and quality. Where supply allows, we prioritize sourcing products from LBMA-certified refineries, while maintaining flexibility to meet market demand. With a streamlined operational model and a professional team, we offer personalized services to both first-time buyers and seasoned investors. PASSTO METAL is built on the core values of Instant Quotation, Secure Transactions, and the commitment to building long-term trust and providing professional service.',
    'about.licensed.title': 'Licensed Dealer',
    'about.licensed.number': 'Hong Kong Customs Registration No. 12345678',
    'about.licensed.desc': 'Fully licensed and regulated precious metals dealer',
    'about.xrf.title': 'XRF Assay Equipment',
    'about.xrf.subtitle': 'Professional Grade Testing',
    'about.xrf.desc': 'Non-destructive purity verification technology',
    'about.certified.title': 'Certified Refineries',
    'about.certified.subtitle': 'LBMA Approved Partners',
    'about.certified.desc': 'Products from world-renowned Swiss and international refineries',
    'about.transparent.title': 'Transparent Trading',
    'about.transparent.subtitle': 'Complete Documentation',
    'about.transparent.desc': 'Full certificates and assay reports for every transaction',
    'about.compliance.title': 'Regulatory Compliance',
    'about.compliance.type': 'License Type',
    'about.compliance.typeValue': 'Precious Metals Dealer',
    'about.compliance.reg': 'Registration No',
    'about.compliance.regValue': 'HK-PMD-12345678',
    'about.compliance.issued': 'Issued By',
    'about.compliance.issuedValue': 'Hong Kong Customs',
    'about.compliance.status': 'Status',
    'about.compliance.statusValue': 'Active & Verified',
    'about.equipment.title': 'Testing Equipment',
    'about.equipment.tech': 'Technology',
    'about.equipment.techValue': 'XRF Spectrometry',
    'about.equipment.accuracy': 'Accuracy',
    'about.equipment.accuracyValue': '±0.01% Purity',
    'about.equipment.calibration': 'Calibration',
    'about.equipment.calibrationValue': 'Monthly Certified',
    'about.equipment.method': 'Testing Method',
    'about.equipment.methodValue': 'Non-Destructive',
    'about.refineries.title': 'Certified Partner Refineries',
    
    // Footer
    'footer.company': 'PASSTO METAL',
    'footer.description': 'Licensed Hong Kong precious metals dealer specializing in 999.9 fine gold bars and coins. Est. 2023',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.services.products': 'Products',
    'footer.services.buyback': 'Buyback Process',
    'footer.services.converter': 'Weight Converter',
    'footer.services.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.legal': 'Legal',
    'footer.legal.privacy': 'Privacy Policy',
    'footer.legal.terms': 'Terms of Service',
    'footer.legal.compliance': 'Compliance',
    'footer.copyright': '© 2023 PASSTO METAL. All rights reserved.',
    'footer.license': 'Licensed Hong Kong Precious Metals Dealer',
  },
  zh: {
    // Header & Navigation
    'nav.home': '首頁',
    'nav.products': '產品',
    'nav.buyback': '回購',
    'nav.converter': '換算',
    'nav.about': '關於',
    'header.tagline': '香港持牌經銷商 • 成立於2023年',
    'header.phone': '+852 6949 7914',
    
    // Hero Section
    'hero.title': 'PASSTO METAL',
    'hero.subtitle': '值得信賴的貴金屬零售商，專營高純度9999黃金條及金幣。即時報價、安全交易、透明買賣，服務所有投資者。',
    'hero.badge1': '最佳價格',
    'hero.badge1desc': '最高回購價',
    'hero.badge2': '持牌經營',
    'hero.badge2desc': '香港海關認證',
    'hero.badge3': '999.9純金',
    'hero.badge3desc': '僅售認證黃金',
    'hero.cta1': '索取即時報價',
    'hero.cta2': '查看產品',
    'hero.feature1': '安全交易',
    'hero.feature2': 'LBMA合作夥伴',
    'hero.feature3': '現貨供應',
    
    // Live Prices Feed
    'prices.title': '實時貴金屬行情',
    'prices.subtitle': '實時買入/賣出價格',
    'prices.bid': '買入價',
    'prices.ask': '賣出價',
    'prices.change': '每日變動',
    'prices.chart': '24小時價格走勢',
    'prices.chartReady': '圖表就緒',
    'prices.apiPending': 'API整合進行中',
    'prices.footer': '實時市場數據 • 每20秒更新',
    
    // Gold Prices Widget
    'goldPrices.title': '黃金即時價格 (港元/盎司)',
    'goldPrices.purity': '999.9純金 • 倫敦現貨參考',
    'goldPrices.updated': '更新時間',
    'goldPrices.spot': '國際現貨',
    'goldPrices.sell': '本公司賣出價',
    'goldPrices.premium': '溢價',
    'goldPrices.buyback': '本公司回購價',
    'goldPrices.bestRate': '最佳市場價',
    'goldPrices.footer': '實時市場數據 • 每20秒更新價格',
    
    // Commitments Section
    'commitments.title': '我們的承諾',
    'commitments.subtitle': '三大卓越支柱，讓我們在貴金屬市場中脫穎而出',
    'commitments.pricing.title': '最優定價',
    'commitments.pricing.desc': '業界領先的回購價格，透明定價與國際現貨市場實時掛鈎。',
    'commitments.pricing.point1': '最高回購價',
    'commitments.pricing.point2': '無隱藏費用',
    'commitments.pricing.point3': '每日更新價格',
    'commitments.stock.title': '庫存保證',
    'commitments.stock.desc': '大量認證999.9純金條及金粒庫存，來自國際知名精煉廠。',
    'commitments.stock.point1': '現貨供應',
    'commitments.stock.point2': '多種重量選擇',
    'commitments.stock.point3': '即時交付',
    'commitments.secure.title': '安全交易',
    'commitments.secure.desc': '持牌經銷商，配備專業XRF檢測設備，確保真實性及純度驗證。',
    'commitments.secure.point1': '持牌監管',
    'commitments.secure.point2': 'XRF檢測',
    'commitments.secure.point3': '安全交易',
    
    // Products Section
    'products.title': '優質產品',
    'products.subtitle': '來自世界知名精煉廠的認證999.9純金',
    'products.perGram': '每克',
    'products.total': '總價',
    'products.cta': '索取報價',
    'products.footer': '所有產品現貨供應 • 可即時交付',
    
    // Buyback Section
    'buyback.title': '回購流程',
    'buyback.subtitle': '簡單、透明、安全的黃金回購三步驟',
    'buyback.step1.title': '提交您的黃金',
    'buyback.step1.desc': '聯繫我們並提供黃金詳情（重量、純度、形式）。如有可提供照片。',
    'buyback.step1.point1': '金條',
    'buyback.step1.point2': '金粒',
    'buyback.step1.point3': '認證產品',
    'buyback.step2.title': '專業檢測',
    'buyback.step2.desc': '我們的認證XRF設備驗證純度及重量。即時獲得完全透明的結果。',
    'buyback.step2.point1': 'XRF檢測',
    'buyback.step2.point2': '重量驗證',
    'buyback.step2.point3': '純度認證',
    'buyback.step3.title': '即時支付',
    'buyback.step3.desc': '接受我們具競爭力的報價，通過銀行轉賬或現金即時收款。',
    'buyback.step3.point1': '最佳市場價',
    'buyback.step3.point2': '無隱藏費用',
    'buyback.step3.point3': '當天結算',
    'buyback.cta.title': '準備好為您的黃金獲得最佳價格？',
    'buyback.cta.subtitle': '立即開始回購流程，體驗我們業界領先的價格及專業服務。',
    'buyback.cta.button': '立即索取實時報價',
    'buyback.cta.badge': '免費工具',
    
    // Converter Section
    'converter.title': '重量換算器',
    'converter.subtitle': '輕鬆換算克、兩及金衡盎司',
    'converter.from': '由',
    'converter.to': '至',
    'converter.grams': '克 (g)',
    'converter.tael': '兩',
    'converter.ounce': '金衡盎司 (oz)',
    'converter.ref1': '1兩 = 37.5克',
    'converter.ref2': '1金衡盎司 = 31.1035克',
    'converter.ref3': '1兩 ≈ 1.323金衡盎司',
    
    // About Section
    'about.title': '關於 PASSTO METAL',
    'about.content': 'PASSTO METAL於2023年8月成立，總部設於香港。我們是一家值得信賴的黃金零售商，專營高純度實體金條及金幣的買賣與回購。作為通過Carbon SP3 Limited運營的集團實體，持有香港貴金屬及寶石經銷商B類牌照（編號：BB231102926），我們嚴格遵守《打擊洗錢及恐怖融資條例》（第615章），為客戶提供安全合規的交易環境。我們專注於9999純度金產品，服務優先考慮安全及品質的個人投資者。在供應允許的情況下，我們優先從LBMA認證精煉廠採購產品，同時保持靈活性以滿足市場需求。憑藉簡化的運營模式及專業團隊，我們為首次買家及資深投資者提供個性化服務。PASSTO METAL以即時報價、安全交易及建立長期信任和專業服務為核心價值。',
    'about.licensed.title': '持牌經銷商',
    'about.licensed.number': '香港海關註冊編號 12345678',
    'about.licensed.desc': '全面持牌及受監管的貴金屬經銷商',
    'about.xrf.title': 'XRF檢測設備',
    'about.xrf.subtitle': '專業級檢測',
    'about.xrf.desc': '非破壞性純度驗證技術',
    'about.certified.title': '認證精煉廠',
    'about.certified.subtitle': 'LBMA認可合作夥伴',
    'about.certified.desc': '來自世界知名瑞士及國際精煉廠的產品',
    'about.transparent.title': '透明交易',
    'about.transparent.subtitle': '完整文件',
    'about.transparent.desc': '每筆交易均附完整證書及檢測報告',
    'about.compliance.title': '法規合規',
    'about.compliance.type': '牌照類型',
    'about.compliance.typeValue': '貴金屬經銷商',
    'about.compliance.reg': '註冊編號',
    'about.compliance.regValue': 'HK-PMD-12345678',
    'about.compliance.issued': '發出機構',
    'about.compliance.issuedValue': '香港海關',
    'about.compliance.status': '狀態',
    'about.compliance.statusValue': '有效及已驗證',
    'about.equipment.title': '檢測設備',
    'about.equipment.tech': '技術',
    'about.equipment.techValue': 'XRF光譜儀',
    'about.equipment.accuracy': '精確度',
    'about.equipment.accuracyValue': '±0.01%純度',
    'about.equipment.calibration': '校準',
    'about.equipment.calibrationValue': '每月認證',
    'about.equipment.method': '檢測方法',
    'about.equipment.methodValue': '非破壞性',
    'about.refineries.title': '認證合作精煉廠',
    
    // Footer
    'footer.company': 'PASSTO METAL',
    'footer.description': '香港持牌貴金屬經銷商，專營999.9純金條及金幣。成立於2023年',
    'footer.quickLinks': '快速連結',
    'footer.services': '服務',
    'footer.services.products': '產品',
    'footer.services.buyback': '回購流程',
    'footer.services.converter': '重量換算器',
    'footer.services.about': '關於我們',
    'footer.contact': '聯絡',
    'footer.legal': '法律',
    'footer.legal.privacy': '隱私政策',
    'footer.legal.terms': '服務條款',
    'footer.legal.compliance': '合規',
    'footer.copyright': '© 2023 PASSTO METAL。版權所有。',
    'footer.license': '香港持牌貴金屬經銷商',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'zh' : 'en';
      localStorage.setItem('language', newLang);
      return newLang;
    });
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
