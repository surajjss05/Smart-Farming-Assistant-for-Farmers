import React from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { FarmAlert, Language, NavTab } from '../types/farm';
import { translations } from '../i18n/translations';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: FarmAlert[];
  language: Language;
  onNavigate: (tab: NavTab) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  alerts,
  language,
  onNavigate
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Farm Alerts & Advisories</h2>
              <p className="text-xs text-stone-600">Active meteorological & disease notifications</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border text-xs ${
                alert.severity === 'high'
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  {alert.severity === 'high' ? (
                    <Flame className="w-4 h-4 text-rose-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  {alert.title}
                </span>
                <span className="text-[10px] text-stone-600 font-semibold">{alert.timestamp}</span>
              </div>

              <p className="text-stone-700 leading-relaxed mb-2">
                {alert.description}
              </p>

              <div className="p-2 rounded-lg bg-white/90 border border-stone-200 text-emerald-950 font-medium">
                <strong>Action:</strong> {alert.recommendation}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={() => {
              onClose();
              onNavigate('weather');
            }}
            className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            Open Weather Radar
          </button>
        </div>
      </div>
    </div>
  );
};
