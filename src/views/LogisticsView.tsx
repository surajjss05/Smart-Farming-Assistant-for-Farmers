import React, { useState } from 'react';
import {
  Truck,
  Warehouse,
  MapPin,
  TrendingUp,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { LogisticsData, FarmProfile, Language } from '../types/farm';
import { translations } from '../i18n/translations';

interface LogisticsViewProps {
  farmProfile: FarmProfile;
  logisticsData: LogisticsData;
  language: Language;
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({
  farmProfile,
  logisticsData,
  language
}) => {
  const t = translations[language];

  // Selected destination
  const [selectedDestId, setSelectedDestId] = useState<string>('dest-2'); // Pune APMC by default

  const currentDest =
    logisticsData.destinations.find(d => d.id === selectedDestId) ||
    logisticsData.destinations[1];

  const totalQuintals = 95; // 4.5 acres * 21.1 q/ac
  const grossTotal = totalQuintals * currentDest.grossPricePerQ;
  const transitTotal = totalQuintals * currentDest.freightCostPerQ;
  const mandiFeesTotal = totalQuintals * currentDest.mandiFeePerQ;
  const unloadingTotal = totalQuintals * currentDest.unloadingCostPerQ;
  const netTotal = grossTotal - (transitTotal + mandiFeesTotal + unloadingTotal);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Farm-to-Market Supply Chain Engine</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">Farm Logistics & Mandi Net Profit</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Evaluate real net returns by factoring freight, road tolls, and labor loading costs across destination markets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Storage Buffer:</span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-100 text-stone-800 border border-stone-200">
              60 Quintals Godown
            </span>
          </div>
        </div>
      </div>

      {/* Net Profit After Transportation - Main Highlight Comparison */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Mandi Net Profit After Transportation Calculator
            </h2>
            <p className="text-xs text-stone-600">
              Comparing 95 Quintals harvest dispatch from Satara Farm
            </p>
          </div>

          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            Net Formula: Gross Realization − (Freight + Mandi Fee + Unloading)
          </span>
        </div>

        {/* 3 Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {logisticsData.destinations.map(dest => {
            const isSelected = selectedDestId === dest.id;
            const isTopAdvantage = !!dest.netProfitAdvantage;

            return (
              <div
                key={dest.id}
                onClick={() => setSelectedDestId(dest.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      {dest.name}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-600">{dest.distanceKm} km</span>
                  </div>

                  <div className="my-3">
                    <span className="text-[10px] text-stone-600 font-bold uppercase block">
                      Net Take-Home Price / Quintal
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-stone-900">
                        ₹{dest.netRealizationPerQ}
                      </span>
                      <span className="text-xs text-stone-600 line-through">
                        ₹{dest.grossPricePerQ}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-700 border-t border-stone-200/80 pt-3">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Freight Cost:</span>
                      <span className="font-semibold text-rose-600">- ₹{dest.freightCostPerQ} / q</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">APMC & Loading Fees:</span>
                      <span className="font-semibold text-rose-600">- ₹{dest.mandiFeePerQ + dest.unloadingCostPerQ} / q</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t border-stone-200">
                      <span>Total Net for 95 Q:</span>
                      <span className="text-emerald-950 font-black">
                        ₹{dest.totalNetFor95Q.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/80">
                  {dest.netProfitAdvantage ? (
                    <span className="inline-block text-[11px] font-extrabold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ⭐ {dest.netProfitAdvantage}
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-600 italic">
                      {dest.recommendation}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Destination Summary Callout */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-lime-50 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                Selected Route: {currentDest.name}
              </span>
              <p className="text-xs text-stone-700">
                Gross: ₹{grossTotal.toLocaleString('en-IN')} | Freight: -₹{transitTotal.toLocaleString('en-IN')} | Net Profit: <strong className="text-emerald-950 font-extrabold">₹{netTotal.toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0">
            Book Shared Transport Truck
          </button>
        </div>
      </div>

      {/* Verified Local Buyers & MSP Center Directory */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Direct Verified Buyers & FPO Network</h2>
              <p className="text-xs text-stone-600">Pre-screened purchasers offering on-farm pickup and transparent terms</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {logisticsData.verifiedBuyers.map((buyer, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold text-stone-900 truncate">{buyer.name}</h3>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                    ★ {buyer.rating}
                  </span>
                </div>
                <span className="text-[11px] text-stone-600 block">{buyer.distance} from farm</span>

                <div className="mt-3 text-xs text-stone-700">
                  <span className="text-[10px] text-stone-600 font-semibold block uppercase">
                    Payment Terms
                  </span>
                  <span className="font-semibold text-emerald-950">{buyer.paymentTerms}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  {buyer.contact}
                </span>
                <button className="text-[11px] font-bold text-emerald-800 hover:underline">
                  Call Buyer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
