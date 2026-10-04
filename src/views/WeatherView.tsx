import React, { useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  MapPin,
  Compass,
  Navigation,
  Check,
  BookmarkCheck,
  Save,
  Satellite,
  Mountain,
  Gauge,
  Thermometer,
  Activity,
  Layers,
  SunMedium
} from 'lucide-react';
import { WeatherData, FarmAlert, FarmProfile, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { SevereWeatherProbabilityChart } from '../components/SevereWeatherProbabilityChart';

interface WeatherViewProps {
  weatherData: WeatherData | null;
  alerts: FarmAlert[];
  language: Language;
  farmProfile: FarmProfile;
  onUpdateLocation?: (newLocation: string, coords?: { latitude: number; longitude: number }, saveToFarm?: boolean) => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  weatherData,
  alerts,
  language,
  farmProfile,
  onUpdateLocation
}) => {
  const t = translations[language];

  const [customLocationInput, setCustomLocationInput] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Action checklist for farmer
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    'task-1': false,
    'task-2': true,
    'task-3': false,
  });

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const current = weatherData?.current || {
    temperature: 28,
    feelsLike: 30,
    humidity: 72,
    rainfallProbability: 35,
    windSpeed: 14,
    condition: 'Partly Cloudy with Humid Breeze',
    icon: 'cloud-sun',
    uvIndex: 6,
    dewPoint: 22,
    soilMoisture: '64% (Adequate)',
    updatedAt: new Date().toISOString()
  };

  const forecast = weatherData?.forecast || [];

  // Saved farm coordinates
  const savedLat = farmProfile.coordinates?.latitude ?? 17.6805;
  const savedLon = farmProfile.coordinates?.longitude ?? 73.9972;

  // Active weather coordinates
  const activeLat = weatherData?.coordinates?.latitude ?? savedLat;
  const activeLon = weatherData?.coordinates?.longitude ?? savedLon;
  const activeLocation = weatherData?.location || farmProfile.location;

  // Is current weather synchronized with the saved farm location coordinates?
  const isCurrentlySavedFarm =
    weatherData?.isSavedFarmLocation ??
    (Math.abs(activeLat - savedLat) < 0.05 && Math.abs(activeLon - savedLon) < 0.05);

  // Popular agricultural district presets with coordinates for high-resolution weather
  const locationPresets = [
    { label: 'Satara, MH', value: 'Satara District, Maharashtra', lat: 17.6805, lon: 73.9972, region: 'Krishna Basin' },
    { label: 'Nashik, MH', value: 'Nashik District, Maharashtra', lat: 19.9975, lon: 73.7898, region: 'Grape & Onion Belt' },
    { label: 'Pune, MH', value: 'Pune District, Maharashtra', lat: 18.5204, lon: 73.8567, region: 'Deccan Vegetables' },
    { label: 'Kolhapur, MH', value: 'Kolhapur District, Maharashtra', lat: 16.7050, lon: 74.2433, region: 'Panchganga Sugar' },
    { label: 'Sangli, MH', value: 'Sangli District, Maharashtra', lat: 16.8524, lon: 74.5815, region: 'Turmeric & Raisins' },
    { label: 'Nagpur, MH', value: 'Nagpur District, Maharashtra (Vidarbha)', lat: 21.1458, lon: 79.0882, region: 'Citrus & Cotton' },
    { label: 'Solapur, MH', value: 'Solapur District, Maharashtra', lat: 17.6599, lon: 75.9064, region: 'Semi-Arid Pomegranate' },
    { label: 'Sambhajinagar, MH', value: 'Chhatrapati Sambhajinagar, Maharashtra', lat: 19.8762, lon: 75.3433, region: 'Marathwada Pulses' },
    { label: 'Amravati, MH', value: 'Amravati District, Maharashtra', lat: 20.9320, lon: 77.7523, region: 'Cotton Belt' },
    { label: 'Indore, MP', value: 'Indore, Madhya Pradesh', lat: 22.7196, lon: 75.8577, region: 'Malwa Soybean' },
    { label: 'Ludhiana, PB', value: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573, region: 'Alluvial Grain Belt' },
  ];

  const handleSelectPreset = (preset: typeof locationPresets[0], saveDirectly = false) => {
    if (onUpdateLocation) {
      onUpdateLocation(preset.value, { latitude: preset.lat, longitude: preset.lon }, saveDirectly);
      setStatusMsg({
        text: `Fetching live regional weather for ${preset.label} (${preset.lat.toFixed(2)}°N, ${preset.lon.toFixed(2)}°E)...`,
        type: 'info'
      });
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleApplyCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customLocationInput.trim();
    if (!query || !onUpdateLocation) return;

    // Check if user entered coordinates like "18.52, 73.85"
    const coordMatch = query.match(/^([-\d.]+)\s*,\s*([-\d.]+)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lon) && lat >= 5 && lat <= 40 && lon >= 65 && lon <= 100) {
        onUpdateLocation(`GPS (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`, { latitude: lat, longitude: lon }, false);
        setStatusMsg({
          text: `Targeting precise coordinates ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E...`,
          type: 'info'
        });
        setCustomLocationInput('');
        setTimeout(() => setStatusMsg(null), 4000);
        return;
      }
    }

    onUpdateLocation(query, undefined, false);
    setStatusMsg({
      text: `Fetching live regional weather for "${query}"...`,
      type: 'info'
    });
    setCustomLocationInput('');
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Re-fetch weather for current farm profile saved coordinates
  const handleSyncSavedFarm = () => {
    if (onUpdateLocation) {
      setIsRefreshing(true);
      onUpdateLocation(farmProfile.location, farmProfile.coordinates, true);
      setStatusMsg({
        text: `Synchronized with Farm Saved Coordinates (${savedLat.toFixed(4)}°N, ${savedLon.toFixed(4)}°E)!`,
        type: 'success'
      });
      setTimeout(() => {
        setIsRefreshing(false);
        setStatusMsg(null);
      }, 3500);
    }
  };

  // Save currently previewed location & coordinates as official farm location
  const handleSaveActiveAsFarmLocation = () => {
    if (onUpdateLocation) {
      onUpdateLocation(activeLocation, { latitude: activeLat, longitude: activeLon }, true);
      setStatusMsg({
        text: `Saved "${activeLocation}" (${activeLat.toFixed(4)}°N, ${activeLon.toFixed(4)}°E) as your official Farm Location! All models updated.`,
        type: 'success'
      });
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  // Browser Geolocation API integration to detect farmer's exact live coordinates
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Proximity calculation for closest Indian agro-districts
        let closest = locationPresets[0];
        let minDist = Infinity;
        for (const dist of locationPresets) {
          const d = Math.hypot(latitude - dist.lat, longitude - dist.lon);
          if (d < minDist) {
            minDist = d;
            closest = dist;
          }
        }

        const detectedName = minDist < 0.8
          ? closest.value
          : `${closest.label.split(',')[0]} Outskirts (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`;

        if (onUpdateLocation) {
          // Update and auto-save detected GPS coordinates to the farm profile
          onUpdateLocation(detectedName, { latitude, longitude }, true);
        }

        setIsDetectingGps(false);
        setStatusMsg({
          text: `Exact Farm GPS Detected: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (${detectedName}). Farm profile & weather synchronized!`,
          type: 'success'
        });
        setTimeout(() => setStatusMsg(null), 5000);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsDetectingGps(false);
        setStatusMsg({
          text: 'Browser GPS restricted in this window. You can select your district from the dropdown above or use the Satellite Map picker!',
          type: 'info'
        });
        setTimeout(() => setStatusMsg(null), 6000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 mb-1.5">
              <CloudSun className="w-3.5 h-3.5" />
              <span>Hyper-Local Agricultural Weather Radar</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">Weather & Crop Protection Alerts</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Micro-climate tracking synchronized to your farm's exact saved geographical coordinates.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncSavedFarm}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
              title="Refresh weather specifically for saved farm coordinates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync Farm Radar</span>
            </button>

            <button
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              title="Detect live GPS coordinates from your device and sync farm profile"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
              <span>{isDetectingGps ? 'Detecting GPS...' : 'Detect Farm GPS'}</span>
            </button>
          </div>
        </div>

        {/* Location & Coordinates Sync Status Bar */}
        <div className="mt-5 pt-4 border-t border-stone-100 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <Satellite className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-stone-600">Saved Farm Location:</span>
                  <span className="font-extrabold text-stone-900">{farmProfile.location}</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                    <Compass className="w-3 h-3 text-stone-600" />
                    {savedLat.toFixed(4)}°N, {savedLon.toFixed(4)}°E
                  </span>

                  {isCurrentlySavedFarm ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                      <Check className="w-3 h-3 text-emerald-700" />
                      Live Synced with Farm Profile
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      Previewing Region: {activeLat.toFixed(2)}°N, {activeLon.toFixed(2)}°E
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-stone-600 flex items-center gap-2 flex-wrap">
                  {weatherData?.regionNote && (
                    <span><strong>Agro-Zone:</strong> {weatherData.regionNote}</span>
                  )}
                  {weatherData?.dataSource && (
                    <span className="text-stone-500">• {weatherData.dataSource}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action when viewing a different region */}
            {!isCurrentlySavedFarm && (
              <button
                onClick={handleSaveActiveAsFarmLocation}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs self-start lg:self-center shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Farm Location</span>
              </button>
            )}
          </div>

          {/* Search bar & Presets */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            {/* Custom Location or Coordinates Input */}
            <form onSubmit={handleApplyCustomLocation} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customLocationInput}
                  onChange={e => setCustomLocationInput(e.target.value)}
                  placeholder="Enter district, taluka, or coordinates (e.g. 19.99, 73.78)..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={!customLocationInput.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-bold transition-colors shrink-0"
              >
                Check Weather
              </button>
            </form>

            <span className="text-[11px] text-stone-500">
              * Enter coordinates or district name to fetch live radar
            </span>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-[11px] font-bold text-stone-600 shrink-0 mr-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              Regional Agro-Centers:
            </span>
            {locationPresets.map(preset => {
              const isSelected = Math.abs(activeLat - preset.lat) < 0.1 && Math.abs(activeLon - preset.lon) < 0.1;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleSelectPreset(preset, false)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs font-bold ring-2 ring-emerald-400/30'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                  title={`${preset.value} (${preset.lat}°N, ${preset.lon}°E)`}
                >
                  <span>{preset.label}</span>
                  <span className="text-[10px] opacity-75">({preset.lat.toFixed(1)}°, {preset.lon.toFixed(1)}°)</span>
                </button>
              );
            })}
          </div>

          {statusMsg && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-sky-50 border-sky-300 text-sky-950'
              }`}
            >
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Weather Card */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 rounded-3xl text-white p-6 sm:p-8 shadow-md border border-sky-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Current Agricultural Conditions
              </span>
              <span className="text-xs text-sky-200/80">•</span>
              <span className="text-xs text-sky-200 font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-300" />
                {activeLocation}
              </span>
              <span className="text-[11px] font-mono text-sky-200/90 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-600/40">
                {activeLat.toFixed(4)}°N, {activeLon.toFixed(4)}°E
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                {current.temperature}°C
              </span>
              <div>
                <span className="text-lg font-bold text-sky-100 block">
                  {current.condition}
                </span>
                <span className="text-xs text-sky-200">
                  Feels like {current.feelsLike}°C • Dew Point {current.dewPoint}°C
                </span>
              </div>
            </div>

            {weatherData?.regionNote && (
              <div className="mt-3 text-xs text-sky-200/90 bg-sky-950/40 px-3 py-1.5 rounded-xl border border-sky-600/30 inline-block">
                🌱 <strong>Agro-Climatic Zone:</strong> {weatherData.regionNote}
              </div>
            )}
          </div>

          {/* Right Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 bg-sky-950/50 p-4 rounded-2xl border border-sky-700/60 backdrop-blur-xs">
            <div>
              <span className="text-[11px] text-sky-300 font-medium block">Relative Humidity</span>
              <span className="text-xl font-bold text-white flex items-center gap-1">
                <Droplets className="w-4 h-4 text-cyan-300" />
                {current.humidity}%
              </span>
              <span className="text-[10px] text-sky-200">
                {current.humidity > 70 ? 'High Spore Risk' : 'Optimal'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-sky-300 font-medium block">Rain Probability</span>
              <span className="text-xl font-bold text-white flex items-center gap-1">
                <CloudRain className="w-4 h-4 text-sky-300" />
                {current.rainfallProbability}%
              </span>
              <span className="text-[10px] text-sky-200">
                {current.rainfallProbability > 40 ? 'Postpone Sprays' : 'Safe to Spray'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-sky-300 font-medium block">Wind Speed</span>
              <span className="text-xl font-bold text-white flex items-center gap-1">
                <Wind className="w-4 h-4 text-teal-300" />
                {current.windSpeed} km/h
              </span>
              <span className="text-[10px] text-sky-200">
                {current.windSpeed > 15 ? 'Drift Caution' : 'Low Drift'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-sky-300 font-medium block">Topsoil Moisture</span>
              <span className="text-base font-bold text-white block truncate">
                {current.soilMoisture}
              </span>
              <span className="text-[10px] text-sky-200">Root zone estimate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Precision Regional Climate Cross-Reference & Micro-Climate Diagnostics Panel */}
      {weatherData?.climateCrossReference && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs shrink-0">
                <Satellite className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-stone-900">
                    Regional Climate Cross-Reference & Micro-Climate Diagnostics
                  </h2>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Coordinate-Calibrated
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Cross-referenced for {activeLat.toFixed(4)}°N, {activeLon.toFixed(4)}°E • {weatherData.climateCrossReference.elevationMeters}m Elevation above MSL
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 self-start lg:self-auto">
              <Mountain className="w-3.5 h-3.5 text-stone-500" />
              <span>AMFU Observatory: <strong>{weatherData.climateCrossReference.nearestStation.split(',')[0]}</strong> (~{weatherData.climateCrossReference.distanceToStationKm} km)</span>
            </div>
          </div>

          {/* Agro-Climatic Sub-Zone Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div>
              <span className="font-extrabold text-emerald-950 uppercase tracking-wide text-[10px] block">
                Agro-Climatic & Agro-Ecological Sub-Zone
              </span>
              <span className="font-bold text-stone-900 text-sm">
                {weatherData.climateCrossReference.agroClimaticZone}
              </span>
              <span className="text-stone-600 block mt-0.5">
                {weatherData.climateCrossReference.subZone}
              </span>
            </div>

            <div className="text-[11px] font-semibold text-emerald-900 bg-white/90 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs self-start sm:self-center shrink-0">
              GDD (Base 10°C): <strong>{weatherData.climateCrossReference.growingDegreeDaysBase10} Units/day</strong>
            </div>
          </div>

          {/* 4 Micro-Climate Diagnostic Instruments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Evapotranspiration (ET0) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-600 uppercase text-[10px]">Reference ET₀</span>
                <Droplets className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-stone-900">
                  {weatherData.climateCrossReference.et0EvapotranspirationMm}
                </span>
                <span className="text-xs font-semibold text-stone-500 ml-1">mm/day</span>
              </div>
              <div className="text-xs font-bold text-sky-900 bg-sky-100/70 px-2 py-1 rounded-lg">
                ~{weatherData.climateCrossReference.irrigationRequirementLitersPerAcre.toLocaleString()} L/acre need
              </div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Atmospheric moisture draw from crop canopy. Daily quota for root turgor.
              </p>
            </div>

            {/* 2. Vapor Pressure Deficit (VPD) */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-600 uppercase text-[10px]">Vapor Pressure Deficit</span>
                <Activity className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-stone-900">
                  {weatherData.climateCrossReference.vaporPressureDeficitKpa}
                </span>
                <span className="text-xs font-semibold text-stone-500 ml-1">kPa</span>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-lg ${
                weatherData.climateCrossReference.vpdStatus.includes('Optimal')
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {weatherData.climateCrossReference.vpdStatus}
              </div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Controls stomatal conductance and photosynthesis rate.
              </p>
            </div>

            {/* 3. Delta-T Agricultural Spray Window */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-600 uppercase text-[10px]">Delta-T Spray Safety</span>
                <Gauge className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-stone-900">
                  {weatherData.climateCrossReference.deltaTSprayC}°C
                </span>
                <span className="text-xs font-semibold text-stone-500 ml-1">ΔT</span>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-lg ${
                weatherData.climateCrossReference.deltaTStatus.includes('Ideal')
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {weatherData.climateCrossReference.deltaTStatus}
              </div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Optimal 2°C – 8°C prevents both droplet drift and rapid evaporation.
              </p>
            </div>

            {/* 4. Soil Root-Zone Temp & Radiation */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-600 uppercase text-[10px]">Soil Temp (6cm)</span>
                <Thermometer className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <span className="text-2xl font-black text-stone-900">
                  {weatherData.climateCrossReference.soilTemperatureRootZoneC}°C
                </span>
                <span className="text-xs font-semibold text-stone-500 ml-1">root depth</span>
              </div>
              <div className="text-xs font-bold text-stone-800 bg-stone-200/80 px-2 py-1 rounded-lg flex items-center justify-between">
                <span>Solar: {weatherData.climateCrossReference.solarRadiationMjPerM2} MJ/m²</span>
                <span>{weatherData.climateCrossReference.surfacePressureHpa} hPa</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Root biological uptake active between 18°C and 30°C.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Predictive Severe Weather Probability Chart (Recharts) */}
      <SevereWeatherProbabilityChart
        forecast={forecast}
        latitude={activeLat}
        longitude={activeLon}
        locationName={activeLocation}
        cropName={farmProfile.currentCrop.name}
      />

      {/* 7-Day Forecast Section */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">7-Day Farming Weather Forecast</h2>
            <p className="text-xs text-stone-600">
              Calibrated for coordinates {activeLat.toFixed(2)}°N, {activeLon.toFixed(2)}°E with chemical spray safety windows
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Safe
            </span>
            <span className="flex items-center gap-1 text-amber-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate
            </span>
            <span className="flex items-center gap-1 text-rose-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Avoid
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((item, idx) => {
            const isToday = idx === 0;
            const sprayBadgeColor =
              item.spraySafety === 'Safe'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : item.spraySafety === 'Moderate'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-rose-100 text-rose-800 border-rose-200';

            return (
              <div
                key={item.day + item.date}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isToday
                    ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-500/20'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">{item.day}</div>
                <div className="text-[10px] text-stone-500 mb-2">{item.date}</div>

                <div className="flex justify-center my-2">
                  {item.icon === 'cloud-rain' ? (
                    <CloudRain className="w-7 h-7 text-sky-700" />
                  ) : item.icon === 'cloud-drizzle' ? (
                    <CloudRain className="w-7 h-7 text-sky-500" />
                  ) : item.icon === 'sun' ? (
                    <Sun className="w-7 h-7 text-amber-500" />
                  ) : (
                    <CloudSun className="w-7 h-7 text-amber-600" />
                  )}
                </div>

                <div className="text-xs font-black text-stone-900">
                  {item.maxTemp}° / {item.minTemp}°
                </div>

                <div className="text-[11px] text-stone-600 mt-1 flex items-center justify-center gap-1">
                  <CloudRain className="w-3 h-3 text-sky-600" />
                  <span>{item.rainProb}%</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-200">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${sprayBadgeColor}`}
                  >
                    {item.spraySafety}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Actionable Advisories & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Location-Specific Farming Advisories */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Coordinate-Specific Farming Advisories</h2>
              <p className="text-xs text-stone-600">
                Tailored for {activeLocation} ({activeLat.toFixed(2)}°N, {activeLon.toFixed(2)}°E)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(weatherData?.advisories || []).map((adv, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  adv.type === 'warning'
                    ? 'bg-amber-50/70 border-amber-200'
                    : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    {adv.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span>{adv.title}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                    {adv.action}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed mt-1">
                  {adv.message}
                </p>
              </div>
            ))}
          </div>

          {/* Action Checklist for the Farmer */}
          <div className="pt-2 border-t border-stone-100">
            <h3 className="text-xs font-bold text-stone-800 mb-2">Recommended Operational Checklist Today</h3>
            <div className="space-y-2">
              {[
                { id: 'task-1', title: 'Check furrow drainage gates for upcoming rainfall buffer' },
                { id: 'task-2', title: 'Inspect lower leaf canopy for morning dew and humidity spots' },
                { id: 'task-3', title: 'Operate drip cycle in morning window before peak midday heat' }
              ].map(task => (
                <label
                  key={task.id}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 hover:bg-stone-100 cursor-pointer border border-stone-200 text-xs transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={completedTasks[task.id] || false}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 text-emerald-600 rounded accent-emerald-600"
                  />
                  <span className={completedTasks[task.id] ? 'line-through text-stone-400' : 'text-stone-800'}>
                    {task.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Crop Protection Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-800">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Active Crop & Pest Alerts</h2>
                <p className="text-xs text-stone-600">
                  Regional risk alerts for {activeLocation}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
              {alerts.length} Warnings
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  alert.severity === 'high'
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    {alert.severity === 'high' ? (
                      <Flame className="w-4 h-4 text-rose-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    {alert.title}
                  </span>
                  <span className="text-[10px] text-stone-600">{alert.timestamp}</span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed mb-2">
                  {alert.description}
                </p>

                <div className="p-2 rounded-lg bg-white/90 border border-stone-200 text-xs text-emerald-950 font-medium">
                  💡 <strong>Recommendation:</strong> {alert.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
