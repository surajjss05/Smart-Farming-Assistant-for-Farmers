import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  Scale,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ProfitOptimizationData, FarmProfile, Language } from '../types/farm';
import { translations } from '../i18n/translations';

interface ProfitOptimizerViewProps {
  farmProfile: FarmProfile;
  initialProfitData: ProfitOptimizationData;
  language: Language;
}

export const ProfitOptimizerView: React.FC<ProfitOptimizerViewProps> = ({
  farmProfile,
  initialProfitData,
  language
}) => {
  const t = translations[language];

  // Dynamic sliders for What-If scenario simulation
  const [marketPrice, setMarketPrice] = useState<number>(5150); // ₹ per quintal
  const [yieldPerAcre, setYieldPerAcre] = useState<number>(21.5); // quintals per acre
  const [adoptionDripSavings, setAdoptionDripSavings] = useState<boolean>(true);
  const [delaySellingStrategy, setDelaySellingStrategy] = useState<boolean>(true);

  // Dynamic calculations
  const totalProductionQ = yieldPerAcre * farmProfile.totalAcres;
  const effectivePrice = delaySellingStrategy ? marketPrice + 210 : marketPrice;
  const grossRevenue = Math.round(totalProductionQ * effectivePrice);

  const baseCostPerAcre = 19300;
  const savingsPerAcre = adoptionDripSavings ? 1200 : 0;
  const totalOperationalCost = Math.round((baseCostPerAcre - savingsPerAcre) * farmProfile.totalAcres);

  const netProfit = grossRevenue - totalOperationalCost;
  const netProfitPerAcre = Math.round(netProfit / farmProfile.totalAcres);
  const profitMarginPercent = ((netProfit / grossRevenue) * 100).toFixed(1);
  const profitabilityScore = Math.min(96, Math.max(20, Math.round((netProfit / totalOperationalCost) * 65)));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-100 text-lime-900 mb-1.5">
              <Coins className="w-3.5 h-3.5 text-lime-800" />
              <span>AI Farm Economics Engine</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">Profit Optimization & Cost Engine</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Expected Profit = Expected Revenue − Total Operational Costs across production, storage & mandi transit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Crop Focus:</span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-100 text-stone-800 border border-stone-200">
              {farmProfile.currentCrop.name} ({farmProfile.totalAcres} Acres)
            </span>
          </div>
        </div>
      </div>

      {/* Main Profit Prediction Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl text-white p-6 sm:p-8 shadow-md border border-emerald-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Main Profit Figure */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                Predicted Net Farm Profit
              </span>
              <span className="text-xs font-semibold text-emerald-200">
                Profit Margin: <strong className="text-lime-300 font-extrabold">{profitMarginPercent}%</strong>
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                ₹{netProfit.toLocaleString('en-IN')}
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-300">
                (₹{netProfitPerAcre.toLocaleString('en-IN')} / acre)
              </span>
            </div>

            {/* Formula Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                <span className="text-[11px] text-emerald-300 block font-medium">Expected Gross Revenue</span>
                <span className="text-lg font-black text-white mt-0.5 block">
                  ₹{grossRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-400">
                  {totalProductionQ.toFixed(1)} q @ ₹{effectivePrice}/q
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                <span className="text-[11px] text-emerald-300 block font-medium">Total Operational Cost</span>
                <span className="text-lg font-black text-rose-300 mt-0.5 block">
                  - ₹{totalOperationalCost.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-400">
                  ₹{Math.round(totalOperationalCost / farmProfile.totalAcres).toLocaleString('en-IN')} / acre
                </span>
              </div>

              <div className="p-3 rounded-xl bg-lime-950/60 border border-lime-600/40">
                <span className="text-[11px] text-lime-300 block font-medium">Net Take-Home Cash</span>
                <span className="text-lg font-black text-lime-300 mt-0.5 block">
                  = ₹{netProfit.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-lime-400 font-semibold">
                  After all labour & diesel expenses
                </span>
              </div>
            </div>
          </div>

          {/* Visual Profitability Score Meter */}
          <div className="bg-emerald-900/40 rounded-2xl p-5 border border-emerald-700/40 text-center flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-2">
              Profitability Score
            </span>
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#064e3b" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#84cc16"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - profitabilityScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{profitabilityScore}</span>
                <span className="text-[9px] text-emerald-300 font-bold uppercase">/ 100</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-lime-300">
              {profitabilityScore >= 75 ? 'Excellent Return' : 'Healthy Return'}
            </span>
          </div>
        </div>
      </div>

      {/* Actionable AI Suggestions & Strategies */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">AI Actionable Profit Strategies</h2>
            <p className="text-xs text-stone-600">Concrete decisions to curb expenses and boost realized revenue</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Strategy 1: Mandi Timing */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-900">Mandi Holding Strategy</span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  + ₹20,200 Gain
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                "Current mandi trends suggest waiting 7–10 days before selling harvested stock. Crushing demand peaks in mid-October, yielding +₹210/quintal over harvest-day distress rates."
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">Simulate 8-Day Storage</label>
              <input
                type="checkbox"
                checked={delaySellingStrategy}
                onChange={e => setDelaySellingStrategy(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>
          </div>

          {/* Strategy 2: Precision Drip Fertigation */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-900">Precision Drip Fertigation</span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Save ₹5,400
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                "Using drip irrigation reduces water pumping electricity by 40% and prevents fertilizer runoff. Your soil potassium is already rich (310 kg/ha), allowing skipping chemical potash."
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">Apply Drip Savings</label>
              <input
                type="checkbox"
                checked={adoptionDripSavings}
                onChange={e => setAdoptionDripSavings(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </div>
          </div>

          {/* Strategy 3: Shared Truck Logistics */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-900">Cooperative Freight Sharing</span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Save ₹3,800
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                "Pool transport with neighboring Satara farmers to hire a 10-ton Eicher truck to Pune Gultekdi APMC. Slashes per-quintal transit costs from ₹140 to ₹85."
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800">Recommended Action</span>
              <span className="text-xs font-bold text-stone-600">Active in Logistics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Cost Breakdown Table & What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 8 Operational Cost Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-1">
            Complete Operational Cost Breakdown
          </h2>
          <p className="text-xs text-stone-600 mb-4">
            Total expenses tracked across all production stages for {farmProfile.totalAcres} Acres
          </p>

          <div className="space-y-2.5">
            {initialProfitData.costBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-stone-800">{item.category}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-stone-600">₹{item.perAcre} / ac</span>
                  <span className="font-black text-stone-900">
                    ₹{(item.perAcre * farmProfile.totalAcres).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-stone-600 w-8 text-right">
                    {item.share}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between font-bold text-xs">
            <span className="text-stone-700">Total Summed Operational Cost:</span>
            <span className="text-sm font-black text-stone-900">
              ₹{totalOperationalCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Right: What-If Profit Scenario Simulator */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-lime-100 text-lime-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Live What-If Profit Simulator</h2>
              <p className="text-xs text-stone-600">Adjust selling rate or yield to simulate harvest profit scenarios</p>
            </div>
          </div>

          {/* Market Price Slider */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-800">Mandi Realization Price</label>
              <span className="text-sm font-black text-emerald-800">₹{marketPrice} / quintal</span>
            </div>
            <input
              type="range"
              min="4200"
              max="6200"
              step="50"
              value={marketPrice}
              onChange={e => setMarketPrice(parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-stone-600 mt-1">
              <span>MSP Floor (₹4,600)</span>
              <span className="font-bold text-emerald-800">Current Mandi (₹5,150)</span>
              <span>Peak Forecast (₹5,800)</span>
            </div>
          </div>

          {/* Yield Slider */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-stone-800">Realized Yield per Acre</label>
              <span className="text-sm font-black text-emerald-800">{yieldPerAcre} q / acre</span>
            </div>
            <input
              type="range"
              min="14"
              max="26"
              step="0.5"
              value={yieldPerAcre}
              onChange={e => setYieldPerAcre(parseFloat(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-stone-600 mt-1">
              <span>Low (14 q)</span>
              <span className="font-bold text-emerald-800">AI Expected (21.5 q)</span>
              <span>Bumper (26 q)</span>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-950 uppercase block">Simulated Net Profit</span>
              <span className="text-2xl font-black text-emerald-950">₹{netProfit.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800 block">Per Acre Margin</span>
              <span className="text-sm font-extrabold text-stone-900">₹{netProfitPerAcre.toLocaleString('en-IN')} / ac</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
