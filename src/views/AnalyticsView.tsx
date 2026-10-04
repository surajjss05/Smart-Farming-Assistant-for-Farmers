import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Coins,
  ShieldAlert,
  Droplets,
  AlertTriangle,
  Bug,
  Sparkles,
  PieChart,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { FarmProfile, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { YearOverYearYieldChart } from '../components/YearOverYearYieldChart';

interface AnalyticsViewProps {
  farmProfile: FarmProfile;
  language: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  farmProfile,
  language
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Comprehensive Farm Performance Analytics</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">Analytics & Farm Risk Index</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Holistic intelligence combining agronomy, meteorology, economics, and supply chain.
            </p>
          </div>

          <span className="text-xs font-extrabold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 self-start sm:self-auto">
            Season: Kharif 2026 • 4.5 Acres Active
          </span>
        </div>
      </div>

      {/* 8 Main KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Expected Yield */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-600 uppercase block">Expected Yield</span>
          <div className="text-2xl font-black text-stone-900 mt-1">21.5 q/ac</div>
          <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">+22% vs district avg</span>
        </div>

        {/* Expected Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-600 uppercase block">Gross Revenue</span>
          <div className="text-2xl font-black text-stone-900 mt-1">₹4,98,000</div>
          <span className="text-[10px] text-stone-600 font-medium block mt-0.5">@ ₹5,150 avg price</span>
        </div>

        {/* Estimated Cost */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-600 uppercase block">Total Cost</span>
          <div className="text-2xl font-black text-rose-700 mt-1">₹86,850</div>
          <span className="text-[10px] text-stone-600 font-medium block mt-0.5">₹19,300 per acre</span>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase block">Expected Profit</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">₹4,11,150</div>
          <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">82.5% Net Margin</span>
        </div>

        {/* Crop Health Score */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-600 uppercase block">Crop Health Score</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">92 / 100</div>
          <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">Optimal vegetative state</span>
        </div>

        {/* Weather Risk */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-600 uppercase block">Weather Risk</span>
          <div className="text-2xl font-black text-amber-700 mt-1">Medium</div>
          <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">Sunday 75% rain spike</span>
        </div>

        {/* Pest Risk */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-600 uppercase block">Pest & Spore Risk</span>
          <div className="text-2xl font-black text-amber-700 mt-1">Moderate</div>
          <span className="text-[10px] text-stone-600 font-medium block mt-0.5">High humidity trigger</span>
        </div>

        {/* Market Opportunity */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-600 uppercase block">Market Opportunity</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">Strong (8.5/10)</div>
          <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">Prices up +4.8% weekly</span>
        </div>
      </div>

      {/* Year-Over-Year Multi-Season Yield Comparison Chart */}
      <YearOverYearYieldChart farmProfile={farmProfile} language={language} />

      {/* Farm Risk Analysis Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Farm Risk Analysis & Mitigation</h2>
              <p className="text-xs text-stone-600">Dynamic risk weighting across environmental and market factors</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Overall Farm Risk:</span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
              Medium Risk (Score 34/100)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Weather Risk */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-stone-800">Weather Risk</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Medium (45%)
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
              Excess rainfall predicted for tomorrow. Risk of temporary water-logging if furrows remain choked.
            </p>
            <div className="mt-2 text-[10px] text-emerald-800 font-semibold">
              Mitigation: Clear drainage furrows today.
            </div>
          </div>

          {/* Pest Risk */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-stone-800">Pest & Disease Risk</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Medium (40%)
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
              Relative humidity &gt; 75% creates suitable micro-climate for fungal Cercospora spores.
            </p>
            <div className="mt-2 text-[10px] text-emerald-800 font-semibold">
              Mitigation: Bio-agent spray (Trichoderma) post-rain.
            </div>
          </div>

          {/* Market Risk */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-stone-800">Market Price Risk</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Low (18%)
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
              Soybean crushing demand is strong with MSP backing. Distress sale risk mitigated by 60q godown.
            </p>
            <div className="mt-2 text-[10px] text-emerald-800 font-semibold">
              Mitigation: Hold in storage for 8-10 days.
            </div>
          </div>

          {/* Water Risk */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-stone-800">Water Availability Risk</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Low (12%)
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
              Borewell and farm pond are at 85% capacity; drip system covers 80% of total land area.
            </p>
            <div className="mt-2 text-[10px] text-emerald-800 font-semibold">
              Mitigation: Maintain drip emitter flushing.
            </div>
          </div>
        </div>
      </div>

      {/* Revenue vs Cost Comparison Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Cost Stacked Visual */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">
            Revenue vs Operational Cost Comparison
          </h2>
          <p className="text-xs text-stone-600 mb-6">
            Net capital productivity and gross margin distribution for {farmProfile.totalAcres} Acres
          </p>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-stone-700">Gross Expected Revenue</span>
                <span className="text-emerald-950 font-black">₹4,98,000 (100%)</span>
              </div>
              <div className="h-6 w-full rounded-xl bg-stone-100 overflow-hidden flex">
                <div style={{ width: '82.5%' }} className="bg-emerald-600 h-full flex items-center justify-center text-[10px] font-bold text-white">
                  Net Profit: ₹4,11,150 (82.5%)
                </div>
                <div style={{ width: '17.5%' }} className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-bold text-white">
                  Cost
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Total Inputs & Operational Capital:</span>
                <span className="text-rose-600">₹86,850</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Net Surplus Take-Home:</span>
                <span className="text-emerald-950 font-bold">₹4,11,150</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-stone-200 text-stone-900">
                <span>Return on Operating Capital (ROI):</span>
                <span className="text-emerald-800 font-extrabold">473%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Utilization & Farm Health Trend */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">
            Farm Resource Utilization Index
          </h2>
          <p className="text-xs text-stone-600 mb-4">
            Efficiency scores across key agricultural assets
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-700">Drip Irrigation Coverage</span>
                <span className="text-emerald-800">80% (3.6 / 4.5 Acres)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div style={{ width: '80%' }} className="bg-emerald-600 h-full rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-700">Storage Capacity Utilization</span>
                <span className="text-emerald-800">63% (60 Quintal Godown)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div style={{ width: '63%' }} className="bg-lime-500 h-full rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-700">Soil Organic Carbon Health</span>
                <span className="text-emerald-800">68% (0.68% OC)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div style={{ width: '68%' }} className="bg-emerald-600 h-full rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-stone-700">Machinery Availability (Tractor & Plough)</span>
                <span className="text-emerald-800">100% Owned</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div style={{ width: '100%' }} className="bg-emerald-600 h-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
