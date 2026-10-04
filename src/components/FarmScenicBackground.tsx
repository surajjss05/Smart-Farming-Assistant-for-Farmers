import React, { useState } from 'react';
import { Sparkles, Sun, Sunrise, Eye, EyeOff, SunMedium, Sliders } from 'lucide-react';

export type FarmMood = 'sunrise' | 'monsoon' | 'harvest';

interface FarmScenicBackgroundProps {
  mood?: FarmMood;
}

export const FarmScenicBackground: React.FC<FarmScenicBackgroundProps> = ({
  mood: initialMood = 'sunrise'
}) => {
  const [mood, setMood] = useState<FarmMood>(initialMood);
  const [brightnessMode, setBrightnessMode] = useState<'luminous' | 'subtle' | 'vibrant' | 'hidden'>('luminous');
  const [showControls, setShowControls] = useState<boolean>(false);

  if (brightnessMode === 'hidden') {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setBrightnessMode('luminous')}
          className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          title="Enable Farm Scenic Backdrop"
        >
          <Sunrise className="w-4 h-4" />
          <span className="hidden sm:inline">Show Farm Backdrop</span>
        </button>
      </div>
    );
  }

  // Opacity styles: 'luminous' keeps it bright, crisp and transparent so text pops
  const opacityConfig = {
    luminous: 'opacity-30', // Default: very clean, bright, zero dimming
    subtle: 'opacity-15',   // Minimalist ambient glow
    vibrant: 'opacity-55'   // More visible scenic presence
  };

  const currentOpacity = opacityConfig[brightnessMode as keyof typeof opacityConfig] || 'opacity-30';

  // Luminous bright palettes
  const palettes = {
    sunrise: {
      skyFrom: '#fffbeb', // bright warm amber-50
      skyMid: '#fed7aa',  // soft peach-200
      skyTo: '#e0f2fe',   // light sky-100
      sunColor: '#f59e0b',
      sunAura: '#fef08a',
      mountainFar: '#93c5fd',
      mountainMid: '#86efac',
      hills: '#4ade80',
      fieldsFront: '#22c55e',
      cropGolden: '#facc15',
      farmerColor: '#451a03'
    },
    monsoon: {
      skyFrom: '#f0fdf4', // fresh light emerald-50
      skyMid: '#e0f2fe',  // light sky-100
      skyTo: '#e2e8f0',   // slate-200
      sunColor: '#e2e8f0',
      sunAura: '#cbd5e1',
      mountainFar: '#64748b',
      mountainMid: '#6ee7b7',
      hills: '#16a34a',
      fieldsFront: '#15803d',
      cropGolden: '#a3e635',
      farmerColor: '#1e293b'
    },
    harvest: {
      skyFrom: '#fefce8', // yellow-50
      skyMid: '#fef08a',  // light gold
      skyTo: '#ffedd5',   // warm orange-100
      sunColor: '#ea580c',
      sunAura: '#fde047',
      mountainFar: '#cbd5e1',
      mountainMid: '#facc15',
      hills: '#eab308',
      fieldsFront: '#ca8a04',
      cropGolden: '#f59e0b',
      farmerColor: '#78350f'
    }
  };

  const p = palettes[mood];

  return (
    <>
      {/* Background Graphic Fixed Canvas */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ease-in-out overflow-hidden ${currentOpacity}`}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMin slice"
          viewBox="0 0 1920 1080"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Luminous Sky Gradient */}
            <linearGradient id="scenic-sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={p.skyMid} stopOpacity="0.7" />
              <stop offset="25%" stopColor={p.skyFrom} stopOpacity="0.8" />
              <stop offset="55%" stopColor={p.skyTo} stopOpacity="0.5" />
              <stop offset="85%" stopColor="#fafaf9" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            {/* Sun Glow */}
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={p.sunColor} stopOpacity="0.85" />
              <stop offset="35%" stopColor={p.sunAura} stopOpacity="0.4" />
              <stop offset="100%" stopColor={p.sunAura} stopOpacity="0" />
            </radialGradient>

            {/* Rolling Hills Gradient */}
            <linearGradient id="hills-far" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={p.mountainFar} stopOpacity="0.35" />
              <stop offset="100%" stopColor={p.mountainMid} stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="hills-mid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={p.hills} stopOpacity="0.45" />
              <stop offset="100%" stopColor={p.fieldsFront} stopOpacity="0.35" />
            </linearGradient>

            {/* Terraced Fields Gradient */}
            <linearGradient id="fields-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={p.fieldsFront} stopOpacity="0.45" />
              <stop offset="50%" stopColor={p.cropGolden} stopOpacity="0.35" />
              <stop offset="100%" stopColor={p.hills} stopOpacity="0.4" />
            </linearGradient>

            {/* Clean Pure White Brightness Wash for content legibility */}
            <linearGradient id="pure-bright-fade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#fafaf9" stopOpacity="0.85" />
              <stop offset="90%" stopColor="#fafaf9" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* 1. Luminous Sky */}
          <rect width="100%" height="100%" fill="url(#scenic-sky)" />

          {/* 2. Golden Rising Sun & Sunbeams */}
          <circle cx="960" cy="180" r="180" fill="url(#sun-glow)" />
          <circle cx="960" cy="180" r="60" fill={p.sunColor} opacity="0.75" />

          {/* Radiating Soft Warm Light Rays */}
          <g opacity="0.16">
            <polygon points="960,180 500,0 600,0" fill="#fef08a" />
            <polygon points="960,180 750,0 850,0" fill="#fef08a" />
            <polygon points="960,180 1070,0 1170,0" fill="#fef08a" />
            <polygon points="960,180 1320,0 1420,0" fill="#fef08a" />
            <polygon points="960,180 1600,40 1700,70" fill="#fef08a" />
            <polygon points="960,180 220,70 320,40" fill="#fef08a" />
          </g>

          {/* Gentle morning clouds */}
          <g fill="#ffffff" opacity="0.6">
            <path d="M240,130 Q280,100 340,110 Q400,90 460,120 Q500,130 520,150 Q360,165 240,130 Z" />
            <path d="M1380,150 Q1440,110 1520,125 Q1600,105 1680,135 Q1740,155 1700,175 Q1540,185 1380,150 Z" />
          </g>

          {/* 3. Distant Sahyadri / Deccan Mountain Ranges */}
          <path
            d="M0,420 Q280,310 560,370 Q840,280 1120,350 Q1400,290 1680,380 Q1820,340 1920,400 L1920,1080 L0,1080 Z"
            fill="url(#hills-far)"
          />

          {/* 4. Mid-Ground Rolling Green Foothills & Agro Groves */}
          <path
            d="M0,490 Q320,410 680,460 Q1040,400 1400,470 Q1680,430 1920,500 L1920,1080 L0,1080 Z"
            fill="url(#hills-mid)"
          />

          {/* Distant Trees, Mango Orchards, Coconut Palms */}
          <g fill="#166534" opacity="0.35">
            <circle cx="340" cy="460" r="14" />
            <circle cx="360" cy="455" r="18" />
            <circle cx="380" cy="462" r="15" />

            <circle cx="1120" cy="465" r="16" />
            <circle cx="1145" cy="460" r="20" />
            <circle cx="1170" cy="466" r="15" />

            <circle cx="1520" cy="480" r="17" />
            <circle cx="1550" cy="475" r="22" />
          </g>

          {/* 5. Terraced Agricultural Plots & Crop Canopies */}
          <path
            d="M0,600 Q400,540 820,590 Q1240,530 1920,620 L1920,1080 L0,1080 Z"
            fill="url(#fields-front)"
          />

          {/* Curving Irrigation Canal with Bright Sunlight Glint */}
          <path
            d="M860,590 Q920,650 980,740 Q1040,840 1100,1080"
            stroke="#38bdf8"
            strokeWidth="7"
            fill="none"
            opacity="0.4"
            strokeLinecap="round"
          />
          <path
            d="M862,590 Q922,650 982,740 Q1042,840 1102,1080"
            stroke="#ffffff"
            strokeWidth="2.5"
            fill="none"
            opacity="0.75"
            strokeLinecap="round"
          />

          {/* Modern Precision Drip Lateral Lines */}
          <g stroke="#ffffff" strokeWidth="1" opacity="0.25" strokeDasharray="6 4">
            <line x1="200" y1="680" x2="680" y2="650" />
            <line x1="180" y1="720" x2="720" y2="680" />
            <line x1="150" y1="770" x2="760" y2="720" />

            <line x1="1200" y1="670" x2="1750" y2="700" />
            <line x1="1160" y1="720" x2="1780" y2="750" />
          </g>

          {/* Golden Crop Canopies (Sugarcane & Grain Stalks Pattern) */}
          <g stroke={p.cropGolden} strokeWidth="2" opacity="0.35" strokeLinecap="round">
            {Array.from({ length: 16 }).map((_, i) => (
              <path
                key={`crop-l-${i}`}
                d={`M${240 + i * 28},${740 + (i % 3) * 6} Q${245 + i * 28},${715} ${242 + i * 28},${700}`}
              />
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
              <path
                key={`crop-r-${i}`}
                d={`M${1300 + i * 30},${740 + (i % 3) * 6} Q${1305 + i * 30},${715} ${1302 + i * 30},${700}`}
              />
            ))}
          </g>

          {/* Distant Tractor Silhouette with Modern Plough */}
          <g transform="translate(1420, 605) scale(0.6)" opacity="0.45" fill="#334155">
            <circle cx="50" cy="50" r="22" />
            <circle cx="50" cy="50" r="14" fill="#ffffff" opacity="0.3" />
            <circle cx="105" cy="56" r="14" />
            <circle cx="105" cy="56" r="8" fill="#ffffff" opacity="0.3" />
            <rect x="42" y="32" width="65" height="18" rx="4" />
            <path d="M75,32 L112,35 L112,50 L75,50 Z" />
            <path d="M42,12 L65,12 L68,32 L40,32 Z" fill="none" stroke="#334155" strokeWidth="4" />
            <line x1="98" y1="20" x2="98" y2="35" stroke="#334155" strokeWidth="3" />
            <circle cx="54" cy="22" r="6" />
          </g>

          {/* Distant Solar Drip Pump Array */}
          <g transform="translate(680, 540) scale(0.65)" opacity="0.5">
            <polygon points="20,25 70,12 85,28 35,42" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <polygon points="50,22 100,10 115,26 65,40" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <line x1="45" y1="36" x2="45" y2="58" stroke="#64748b" strokeWidth="2.5" />
            <line x1="90" y1="32" x2="90" y2="58" stroke="#64748b" strokeWidth="2.5" />
          </g>

          {/* 6. Iconic Indian Farmer Silhouette standing proudly in field at sunrise */}
          <g transform="translate(180, 480) scale(1.1)" opacity="0.6" fill={p.farmerColor}>
            {/* Traditional Turban (Pagri) */}
            <path
              d="M62,48 C58,40 68,34 78,35 C86,36 93,42 90,49 C93,52 90,58 84,59 C76,60 62,56 62,48 Z"
              fill="#d97706"
            />
            <path d="M72,50 C74,54 75,60 72,65 C76,67 80,64 81,59 C82,53 79,50 72,50 Z" />
            <path d="M64,66 C52,70 45,85 46,115 L95,115 C96,85 88,70 78,66 Z" fill="#292524" />
            <path
              d="M58,72 C62,85 64,105 65,128 C61,128 56,105 54,82 Z"
              fill="#b45309"
            />
            <path d="M48,115 L45,175 L66,175 L70,128 L74,175 L95,175 L92,115 Z" fill="#1c1917" />
            <line x1="102" y1="35" x2="98" y2="185" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
            <circle cx="98" cy="85" r="5" fill="#292524" />
          </g>

          {/* 7. Pure Brightness Legibility Mask */}
          {/* This guarantees dashboard cards, fonts, and charts remain 100% bright, pure, and high contrast */}
          <rect width="100%" height="100%" fill="url(#pure-bright-fade)" />
        </svg>
      </div>

      {/* Floating Theme & Atmosphere Switcher Pill */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="relative">
          {showControls ? (
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xl space-y-3 text-xs animate-fadeIn text-stone-900 w-64">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-extrabold flex items-center gap-1.5 text-stone-900">
                  <SunMedium className="w-4 h-4 text-amber-500" />
                  Farm Backdrop & Lighting
                </span>
                <button
                  onClick={() => setShowControls(false)}
                  className="text-stone-400 hover:text-stone-700 text-xs font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Brightness Presets */}
              <div>
                <span className="text-[11px] font-bold text-stone-500 block mb-1.5 uppercase tracking-wide">
                  Lighting & Clarity
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setBrightnessMode('luminous')}
                    className={`py-1.5 px-2 rounded-xl text-center font-bold text-[11px] transition-all cursor-pointer ${
                      brightnessMode === 'luminous'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    ☀️ Bright
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrightnessMode('subtle')}
                    className={`py-1.5 px-2 rounded-xl text-center font-bold text-[11px] transition-all cursor-pointer ${
                      brightnessMode === 'subtle'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    🌤️ Subtle
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrightnessMode('vibrant')}
                    className={`py-1.5 px-2 rounded-xl text-center font-bold text-[11px] transition-all cursor-pointer ${
                      brightnessMode === 'vibrant'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    🌄 Scenic
                  </button>
                </div>
              </div>

              {/* Mood options */}
              <div>
                <span className="text-[11px] font-bold text-stone-500 block mb-1.5 uppercase tracking-wide">
                  Color Atmosphere
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setMood('sunrise')}
                    className={`py-1 px-1.5 rounded-lg text-center font-bold text-[10px] transition-colors cursor-pointer ${
                      mood === 'sunrise'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    🌅 Dawn
                  </button>
                  <button
                    type="button"
                    onClick={() => setMood('monsoon')}
                    className={`py-1 px-1.5 rounded-lg text-center font-bold text-[10px] transition-colors cursor-pointer ${
                      mood === 'monsoon'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    🌧️ Lush
                  </button>
                  <button
                    type="button"
                    onClick={() => setMood('harvest')}
                    className={`py-1 px-1.5 rounded-lg text-center font-bold text-[10px] transition-colors cursor-pointer ${
                      mood === 'harvest'
                        ? 'bg-orange-100 text-orange-900 border border-orange-300'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    🌾 Gold
                  </button>
                </div>
              </div>

              {/* Turn off */}
              <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-500">Backdrop Visibility:</span>
                <button
                  onClick={() => setBrightnessMode('hidden')}
                  className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center gap-1 font-semibold text-[10px] cursor-pointer"
                >
                  <EyeOff className="w-3 h-3" />
                  <span>Disable</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowControls(true)}
              className="px-3 py-2 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md transition-all hover:scale-105 flex items-center gap-1.5 text-xs font-bold cursor-pointer hover:border-emerald-300"
              title="Adjust Farm Backdrop & Lighting"
            >
              <SunMedium className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Lighting & Theme</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
