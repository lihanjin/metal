import { useRequest } from 'ahooks';

// K线类型枚举
export enum KlineType {
  ONE_MINUTE = 1,
  FIVE_MINUTES = 5,
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
  ONE_DAY = 1440,
  ONE_WEEK = 10080,
  ONE_MONTH = 43200,
}

// K线请求参数类型
export interface KlineRequestParams {
  code: string; // 品种代码，如 "NGAS", "GOLD", "Silver"
  kline_type: KlineType | number; // K线类型
  kline_timestamp_end?: number; // 结束时间戳，0 表示最新
  query_kline_num?: number; // 查询数量，默认 50
  adjust_type?: number; // 调整类型，默认 0
  isStock?: boolean; // 是否为股票，默认 false
}

// 单根 K线数据类型
export interface KlineItem {
  timestamp: string;
  open_price: string;
  close_price: string;
  high_price: string;
  low_price: string;
  volume: string;
  turnover: string;
  avg_price?: string;
}

// K线 API 响应类型
export interface KlineResponse {
  ret: number;
  msg: string;
  trace: string;
  data: {
    code: string;
    kline_type: number;
    kline_list: KlineItem[];
  };
}

// 缓存配置
const CACHE_KEY_PREFIX = 'kline-cache';
const CACHE_EXPIRY_MS = 2 * 60 * 1000; // 缓存有效期 2 分钟

/**
 * 缓存配置选项
 */
export const KLINE_CACHE_CONFIG = {
  PREFIX: CACHE_KEY_PREFIX,
  EXPIRY_MS: CACHE_EXPIRY_MS,
  EXPIRY_MINUTES: CACHE_EXPIRY_MS / 60 / 1000,
} as const;

// 缓存数据接口
interface CacheData {
  data: KlineResponse;
  timestamp: number;
}

/**
 * 生成缓存键
 */
const getCacheKey = (params: KlineRequestParams): string => {
  const { code, kline_type, isStock } = params;
  return `${CACHE_KEY_PREFIX}-${isStock ? 'stock' : 'forex'}-${code}-${kline_type}`;
};

/**
 * 从本地存储获取缓存
 */
const getCache = (key: string): KlineResponse | null => {
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

    console.log('✅ 使用 K线缓存数据');
    return cacheData.data;
  } catch (error) {
    console.error('读取 K线缓存失败:', error);
    return null;
  }
};

/**
 * 保存数据到本地存储
 */
const setCache = (key: string, data: KlineResponse): void => {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
    console.log('💾 K线数据已缓存');
  } catch (error) {
    console.error('保存 K线缓存失败:', error);
  }
};

/**
 * 清除所有 K线数据缓存
 */
export const clearAllKlineCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ 所有 K线数据缓存已清除');
  } catch (error) {
    console.error('清除所有 K线缓存失败:', error);
  }
};

/**
 * 请求 K线数据的函数（带缓存）
 */
const fetchKlineData = async (
  params: KlineRequestParams
): Promise<KlineResponse> => {
  const cacheKey = getCacheKey(params);

  // 设置默认值
  const requestParams = {
    code: params.code,
    kline_type: params.kline_type,
    kline_timestamp_end: params.kline_timestamp_end ?? 0,
    query_kline_num: params.query_kline_num ?? 50,
    adjust_type: params.adjust_type ?? 0,
    isStock: params.isStock ?? false,
  };

  const requestBody = {
    data: requestParams,
  };

  try {
    // 发起请求
    const response = await fetch('http://localhost:3001/quote/kline', {
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
    console.error('❌ K线请求失败:', error);

    // 请求失败时，尝试使用缓存数据
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      console.log('🔄 K线接口失败，使用缓存数据');
      return cachedData;
    }

    // 如果没有缓存，抛出错误
    throw error;
  }
};

/**
 * 使用 K线数据的 Hook（带本地缓存）
 *
 * 功能：
 * - 自动缓存成功的请求数据到 localStorage（有效期 2 分钟）
 * - 当请求失败时，自动使用缓存数据（如果有）
 * - 支持手动刷新
 *
 * @param params - K线请求参数
 * @param options - ahooks useRequest 的配置选项
 *
 * @example
 * ```tsx
 * // 获取 GOLD 的 1 分钟 K线数据
 * const { data, loading, refresh } = useKlineData({
 *   code: 'GOLD',
 *   kline_type: KlineType.ONE_MINUTE,
 *   query_kline_num: 50,
 * });
 *
 * // 获取 NGAS 的日线数据
 * const { data } = useKlineData({
 *   code: 'NGAS',
 *   kline_type: KlineType.ONE_DAY,
 *   query_kline_num: 100,
 * });
 *
 * // 手动触发
 * const { data, run } = useKlineData(
 *   { code: 'Silver', kline_type: KlineType.FIFTEEN_MINUTES },
 *   { manual: true }
 * );
 * run();
 *
 * // 清除所有缓存
 * import { clearAllKlineCache } from './hooks/use-kline-data';
 * clearAllKlineCache();
 * ```
 */
export const useKlineData = (
  params: KlineRequestParams,
  options?: Parameters<typeof useRequest>[1]
) => {
  return useRequest(() => fetchKlineData(params), {
    // 默认配置：缓存
    cacheKey: `kline-${params.code}-${params.kline_type}`,
    pollingInterval: 30000,
    ...options,
  });
};

/**
 * 使用多个品种的 K线数据
 *
 * @example
 * ```tsx
 * const { data: goldData } = useKlineData({ code: 'GOLD', kline_type: 1 });
 * const { data: silverData } = useKlineData({ code: 'Silver', kline_type: 1 });
 * ```
 */
export default useKlineData;

