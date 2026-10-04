import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Award,
  Sparkles,
  ArrowUpRight,
  Filter,
  Layers,
  Sprout,
  HelpCircle,
  CheckCircle2,
  LineChart
} from 'lucide-react';
import { Language, FarmProfile } from '../types/farm';

interface YearOverYearYieldChartProps {
  language: Language;
  farmProfile?: FarmProfile;
}

type CropFilterType = 'soybean' | 'sugarcane' | 'gram';
type MetricViewType = 'yieldPerAcre' | 'totalProduction' | 'netRevenue';

interface SeasonData {
  seasonKey: string;
  year: number;
  seasonName: string;
  isForecast?: boolean;
  metrics: {
    soybean: {
      yieldPerAcre: number; // q/acre
      districtAvg: number; // q/acre
      totalProduction: number; // quintals
      netRevenuePerAcre: number; // INR
    };
    sugarcane: {
      yieldPerAcre: number; // tonnes/acre
      districtAvg: number; // tonnes/acre
      totalProduction: number; // tonnes
      netRevenuePerAcre: number; // INR
    };
    gram: {
      yieldPerAcre: number; // q/acre
      districtAvg: number; // q/acre
      totalProduction: number; // quintals
      netRevenuePerAcre: number; // INR
    };
  };
  keyMilestone: {
    en: string;
    hi: string;
    mr: string;
  };
}

const HISTORICAL_SEASONS: SeasonData[] = [
  {
    seasonKey: '2023-kharif',
    year: 2023,
    seasonName: 'Kharif 2023',
    metrics: {
      soybean: { yieldPerAcre: 14.5, districtAvg: 12.8, totalProduction: 65, netRevenuePerAcre: 24500 },
      sugarcane: { yieldPerAcre: 38.0, districtAvg: 34.0, totalProduction: 323, netRevenuePerAcre: 58000 },
      gram: { yieldPerAcre: 9.8, districtAvg: 8.5, totalProduction: 24, netRevenuePerAcre: 19800 }
    },
    keyMilestone: {
      en: 'Baseline flood irrigation, traditional urea-heavy fertilization',
      hi: 'पारंपरिक बाढ़ सिंचाई, अत्यधिक यूरिया का उपयोग',
      mr: 'पारंपरिक पाटपाणी सिंचन, रासायनिक खतांचा अतिवापर'
    }
  },
  {
    seasonKey: '2024-kharif',
    year: 2024,
    seasonName: 'Kharif 2024',
    metrics: {
      soybean: { yieldPerAcre: 17.2, districtAvg: 13.4, totalProduction: 77, netRevenuePerAcre: 31200 },
      sugarcane: { yieldPerAcre: 42.5, districtAvg: 35.2, totalProduction: 361, netRevenuePerAcre: 68500 },
      gram: { yieldPerAcre: 11.5, districtAvg: 9.0, totalProduction: 28, netRevenuePerAcre: 23600 }
    },
    keyMilestone: {
      en: 'Installed 7.5 HP solar pump & initial automated drip lateral manifold',
      hi: '7.5 HP सोलर पंप व ड्रिप सिंचाई प्रणाली स्थापित की',
      mr: '७.५ एचपी सौर पंप आणि ठिबक सिंचन बसवले'
    }
  },
  {
    seasonKey: '2025-kharif',
    year: 2025,
    seasonName: 'Kharif 2025',
    metrics: {
      soybean: { yieldPerAcre: 19.4, districtAvg: 14.1, totalProduction: 87, netRevenuePerAcre: 38400 },
      sugarcane: { yieldPerAcre: 46.0, districtAvg: 36.5, totalProduction: 391, netRevenuePerAcre: 79200 },
      gram: { yieldPerAcre: 13.8, districtAvg: 9.6, totalProduction: 34, netRevenuePerAcre: 29400 }
    },
    keyMilestone: {
      en: 'Soil health conditioning (pH adjusted from 6.2 to 6.8) & Trichoderma bio-seed treatment',
      hi: 'मृदा स्वास्थ्य सुधार (pH 6.8 संतुलित) व जैविक बीज उपचार',
      mr: 'माती आरोग्य सुधारणा (सामू ६.८) व ट्रायकोडर्मा बीजप्रक्रिया'
    }
  },
  {
    seasonKey: '2026-kharif',
    year: 2026,
    seasonName: 'Kharif 2026 (Projected)',
    isForecast: true,
    metrics: {
      soybean: { yieldPerAcre: 21.5, districtAvg: 14.6, totalProduction: 96, netRevenuePerAcre: 43000 },
      sugarcane: { yieldPerAcre: 49.5, districtAvg: 37.0, totalProduction: 420, netRevenuePerAcre: 88500 },
      gram: { yieldPerAcre: 15.2, districtAvg: 10.0, totalProduction: 38, netRevenuePerAcre: 34000 }
    },
    keyMilestone: {
      en: 'KisanAI full precision loop: Satellite NDVI crop health, rain-skip irrigation & optimal mandi sales timing',
      hi: 'किसान AI सटीक चक्र: सैटेलाइट फसल स्वास्थ्य, वर्षा-बचत सिंचाई व सटीक मंडी बिक्री',
      mr: 'किसान AI अचूक कृषी: सॅटेलाइट पीक आरोग्य, पाऊस-बचत सिंचन व योग्य बाजार विक्री'
    }
  }
];

export const YearOverYearYieldChart: React.FC<YearOverYearYieldChartProps> = ({ language, farmProfile }) => {
  const [selectedCrop, setSelectedCrop] = useState<CropFilterType>('soybean');
  const [metricView, setMetricView] = useState<MetricViewType>('yieldPerAcre');
  const [showDistrictBenchmark, setShowDistrictBenchmark] = useState<boolean>(true);

  // Localization labels
  const t = {
    en: {
      title: 'Year-Over-Year Yield & Productivity Trends',
      subtitle: 'Multi-season historical harvest performance and precision farming gains (2023 - 2026)',
      cropFilterLabel: 'Crop Portfolio:',
      metricLabel: 'View Metric:',
      yieldPerAcre: 'Yield per Acre',
      totalProduction: 'Total Harvest',
      netRevenue: 'Net Profit / Acre',
      districtComparison: 'Show District Average Benchmark',
      cagrBadge: '+48.3% 4-Year Yield Surge',
      aboveDistrict: 'above Satara district average',
      milestoneHeader: 'Key Seasonal Interventions & Technological Drivers',
      forecastBadge: 'Forecast (Current Season)',
      productivityDrivers: 'Top Drivers of Productivity Growth:',
      driver1: 'Precision Drip Fertigation & Rain-Skip Schedules (+28%)',
      driver2: 'Microbial Soil Bio-Conditioning & pH Balancing (+24%)',
      driver3: 'AI Satellite Scouting & Early Disease Suppression (+18%)'
    },
    hi: {
      title: 'साल-दर-साल उपज एवं उत्पादकता रुझान',
      subtitle: 'कई मौसमों का ऐतिहासिक फसल उत्पादन एवं स्मार्ट कृषि से प्राप्त लाभ (2023 - 2026)',
      cropFilterLabel: 'फसल चुनें:',
      metricLabel: 'मीट्रिक देखें:',
      yieldPerAcre: 'प्रति एकड़ उपज',
      totalProduction: 'कुल उत्पादन',
      netRevenue: 'शुद्ध लाभ / एकड़',
      districtComparison: 'जिले का औसत बेंचमार्क दिखाएं',
      cagrBadge: '+48.3% 4-वर्षीय उपज वृद्धि',
      aboveDistrict: 'सतारा जिले के औसत से अधिक',
      milestoneHeader: 'मौसम-वार प्रमुख कृषि सुधार एवं तकनीकी उपाय',
      forecastBadge: 'अनुमानित (वर्तमान मौसम)',
      productivityDrivers: 'उपज वृद्धि के मुख्य कारण:',
      driver1: 'सटीक ड्रिप सिंचाई व वर्षा-बचत प्रणाली (+28%)',
      driver2: 'मृदा स्वास्थ्य सुधार व pH संतुलन (+24%)',
      driver3: 'AI सैटेलाइट निगरानी व रोग की शीघ्र रोकथाम (+18%)'
    },
    mr: {
      title: 'वर्षनिहाय पीक उत्पादन व उत्पादकता कल',
      subtitle: 'मागील ४ हंगामातील प्रत्यक्ष उत्पादन व अचूक शेती तंत्रज्ञानामुळे झालेली वाढ (२०२३ - २०२६)',
      cropFilterLabel: 'पीक निवडा:',
      metricLabel: 'माहिती प्रकार:',
      yieldPerAcre: 'एकरी उत्पादन',
      totalProduction: 'एकूण उत्पादन',
      netRevenue: 'निव्वळ नफा / एकर',
      districtComparison: 'जिल्हा सरासरी तुलना दाखवा',
      cagrBadge: '+४८.३% ४-वार्षिक भरघोस वाढ',
      aboveDistrict: 'सातारा जिल्ह्याच्या सरासरीपेक्षा जास्त',
      milestoneHeader: 'हंगामनिहाय महत्त्वाचे बदल व शेती तंत्रज्ञान',
      forecastBadge: 'अंदाजित (चालू हंगाम)',
      productivityDrivers: 'उत्पादकतेत वाढ होण्याची मुख्य कारणे:',
      driver1: 'अचूक ठिबक खत व्यवस्थापन व पाऊस-बचत (+२८%)',
      driver2: 'सेंद्रिय भूसुधार व सामू (pH) संतुलन (+२४%)',
      driver3: 'AI सॅटेलाइट निरीक्षण व रोग त्वरित नियंत्रण (+१८%)'
    }
  }[language];

  // Unit description
  const unitLabel = useMemo(() => {
    if (metricView === 'netRevenue') return '₹ / acre';
    if (selectedCrop === 'sugarcane') {
      return metricView === 'yieldPerAcre' ? 'tonnes / acre' : 'tonnes';
    }
    return metricView === 'yieldPerAcre' ? 'quintals / acre' : 'quintals';
  }, [metricView, selectedCrop]);

  // Extract values and calculate scale
  const chartData = useMemo(() => {
    return HISTORICAL_SEASONS.map((season) => {
      const cropData = season.metrics[selectedCrop];
      let value = 0;
      let benchmark = 0;

      if (metricView === 'yieldPerAcre') {
        value = cropData.yieldPerAcre;
        benchmark = cropData.districtAvg;
      } else if (metricView === 'totalProduction') {
        value = cropData.totalProduction;
        benchmark = Math.round(cropData.totalProduction * 0.72);
      } else {
        value = cropData.netRevenuePerAcre;
        benchmark = Math.round(cropData.netRevenuePerAcre * 0.65);
      }

      return {
        seasonKey: season.seasonKey,
        year: season.year,
        seasonName: season.seasonName,
        isForecast: season.isForecast,
        value,
        benchmark,
        milestone: season.keyMilestone[language]
      };
    });
  }, [selectedCrop, metricView, language]);

  // Determine Max Value for Scaling (with 20% head-room)
  const maxVal = useMemo(() => {
    const allVals = chartData.flatMap((d) => [d.value, d.benchmark]);
    return Math.max(...allVals) * 1.15;
  }, [chartData]);

  // Calculate 4-Year Overall Percentage Growth
  const firstVal = chartData[0]?.value || 1;
  const latestVal = chartData[chartData.length - 1]?.value || 1;
  const overallGrowthPercent = (((latestVal - firstVal) / firstVal) * 100).toFixed(1);

  // Latest vs District average delta
  const latestItem = chartData[chartData.length - 1];
  const outperformancePercent = latestItem
    ? (((latestItem.value - latestItem.benchmark) / latestItem.benchmark) * 100).toFixed(1)
    : '47.2';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-lime-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <TrendingUp className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                {t.title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                +{overallGrowthPercent}% Growth Trend
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Highlights Summary Pill */}
        <div className="flex items-center gap-2 bg-emerald-50/80 px-3.5 py-2 rounded-2xl border border-emerald-200 text-xs self-start lg:self-auto">
          <Award className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="text-emerald-950 font-bold">
            +{outperformancePercent}% {t.aboveDistrict}
          </span>
        </div>
      </div>

      {/* Filter and Metric Toggle Bar */}
      <div className="pt-2 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
        {/* Crop Selector Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <span className="text-stone-500 text-[11px] px-2 font-medium hidden sm:inline">{t.cropFilterLabel}</span>
          <button
            type="button"
            onClick={() => setSelectedCrop('soybean')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCrop === 'soybean'
                ? 'bg-white text-emerald-900 shadow-xs font-black ring-1 ring-emerald-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🌱 Soybean (JS-335)
          </button>

          <button
            type="button"
            onClick={() => setSelectedCrop('sugarcane')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCrop === 'sugarcane'
                ? 'bg-white text-emerald-900 shadow-xs font-black ring-1 ring-emerald-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🎋 Sugarcane (Co-86032)
          </button>

          <button
            type="button"
            onClick={() => setSelectedCrop('gram')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCrop === 'gram'
                ? 'bg-white text-emerald-900 shadow-xs font-black ring-1 ring-emerald-300'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🌾 Chickpea / Gram
          </button>
        </div>

        {/* Metric Selector & Benchmark Toggle */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl font-bold">
            <button
              type="button"
              onClick={() => setMetricView('yieldPerAcre')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                metricView === 'yieldPerAcre'
                  ? 'bg-white text-stone-900 shadow-2xs font-black'
                  : 'text-stone-600'
              }`}
            >
              {t.yieldPerAcre}
            </button>
            <button
              type="button"
              onClick={() => setMetricView('totalProduction')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                metricView === 'totalProduction'
                  ? 'bg-white text-stone-900 shadow-2xs font-black'
                  : 'text-stone-600'
              }`}
            >
              {t.totalProduction}
            </button>
            <button
              type="button"
              onClick={() => setMetricView('netRevenue')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                metricView === 'netRevenue'
                  ? 'bg-white text-stone-900 shadow-2xs font-black'
                  : 'text-stone-600'
              }`}
            >
              {t.netRevenue}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDistrictBenchmark(!showDistrictBenchmark)}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1.5 ${
              showDistrictBenchmark
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-500'
            }`}
          >
            <span className="w-2.5 h-1.5 rounded-sm bg-amber-500 inline-block" />
            <span>District Avg</span>
          </button>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500 font-semibold">
          <span>Y-Axis: {unitLabel}</span>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block shadow-2xs" />
              <span className="font-bold text-stone-700">Your Farm Harvest</span>
            </div>
            {showDistrictBenchmark && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block shadow-2xs" />
                <span className="font-bold text-stone-700">District Average</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Columns Comparison */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-end min-h-[260px] pb-2 border-b border-stone-300">
          {chartData.map((item, index) => {
            const heightPercent = Math.min(Math.round((item.value / maxVal) * 100), 100);
            const benchmarkHeightPercent = Math.min(Math.round((item.benchmark / maxVal) * 100), 100);

            // Calculate YoY jump compared to previous year
            const prevItem = chartData[index - 1];
            const yoyChange = prevItem
              ? (((item.value - prevItem.value) / prevItem.value) * 100).toFixed(1)
              : null;

            return (
              <div key={item.seasonKey} className="flex flex-col items-center group">
                {/* YoY Growth Badge */}
                <div className="mb-2 h-6 flex items-center">
                  {yoyChange ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                      +{yoyChange}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400 font-semibold">Baseline</span>
                  )}
                </div>

                {/* Bars Group */}
                <div className="w-full flex items-end justify-center gap-2 h-[200px]">
                  {/* Your Farm Bar */}
                  <div className="flex-1 max-w-[58px] flex flex-col items-center justify-end h-full">
                    {/* Floating Value Label */}
                    <span className="text-[11px] font-black text-stone-900 mb-1.5 whitespace-nowrap">
                      {metricView === 'netRevenue' ? `₹${(item.value / 1000).toFixed(1)}k` : item.value}
                    </span>

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 relative shadow-sm group-hover:brightness-105 ${
                        item.isForecast
                          ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-lime-400 ring-2 ring-emerald-500/30'
                          : 'bg-gradient-to-t from-emerald-700 to-emerald-500'
                      }`}
                    >
                      {item.isForecast && (
                        <div className="absolute top-1 left-1 right-1 text-[9px] font-bold text-emerald-950 text-center uppercase tracking-wider bg-white/70 rounded py-0.5">
                          AI est.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benchmark Bar */}
                  {showDistrictBenchmark && (
                    <div className="flex-1 max-w-[42px] flex flex-col items-center justify-end h-full">
                      <span className="text-[10px] font-bold text-amber-800 mb-1.5 whitespace-nowrap">
                        {metricView === 'netRevenue' ? `₹${(item.benchmark / 1000).toFixed(1)}k` : item.benchmark}
                      </span>
                      <div
                        style={{ height: `${benchmarkHeightPercent}%` }}
                        className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-xl transition-all duration-500 opacity-80"
                      />
                    </div>
                  )}
                </div>

                {/* Season Label at Bottom */}
                <div className="mt-3 text-center">
                  <div className="text-xs font-black text-stone-900">{item.seasonName.split(' ')[0]}</div>
                  <div className="text-[11px] font-semibold text-stone-600">{item.year}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanatory Legend / Formula */}
        <div className="mt-3 text-[11px] text-stone-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>* Projected 2026 Kharif figures computed using calibrated micro-climate models and 15.5 acres parcel boundary.</span>
          <span className="text-emerald-800 font-bold">Source: Farm Historical Ledger & Satara APMC Ground Data</span>
        </div>
      </div>

      {/* Season-by-Season Agronomic Milestones */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>{t.milestoneHeader}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {HISTORICAL_SEASONS.map((season) => (
            <div
              key={season.seasonKey}
              className={`p-4 rounded-2xl border transition-all ${
                season.isForecast
                  ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-stone-900">
                  {season.seasonName}
                </span>
                {season.isForecast ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950">
                    {t.forecastBadge}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    Harvest Complete
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed min-h-[44px]">
                {season.keyMilestone[language]}
              </p>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-500">Yield:</span>
                <span className="font-extrabold text-stone-900">
                  {season.metrics[selectedCrop].yieldPerAcre}{' '}
                  {selectedCrop === 'sugarcane' ? 't/ac' : 'q/ac'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Drivers of Productivity Gains */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t.productivityDrivers}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-100 mt-2">
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                <strong className="text-white block font-bold">1. Solar Drip & Rain-Skip (+28%)</strong>
                <span className="text-[11px] text-stone-300">Prevented water-stress & nutrient leaching</span>
              </div>
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                <strong className="text-white block font-bold">2. Root-Zone Soil Health (+24%)</strong>
                <span className="text-[11px] text-stone-300">Targeted NPK & pH balance at 6.8</span>
              </div>
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                <strong className="text-white block font-bold">3. Satellite & AI Scout (+18%)</strong>
                <span className="text-[11px] text-stone-300">Early spot-treatment before blight spread</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
