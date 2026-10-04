import React from 'react';
import {
  X,
  User,
  MapPin,
  Tractor,
  Layers,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { FarmProfile, Language } from '../types/farm';
import { initialFarmProfile } from '../data/mockData';
import { translations } from '../i18n/translations';

interface FarmProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmProfile: FarmProfile;
  onResetDemo: () => void;
  language: Language;
}

export const FarmProfileModal: React.FC<FarmProfileModalProps> = ({
  isOpen,
  onClose,
  farmProfile,
  onResetDemo,
  language
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">{farmProfile.farmerName}</h2>
              <span className="text-xs text-stone-600">Farmer Profile ID: {farmProfile.id}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-600">Location:</span>
              <span className="font-bold text-stone-900">{farmProfile.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Coordinates:</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                {farmProfile.coordinates?.latitude?.toFixed(4)}°N, {farmProfile.coordinates?.longitude?.toFixed(4)}°E
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Phone:</span>
              <span className="font-bold text-stone-900">{farmProfile.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Total Landholding:</span>
              <span className="font-bold text-emerald-800">{farmProfile.totalAcres} Acres</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Soil Type:</span>
              <span className="font-bold text-stone-900">{farmProfile.soilType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600">Current Standing Crop:</span>
              <span className="font-bold text-stone-900">{farmProfile.currentCrop.name} ({farmProfile.currentCrop.growthStage})</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            <strong>Demo Mode:</strong> You are currently exploring Kisan AI with simulated farm and sensor data from Satara District, Maharashtra.
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => {
              onResetDemo();
              onClose();
            }}
            className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Farm</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
