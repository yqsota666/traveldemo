import Taro from "@tarojs/taro";

const TRAVEL_API_BASE = "http://127.0.0.1:8080";
const ADMIN_MEDIA_BASE = "http://127.0.0.1:8091";

export interface TravelPageResult<T> {
  records: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface TravelApiEnvelope<T> {
  status: number;
  message: string;
  result: T;
}

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>) {
  const base = `${TRAVEL_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  if (!params) return base;
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return qs ? `${base}?${qs}` : base;
}

export async function travelGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): Promise<T> {
  const url = buildUrl(path, params);
  if (process.env.TARO_ENV === "h5" || (typeof window !== "undefined" && typeof fetch !== "undefined")) {
    const res = await fetch(url);
    const body = (await res.json()) as TravelApiEnvelope<T>;
    if (body.status !== 200) {
      throw new Error(body.message || "请求失败");
    }
    return body.result;
  }
  const res = await Taro.request<TravelApiEnvelope<T>>({ url, method: "GET" });
  const body = res.data;
  if (!body || body.status !== 200) {
    throw new Error(body?.message || "请求失败");
  }
  return body.result;
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/")) return `${ADMIN_MEDIA_BASE}${url}`;
  return url;
}

export const contentApi = {
  cities: (page = 1, pageSize = 50) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/cities", { page, pageSize }),
  cityByName: (name: string) =>
    travelGet<Record<string, unknown>>("/api/travel/content/cities/by-name", { name }),
  banners: (page = 1, pageSize = 20) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/banners", { page, pageSize }),
  scenics: (params: { cityId?: number; keyword?: string; recommended?: boolean; page?: number; pageSize?: number }) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/scenics", {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      cityId: params.cityId,
      keyword: params.keyword,
      recommended: params.recommended,
    }),
  scenicDetail: (id: number) => travelGet<Record<string, unknown>>(`/api/travel/content/scenics/${id}`),
  hotels: (params: { cityId?: number; keyword?: string; page?: number; pageSize?: number }) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/hotels", {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      cityId: params.cityId,
      keyword: params.keyword,
    }),
  carRentals: (params: { cityId?: number; keyword?: string; page?: number; pageSize?: number }) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/car-rentals", {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      cityId: params.cityId,
      keyword: params.keyword,
    }),
  guides: (params: { cityId?: number; page?: number; pageSize?: number }) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/guides", {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      cityId: params.cityId,
    }),
  products: (params: { cityId?: number; keyword?: string; recommended?: boolean; page?: number; pageSize?: number }) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/products", {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      cityId: params.cityId,
      keyword: params.keyword,
      recommended: params.recommended,
    }),
  productDetail: (id: number) => travelGet<Record<string, unknown>>(`/api/travel/content/products/${id}`),
  cases: (params: { cityId?: number; caseType?: string; page?: number; pageSize?: number }) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/cases", {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      cityId: params.cityId,
      caseType: params.caseType,
    }),
  tripReminders: (params: { cityId?: number; page?: number; pageSize?: number }) =>
    travelGet<TravelPageResult<Record<string, unknown>>>("/api/travel/content/trip-reminders", {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      cityId: params.cityId,
    }),
  aboutCompany: () => travelGet<Record<string, unknown>>("/api/travel/content/about/company"),
  consultation: () => travelGet<Record<string, unknown>>("/api/travel/content/consultation"),
};
