import {
  FarmProfile,
  WeatherData,
  FarmAlert,
  MarketCommodity,
  CropRecommendation,
  YieldForecastData,
  ProfitOptimizationData,
  DiseaseDiagnosis,
  LogisticsData,
  Language
} from '../types/farm';

export async function fetchFarmProfile(): Promise<FarmProfile> {
  const res = await fetch('/api/farm-profile');
  if (!res.ok) throw new Error('Failed to load farm profile');
  return res.json();
}

export async function updateFarmProfile(profile: Partial<FarmProfile>): Promise<{ success: boolean; profile: FarmProfile }> {
  const res = await fetch('/api/farm-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!res.ok) throw new Error('Failed to update farm profile');
  return res.json();
}

export async function fetchWeatherData(
  params?: { location?: string; lat?: number; lon?: number } | string
): Promise<WeatherData> {
  let url = '/api/weather';
  if (typeof params === 'string') {
    url += `?location=${encodeURIComponent(params)}`;
  } else if (params) {
    const q = new URLSearchParams();
    if (params.location) q.append('location', params.location);
    if (params.lat !== undefined) q.append('lat', params.lat.toString());
    if (params.lon !== undefined) q.append('lon', params.lon.toString());
    const qs = q.toString();
    if (qs) url += `?${qs}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load weather data');
  return res.json();
}

export async function fetchAlerts(location?: string): Promise<FarmAlert[]> {
  const url = location ? `/api/alerts?location=${encodeURIComponent(location)}` : '/api/alerts';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load alerts');
  return res.json();
}

export async function fetchMarketPrices(): Promise<MarketCommodity[]> {
  const res = await fetch('/api/market-prices');
  if (!res.ok) throw new Error('Failed to load market prices');
  return res.json();
}

export async function fetchCropRecommendations(params: {
  soilType?: string;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  moisture?: number;
  season?: string;
  location?: string;
  acreage?: number;
}): Promise<{ recommendations: CropRecommendation[]; sortCriteria: string }> {
  const res = await fetch('/api/crop-recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to get crop recommendations');
  return res.json();
}

export async function fetchYieldForecast(params: {
  crop?: string;
  acres?: number;
  irrigationStatus?: string;
  soilHealthRating?: string;
}): Promise<YieldForecastData> {
  const res = await fetch('/api/yield-forecast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to get yield forecast');
  return res.json();
}

export async function fetchProfitOptimization(params: {
  crop?: string;
  acres?: number;
  expectedYieldPerAcre?: number;
  marketPricePerQ?: number;
}): Promise<ProfitOptimizationData> {
  const res = await fetch('/api/profit-optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to calculate profit optimization');
  return res.json();
}

export async function detectCropDisease(data: {
  imageBase64?: string;
  mimeType?: string;
  cropName?: string;
  userNotes?: string;
}): Promise<{ success: boolean; diagnosis: DiseaseDiagnosis; source?: string }> {
  const res = await fetch('/api/disease-detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Disease analysis failed');
  return res.json();
}

export async function fetchLogisticsData(): Promise<LogisticsData> {
  const res = await fetch('/api/logistics');
  if (!res.ok) throw new Error('Failed to load logistics data');
  return res.json();
}

export async function sendChatMessage(data: {
  message: string;
  language: Language;
  history?: { sender: 'user' | 'bot'; text: string }[];
  model?: 'gemini-3.8-flash' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview' | string;
  role?: 'agronomist' | 'market_analyst' | 'schemes_expert' | string;
  useSearchGrounding?: boolean;
}): Promise<{
  reply: string;
  language: string;
  model?: string;
  role?: string;
  roleTitle?: string;
  sources?: { title: string; uri: string }[];
}> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Chatbot request failed');
  return res.json();
}

export async function searchLiveMarketData(query: string, location?: string): Promise<{
  result: string;
  sources?: { title: string; uri: string }[];
  model?: string;
}> {
  const res = await fetch('/api/market-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, location })
  });
  if (!res.ok) throw new Error('Live market search failed');
  return res.json();
}

export async function searchAgriAdvisories(query: string, location?: string): Promise<{
  result: string;
  sources?: { title: string; uri: string }[];
  model?: string;
}> {
  const res = await fetch('/api/agri-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, location })
  });
  if (!res.ok) throw new Error('Agricultural advisory search failed');
  return res.json();
}
