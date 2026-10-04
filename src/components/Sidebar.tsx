import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  Coins,
  Bug,
  LineChart,
  CloudSun,
  CalendarCheck,
  Truck,
  BarChart3,
  Bot,
  Layers,
  ChevronRight,
  Satellite
} from 'lucide-react';
import { NavTab, Language } from '../types/farm';
import { translations } from '../i18n/translations';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language,
  mobileMenuOpen,
  onCloseMobileMenu
}) => {
  const t = translations[language];

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: t.tabs.dashboard,
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'farm',
      label: t.tabs.farm,
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'farm-satellite',
      label: t.tabs.farmSatellite,
      icon: <Satellite className="w-5 h-5" />,
      badge: 'Maps'
    },
    {
      id: 'crop-recommendation',
      label: t.tabs.cropRecommendation,
      icon: <Sprout className="w-5 h-5" />,
      badge: 'AI'
    },
    {
      id: 'yield-forecast',
      label: t.tabs.yieldForecast,
      icon: <TrendingUp className="w-5 h-5" />,
      badge: 'ML'
    },
    {
      id: 'profit-optimizer',
      label: t.tabs.profitOptimizer,
      icon: <Coins className="w-5 h-5" />
    },
    {
      id: 'crop-health',
      label: t.tabs.cropHealth,
      icon: <Bug className="w-5 h-5" />,
      badge: 'Vision'
    },
    {
      id: 'market-prices',
      label: t.tabs.marketPrices,
      icon: <LineChart className="w-5 h-5" />
    },
    {
      id: 'weather',
      label: t.tabs.weather,
      icon: <CloudSun className="w-5 h-5" />
    },
    {
      id: 'harvest-planner',
      label: t.tabs.harvestPlanner,
      icon: <CalendarCheck className="w-5 h-5" />
    },
    {
      id: 'logistics',
      label: t.tabs.logistics,
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'analytics',
      label: t.tabs.analytics,
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'chatbot',
      label: t.tabs.chatbot,
      icon: <Bot className="w-5 h-5" />,
      badge: 'Live'
    }
  ];

  const handleNavClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-md border-r border-stone-200/90 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto shadow-sm`}
      >
        <div className="p-3">
          <div className="px-3 py-2 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            Agricultural Intelligence
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`${isActive ? 'text-white' : 'text-emerald-700'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-700 text-emerald-100'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Help Card */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-lime-50 border border-emerald-200/80">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-emerald-950">Kisan AI Voice & Text</span>
          </div>
          <p className="text-[11px] text-stone-600 mb-2.5">
            Ask any farming query in English, Hindi, or Marathi anytime.
          </p>
          <button
            onClick={() => handleNavClick('chatbot')}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Assistant</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
