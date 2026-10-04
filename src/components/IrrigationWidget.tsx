import React, { useState, useEffect, useMemo } from 'react';
import {
  Droplets,
  CloudRain,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Satellite,
  Waves,
  Sun
} from 'lucide-react';
import { FarmProfile, WeatherData, Language, NavTab } from '../types/farm';

interface IrrigationWidgetProps {
  farmProfile: FarmProfile;
  weatherData: WeatherData | null;
  language: Language;
  onNavigate?: (tab: NavTab) => void;
}

export const IrrigationWidget: React.FC<IrrigationWidgetProps> = ({
  farmProfile,
  weatherData,
  language,
  onNavigate
}) => {
  // Current soil moisture from farm profile (or default to 64%)
  const soilMoisture = farmProfile.soilData.moisture ?? 64;

  // Next rain forecast inspection from weather data
  const tomorrowForecast = weatherData?.forecast?.[1];
  const rainProbabilityTomorrow = tomorrowForecast?.rainProb ?? weatherData?.current?.rainfallProbability ?? 35;
  const isRainLikely = rainProbabilityTomorrow >= 55;

  // Active zone selection
  const [selectedZone, setSelectedZone] = useState<string>('zone-1');
  const [smartWeatherSync, setSmartWeatherSync] = useState<boolean>(true);
  const [isManualCycleRunning, setIsManualCycleRunning] = useState<boolean>(false);
  const [manualTimeRemaining, setManualTimeRemaining] = useState<number>(1200); // 20 minutes in seconds
  const [cycleSkipped, setCycleSkipped] = useState<boolean>(false);

  // Countdown timer calculation (in seconds)
  // If moisture is high (>70%) or rain is imminent, next irrigation is delayed.
  // Otherwise, default scheduled countdown is approx 14 hours 25 minutes (51,900s).
  const initialSeconds = useMemo(() => {
    if (cycleSkipped) return 86400 * 2; // 48 hours
    if (isRainLikely && smartWeatherSync) {
      // Delay until after the rain event
      return 3600 * 38 + 1800; // 38 hours 30 mins
    }
    if (soilMoisture >= 68) {
      return 3600 * 22 + 900; // 22 hours 15 mins
    }
    if (soilMoisture <= 45) {
      return 3600 * 3 + 1200; // 3 hours 20 mins (urgently needed)
    }
    return 3600 * 14 + 1500; // 14 hours 25 mins
  }, [soilMoisture, isRainLikely, smartWeatherSync, cycleSkipped]);

  const [countdownSeconds, setCountdownSeconds] = useState<number>(initialSeconds);

  // Update countdown when conditions change
  useEffect(() => {
    setCountdownSeconds(initialSeconds);
  }, [initialSeconds]);

  // Live ticking countdown for the widget
  useEffect(() => {
    if (isManualCycleRunning) {
      const interval = setInterval(() => {
        setManualTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsManualCycleRunning(false);
            return 1200;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isManualCycleRunning]);

  // Format countdown into Hours, Minutes, Seconds
  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  };

  const timer = formatCountdown(countdownSeconds);
  const manualTimer = formatCountdown(manualTimeRemaining);

  // Irrigation Zones definition
  const zones = [
    {
      id: 'zone-1',
      name: 'Plot A • North Cane Field',
      crop: `${farmProfile.currentCrop.name} (${farmProfile.currentCrop.variety})`,
      acres: 8.5,
      method: 'Drip Manifold Line #1',
      nextScheduled: isRainLikely && smartWeatherSync ? 'Rescheduled to Mon 06:00 AM' : 'Today 06:30 PM',
      duration: '45 mins',
      estWaterLiters: 4800,
      status: isRainLikely && smartWeatherSync ? 'Rain-Skip Active' : 'On Schedule'
    },
    {
      id: 'zone-2',
      name: 'Plot B • South Sector',
      crop: 'Soybean (JS-335) Rotation',
      acres: 4.5,
      method: 'Micro-Sprinkler Line #2',
      nextScheduled: isRainLikely && smartWeatherSync ? 'Rescheduled to Tue 05:30 AM' : 'Tomorrow 07:00 AM',
      duration: '30 mins',
      estWaterLiters: 2600,
      status: isRainLikely && smartWeatherSync ? 'Rain-Skip Active' : 'On Schedule'
    },
    {
      id: 'zone-3',
      name: 'Plot C • Polyhouse & Nursery',
      crop: 'Protected Horticulture & Seedlings',
      acres: 2.5,
      method: 'Precision Overhead Mist',
      nextScheduled: 'Today 04:30 PM',
      duration: '15 mins',
      estWaterLiters: 850,
      status: 'Protected from Rain'
    }
  ];

  const currentZone = zones.find((z) => z.id === selectedZone) || zones[0];

  // Moisture state classification
  const moistureLevel = useMemo(() => {
    if (soilMoisture < 35) {
      return {
        label: 'Critical Deficit',
        color: 'text-rose-700',
        bg: 'bg-rose-100',
        border: 'border-rose-300',
        recommendation: 'Immediate watering required to prevent leaf wilting and root senescence.'
      };
    }
    if (soilMoisture < 50) {
      return {
        label: 'Depleting / Irrigation Due',
        color: 'text-amber-700',
        bg: 'bg-amber-100',
        border: 'border-amber-300',
        recommendation: 'Soil is in allowable depletion zone. Prepare next watering cycle.'
      };
    }
    if (soilMoisture <= 75) {
      return {
        label: 'Optimal Root-Zone Moisture',
        color: 'text-emerald-700',
        bg: 'bg-emerald-100',
        border: 'border-emerald-300',
        recommendation: 'Crop roots have ideal water-to-air balance. Natural transpiration healthy.'
      };
    }
    return {
      label: 'Field Capacity / Saturated',
      color: 'text-sky-700',
      bg: 'bg-sky-100',
      border: 'border-sky-300',
      recommendation: 'Adequate moisture buffer. Avoid over-irrigation to maintain aeration.'
    };
  }, [soilMoisture]);

  // Multi-language text map
  const labels = {
    en: {
      title: 'Smart Irrigation & Water Management',
      subtitle: 'Automated scheduling synchronized with soil sensors and local rain radar',
      nextCountdown: 'Next Irrigation in',
      rainSkipTitle: 'Smart Rain-Skip Protocol Active',
      rainSkipDesc: `Incoming precipitation (${rainProbabilityTomorrow}% probability tomorrow) will supply natural soil moisture. Drip cycle has been delayed to prevent water-logging and save groundwater.`,
      activeWatering: 'Watering in Progress (Manual Quick Cycle)',
      stopCycle: 'Stop Cycle',
      startQuick: 'Start 20-min Quick Drip',
      skipCycle: 'Skip Next Cycle',
      restoreSchedule: 'Restore Schedule',
      weatherSyncEnabled: 'Weather-Sync Enabled',
      weatherSyncDisabled: 'Weather-Sync Paused',
      soilTelemetry: 'Root-Zone Soil Moisture Probe (15cm depth)',
      savingsStat: '14,200 Litres Conserved',
      savingsSub: 'via intelligent rainfall-skips this Kharif cycle',
      viewSatellite: 'View Pump & Plots on Satellite Map'
    },
    hi: {
      title: 'स्मार्ट सिंचाई एवं जल प्रबंधन',
      subtitle: 'मिट्टी की नमी और स्थानीय वर्षा पूर्वानुमान के अनुसार स्वचालित सिंचाई समय सारणी',
      nextCountdown: 'अगली सिंचाई प्रारंभ होने में शेष',
      rainSkipTitle: 'वर्षा-बचत प्रणाली (Rain-Skip) सक्रिय',
      rainSkipDesc: `कल ${rainProbabilityTomorrow}% बारिश की संभावना है। प्राकृतिक वर्षा से नमी मिलेगी, इसलिए ड्रिप चक्र को आगे बढ़ा दिया गया है ताकि पानी व बिजली की बचत हो सके।`,
      activeWatering: 'सिंचाई जारी है (मैनुअल त्वरित चक्र)',
      stopCycle: 'सिंचाई रोकें',
      startQuick: '20 मिनट ड्रिप प्रारंभ करें',
      skipCycle: 'अगली सिंचाई छोड़ें',
      restoreSchedule: 'अनुसूची पुनः स्थापित करें',
      weatherSyncEnabled: 'मौसम-सिंक चालू',
      weatherSyncDisabled: 'मौसम-सिंक बंद',
      soilTelemetry: 'जड़ क्षेत्र मिट्टी नमी जांच (15 सेमी गहराई)',
      savingsStat: '14,200 लीटर जल सुरक्षित',
      savingsSub: 'बारिश के अनुसार स्मार्ट सिंचाई से इस मौसम में बचत',
      viewSatellite: 'सैटेलाइट नक्शे पर पंप व प्लॉट देखें'
    },
    mr: {
      title: 'स्मार्ट सिंचन व पाणी व्यवस्थापन',
      subtitle: 'जमिनीतील ओलावा आणि स्थानिक पावसाच्या अंदाजानुसार अचूक सिंचन वेळापत्रक',
      nextCountdown: 'पुढील पाणी भरण्यास शिल्लक वेळ',
      rainSkipTitle: 'पाऊस-बचत प्रणाली (Rain-Skip) सक्रिय',
      rainSkipDesc: `उद्या ${rainProbabilityTomorrow}% पावसाची शक्यता आहे. नैसर्गिक पावसामुळे पिकास पाणी मिळणार असल्याने ठिबक सिंचन पुढे ढकलण्यात आले आहे, ज्यामुळे पाणी व वीज बचत होईल.`,
      activeWatering: 'पाणी भरणे सुरू आहे (मॅन्युअल सायकल)',
      stopCycle: 'सायकल थांबवा',
      startQuick: '२० मिनिटे ठिबक सुरू करा',
      skipCycle: 'पुढील पाळी टाळा',
      restoreSchedule: 'मूळ वेळापत्रक चालू करा',
      weatherSyncEnabled: 'हवामान-सिंक सक्रिय',
      weatherSyncDisabled: 'हवामान-सिंक बंद',
      soilTelemetry: 'मुळे क्षेत्र माती ओलावा सेन्सर (१५ सेंमी खोली)',
      savingsStat: '१४,२०० लिटर पाण्याची बचत',
      savingsSub: 'पावसाच्या अचूक अंदाजामुळे या हंगामातील बचत',
      viewSatellite: 'सॅटेलाइट नकाशावर पंप व शेत पहा'
    }
  }[language];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20 shrink-0">
            <Droplets className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                {labels.title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 flex items-center gap-1">
                <Waves className="w-3 h-3 text-cyan-600" />
                Drip & Moisture Telemetry
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {labels.subtitle}
            </p>
          </div>
        </div>

        {/* Weather Sync Mode Switcher */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setSmartWeatherSync(!smartWeatherSync)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              smartWeatherSync
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                : 'bg-stone-100 border-stone-200 text-stone-600'
            }`}
          >
            <CloudRain className={`w-3.5 h-3.5 ${smartWeatherSync ? 'text-emerald-600' : 'text-stone-400'}`} />
            <span>{smartWeatherSync ? labels.weatherSyncEnabled : labels.weatherSyncDisabled}</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('farm-satellite')}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Inspect drip manifold and borehole pump on satellite"
            >
              <Satellite className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">{labels.viewSatellite}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Feature Cards Grid: Next Irrigation Countdown & Soil Moisture Sensor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Next Irrigation Countdown Hero Box (7 cols) */}
        <div
          className={`lg:col-span-7 rounded-2xl p-6 border transition-all ${
            isManualCycleRunning
              ? 'bg-gradient-to-br from-cyan-900 via-teal-900 to-emerald-950 text-white border-cyan-500 shadow-lg'
              : isRainLikely && smartWeatherSync
              ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white border-teal-500/40 shadow-md'
              : 'bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 text-white border-emerald-500/40 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{isManualCycleRunning ? labels.activeWatering : labels.nextCountdown}</span>
            </span>

            {/* Smart Protocol Badge */}
            {isRainLikely && smartWeatherSync && !isManualCycleRunning && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-300 animate-bounce" />
                <span>Rain-Skip Delay</span>
              </span>
            )}

            {isManualCycleRunning && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500 text-stone-950 flex items-center gap-1.5 animate-pulse">
                <Waves className="w-3.5 h-3.5" />
                <span>Pump Active (7.5 HP)</span>
              </span>
            )}
          </div>

          {/* Countdown Numbers Display */}
          <div className="flex items-baseline gap-3 my-2">
            {isManualCycleRunning ? (
              <div className="flex items-center gap-2">
                <div className="bg-cyan-950/80 px-4 py-2 rounded-xl border border-cyan-400/40 text-3xl sm:text-4xl font-black font-mono tracking-tight text-cyan-200">
                  {manualTimer.minutes}
                </div>
                <span className="text-2xl font-bold text-cyan-400">:</span>
                <div className="bg-cyan-950/80 px-4 py-2 rounded-xl border border-cyan-400/40 text-3xl sm:text-4xl font-black font-mono tracking-tight text-cyan-200">
                  {manualTimer.seconds}
                </div>
                <span className="text-xs text-cyan-300 font-semibold ml-2">min remaining</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-center">
                  <div className="bg-stone-950/70 px-3.5 py-2 rounded-xl border border-white/10 text-3xl sm:text-4xl font-black font-mono tracking-tight text-white shadow-inner">
                    {timer.hours}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 mt-1 block">Hours</span>
                </div>
                <span className="text-2xl font-bold text-emerald-400 mb-4">:</span>
                <div className="text-center">
                  <div className="bg-stone-950/70 px-3.5 py-2 rounded-xl border border-white/10 text-3xl sm:text-4xl font-black font-mono tracking-tight text-white shadow-inner">
                    {timer.minutes}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 mt-1 block">Mins</span>
                </div>
                <span className="text-2xl font-bold text-emerald-400 mb-4">:</span>
                <div className="text-center">
                  <div className="bg-stone-950/70 px-3.5 py-2 rounded-xl border border-white/10 text-3xl sm:text-4xl font-black font-mono tracking-tight text-white shadow-inner">
                    {timer.seconds}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 mt-1 block">Secs</span>
                </div>
              </div>
            )}
          </div>

          {/* Context Advisory inside Countdown box */}
          <div className="mt-4 pt-3 border-t border-white/10">
            {isRainLikely && smartWeatherSync && !isManualCycleRunning ? (
              <div className="flex items-start gap-2.5 text-xs text-cyan-200 leading-relaxed">
                <CloudRain className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <p>
                  <strong>{labels.rainSkipTitle}:</strong> {labels.rainSkipDesc}
                </p>
              </div>
            ) : isManualCycleRunning ? (
              <div className="flex items-center gap-2 text-xs text-cyan-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Delivering 120 L/min across drip laterals. Solar manifold pressure: 2.3 bar.</span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-emerald-200 flex-wrap gap-2">
                <span>Target: <strong>{currentZone.name}</strong> ({currentZone.duration})</span>
                <span className="font-mono bg-emerald-900/60 px-2.5 py-0.5 rounded-full text-[11px] text-emerald-300 border border-emerald-700/60">
                  Est. {currentZone.estWaterLiters} Litres
                </span>
              </div>
            )}
          </div>

          {/* Action buttons inside hero box */}
          <div className="mt-4 flex items-center gap-2.5 flex-wrap">
            {isManualCycleRunning ? (
              <button
                type="button"
                onClick={() => setIsManualCycleRunning(false)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>{labels.stopCycle}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsManualCycleRunning(true);
                  setManualTimeRemaining(1200);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{labels.startQuick}</span>
              </button>
            )}

            {!isManualCycleRunning && (
              <button
                type="button"
                onClick={() => setCycleSkipped(!cycleSkipped)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-300" />
                <span>{cycleSkipped ? labels.restoreSchedule : labels.skipCycle}</span>
              </button>
            )}
          </div>
        </div>

        {/* Soil Moisture Meter & Root-Zone Telemetry Box (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl p-5 sm:p-6 bg-stone-50 border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>Soil Moisture Level</span>
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${moistureLevel.bg} ${moistureLevel.color} ${moistureLevel.border}`}>
                {moistureLevel.label}
              </span>
            </div>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-stone-900">{soilMoisture}%</span>
              <span className="text-xs font-semibold text-stone-500">Volumetric Water Content (VWC)</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5 my-3">
              <div className="w-full bg-stone-200 rounded-full h-3.5 overflow-hidden p-0.5 border border-stone-300/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${Math.min(Math.max(soilMoisture, 5), 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-500 font-semibold px-0.5">
                <span>0% Wilting</span>
                <span className="text-amber-700">35% Deficit</span>
                <span className="text-emerald-700 font-bold">50-70% Optimal</span>
                <span className="text-cyan-700">100% Saturated</span>
              </div>
            </div>

            {/* Actionable Moisture Guidance */}
            <p className="text-xs text-stone-600 mt-2 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
              {moistureLevel.recommendation}
            </p>
          </div>

          {/* Soil Physics Metadata footer */}
          <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-stone-500 block">Soil Type:</span>
              <span className="font-bold text-stone-800">{farmProfile.soilType}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Water Holding Capacity:</span>
              <span className="font-bold text-emerald-800">High (180 mm/m)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Day Rainfall Forecast & Rain-Skip Timeline Strip */}
      <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800 shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-cyan-950 flex items-center gap-1.5">
              <span>Local Rainfall Impact on Irrigation</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-200/80 text-cyan-900">
                Satellite Doppler Synced
              </span>
            </div>
            <p className="text-xs text-cyan-900/80 mt-0.5">
              {isRainLikely
                ? `High probability (${rainProbabilityTomorrow}%) of rain tomorrow. Automated Rain-Skip saves ~${currentZone.estWaterLiters} L of water.`
                : 'Dry weather predicted for the next 48 hours. Routine drip irrigation schedule active.'}
            </p>
          </div>
        </div>

        {/* 3-Day Quick Rain Probability Pills */}
        <div className="flex items-center gap-2 text-xs shrink-0 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-cyan-200 text-stone-800 text-center font-semibold">
            <div className="text-[10px] text-stone-500">Today</div>
            <div className="font-bold text-cyan-800">💧 {weatherData?.current?.rainfallProbability ?? 35}%</div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-center font-semibold ${
            isRainLikely ? 'bg-cyan-200/80 border-cyan-400 text-cyan-950 ring-2 ring-cyan-400/30' : 'bg-white border-cyan-200 text-stone-800'
          }`}>
            <div className="text-[10px] text-cyan-900 font-bold">Tomorrow</div>
            <div className="font-black text-cyan-950">🌧️ {rainProbabilityTomorrow}%</div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white border border-cyan-200 text-stone-800 text-center font-semibold">
            <div className="text-[10px] text-stone-500">Day After</div>
            <div className="font-bold text-cyan-800">⛅ {weatherData?.forecast?.[2]?.rainProb ?? 20}%</div>
          </div>
        </div>
      </div>

      {/* Multi-Plot / Irrigation Zones Scheduling Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Farm Plots Watering Schedule & Automation</span>
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            3 Automated Zones Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {zones.map((zone) => {
            const isSelected = selectedZone === zone.id;
            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-900 truncate">
                    {zone.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    zone.status === 'Rain-Skip Active'
                      ? 'bg-cyan-100 text-cyan-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {zone.status}
                  </span>
                </div>

                <div className="text-xs text-stone-600 mb-2 truncate">
                  {zone.crop} • {zone.acres} Acres
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Method</span>
                    <span className="font-bold text-stone-700">{zone.method.split(' ')[0]}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-400 block text-[10px]">Next Run</span>
                    <span className="font-bold text-emerald-800">{zone.nextScheduled}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Water Conservation Banner */}
      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>{labels.savingsStat}:</strong> {labels.savingsSub}
          </span>
        </div>

        <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
          <span>Solar Borewell: 7.5 HP</span>
          <span>•</span>
          <span>Discharge: 120 LPM</span>
          <span>•</span>
          <span>Total Drip Coverage: {farmProfile.resources.dripCoveragePercent}%</span>
        </div>
      </div>
    </div>
  );
};
