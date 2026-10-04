export type Language = 'en' | 'hi' | 'mr';

export type NavTab = 
  | 'dashboard'
  | 'farm'
  | 'farm-satellite'
  | 'crop-recommendation'
  | 'yield-forecast'
  | 'profit-optimizer'
  | 'crop-health'
  | 'market-prices'
  | 'weather'
  | 'harvest-planner'
  | 'logistics'
  | 'analytics'
  | 'chatbot';

export interface SoilData {
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  moisture: number; // %
  organicCarbon: number; // %
  fertilityRating: 'Low' | 'Medium' | 'Good' | 'Excellent';
}

export interface CurrentCrop {
  name: string;
  variety: string;
  sowingDate: string;
  growthStage: string;
  daysAfterSowing: number;
  expectedMaturityDays: number;
  irrigationType: string;
  waterSource: string;
}

export interface FarmProfile {
  id: string;
  farmerName: string;
  phone: string;
  location: string;
  state: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  totalAcres: number;
  soilType: string;
  soilData: SoilData;
  currentCrop: CurrentCrop;
  resources: {
    tractorAvailable: boolean;
    storageCapacityQuintals: number;
    storageType: string;
    labourAvailability: string;
    dripCoveragePercent: number;
  };
}

export interface WeatherDay {
  day: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  rainProb: number;
  condition: string;
  icon: string;
  spraySafety: 'Safe' | 'Moderate' | 'Avoid';
}

export interface RegionalClimateCrossReference {
  agroClimaticZone: string;
  subZone: string;
  elevationMeters: number;
  nearestStation: string;
  distanceToStationKm: number;
  et0EvapotranspirationMm: number;
  irrigationRequirementLitersPerAcre: number;
  vaporPressureDeficitKpa: number;
  vpdStatus: 'Low Transpiration' | 'Optimal Transpiration' | 'High Stomatal Stress';
  deltaTSprayC: number;
  deltaTStatus: 'Ideal Spray Window' | 'Marginal' | 'Unfavorable / Drift Risk';
  soilTemperatureRootZoneC: number;
  surfacePressureHpa: number;
  solarRadiationMjPerM2: number;
  growingDegreeDaysBase10: number;
  microClimateSummary: string;
  soilMoistureDepthPercent: number;
}

export interface WeatherData {
  location: string;
  regionNote?: string;
  isSavedFarmLocation?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  dataSource?: string;
  climateCrossReference?: RegionalClimateCrossReference;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    rainfallProbability: number;
    windSpeed: number;
    condition: string;
    icon: string;
    uvIndex: number;
    dewPoint: number;
    soilMoisture: string;
    updatedAt: string;
    surfacePressureHpa?: number;
    elevationMeters?: number;
    evapotranspirationEt0?: number;
    vpdKpa?: number;
    deltaT?: number;
  };
  forecast: WeatherDay[];
  advisories: {
    type: 'warning' | 'info' | 'success';
    title: string;
    message: string;
    action: string;
  }[];
}

export interface FarmAlert {
  id: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  crop: string;
  description: string;
  recommendation: string;
  timestamp: string;
  urgent: boolean;
}

export interface MandiItem {
  name: string;
  distanceKm: number;
  price: number;
  trend: string;
  status: 'Hold' | 'Sell' | 'Hold for Peak' | 'Sell Immediately' | 'Steady';
  transportCostPerQ: number;
  netPricePerQ: number;
}

export interface PriceHistoryPoint {
  day: string;
  price: number;
  isPredicted?: boolean;
}

export interface MarketCommodity {
  crop: string;
  unit: string;
  basePrice: number;
  weeklyChange: string;
  mandis: MandiItem[];
  priceHistory: PriceHistoryPoint[];
  aiRecommendation: string;
  recommendationAction: string;
}

export interface CropRecommendation {
  id: string;
  crop: string;
  season: string;
  suitability: number;
  expectedYield: string;
  averageYieldPerAcre: number;
  totalExpectedYield: string;
  estimatedCostPerAcre: number;
  totalEstimatedCost: number;
  currentMarketPrice: number;
  expectedRevenue: number;
  expectedProfit: number;
  risk: 'Low' | 'Medium' | 'High' | string;
  riskColor: 'emerald' | 'amber' | 'rose';
  waterNeed: string;
  maturityDays: string;
  why: string;
  advantages: string[];
  expertAiNote?: string;
}

export interface YieldForecastData {
  crop: string;
  acres: number;
  expectedYieldPerAcre: number;
  unit: string;
  totalPredictedQuintals: string;
  confidencePercentage: number;
  minExpectedYield: string;
  maxExpectedYield: string;
  districtBenchmarkYield: string;
  gainOverDistrictAverage: string;
  factors: {
    name: string;
    impact: string;
    description: string;
  }[];
  growthStageTimeline: {
    stage: string;
    expected: number;
    actual: number | null;
    status: string;
  }[];
}

export interface CostBreakdownItem {
  category: string;
  perAcre: number;
  total: number;
  share: string;
}

export interface OptimizationRecommendation {
  title: string;
  savingsOrGain: string;
  type: 'revenue' | 'cost';
  description: string;
}

export interface ProfitOptimizationData {
  crop: string;
  farmAcres: number;
  totalProductionQ: string;
  grossRevenue: number;
  totalOperationalCost: number;
  netProfit: number;
  profitMarginPercent: string;
  profitabilityScore: number;
  costBreakdown: CostBreakdownItem[];
  optimizationRecommendations: OptimizationRecommendation[];
}

export interface DiseaseDiagnosis {
  diseaseName: string;
  pathogenType: string;
  confidence: number;
  severity: string;
  severityLevel: 'low' | 'moderate' | 'high' | 'healthy';
  symptoms: string[];
  causes: string[];
  immediateActions: string[];
  organicRemedies: string[];
  preventiveMeasures: string[];
  expertConsultationNote: string;
}

export interface LogisticsDestination {
  id: string;
  name: string;
  distanceKm: number;
  grossPricePerQ: number;
  freightCostPerQ: number;
  mandiFeePerQ: number;
  unloadingCostPerQ: number;
  netRealizationPerQ: number;
  totalNetFor95Q: number;
  transitTimeHours: number;
  netProfitAdvantage?: string;
  recommendation: string;
}

export interface VerifiedBuyer {
  name: string;
  contact: string;
  rating: number;
  paymentTerms: string;
  distance: string;
}

export interface LogisticsData {
  currentHarvest: {
    crop: string;
    expectedYieldTotalQuintals: number;
    harvestDate: string;
    storageAvailableQuintals: number;
    immediateDispatchNeededQuintals: number;
  };
  destinations: LogisticsDestination[];
  verifiedBuyers: VerifiedBuyer[];
}

export interface GroundingSource {
  title?: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickAction?: string;
  modelUsed?: string;
  groundingSources?: GroundingSource[];
  roleTitle?: string;
}
