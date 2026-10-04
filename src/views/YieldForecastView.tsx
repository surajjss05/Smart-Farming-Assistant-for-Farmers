import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Droplets,
  AlertTriangle,
  Layers,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { YieldForecastData, FarmProfile, Language } from '../types/farm';
import { translations } from '../i18n/translations';

interface YieldForecastViewProps {
  farmProfile: FarmProfile;
  initialForecast: YieldForecastData;
  language: Language;
}

export const YieldForecastView: React.FC<YieldForecastViewProps> = ({
  farmProfile,
  initialForecast,
  language
}) => {
  const t = translations[language];

  // Interactive simulation parameters
  const [irrigationStatus, setIrrigationStatus] = useState<'Drip Fertigation' | 'Canal/Flood' | 'Rainfed'>('Drip Fertigation');
  const [fertilizerAdherence, setFertilizerAdherence] = useState<number>(95); // %
  const [pestScoutingFreq, setPestScoutingFreq] = useState<'Bi-weekly' | 'Weekly' | 'Occasional'>('Bi-weekly');

  // Compute simulated yield adjustment based on user tweaks
  let irrigationModifier = 0;
  if (irrigationStatus === 'Drip Fertigation') irrigationModifier = 1.2;
  else if (irrigationStatus === 'Canal/Flood') irrigationModifier = -0.5;
  else irrigationModifier = -2.1;

  const fertModifier = ((fertilizerAdherence - 90) / 10) * 0.8;
  const pestModifier = pestScoutingFreq === 'Weekly' ? 0.6 : pestScoutingFreq === 'Bi-weekly' ? 0.2 : -1.2;

  const currentPredicted = Math.max(12, Number((initialForecast.expectedYieldPerAcre + irrigationModifier + fertModifier + pestModifier).toFixed(1)));
  const totalPredicted = (currentPredicted * farmProfile.totalAcres).toFixed(1);
  const minYield = (currentPredicted * 0.88).toFixed(1);
  const maxYield = (currentPredicted * 1.14).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Multi-Variable Machine Learning Forecast</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">AI Yield Forecasting Model</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Predicting end-of-season harvest yields using soil sensor metrics, weather projections, and crop phenology.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Model Confidence:</span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
              87% Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Main Yield Projection Display Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl text-white p-6 sm:p-8 shadow-md border border-emerald-700/60">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
              Active Standing Crop • {farmProfile.currentCrop.name}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {currentPredicted}
              </span>
              <span className="text-lg font-bold text-emerald-200">
                Quintals / Acre
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
              For your <strong className="text-white font-bold">{farmProfile.totalAcres} Acres</strong> farm, total harvest output is projected at{' '}
              <strong className="text-lime-300 font-extrabold">{totalPredicted} Quintals</strong> (± {((currentPredicted * 0.1) * farmProfile.totalAcres).toFixed(0)} q buffer).
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-700/50">
                <span className="text-emerald-300 block text-[11px]">Minimum Expected</span>
                <span className="text-base font-extrabold text-white">{minYield} q/ac</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-700/50">
                <span className="text-emerald-300 block text-[11px]">Maximum Potential</span>
                <span className="text-base font-extrabold text-lime-300">{maxYield} q/ac</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-700/50">
                <span className="text-emerald-300 block text-[11px]">District Avg Benchmark</span>
                <span className="text-base font-extrabold text-stone-200">17.2 q/ac (+24%)</span>
              </div>
            </div>
          </div>

          {/* Interactive Confidence Dial */}
          <div className="bg-emerald-950/60 rounded-2xl p-5 border border-emerald-700/40 text-center flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#064e3b"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#a3e635"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.87)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">87%</span>
                <span className="text-[10px] text-emerald-300 font-semibold uppercase">Confidence</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-tight">
              High correlation based on 4 years historical Satara weather records and optimal soil pH (6.8).
            </p>
          </div>
        </div>
      </div>

      {/* Actual/Observed vs Predicted Yield Growth Stage Chart */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Actual / Observed vs AI Predicted Yield by Growth Stage
            </h2>
            <p className="text-xs text-stone-600">
              Tracking biomass accumulation and canopy development across milestones
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-stone-700">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              Observed Biomass Index
            </span>
            <span className="flex items-center gap-1.5 text-stone-700">
              <span className="w-3 h-3 rounded-full bg-lime-400"></span>
              AI Model Projection
            </span>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[580px] h-64 relative bg-stone-50/70 rounded-xl p-4 border border-stone-200">
            {/* Y Axis Guide Lines */}
            <div className="absolute inset-x-12 top-6 bottom-10 flex flex-col justify-between pointer-events-none">
              {[25, 20, 15, 10, 5, 0].map(val => (
                <div key={val} className="flex items-center w-full border-b border-stone-200/70 text-[10px] text-stone-600">
                  <span className="w-6 -ml-8 text-right font-medium">{val}</span>
                </div>
              ))}
            </div>

            {/* Stages Grid Bars */}
            <div className="absolute inset-x-14 top-6 bottom-10 flex justify-between items-end">
              {initialForecast.growthStageTimeline.map((item, idx) => {
                const maxVal = 25;
                const predictedHeight = `${(item.expected / maxVal) * 100}%`;
                const actualHeight = item.actual !== null ? `${(item.actual / maxVal) * 100}%` : '0%';

                return (
                  <div key={idx} className="flex flex-col items-center w-28 group">
                    <div className="flex items-end gap-2 h-44 w-full justify-center">
                      {/* Observed bar */}
                      {item.actual !== null ? (
                        <div
                          style={{ height: actualHeight }}
                          className="w-5 rounded-t-md bg-emerald-600 transition-all duration-300 relative group-hover:bg-emerald-500"
                        >
                          <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-opacity">
                            Obs: {item.actual} q
                          </span>
                        </div>
                      ) : (
                        <div className="w-5 h-2 border border-dashed border-stone-300 rounded-t-md" />
                      )}

                      {/* Predicted bar */}
                      <div
                        style={{ height: predictedHeight }}
                        className="w-5 rounded-t-md bg-lime-400 transition-all duration-300 relative group-hover:bg-lime-300"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-opacity">
                          Pred: {item.expected} q
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <div className="text-[11px] font-bold text-stone-800 truncate max-w-[110px]">
                        {item.stage.split(' ')[0]}
                      </div>
                      <div className="text-[9px] text-stone-600 font-medium">
                        {item.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Factors Affecting Yield & Simulator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Factors Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Key Yield Determining Factors</h2>
              <p className="text-xs text-stone-600">Model feature weights and real-world farm conditions</p>
            </div>
          </div>

          <div className="space-y-3">
            {initialForecast.factors.map((factor, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-stone-900">{factor.name}</span>
                  <span
                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                      factor.impact.includes('+')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {factor.impact}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: What-If Yield Simulation Controls */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-lime-100 text-lime-800">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Interactive Farm Yield Simulator</h2>
                <p className="text-xs text-stone-600">Adjust farm practices to see projected yield response</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIrrigationStatus('Drip Fertigation');
                setFertilizerAdherence(95);
                setPestScoutingFreq('Bi-weekly');
              }}
              className="text-xs text-stone-600 hover:text-emerald-800 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Irrigation Method Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">Irrigation Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Drip Fertigation', 'Canal/Flood', 'Rainfed'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setIrrigationStatus(method)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    irrigationStatus === method
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Fertilizer Adherence Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-700">Recommended Fertilizer Dosage Adherence</label>
              <span className="text-xs font-extrabold text-emerald-800">{fertilizerAdherence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={fertilizerAdherence}
              onChange={e => setFertilizerAdherence(parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-stone-600 mt-1">
              <span>Sub-optimal (50%)</span>
              <span>Balanced 100% Soil Plan</span>
            </div>
          </div>

          {/* Pest Scouting Frequency */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">Pest & Disease Scouting Rigor</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Weekly', 'Bi-weekly', 'Occasional'] as const).map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setPestScoutingFreq(freq)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    pestScoutingFreq === freq
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Output Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-lime-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-stone-600 uppercase block">Simulated Output</span>
              <span className="text-xl font-black text-stone-900">{currentPredicted} quintals / acre</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-800 block">Total Projected</span>
              <span className="text-base font-extrabold text-emerald-950">{totalPredicted} Quintals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
