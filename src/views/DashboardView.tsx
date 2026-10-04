import React from 'react';
import {
  CloudSun,
  TrendingUp,
  Coins,
  Bug,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Droplets,
  Sprout,
  ArrowRight,
  CheckCircle2,
  Calendar,
  CloudRain,
  Sun,
  Flame,
  ChevronRight,
  Sparkles,
  Satellite
} from 'lucide-react';
import {
  FarmProfile,
  WeatherData,
  FarmAlert,
  MarketCommodity,
  NavTab,
  Language
} from '../types/farm';
import { translations } from '../i18n/translations';
import { IrrigationWidget } from '../components/IrrigationWidget';

interface DashboardViewProps {
  farmProfile: FarmProfile;
  weatherData: WeatherData | null;
  alerts: FarmAlert[];
  marketData: MarketCommodity[];
  onNavigate: (tab: NavTab) => void;
  language: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farmProfile,
  weatherData,
  alerts,
  marketData,
  onNavigate,
  language
}) => {
  const t = translations[language];

  // Greeting based on current local hour
  const currentHour = new Date().getHours();
  let greeting = t.greetingMorning;
  if (currentHour >= 12 && currentHour < 17) greeting = t.greetingAfternoon;
  else if (currentHour >= 17) greeting = t.greetingEvening;

  const currentTemp = weatherData?.current?.temperature ?? 28;
  const currentHumidity = weatherData?.current?.humidity ?? 72;
  const rainProb = weatherData?.current?.rainfallProbability ?? 35;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Sprout className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-600/60 text-xs font-semibold text-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>AI Farm Advisory • Kharif Season 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {greeting}, {farmProfile.farmerName} 👋
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            {t.farmIntelligenceToday}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/40">
              <Calendar className="w-3.5 h-3.5 text-lime-400" />
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/40">
              <Sprout className="w-3.5 h-3.5 text-lime-400" />
              Active Crop: {farmProfile.currentCrop.name} ({farmProfile.currentCrop.growthStage})
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/40">
              <Droplets className="w-3.5 h-3.5 text-cyan-300" />
              Soil Moisture: {farmProfile.soilData.moisture}% (Adequate)
            </span>
            <button
              onClick={() => onNavigate('farm-satellite')}
              className="flex items-center gap-1.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold px-3 py-1.5 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer ml-auto"
            >
              <Satellite className="w-3.5 h-3.5 text-emerald-900" />
              <span>Google Maps Satellite View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weather KPI */}
        <div
          onClick={() => onNavigate('weather')}
          className="cursor-pointer group bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              {t.metrics.weather}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CloudSun className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">{currentTemp}°C</span>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {weatherData?.current?.condition || 'Partly Sunny'}
            </span>
          </div>
          <p className="mt-2 text-xs text-stone-600 flex items-center gap-2">
            <span>💧 {currentHumidity}% Humidity</span>
            <span>•</span>
            <span>🌧️ {rainProb}% Rain</span>
          </p>
          <div className="mt-2 text-[10px] text-stone-500 flex items-center gap-1 font-mono flex-wrap">
            <span>📍 {farmProfile.location.split(',')[0]}</span>
            <span>({farmProfile.coordinates?.latitude?.toFixed(2)}°N, {farmProfile.coordinates?.longitude?.toFixed(2)}°E)</span>
            {weatherData?.climateCrossReference && (
              <span className="text-emerald-800 font-bold">• Alt {weatherData.climateCrossReference.elevationMeters}m • ET₀ {weatherData.climateCrossReference.et0EvapotranspirationMm}mm</span>
            )}
          </div>
        </div>

        {/* Expected Yield KPI */}
        <div
          onClick={() => onNavigate('yield-forecast')}
          className="cursor-pointer group bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              {t.metrics.expectedYield}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">21.5</span>
            <span className="text-sm font-semibold text-stone-600">quintals / acre</span>
          </div>
          <p className="mt-2 text-xs text-emerald-800 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+22.5% above district average</span>
          </p>
        </div>

        {/* Estimated Profit KPI */}
        <div
          onClick={() => onNavigate('profit-optimizer')}
          className="cursor-pointer group bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              {t.metrics.estimatedProfit}
            </span>
            <div className="w-10 h-10 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900">₹43,000</span>
            <span className="text-xs font-semibold text-stone-600">/ acre net</span>
          </div>
          <p className="mt-2 text-xs text-stone-600 flex items-center justify-between">
            <span>Rev: ₹85,000</span>
            <span>Cost: ₹42,000</span>
          </p>
        </div>

        {/* Farm Risk Index KPI */}
        <div
          onClick={() => onNavigate('analytics')}
          className="cursor-pointer group bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              {t.metrics.farmRisk}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">Medium</span>
            <span className="text-xs text-stone-600">(Score 34/100)</span>
          </div>
          <p className="mt-2 text-xs text-amber-800 font-medium">
            Weather risk due to Sunday rain
          </p>
        </div>
      </div>

      {/* Smart Irrigation Management & Soil Moisture Telemetry Widget */}
      <IrrigationWidget
        farmProfile={farmProfile}
        weatherData={weatherData}
        language={language}
        onNavigate={onNavigate}
      />

      {/* 5-7 Day Weather Forecast & Actionable Advisory */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 text-sky-800 rounded-xl">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">7-Day Farming Weather Forecast</h2>
              <p className="text-xs text-stone-600">
                Tailored micro-climate advisory for {farmProfile.location} ({farmProfile.coordinates?.latitude?.toFixed(2)}°N, {farmProfile.coordinates?.longitude?.toFixed(2)}°E)
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('weather')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Full Weather Radar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Forecast Cards Horizontal Scroll */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {(weatherData?.forecast ?? [
            { day: 'Today', date: 'Oct 4', maxTemp: 29, minTemp: 21, humidity: 72, rainProb: 35, condition: 'Partly Cloudy', icon: 'cloud-sun', spraySafety: 'Moderate' },
            { day: 'Tomorrow', date: 'Oct 5', maxTemp: 27, minTemp: 20, humidity: 82, rainProb: 75, condition: 'Showers & Storm', icon: 'cloud-rain', spraySafety: 'Avoid' },
            { day: 'Sun', date: 'Oct 6', maxTemp: 28, minTemp: 21, humidity: 78, rainProb: 50, condition: 'Scattered Rain', icon: 'cloud-drizzle', spraySafety: 'Avoid' },
            { day: 'Mon', date: 'Oct 7', maxTemp: 30, minTemp: 22, humidity: 65, rainProb: 20, condition: 'Clear Sunshine', icon: 'sun', spraySafety: 'Safe' },
            { day: 'Tue', date: 'Oct 8', maxTemp: 31, minTemp: 22, humidity: 60, rainProb: 10, condition: 'Sunny & Dry', icon: 'sun', spraySafety: 'Safe' },
            { day: 'Wed', date: 'Oct 9', maxTemp: 30, minTemp: 21, humidity: 62, rainProb: 15, condition: 'Mostly Sunny', icon: 'sun', spraySafety: 'Safe' },
            { day: 'Thu', date: 'Oct 10', maxTemp: 29, minTemp: 20, humidity: 66, rainProb: 25, condition: 'Mild Clouds', icon: 'cloud-sun', spraySafety: 'Safe' }
          ]).map((item, idx) => {
            const isToday = idx === 0;
            const sprayBadgeColor =
              item.spraySafety === 'Safe'
                ? 'bg-emerald-100 text-emerald-800'
                : item.spraySafety === 'Moderate'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800';

            return (
              <div
                key={item.day}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isToday
                    ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">{item.day}</div>
                <div className="text-[10px] text-stone-600 mb-2">{item.date}</div>

                <div className="flex justify-center my-1.5">
                  {item.icon === 'cloud-rain' ? (
                    <CloudRain className="w-6 h-6 text-sky-700" />
                  ) : item.icon === 'sun' ? (
                    <Sun className="w-6 h-6 text-amber-700" />
                  ) : (
                    <CloudSun className="w-6 h-6 text-amber-700" />
                  )}
                </div>

                <div className="text-sm font-extrabold text-stone-900">
                  {item.maxTemp}° / <span className="text-xs text-stone-600 font-normal">{item.minTemp}°</span>
                </div>

                <div className="text-[11px] text-sky-800 font-semibold mt-1">
                  🌧️ {item.rainProb}%
                </div>

                <div className="mt-2">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${sprayBadgeColor}`}>
                    {item.spraySafety === 'Avoid' ? 'No Spray' : item.spraySafety}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actionable farming weather note */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">
              Farming Advisory for Satara District:
            </div>
            <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
              "Rain is expected tomorrow (75% probability). Consider delaying pesticide and foliar fertilizer spraying until clear weather on Monday. Clear furrows to avoid water-logging in pod-stage Soybean."
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: AI Recommendations & Farm Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: AI Crop Recommendation Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">AI Crop Recommendations</h2>
                  <p className="text-xs text-stone-600">Based on black soil, Kharif season & market prices</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                93% Match
              </span>
            </div>

            {/* Top Recommended Crop Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-lime-50/80 border border-emerald-200 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Top Recommended Crop
                  </div>
                  <h3 className="text-lg font-extrabold text-stone-900 mt-0.5">
                    Soybean (JS-335 / JS-9305)
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Expected Yield: <span className="font-semibold text-stone-800">19–22 quintals/acre</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-600 block">Estimated Profit</span>
                  <span className="text-lg font-black text-emerald-800">₹43,000</span>
                  <span className="text-[10px] text-stone-600 block">per acre</span>
                </div>
              </div>

              {/* Explainable AI snippet */}
              <div className="mt-3 pt-3 border-t border-emerald-200/80">
                <div className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Why this crop?</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  "Soybean is recommended because your soil pH (6.8) is optimal for rhizobium root nodulation, current moisture (64%) supports vigorous pod fill, and predicted mandi prices are strong (₹5,150–₹5,380/q)."
                </p>
              </div>

              {/* Secondary Crop Runner Up */}
              <div className="mt-3 flex items-center justify-between text-xs bg-white/70 px-3 py-2 rounded-xl border border-emerald-200/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800">2. Cotton (Bt Hybrid)</span>
                  <span className="text-stone-600">• 86% match</span>
                </div>
                <span className="font-bold text-emerald-800">₹48,000 profit (higher risk)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('crop-recommendation')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <span>Explore All Crop Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Farm Risk Alerts & Protection */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">Farm Risk & Pest Alerts</h2>
                  <p className="text-xs text-stone-600">Active alerts generated from climate sensors & weather models</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                {alerts.length} Active
              </span>
            </div>

            {/* List of alerts */}
            <div className="space-y-3 mb-4">
              {alerts.slice(0, 2).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.severity === 'high'
                      ? 'bg-rose-50/60 border-rose-200 text-stone-900'
                      : 'bg-amber-50/60 border-amber-200 text-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold flex items-center gap-1.5 text-stone-900">
                      {alert.severity === 'high' ? (
                        <Flame className="w-3.5 h-3.5 text-rose-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-stone-600">{alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-emerald-800">
                      Action: {alert.recommendation.split('.')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('crop-health')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Bug className="w-3.5 h-3.5 text-emerald-800" />
              <span>Scan Crop Health</span>
            </button>
            <button
              onClick={() => onNavigate('weather')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Soil Health Meters Section */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-100 text-stone-700 rounded-xl">
              <Droplets className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Soil Health & Nutrients</h2>
              <p className="text-xs text-stone-600">
                {farmProfile.soilType} • Last Tested: Soil Health Card Sept 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('farm')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Update Soil Card</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Soil Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* pH */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 block">Soil pH</span>
            <div className="text-xl font-extrabold text-stone-900 mt-1">{farmProfile.soilData.ph}</div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Optimal
            </span>
            <span className="text-[10px] text-stone-600 block mt-1">Neutral 6.5–7.5</span>
          </div>

          {/* Nitrogen */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 block">Nitrogen (N)</span>
            <div className="text-xl font-extrabold text-stone-900 mt-1">{farmProfile.soilData.nitrogen}</div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Medium-Low
            </span>
            <span className="text-[10px] text-stone-600 block mt-1">kg/ha (Target 280)</span>
          </div>

          {/* Phosphorus */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 block">Phosphorus (P)</span>
            <div className="text-xl font-extrabold text-stone-900 mt-1">{farmProfile.soilData.phosphorus}</div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Good
            </span>
            <span className="text-[10px] text-stone-600 block mt-1">kg/ha (Target 25)</span>
          </div>

          {/* Potassium */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 block">Potassium (K)</span>
            <div className="text-xl font-extrabold text-stone-900 mt-1">{farmProfile.soilData.potassium}</div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              High / Rich
            </span>
            <span className="text-[10px] text-stone-600 block mt-1">kg/ha (Target 280)</span>
          </div>

          {/* Moisture */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 block">Soil Moisture</span>
            <div className="text-xl font-extrabold text-stone-900 mt-1">{farmProfile.soilData.moisture}%</div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              Good
            </span>
            <span className="text-[10px] text-stone-600 block mt-1">Pod-fill range</span>
          </div>

          {/* Organic Carbon */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 block">Organic Carbon</span>
            <div className="text-xl font-extrabold text-stone-900 mt-1">{farmProfile.soilData.organicCarbon}%</div>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Good
            </span>
            <span className="text-[10px] text-stone-600 block mt-1">Rich microbial base</span>
          </div>
        </div>

        {/* Soil recommendation text */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-950 leading-relaxed">
            <strong className="font-bold">Soil Recommendation:</strong> Your soil potassium is rich, saving you money on chemical potash. Nitrogen is slightly low—apply bio-fertilizer Rhizobium culture or liquid Azotobacter with drip irrigation to avoid excessive synthetic urea costs.
          </p>
        </div>
      </div>

      {/* Market Price Trends Preview */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Mandi Market Intelligence & Price Trends</h2>
              <p className="text-xs text-stone-600">Real-time APMC arrivals & 14-day AI price movement predictions</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('market-prices')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Markets</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Market Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-600">
                <th className="pb-3 font-bold">Crop / Commodity</th>
                <th className="pb-3 font-bold">Top Mandi</th>
                <th className="pb-3 font-bold">Current Rate</th>
                <th className="pb-3 font-bold">7-Day Trend</th>
                <th className="pb-3 font-bold">Net After Transit</th>
                <th className="pb-3 font-bold">AI Recommendation</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-stone-50">
                <td className="py-3 font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Soybean (JS-335)
                </td>
                <td className="py-3 text-stone-700">Pune Gultekdi (110 km)</td>
                <td className="py-3 font-extrabold text-stone-900">₹5,380 / q</td>
                <td className="py-3 font-semibold text-emerald-800">↑ +6.2%</td>
                <td className="py-3 font-bold text-emerald-900">₹5,240 / q</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                    Hold for Peak (Oct 12)
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onNavigate('market-prices')}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Compare
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3 font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Tomato (Hybrid)
                </td>
                <td className="py-3 text-stone-700">Vashi Mumbai (240 km)</td>
                <td className="py-3 font-extrabold text-stone-900">₹2,650 / q</td>
                <td className="py-3 font-semibold text-emerald-800">↑ +8.1%</td>
                <td className="py-3 font-bold text-emerald-900">₹2,430 / q</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    Sell Staggered
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onNavigate('market-prices')}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Compare
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3 font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Cotton (Kapas)
                </td>
                <td className="py-3 text-stone-700">Satara Mandi (18 km)</td>
                <td className="py-3 font-extrabold text-stone-900">₹7,350 / q</td>
                <td className="py-3 font-semibold text-emerald-800">↑ +1.0%</td>
                <td className="py-3 font-bold text-emerald-900">₹7,310 / q</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-800">
                    Steady / Hold
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onNavigate('market-prices')}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Compare
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AI Disclaimer */}
        <p className="mt-3 text-[11px] text-stone-600 text-center italic">
          * Predicted prices are AI estimates based on historical APMC arrivals and seasonal demand models, not guaranteed minimums.
        </p>
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('crop-health')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Bug className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-stone-900 text-sm block">Crop Doctor</span>
          <span className="text-xs text-stone-600">Scan leaf for diseases & pests</span>
        </button>

        <button
          onClick={() => onNavigate('profit-optimizer')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Coins className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-stone-900 text-sm block">Profit Engine</span>
          <span className="text-xs text-stone-600">Calculate net revenue & savings</span>
        </button>

        <button
          onClick={() => onNavigate('harvest-planner')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-stone-900 text-sm block">Harvest Window</span>
          <span className="text-xs text-stone-600">Weather & price peak timing</span>
        </button>

        <button
          onClick={() => onNavigate('chatbot')}
          className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-stone-900 text-sm block">Ask Kisan AI</span>
          <span className="text-xs text-stone-600">Hindi, Marathi & English advice</span>
        </button>
      </div>
    </div>
  );
};
