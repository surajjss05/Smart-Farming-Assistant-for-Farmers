import React from 'react';
import {
  Sprout,
  Bell,
  User,
  Globe,
  MapPin,
  Menu,
  X,
  Sparkles,
  Bot
} from 'lucide-react';
import { Language, FarmProfile, FarmAlert } from '../types/farm';
import { translations } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  farmProfile: FarmProfile;
  alerts: FarmAlert[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  farmProfile,
  alerts,
  onOpenNotifications,
  onOpenProfile,
  onOpenChat,
  mobileMenuOpen,
  onToggleMobileMenu
}) => {
  const t = translations[language];
  const urgentCount = alerts.filter(a => a.urgent).length;

  return (
    <header className="sticky top-0 z-30 bg-emerald-950 text-white border-b border-emerald-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Menu button + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
                <Sprout className="w-6 h-6 text-emerald-950 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-200 via-white to-lime-200 bg-clip-text text-transparent">
                    {t.appName}
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-300 border border-emerald-700/60">
                    <Sparkles className="w-3 h-3 mr-1 text-lime-400" />
                    AI 3.8
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/80 hidden md:block">
                  {t.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Current Farm Location Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-800 text-xs text-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
            <span className="font-semibold text-white">{farmProfile.farmerName}</span>
            <span className="text-emerald-400">•</span>
            <span>{farmProfile.location}</span>
            <span className="text-emerald-400">•</span>
            <span className="text-lime-300 font-medium">{farmProfile.totalAcres} Acres</span>
            <span className="ml-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider">
              Demo Farm
            </span>
          </div>

          {/* Right: Language switch + Kisan AI chat trigger + Alerts + Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-900/80 rounded-lg p-0.5 border border-emerald-800 text-xs">
              <Globe className="w-3.5 h-3.5 ml-2 text-emerald-300 hidden sm:block" />
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('mr')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  language === 'mr'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Quick AI Assistant Trigger */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-emerald-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              title="Chat with Kisan AI"
            >
              <Bot className="w-4 h-4 stroke-[2.2]" />
              <span className="hidden sm:inline">Kisan AI</span>
            </button>

            {/* Alerts Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-800 transition-colors"
              aria-label="Farm Alerts"
            >
              <Bell className="w-5 h-5" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {urgentCount}
                </span>
              )}
            </button>

            {/* Farmer Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-800 text-emerald-200 hover:text-white text-xs transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden md:inline font-medium text-white">
                {farmProfile.farmerName.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
