import React, { useState } from 'react';
import {
  Sprout,
  Filter,
  Sparkles,
  TrendingUp,
  Coins,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  Droplets,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CropRecommendation, FarmProfile, Language } from '../types/farm';
import { translations } from '../i18n/translations';

interface CropRecommendationViewProps {
  farmProfile: FarmProfile;
  recommendations: CropRecommendation[];
  language: Language;
  onNavigateToProfit: () => void;
}

export const CropRecommendationView: React.FC<CropRecommendationViewProps> = ({
  farmProfile,
  recommendations,
  language,
  onNavigateToProfit
}) => {
  const t = translations[language];

  const [selectedSeason, setSelectedSeason] = useState<'All' | 'Kharif' | 'Rabi' | 'Zaid'>('All');
  const [selectedRisk, setSelectedRisk] = useState<'All' | 'Low' | 'Medium'>('All');
  const [expandedCropId, setExpandedCropId] = useState<string | null>('rec-1');

  const filtered = recommendations.filter(crop => {
    if (selectedSeason !== 'All' && !crop.season.includes(selectedSeason)) return false;
    if (selectedRisk !== 'All' && crop.risk !== selectedRisk) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Multi-Factor AI Ranking Engine</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">AI Crop Recommendation System</h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Synthesizing your <strong className="font-semibold text-stone-800">{farmProfile.soilType}</strong> (pH {farmProfile.soilData.ph}, {farmProfile.soilData.moisture}% moisture), local Kharif climate, Mandi price forecasts, and input costs.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-col gap-0.5">
            <span className="font-bold">Optimization Metric:</span>
            <span className="text-emerald-800 font-semibold">Expected Profit + Suitability + Low Risk</span>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Season Filter:</span>
          </div>

          {(['All', 'Kharif', 'Rabi', 'Zaid'] as const).map(season => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSeason === season
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {season === 'All' ? 'All Seasons' : `${season} Season`}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-stone-200 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mr-2">
            <span>Risk Tolerance:</span>
          </div>

          {(['All', 'Low', 'Medium'] as const).map(risk => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRisk === risk
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {risk === 'All' ? 'All Risk Levels' : `${risk} Risk Only`}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Crops Cards List */}
      <div className="space-y-4">
        {filtered.map((item, index) => {
          const isExpanded = expandedCropId === item.id;
          const isTopMatch = index === 0;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                isTopMatch
                  ? 'border-emerald-400 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Card Header Bar */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isTopMatch
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-stone-900">{item.crop}</h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                          {item.season}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Duration: {item.maturityDays} • Water: {item.waterNeed}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Suitability Score Pill */}
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-stone-600 uppercase block">
                        Crop Suitability
                      </span>
                      <span className="text-base font-black text-emerald-800">
                        {item.suitability}%
                      </span>
                    </div>

                    {/* Risk Badge */}
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-stone-600 uppercase block">
                        Risk Level
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          item.risk === 'Low'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.risk.includes('High')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.risk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Financial & Agronomic Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div>
                    <span className="text-[11px] text-stone-600 block">Expected Yield</span>
                    <span className="text-sm font-extrabold text-stone-900 block mt-0.5">
                      {item.expectedYield}
                    </span>
                    <span className="text-[10px] text-stone-600">
                      Total: ~{item.totalExpectedYield} quintals
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-600 block">Current Mandi Price</span>
                    <span className="text-sm font-extrabold text-stone-900 block mt-0.5">
                      ₹{item.currentMarketPrice.toLocaleString('en-IN')} / q
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold">Active demand</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-600 block">Estimated Cost</span>
                    <span className="text-sm font-extrabold text-stone-900 block mt-0.5">
                      ₹{item.estimatedCostPerAcre.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-600">per acre</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-emerald-800 font-bold block">
                      Expected Net Profit
                    </span>
                    <span className="text-base font-black text-emerald-800 block mt-0.5">
                      ₹{item.expectedProfit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold">
                      for {farmProfile.totalAcres} acres
                    </span>
                  </div>
                </div>

                {/* Explainable AI "Why this crop?" Dropdown Accordion */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => setExpandedCropId(isExpanded ? null : item.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-stone-800 hover:text-emerald-800 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>Why does Kisan AI recommend this crop?</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2.5 animate-fadeIn">
                      <p className="text-stone-800 leading-relaxed font-medium">
                        "{item.why}"
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-emerald-200/60">
                        <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">
                          Agronomic & Market Advantages:
                        </span>
                        {item.advantages.map((adv, aIdx) => (
                          <div key={aIdx} className="flex items-start gap-2 text-stone-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{adv}</span>
                          </div>
                        ))}
                      </div>

                      {item.expertAiNote && (
                        <div className="mt-2 p-2.5 rounded-lg bg-white/80 border border-emerald-300 text-emerald-950 italic">
                          💡 <strong>Scientist Advisory:</strong> {item.expertAiNote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold">Want to customize costs & calculate exact profit margins?</h2>
          <p className="text-xs text-emerald-200 mt-0.5">
            Test seed varieties, fertilizer dosages, and storage holding options in the Profit Optimizer.
          </p>
        </div>

        <button
          onClick={onNavigateToProfit}
          className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 font-extrabold text-xs sm:text-sm shrink-0 flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <span>Open Profit Optimizer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
