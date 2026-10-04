import React, { useState } from 'react';
import {
  LineChart,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  HelpCircle,
  Truck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Search,
  Globe,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { MarketCommodity, Language, GroundingSource } from '../types/farm';
import { searchLiveMarketData } from '../services/api';
import { translations } from '../i18n/translations';

interface MarketPricesViewProps {
  marketData: MarketCommodity[];
  language: Language;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  marketData,
  language
}) => {
  const t = translations[language];

  const [selectedCropIndex, setSelectedCropIndex] = useState<number>(0);
  const currentCommodity = marketData[selectedCropIndex] || marketData[0];

  // Google Search Grounding Live Mandi Query State
  const [liveSearchQuery, setLiveSearchQuery] = useState('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [liveSearchResult, setLiveSearchResult] = useState<{
    query: string;
    result: string;
    sources?: GroundingSource[];
  } | null>(null);

  const handleLiveSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || liveSearchQuery || `${currentCommodity.crop} APMC mandi bhav today`;
    if (!query.trim() || isSearchingLive) return;

    setIsSearchingLive(true);
    try {
      const data = await searchLiveMarketData(query);
      setLiveSearchResult({
        query,
        result: data.result,
        sources: data.sources
      });
    } catch (err) {
      console.error('Failed to run live market search:', err);
    } finally {
      setIsSearchingLive(false);
    }
  };

  // SVG Chart points calculation
  const history = currentCommodity.priceHistory || [];
  const minPrice = Math.min(...history.map(p => p.price)) * 0.95;
  const maxPrice = Math.max(...history.map(p => p.price)) * 1.05;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time APMC Mandi Intelligence</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">Crop Market Prices & Price Trends</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Compare mandi arrivals across Maharashtra APMCs and leverage 14-day AI price movement predictions.
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">⚠️ Notice:</span>
            <span>Predicted prices are AI statistical estimates, not guaranteed prices.</span>
          </div>
        </div>

        {/* Commodity Selector Tabs */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap gap-2">
          {marketData.map((commodity, idx) => (
            <button
              key={commodity.crop}
              onClick={() => {
                setSelectedCropIndex(idx);
                setLiveSearchQuery(`${commodity.crop} APMC mandi prices Maharashtra today`);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCropIndex === idx
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>{commodity.crop}</span>
              <span className={`ml-2 text-[10px] ${selectedCropIndex === idx ? 'text-emerald-100' : 'text-emerald-700'}`}>
                {commodity.weeklyChange}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Google Search Grounding Real-Time Mandi Search Panel */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50/60 rounded-2xl p-5 border border-sky-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-stone-900">Live Google Search Mandi Intelligence</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-600 text-white tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  Search Grounded
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Queries live Google Search for today's wholesale APMC arrival rates, government circulars, and mandi auctions
              </p>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 font-medium self-start sm:self-center">
            Powered by Gemini + Google Search Grounding
          </div>
        </div>

        {/* Search input form */}
        <form onSubmit={e => handleLiveSearch(e)} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={liveSearchQuery}
              onChange={e => setLiveSearchQuery(e.target.value)}
              placeholder={`e.g. ${currentCommodity.crop} mandi bhav Satara today, Pune APMC auction rates...`}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sky-300 bg-white text-xs sm:text-sm font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSearchingLive}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              {isSearchingLive ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching Web...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Mandi Rates</span>
                </>
              )}
            </button>

            {liveSearchResult && (
              <button
                type="button"
                onClick={() => setLiveSearchResult(null)}
                className="px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* One-Tap Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-stone-500 shrink-0">Popular:</span>
          {[
            `${currentCommodity.crop} mandi rate Satara today`,
            `Pune APMC ${currentCommodity.crop} wholesale bhav`,
            'Soybean mandi prices Maharashtra',
            'Onion APMC rates Lasalgaon today',
            'Cotton Kapas MSP and APMC auction'
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setLiveSearchQuery(chip);
                handleLiveSearch(undefined, chip);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-[11px] font-medium text-sky-950 border border-sky-200 hover:border-sky-400 shadow-2xs whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Search className="w-2.5 h-2.5 text-sky-600" />
              <span>{chip}</span>
            </button>
          ))}
        </div>

        {/* Live Search Grounding Result Card */}
        {liveSearchResult && (
          <div className="p-4 rounded-xl bg-white border border-sky-300 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-stone-800">
                  Search Query: &ldquo;{liveSearchResult.query}&rdquo;
                </span>
              </div>
              <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Verified with Google Search Grounding
              </span>
            </div>

            <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-line font-medium bg-stone-50/70 p-3 rounded-lg border border-stone-200/80">
              {liveSearchResult.result}
            </div>

            {/* Web Grounding Citations */}
            {liveSearchResult.sources && liveSearchResult.sources.length > 0 && (
              <div className="pt-2 border-t border-stone-100 space-y-1.5">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3 text-sky-600" />
                  Grounded Sources & APMC Links:
                </span>
                <div className="flex flex-wrap gap-2">
                  {liveSearchResult.sources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[11px] font-medium text-sky-900 border border-sky-200 hover:border-sky-300 transition-colors shadow-2xs"
                    >
                      <ExternalLink className="w-3 h-3 text-sky-600" />
                      <span className="max-w-[200px] truncate">{src.title || new URL(src.uri).hostname}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Interactive Price Trend Chart Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              14-Day Price Movement & AI Forecast
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-black text-stone-900">
                ₹{currentCommodity.basePrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                {currentCommodity.weeklyChange} this week
              </span>
              <span className="text-xs text-stone-600 font-medium">per quintal</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-stone-700">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              Observed Mandi Price
            </span>
            <span className="flex items-center gap-1.5 text-stone-700">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 border-dashed"></span>
              AI Forecasted Trend (Oct 5–12)
            </span>
          </div>
        </div>

        {/* Interactive SVG Line Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[620px] h-72 relative bg-stone-50/70 rounded-xl p-6 border border-stone-200">
            {/* Guide lines */}
            <div className="absolute inset-x-14 top-6 bottom-12 flex flex-col justify-between pointer-events-none">
              {[maxPrice, (maxPrice + minPrice) / 2, minPrice].map((val, idx) => (
                <div key={idx} className="flex items-center w-full border-b border-stone-200/80 text-[10px] text-stone-600">
                  <span className="w-10 -ml-12 text-right font-medium">₹{Math.round(val)}</span>
                </div>
              ))}
            </div>

            {/* Connecting Line and Dots */}
            <svg className="w-full h-48 mt-4 overflow-visible" viewBox="0 0 600 160">
              {/* Path generator */}
              {(() => {
                const totalPoints = history.length;
                const points = history.map((pt, i) => {
                  const x = (i / (totalPoints - 1)) * 560 + 20;
                  const y = 150 - ((pt.price - minPrice) / (maxPrice - minPrice)) * 140;
                  return { x, y, pt };
                });

                const actualPoints = points.filter(p => !p.pt.isPredicted);
                const predictedPoints = points.filter(p => p.pt.isPredicted);

                const dActual = actualPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const lastActual = actualPoints[actualPoints.length - 1];
                const dPred = [lastActual, ...predictedPoints].map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                return (
                  <>
                    {/* Area fill for actual */}
                    <path
                      d={`${dActual} L ${lastActual.x} 150 L ${actualPoints[0].x} 150 Z`}
                      fill="rgba(16, 185, 129, 0.12)"
                    />
                    {/* Actual solid line */}
                    <path d={dActual} fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
                    {/* Predicted dashed line */}
                    <path d={dPred} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6,4" strokeLinecap="round" />

                    {/* Dots */}
                    {points.map((p, i) => (
                      <g key={i} className="group cursor-pointer">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={p.pt.isPredicted ? 5 : 5.5}
                          fill={p.pt.isPredicted ? '#f59e0b' : '#059669'}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                        />
                        <text
                          x={p.x}
                          y={p.y - 10}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-stone-800"
                        >
                          ₹{p.pt.price}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* X Axis Labels */}
            <div className="absolute inset-x-14 bottom-3 flex justify-between text-[11px] font-bold text-stone-600">
              {history.map((pt, i) => (
                <span
                  key={i}
                  className={`text-center ${pt.isPredicted ? 'text-amber-800 font-extrabold' : ''}`}
                >
                  {pt.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Selling Recommendation Advice */}
        <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950">
              AI Market Recommendation: <strong>{currentCommodity.recommendationAction}</strong>
            </div>
            <p className="text-xs text-stone-700 mt-1 leading-relaxed">
              "{currentCommodity.aiRecommendation}"
            </p>
          </div>
        </div>
      </div>

      {/* APMC Mandi Comparison Table */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Regional APMC Mandi Comparison</h2>
              <p className="text-xs text-stone-600">
                Net return calculation taking into account distance, diesel, and transport toll
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-stone-600">
            Base location: Satara, Maharashtra
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-600">
                <th className="pb-3 font-bold">Mandi Name</th>
                <th className="pb-3 font-bold">Distance</th>
                <th className="pb-3 font-bold">Gross Rate</th>
                <th className="pb-3 font-bold">7-Day Trend</th>
                <th className="pb-3 font-bold">Transit Cost / q</th>
                <th className="pb-3 font-bold">Net Realized Price</th>
                <th className="pb-3 font-bold">Selling Advice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {currentCommodity.mandis.map((mandi, idx) => {
                const isBestNet =
                  mandi.netPricePerQ ===
                  Math.max(...currentCommodity.mandis.map(m => m.netPricePerQ));

                return (
                  <tr key={idx} className={isBestNet ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-stone-50'}>
                    <td className="py-3 font-bold text-stone-900 flex items-center gap-2">
                      {isBestNet && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                      {mandi.name}
                    </td>
                    <td className="py-3 text-stone-600">{mandi.distanceKm} km</td>
                    <td className="py-3 font-extrabold text-stone-900">₹{mandi.price} / q</td>
                    <td className="py-3 text-emerald-800 font-bold">{mandi.trend}</td>
                    <td className="py-3 text-stone-600">- ₹{mandi.transportCostPerQ}</td>
                    <td className="py-3 font-black text-emerald-950 text-sm">
                      ₹{mandi.netPricePerQ} / q
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          mandi.status.includes('Hold')
                            ? 'bg-amber-100 text-amber-800'
                            : mandi.status.includes('Sell')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {mandi.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
