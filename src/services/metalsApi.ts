// Metals-API Integration Service
// API Documentation: https://metals-api.com/

export interface MetalsApiResponse {
  success: boolean;
  timestamp: number;
  date: string;
  base: string;
  rates: {
    XAG?: number;  // Silver (troy ounce)
    XAU?: number;  // Gold (troy ounce)
    XPD?: number;  // Palladium (troy ounce)
    XPT?: number;  // Platinum (troy ounce)
    USDXAG?: number; // USD per troy ounce Silver
    USDXAU?: number; // USD per troy ounce Gold
    USDXPD?: number; // USD per troy ounce Palladium
    USDXPT?: number; // USD per troy ounce Platinum
  };
}

export interface MetalPrice {
  symbol: string;
  name: string;
  usdPerOz: number;
  perGram: number;
  change24h: number;
  changePercent: number;
  timestamp: number;
  date: string;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}

class MetalsApiService {
  private baseUrl = 'https://metals-api.com/api';
  private apiKey: string | null = null;
  private cachedData: MetalsApiResponse | null = null;
  private cacheTimestamp: number = 0;
  private cacheDuration = 60000; // 1 minute cache

  constructor() {
    // In production, store API key in environment variables
    // For now, we'll use mock data structure
    this.apiKey = import.meta.env.VITE_METALS_API_KEY || null;
  }

  /**
   * Parse the provided API response data
   */
  parseApiResponse(data: MetalsApiResponse): MetalPrice[] {
    const metals: MetalPrice[] = [];
    const { rates, timestamp, date } = data;

    // Gold (XAU)
    if (rates.USDXAU) {
      metals.push({
        symbol: 'GOLD',
        name: 'Gold',
        usdPerOz: rates.USDXAU,
        perGram: rates.USDXAU / 31.1035, // Convert troy oz to grams
        change24h: 0, // Would need historical data
        changePercent: 0,
        timestamp,
        date
      });
    }

    // Silver (XAG)
    if (rates.USDXAG) {
      metals.push({
        symbol: 'SILVER',
        name: 'Silver',
        usdPerOz: rates.USDXAG,
        perGram: rates.USDXAG / 31.1035,
        change24h: 0,
        changePercent: 0,
        timestamp,
        date
      });
    }

    // Platinum (XPT)
    if (rates.USDXPT) {
      metals.push({
        symbol: 'PLATINUM',
        name: 'Platinum',
        usdPerOz: rates.USDXPT,
        perGram: rates.USDXPT / 31.1035,
        change24h: 0,
        changePercent: 0,
        timestamp,
        date
      });
    }

    // Palladium (XPD)
    if (rates.USDXPD) {
      metals.push({
        symbol: 'PALLADIUM',
        name: 'Palladium',
        usdPerOz: rates.USDXPD,
        perGram: rates.USDXPD / 31.1035,
        change24h: 0,
        changePercent: 0,
        timestamp,
        date
      });
    }

    return metals;
  }

  /**
   * Calculate bid/ask spread (typically 1-2% for precious metals)
   */
  calculateBidAsk(spotPrice: number, spreadPercent: number = 1.6) {
    const spreadAmount = spotPrice * (spreadPercent / 100);
    return {
      bid: spotPrice - spreadAmount / 2,
      ask: spotPrice + spreadAmount / 2,
      spread: spreadAmount
    };
  }

  /**
   * Fetch latest metal prices
   * Uses the provided API response structure
   */
  async getLatestPrices(): Promise<MetalPrice[]> {
    // Check cache first
    const now = Date.now();
    if (this.cachedData && (now - this.cacheTimestamp) < this.cacheDuration) {
      return this.parseApiResponse(this.cachedData);
    }

    try {
      // Use the provided mock data for now
      // In production, this would be: fetch(`${this.baseUrl}/latest?access_key=${this.apiKey}&base=USD&symbols=XAU,XAG,XPT,XPD`)
      const mockResponse: MetalsApiResponse = {
        success: true,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        base: 'USD',
        rates: {
          XAG: 0.019843363272664,
          XAU: 0.00024765723986824,
          XPD: 0.00072046109510086,
          XPT: 0.00065061808718282,
          USDXAG: 50.3946829103103,
          USDXAU: 4037.83875057328,
          USDXPD: 1388.00000000001,
          USDXPT: 1537.00000000001
        }
      };

      this.cachedData = mockResponse;
      this.cacheTimestamp = now;

      return this.parseApiResponse(mockResponse);
    } catch (error) {
      console.error('Error fetching metals prices:', error);
      // Return fallback data
      return this.getFallbackPrices();
    }
  }

  /**
   * Generate mock historical data for 24-hour chart
   */
  generateMockHistory(currentPrice: number, points: number = 24): PriceHistory[] {
    const history: PriceHistory[] = [];
    const now = Date.now();
    const hourMs = 3600000;

    for (let i = points; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * 0.03; // ±1.5% variance
      history.push({
        timestamp: now - (i * hourMs),
        price: currentPrice * (1 + variance)
      });
    }

    return history;
  }

  /**
   * Fallback prices if API fails
   */
  private getFallbackPrices(): MetalPrice[] {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    return [
      {
        symbol: 'GOLD',
        name: 'Gold',
        usdPerOz: 4037.84,
        perGram: 129.82,
        change24h: -0.12,
        changePercent: -0.02,
        timestamp: now,
        date: today
      },
      {
        symbol: 'SILVER',
        name: 'Silver',
        usdPerOz: 50.39,
        perGram: 1.62,
        change24h: -0.02,
        changePercent: -0.04,
        timestamp: now,
        date: today
      },
      {
        symbol: 'PLATINUM',
        name: 'Platinum',
        usdPerOz: 1537.00,
        perGram: 49.41,
        change24h: 0.46,
        changePercent: 0.03,
        timestamp: now,
        date: today
      }
    ];
  }
}

export const metalsApi = new MetalsApiService();
