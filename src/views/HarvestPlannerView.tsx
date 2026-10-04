import React from 'react';
import {
  CalendarCheck,
  Calendar,
  Sparkles,
  TrendingUp,
  Sun,
  ShieldCheck,
  Warehouse,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { FarmProfile, Language } from '../types/farm';
import { translations } from '../i18n/translations';

interface HarvestPlannerViewProps {
  farmProfile: FarmProfile;
  language: Language;
}

export const HarvestPlannerView: React.FC<HarvestPlannerViewProps> = ({
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
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Optimal Maturity & Price Peak Calculator</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">AI Harvest Window Planner</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Synchronizing crop pod maturity, 14-day dry weather windows, and Mandi price momentum.
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs self-start sm:self-auto">
            Current Stage: Pod Fill (Day 68 of 95)
          </span>
        </div>
      </div>

      {/* Main Recommended Harvest Window Hero */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl text-white p-6 sm:p-8 shadow-md border border-emerald-800/60">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold text-lime-400 uppercase tracking-wider block">
              AI Recommended Optimal Harvest Window
            </span>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                October 12 – October 16
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <Clock className="w-4 h-4 text-lime-400" />
              <span>Approximately 8 to 12 days from today</span>
            </div>

            {/* Explainable Reason Box */}
            <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700/50 mt-4 text-xs">
              <div className="text-emerald-300 font-bold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>Why this specific 5-day window?</span>
              </div>
              <p className="text-white/90 leading-relaxed font-medium">
                "Weather models predict 100% dry sunshine with zero rain from Oct 10 onwards, ensuring pods dry to optimal 13% grain moisture on the stalk without fungal risk. Concurrently, Pune APMC soybean prices are forecasted to hit peak early-season levels of ₹5,420/quintal."
              </p>
            </div>
          </div>

          {/* Harvest Readiness Metrics */}
          <div className="p-5 rounded-2xl bg-emerald-900/40 border border-emerald-700/40 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
              <span className="text-emerald-300">Pod Yellowing %</span>
              <span className="font-extrabold text-white">65% (Target 90%)</span>
            </div>
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
              <span className="text-emerald-300">Grain Moisture Goal</span>
              <span className="font-extrabold text-white">13.0% (Safe Storage)</span>
            </div>
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
              <span className="text-emerald-300">Rain Risk in Window</span>
              <span className="font-extrabold text-lime-300">&lt; 5% (Ideal)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-300">Projected Mandi Rate</span>
              <span className="font-extrabold text-lime-300">₹5,420 / q (+5.2%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Harvest Timeline Milestones */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <h2 className="text-base font-bold text-stone-900 mb-4">
          Harvest Preparation & Operational Milestones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-black text-emerald-800 block">Oct 5 – Oct 7</span>
            <h3 className="text-sm font-bold text-stone-900 mt-1">Furrow Drainage & Pest Watch</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Clear furrows to allow rain runoff; stop chemical sprays to comply with 14-day pre-harvest intervals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-black text-emerald-800 block">Oct 8 – Oct 10</span>
            <h3 className="text-sm font-bold text-stone-900 mt-1">Book Thresher & Labour Crew</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Reserve local tractor thresher and schedule 6 field workers for pod cutting and bundling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
            <span className="text-xs font-black text-emerald-950 block">Oct 12 – Oct 14</span>
            <h3 className="text-sm font-bold text-stone-900 mt-1">Prime Harvesting & Threshing</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Harvest when leaves have naturally dropped and pods rattle when gently shaken. Thresh within 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-black text-emerald-800 block">Oct 15 – Oct 20</span>
            <h3 className="text-sm font-bold text-stone-900 mt-1">Storage Buffer or Mandi Sale</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Store 60 quintals in on-farm ventilated godown; transport remaining 35 quintals to Pune APMC for cash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
