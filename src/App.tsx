import React, { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import {
  NavTab,
  Language,
  FarmProfile,
  WeatherData,
  FarmAlert,
  MarketCommodity,
  CropRecommendation,
  YieldForecastData,
  ProfitOptimizationData,
  LogisticsData
} from './types/farm';
import { initialFarmProfile } from './data/mockData';
import {
  fetchFarmProfile,
  updateFarmProfile,
  fetchWeatherData,
  fetchAlerts,
  fetchMarketPrices,
  fetchCropRecommendations,
  fetchYieldForecast,
  fetchProfitOptimization,
  fetchLogisticsData
} from './services/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { MyFarmView } from './views/MyFarmView';
import { FarmSatelliteView } from './views/FarmSatelliteView';
import { CropRecommendationView } from './views/CropRecommendationView';
import { YieldForecastView } from './views/YieldForecastView';
import { ProfitOptimizerView } from './views/ProfitOptimizerView';
import { CropHealthView } from './views/CropHealthView';
import { MarketPricesView } from './views/MarketPricesView';
import { WeatherView } from './views/WeatherView';
import { HarvestPlannerView } from './views/HarvestPlannerView';
import { LogisticsView } from './views/LogisticsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AIChatbotView } from './views/AIChatbotView';
import { NotificationModal } from './components/NotificationModal';
import { FarmProfileModal } from './components/FarmProfileModal';
import { FarmScenicBackground } from './components/FarmScenicBackground';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Core Data States
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(initialFarmProfile);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [marketData, setMarketData] = useState<MarketCommodity[]>([]);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [yieldForecast, setYieldForecast] = useState<YieldForecastData | null>(null);
  const [profitData, setProfitData] = useState<ProfitOptimizationData | null>(null);
  const [logisticsData, setLogisticsData] = useState<LogisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const prof = await fetchFarmProfile().catch(() => initialFarmProfile);
        setFarmProfile(prof);

        // Fetch weather calibrated to exact saved farm coordinates
        const [weather, alrts, markets, logData] = await Promise.all([
          fetchWeatherData({
            location: prof.location,
            lat: prof.coordinates?.latitude,
            lon: prof.coordinates?.longitude
          }).catch(() => null),
          fetchAlerts(prof.location).catch(() => []),
          fetchMarketPrices().catch(() => []),
          fetchLogisticsData().catch(() => null)
        ]);

        if (weather) setWeatherData(weather);
        if (alrts) setAlerts(alrts);
        if (markets) setMarketData(markets);
        if (logData) setLogisticsData(logData);

        // Fetch dependent agricultural models
        const [recs, yieldData, profit] = await Promise.all([
          fetchCropRecommendations({
            soilType: prof.soilType,
            ph: prof.soilData.ph,
            nitrogen: prof.soilData.nitrogen,
            phosphorus: prof.soilData.phosphorus,
            potassium: prof.soilData.potassium,
            moisture: prof.soilData.moisture,
            acreage: prof.totalAcres,
            location: prof.location
          }).catch(() => ({ recommendations: [], sortCriteria: '' })),
          fetchYieldForecast({
            crop: prof.currentCrop.name,
            acres: prof.totalAcres
          }).catch(() => null),
          fetchProfitOptimization({
            crop: prof.currentCrop.name,
            acres: prof.totalAcres
          }).catch(() => null)
        ]);

        if (recs?.recommendations) setRecommendations(recs.recommendations);
        if (yieldData) setYieldForecast(yieldData);
        if (profit) setProfitData(profit);
      } catch (err) {
        console.error('Initial data loading fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleUpdateProfile = async (updatedFields: Partial<FarmProfile>) => {
    const updated = { ...farmProfile, ...updatedFields };
    setFarmProfile(updated);

    try {
      await updateFarmProfile(updatedFields);
      // Re-trigger predictions, weather and alerts according to new saved location coordinates
      const [recs, yieldData, profit, weather, newAlerts] = await Promise.all([
        fetchCropRecommendations({
          soilType: updated.soilType,
          ph: updated.soilData.ph,
          nitrogen: updated.soilData.nitrogen,
          phosphorus: updated.soilData.phosphorus,
          potassium: updated.soilData.potassium,
          moisture: updated.soilData.moisture,
          acreage: updated.totalAcres,
          location: updated.location
        }),
        fetchYieldForecast({
          crop: updated.currentCrop.name,
          acres: updated.totalAcres
        }),
        fetchProfitOptimization({
          crop: updated.currentCrop.name,
          acres: updated.totalAcres
        }),
        fetchWeatherData({
          location: updated.location,
          lat: updated.coordinates?.latitude,
          lon: updated.coordinates?.longitude
        }),
        fetchAlerts(updated.location)
      ]);

      if (recs?.recommendations) setRecommendations(recs.recommendations);
      if (yieldData) setYieldForecast(yieldData);
      if (profit) setProfitData(profit);
      if (weather) setWeatherData(weather);
      if (newAlerts) setAlerts(newAlerts);
    } catch (e) {
      console.error('Error recalculating models on profile update:', e);
    }
  };

  const handleUpdateLocation = async (
    newLoc: string,
    coords?: { latitude: number; longitude: number },
    saveToFarm = true
  ) => {
    if (saveToFarm) {
      handleUpdateProfile({
        location: newLoc,
        coordinates: coords || farmProfile.coordinates
      });
    } else {
      try {
        const newWeather = await fetchWeatherData({
          location: newLoc,
          lat: coords?.latitude,
          lon: coords?.longitude
        });
        setWeatherData(newWeather);
      } catch (err) {
        console.error('Failed to preview weather:', err);
      }
    }
  };

  const handleResetDemo = () => {
    setFarmProfile(initialFarmProfile);
    handleUpdateProfile(initialFarmProfile);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans relative">
      {/* Attractive Scenic Farm Landscape & Farmer Background */}
      <FarmScenicBackground mood="sunrise" />

      {/* Top Application Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        farmProfile={farmProfile}
        alerts={alerts}
        onOpenNotifications={() => setNotificationOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenChat={() => setCurrentTab('chatbot')}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        {/* Responsive Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          language={language}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:pl-72 w-full transition-all relative z-10">
          {currentTab === 'dashboard' && (
            <DashboardView
              farmProfile={farmProfile}
              weatherData={weatherData}
              alerts={alerts}
              marketData={marketData}
              onNavigate={setCurrentTab}
              language={language}
            />
          )}

          {currentTab === 'farm' && (
            <MyFarmView
              farmProfile={farmProfile}
              onUpdateProfile={handleUpdateProfile}
              language={language}
              onNavigateToSatellite={() => setCurrentTab('farm-satellite')}
            />
          )}

          {currentTab === 'farm-satellite' && (
            <FarmSatelliteView
              farmProfile={farmProfile}
              language={language}
              onNavigateToCropHealth={() => setCurrentTab('crop-health')}
              onNavigateToWeather={() => setCurrentTab('weather')}
              onUpdateLocation={handleUpdateLocation}
            />
          )}

          {currentTab === 'crop-recommendation' && (
            <CropRecommendationView
              farmProfile={farmProfile}
              recommendations={recommendations}
              language={language}
              onNavigateToProfit={() => setCurrentTab('profit-optimizer')}
            />
          )}

          {currentTab === 'yield-forecast' && yieldForecast && (
            <YieldForecastView
              farmProfile={farmProfile}
              initialForecast={yieldForecast}
              language={language}
            />
          )}

          {currentTab === 'profit-optimizer' && profitData && (
            <ProfitOptimizerView
              farmProfile={farmProfile}
              initialProfitData={profitData}
              language={language}
            />
          )}

          {currentTab === 'crop-health' && (
            <CropHealthView language={language} />
          )}

          {currentTab === 'market-prices' && marketData.length > 0 && (
            <MarketPricesView
              marketData={marketData}
              language={language}
            />
          )}

          {currentTab === 'weather' && (
            <WeatherView
              weatherData={weatherData}
              alerts={alerts}
              language={language}
              farmProfile={farmProfile}
              onUpdateLocation={handleUpdateLocation}
            />
          )}

          {currentTab === 'harvest-planner' && (
            <HarvestPlannerView
              farmProfile={farmProfile}
              language={language}
            />
          )}

          {currentTab === 'logistics' && logisticsData && (
            <LogisticsView
              farmProfile={farmProfile}
              logisticsData={logisticsData}
              language={language}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              farmProfile={farmProfile}
              language={language}
            />
          )}

          {currentTab === 'chatbot' && (
            <AIChatbotView
              farmProfile={farmProfile}
              language={language}
              onLanguageChange={setLanguage}
              onNavigateToCropHealth={() => setCurrentTab('crop-health')}
            />
          )}
        </main>
      </div>

      {/* Notification Alerts Modal */}
      <NotificationModal
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
        alerts={alerts}
        language={language}
        onNavigate={setCurrentTab}
      />

      {/* Farmer Profile & Settings Modal */}
      <FarmProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        farmProfile={farmProfile}
        onResetDemo={handleResetDemo}
        language={language}
      />

      {/* Floating Gemini Chatbot Launcher (visible on all other tabs) */}
      {currentTab !== 'chatbot' && (
        <button
          onClick={() => setCurrentTab('chatbot')}
          className="fixed bottom-6 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl flex items-center gap-2.5 transition-all duration-200 group active:scale-95 border border-emerald-400/40 cursor-pointer"
          title="Open Kisan AI Gemini Farming Assistant"
          aria-label="Open Kisan AI Chatbot"
        >
          <div className="relative">
            <Bot className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime-400 rounded-full"></span>
          </div>
          <div className="text-left hidden sm:block pr-1">
            <div className="text-xs font-black tracking-tight leading-tight flex items-center gap-1">
              <span>Kisan AI Assistant</span>
              <Sparkles className="w-3 h-3 text-lime-300" />
            </div>
            <div className="text-[10px] text-emerald-200 leading-tight">
              Multi-Turn • Voice & Roles
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
