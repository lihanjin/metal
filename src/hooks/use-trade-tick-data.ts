import { useRequest } from 'ahooks';

// 交易品种类型
export interface TradeSymbol {
  code: string;
}

// 请求参数类型
export interface TradeTickRequestParams {
  isStock: boolean;
  data: {
    symbol_list: TradeSymbol[];
  };
  trace?: string;
}

// 响应数据类型（根据实际 API 返回格式调整）
export interface TradeTickResponse {
  code?: number;
  msg?: string;
  data?: any;
  // 根据实际 API 返回格式添加更多字段
}

// 默认的交易品种列表
export const DEFAULT_SYMBOLS: TradeSymbol[] = [
  { code: 'GOLD' },
  { code: 'Silver' },
  { code: 'Platinum' }
];

// 缓存配置
const CACHE_KEY_PREFIX = 'trade-tick-cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 缓存有效期 5 分钟

/**
 * 缓存配置选项
 */
export const CACHE_CONFIG = {
  PREFIX: CACHE_KEY_PREFIX,
  EXPIRY_MS: CACHE_EXPIRY_MS,
  EXPIRY_MINUTES: CACHE_EXPIRY_MS / 60 / 1000,
} as const;

// 缓存数据接口
interface CacheData {
  data: TradeTickResponse;
  timestamp: number;
}

/**
 * 生成随机 trace ID
 */
const generateTraceId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * 生成缓存键
 */
const getCacheKey = (params: TradeTickRequestParams): string => {
  const symbolCodes = params.data.symbol_list.map(s => s.code).sort().join(',');
  return `${CACHE_KEY_PREFIX}-${params.isStock ? 'stock' : 'forex'}-${symbolCodes}`;
};

/**
 * 从本地存储获取缓存
 */
const getCache = (key: string): TradeTickResponse | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheData: CacheData = JSON.parse(cached);
    
    // 检查缓存是否过期
    const isExpired = Date.now() - cacheData.timestamp > CACHE_EXPIRY_MS;
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    console.log('✅ 使用缓存数据');
    return cacheData.data;
  } catch (error) {
    console.error('读取缓存失败:', error);
    return null;
  }
};

/**
 * 保存数据到本地存储
 */
const setCache = (key: string, data: TradeTickResponse): void => {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
    console.log('💾 数据已缓存');
  } catch (error) {
    console.error('保存缓存失败:', error);
  }
};

/**
 * 清除指定键的缓存
 */
const clearCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
    console.log('🗑️ 缓存已清除');
  } catch (error) {
    console.error('清除缓存失败:', error);
  }
};

/**
 * 清除所有交易数据缓存
 */
export const clearAllTradeTickCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ 所有交易数据缓存已清除');
  } catch (error) {
    console.error('清除所有缓存失败:', error);
  }
};

/**
 * 请求 alltick 交易数据的函数（带缓存）
 */
const fetchTradeTickData = async (
  params: TradeTickRequestParams
): Promise<TradeTickResponse> => {
  const cacheKey = getCacheKey(params);
  const traceId = params.trace || generateTraceId();

  // 构造请求体，包含 timestamp 用于防重放攻击
  const requestBody = {
    data: {
      isStock: params.isStock,
      data: params.data,
      trace: traceId,
      timestamp: Date.now(),
    },
  };

  try {
    // 发起请求
    const response = await fetch('https://mdx.aatest.online/quote/trade-tick', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // 请求成功，保存到缓存
    setCache(cacheKey, result);

    return result;
  } catch (error) {
    console.error('❌ 请求失败:', error);

    // 请求失败时，尝试使用缓存数据
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      console.log('🔄 接口失败，使用缓存数据');
      return cachedData;
    }

    // 如果没有缓存，抛出错误
    throw error;
  }
};

/**
 * 使用 alltick 交易数据的 Hook（带本地缓存）
 * 
 * 功能：
 * - 自动缓存成功的请求数据到 localStorage（有效期 5 分钟）
 * - 当请求失败时，自动使用缓存数据（如果有）
 * - 支持自动轮询（默认 20 秒）
 * 
 * @param symbolList - 交易品种列表，默认使用 DEFAULT_SYMBOLS
 * @param isStock - 是否为股票，默认为 false
 * @param options - ahooks useRequest 的配置选项
 * 
 * @example
 * ```tsx
 * // 基础使用（自动缓存和错误降级）
 * const { data, loading, refresh } = useTradeTickData();
 * 
 * // 使用自定义品种列表
 * const { data } = useTradeTickData([{ code: 'GOLD' }, { code: 'Silver' }]);
 * 
 * // 手动触发请求
 * const { data, run } = useTradeTickData(undefined, false, { manual: true });
 * run();
 * 
 * // 自定义轮询间隔
 * const { data } = useTradeTickData(undefined, false, { pollingInterval: 30000 });
 * 
 * // 清除所有缓存
 * import { clearAllTradeTickCache } from './hooks/use-trade-tick-data';
 * clearAllTradeTickCache();
 * ```
 */
export const useTradeTickData = (
  symbolList: TradeSymbol[] = DEFAULT_SYMBOLS,
  isStock: boolean = false,
  options?: Parameters<typeof useRequest>[1]
) => {
  return useRequest(
    () => fetchTradeTickData({
      isStock,
      data: { symbol_list: symbolList }
    }),
    {
      // 默认配置：10秒轮询、缓存
      pollingInterval: 30000,
      cacheKey: 'trade-tick-data',
      ...options
    }
  );
};

