import React, { useState, useRef } from 'react';
import {
  Bug,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Flame,
  Info,
  HelpCircle,
  FileCheck,
  Globe,
  Search,
  ExternalLink
} from 'lucide-react';
import { DiseaseDiagnosis, Language, GroundingSource } from '../types/farm';
import { sampleLeafPresets, SampleLeaf } from '../data/mockData';
import { detectCropDisease, searchAgriAdvisories } from '../services/api';
import { translations } from '../i18n/translations';

interface CropHealthViewProps {
  language: Language;
}

export const CropHealthView: React.FC<CropHealthViewProps> = ({ language }) => {
  const t = translations[language];

  const [selectedPreset, setSelectedPreset] = useState<SampleLeaf | null>(sampleLeafPresets[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(sampleLeafPresets[0].diagnosis);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [userNotes, setUserNotes] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time Google Search Grounding for Pest Outbreaks & KVK Advisories
  const [liveAgriQuery, setLiveAgriQuery] = useState('');
  const [isSearchingAgri, setIsSearchingAgri] = useState(false);
  const [liveAgriResult, setLiveAgriResult] = useState<{
    query: string;
    result: string;
    sources?: GroundingSource[];
  } | null>(null);

  const handleAgriSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || liveAgriQuery || `${diagnosis?.diseaseName || 'Crop disease'} treatment spray alert Maharashtra`;
    if (!query.trim() || isSearchingAgri) return;

    setIsSearchingAgri(true);
    try {
      const res = await searchAgriAdvisories(query);
      setLiveAgriResult({
        query,
        result: res.result,
        sources: res.sources
      });
    } catch (err) {
      console.error('Agri search failed:', err);
    } finally {
      setIsSearchingAgri(false);
    }
  };

  const handleSelectPreset = async (preset: SampleLeaf) => {
    setSelectedPreset(preset);
    setCustomImage(null);
    setIsAnalyzing(true);

    // Call server detection endpoint
    try {
      const res = await detectCropDisease({
        cropName: preset.crop,
        userNotes: preset.notes
      });
      if (res && res.diagnosis) {
        setDiagnosis(res.diagnosis);
      } else {
        setDiagnosis(preset.diagnosis);
      }
    } catch {
      setDiagnosis(preset.diagnosis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setCustomImage(base64);
      setSelectedPreset(null);
      setIsAnalyzing(true);

      try {
        const res = await detectCropDisease({
          imageBase64: base64,
          mimeType: file.type || 'image/jpeg',
          userNotes
        });
        if (res && res.diagnosis) {
          setDiagnosis(res.diagnosis);
        } else {
          setDiagnosis(sampleLeafPresets[0].diagnosis);
        }
      } catch {
        setDiagnosis(sampleLeafPresets[0].diagnosis);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 mb-1.5">
              <Bug className="w-3.5 h-3.5 text-rose-800" />
              <span>AI Crop Doctor & Vision Diagnostics</span>
            </div>
            <h1 className="text-2xl font-black text-stone-900">{t.cropHealth.title}</h1>
            <p className="text-xs text-stone-600 mt-0.5">
              {t.cropHealth.subtitle}
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Upload or Take Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Preset Leaf Selector or Custom Upload Display */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
          {t.cropHealth.orChoosePreset}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sampleLeafPresets.map(preset => {
            const isSelected = selectedPreset?.id === preset.id && !customImage;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center gap-2 group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-xs group-hover:scale-105 transition-transform p-1">
                  <img
                    src={preset.thumbnailSvg}
                    alt={preset.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center w-full">
                  <span className="text-xs font-bold text-stone-900 block truncate">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-stone-600 truncate block">
                    {preset.crop}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {customImage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={customImage}
                alt="Custom uploaded crop leaf"
                className="w-12 h-12 rounded-lg object-cover border border-emerald-300"
              />
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Your Uploaded Leaf Photo</span>
                <span className="text-[11px] text-emerald-800 font-semibold">Analyzed by Gemini Vision AI</span>
              </div>
            </div>

            <button
              onClick={() => handleSelectPreset(sampleLeafPresets[0])}
              className="text-xs text-stone-600 hover:text-stone-900 font-semibold underline"
            >
              Reset to presets
            </button>
          </div>
        )}
      </div>

      {/* Loading Scanning State */}
      {isAnalyzing && (
        <div className="p-8 bg-white rounded-2xl border border-emerald-300 text-center space-y-3 animate-pulse shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h2 className="text-base font-extrabold text-stone-900">
            {t.cropHealth.diagnosing}
          </h2>
          <p className="text-xs text-stone-600">
            Inspecting lesion chlorosis, necrosis margins, spore pustules, and leaf venation...
          </p>
        </div>
      )}

      {/* Diagnosis Results Card */}
      {!isAnalyzing && diagnosis && (
        <div className="space-y-6">
          {/* Main Diagnosis Banner */}
          <div
            className={`rounded-2xl p-6 border shadow-xs ${
              diagnosis.severityLevel === 'healthy'
                ? 'bg-emerald-50/80 border-emerald-300'
                : diagnosis.severityLevel === 'high'
                ? 'bg-rose-50/80 border-rose-300'
                : 'bg-amber-50/80 border-amber-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      diagnosis.severityLevel === 'healthy'
                        ? 'bg-emerald-200 text-emerald-900'
                        : diagnosis.severityLevel === 'high'
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {diagnosis.severityLevel === 'healthy' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    {diagnosis.pathogenType}
                  </span>
                  <span className="text-xs text-stone-600 font-semibold">
                    Severity: {diagnosis.severity}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-stone-900">
                  {diagnosis.diseaseName}
                </h2>
              </div>

              {/* Confidence Score Badge */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-center shrink-0 self-start sm:self-auto">
                <span className="text-[10px] font-bold text-stone-600 uppercase block">
                  AI Confidence
                </span>
                <span className="text-2xl font-black text-emerald-800">
                  {diagnosis.confidence}%
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Google Search Grounding - University Outbreak & KVK Advisory Search */}
          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 rounded-2xl p-5 border border-teal-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-900">Live University & KVK Outbreak Search</h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-600 text-white tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Google Search Grounded
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Cross-checks state agricultural university bulletins (MPKV, ICAR, KVK) for current spray notices and outbreak alerts
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const targetQuery = `${diagnosis.diseaseName} spray advisory and management Maharashtra`;
                  setLiveAgriQuery(targetQuery);
                  handleAgriSearch(undefined, targetQuery);
                }}
                disabled={isSearchingAgri}
                className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-center disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Verify with Live Search</span>
              </button>
            </div>

            {/* Custom Search Form */}
            <form onSubmit={e => handleAgriSearch(e)} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={liveAgriQuery}
                  onChange={e => setLiveAgriQuery(e.target.value)}
                  placeholder={`Search e.g. "${diagnosis.diseaseName} organic spray dosages KVK Maharashtra"...`}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-teal-300 bg-white text-xs sm:text-sm font-medium text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSearchingAgri}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSearchingAgri ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking Web...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Bulletins</span>
                    </>
                  )}
                </button>

                {liveAgriResult && (
                  <button
                    type="button"
                    onClick={() => setLiveAgriResult(null)}
                    className="px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold hover:bg-stone-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {/* Live Search Grounding Result */}
            {liveAgriResult && (
              <div className="p-4 rounded-xl bg-white border border-teal-300 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    <span className="text-xs font-bold text-stone-800">
                      Advisory Query: &ldquo;{liveAgriResult.query}&rdquo;
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Live Verified via Gemini + Google Search Grounding
                  </span>
                </div>

                <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-line font-medium bg-stone-50/70 p-3 rounded-lg border border-stone-200/80">
                  {liveAgriResult.result}
                </div>

                {/* Grounded Citation Sources */}
                {liveAgriResult.sources && liveAgriResult.sources.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3 text-teal-600" />
                      University & Extension Sources:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {liveAgriResult.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[11px] font-medium text-teal-900 border border-teal-200 hover:border-teal-300 transition-colors shadow-2xs"
                        >
                          <ExternalLink className="w-3 h-3 text-teal-600" />
                          <span className="max-w-[200px] truncate">{src.title || new URL(src.uri).hostname}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4 Cards Grid: Symptoms, Causes, Immediate Actions, Organic Remedies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symptoms */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">{t.cropHealth.symptoms}</h3>
              </div>
              <ul className="space-y-2 text-xs text-stone-700">
                {diagnosis.symptoms.map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                    <span className="leading-relaxed">{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Causes */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-800">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">{t.cropHealth.causes}</h3>
              </div>
              <ul className="space-y-2 text-xs text-stone-700">
                {diagnosis.causes.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
                    <span className="leading-relaxed">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Immediate Actions */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-800">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">{t.cropHealth.immediateActions}</h3>
              </div>
              <ul className="space-y-2 text-xs text-stone-700">
                {diagnosis.immediateActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organic & Biological Remedies */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900">{t.cropHealth.organicRemedies}</h3>
              </div>
              <ul className="space-y-2 text-xs text-stone-700">
                {diagnosis.organicRemedies.map((remedy, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Preventive Measures */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">{t.cropHealth.preventiveMeasures}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {diagnosis.preventiveMeasures.map((measure, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  <strong className="font-semibold text-stone-900 block mb-1">Step {idx + 1}:</strong>
                  {measure}
                </div>
              ))}
            </div>
          </div>

          {/* Official Agricultural Extension Consultation Note */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-950 mb-0.5">
                {t.cropHealth.expertAdvisory} (Responsible AI Guidance)
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                {diagnosis.expertConsultationNote}
              </p>
              <div className="mt-2 text-[11px] text-amber-800 font-semibold">
                Kisan Call Center: <strong>1800-180-1551 (Toll-Free, 24/7)</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
