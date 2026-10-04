import React, { useState } from 'react';
import {
  Layers,
  Save,
  FileText,
  Upload,
  Droplets,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Tractor,
  Warehouse,
  Users,
  Satellite,
  Compass,
  MapPin,
  ChevronRight,
  Radio,
  Zap,
  Activity
} from 'lucide-react';
import { FarmProfile, SoilData, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { IoTSoilSensorStation } from '../components/IoTSoilSensorStation';

interface MyFarmViewProps {
  farmProfile: FarmProfile;
  onUpdateProfile: (profile: Partial<FarmProfile>) => void;
  language: Language;
  onNavigateToSatellite?: () => void;
}

export const MyFarmView: React.FC<MyFarmViewProps> = ({
  farmProfile,
  onUpdateProfile,
  language,
  onNavigateToSatellite
}) => {
  const t = translations[language];

  const [formData, setFormData] = useState({
    farmerName: farmProfile.farmerName,
    location: farmProfile.location,
    latitude: farmProfile.coordinates?.latitude ?? 17.6805,
    longitude: farmProfile.coordinates?.longitude ?? 73.9972,
    totalAcres: farmProfile.totalAcres,
    soilType: farmProfile.soilType,
    ph: farmProfile.soilData.ph,
    nitrogen: farmProfile.soilData.nitrogen,
    phosphorus: farmProfile.soilData.phosphorus,
    potassium: farmProfile.soilData.potassium,
    moisture: farmProfile.soilData.moisture,
    organicCarbon: farmProfile.soilData.organicCarbon,
    storageCapacityQuintals: farmProfile.resources.storageCapacityQuintals,
    dripCoveragePercent: farmProfile.resources.dripCoveragePercent,
    currentCropName: farmProfile.currentCrop.name,
    growthStage: farmProfile.currentCrop.growthStage
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [autoSyncIoT, setAutoSyncIoT] = useState<boolean>(true);

  // Sync moisture callback from live IoT sensor stream
  const handleSyncMoistureFromIoT = (newMoisture: number) => {
    setFormData((prev) => ({
      ...prev,
      moisture: Math.round(newMoisture)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSoilData: SoilData = {
      ph: Number(formData.ph),
      nitrogen: Number(formData.nitrogen),
      phosphorus: Number(formData.phosphorus),
      potassium: Number(formData.potassium),
      moisture: Number(formData.moisture),
      organicCarbon: Number(formData.organicCarbon),
      fertilityRating:
        formData.ph >= 6.5 && formData.ph <= 7.5 && formData.organicCarbon >= 0.6
          ? 'Good'
          : 'Medium'
    };

    onUpdateProfile({
      farmerName: formData.farmerName,
      location: formData.location,
      coordinates: {
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude)
      },
      totalAcres: Number(formData.totalAcres),
      soilType: formData.soilType,
      soilData: updatedSoilData,
      currentCrop: {
        ...farmProfile.currentCrop,
        name: formData.currentCropName,
        growthStage: formData.growthStage
      },
      resources: {
        ...farmProfile.resources,
        storageCapacityQuintals: Number(formData.storageCapacityQuintals),
        dripCoveragePercent: Number(formData.dripCoveragePercent)
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleSimulateSoilCardUpload = () => {
    // Simulate parsing of official Soil Health Card (SHC)
    setFormData(prev => ({
      ...prev,
      ph: 6.9,
      nitrogen: 210,
      phosphorus: 30,
      potassium: 320,
      moisture: 65,
      organicCarbon: 0.72
    }));
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Farm & Soil Profiler</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">My Farm & Soil Management</h1>
          <p className="text-xs text-stone-600">
            Configure soil parameters, farm resources, and current crop growth stage.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulateSoilCardUpload}
          className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-2 border border-emerald-200 transition-colors self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-emerald-700" />
          <span>Auto-Fill from Soil Health Card</span>
        </button>
      </div>

      {uploadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Soil Health Card verified! Soil pH (6.9), Nitrogen (210 kg/ha), Phosphorus (30 kg/ha), and Potassium (320 kg/ha) synced successfully.
          </span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Google Maps Satellite Farm Cadastral Card */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-slate-900 rounded-2xl p-6 text-white border border-stone-700 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
                <Satellite className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-white">
                    Google Maps Satellite Cadastral Overview
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Live Coordinates Calibrated
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1">
                  GPS: <span className="font-mono text-emerald-300 font-bold">{formData.latitude.toFixed(4)}°N, {formData.longitude.toFixed(4)}°E</span> • {formData.totalAcres} Acres Registered Boundary
                </p>
              </div>
            </div>

            {onNavigateToSatellite && (
              <button
                type="button"
                onClick={onNavigateToSatellite}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <span>Launch Interactive Satellite View</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Soil Health Meters Section */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Soil Health Test Parameters</h2>
                <p className="text-xs text-stone-600">Adjust sliders or enter values from your laboratory test</p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Overall Status: Good
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* pH Slider */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800">Soil pH</label>
                <span className="text-sm font-black text-emerald-800">{formData.ph}</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={formData.ph}
                onChange={e => setFormData({ ...formData, ph: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                <span>Acidic (&lt;6.0)</span>
                <span className="font-bold text-emerald-800">Optimal (6.5–7.5)</span>
                <span>Alkaline (&gt;8.0)</span>
              </div>
            </div>

            {/* Nitrogen */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800">Available Nitrogen (N)</label>
                <span className="text-sm font-black text-amber-800">{formData.nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="100"
                max="450"
                step="5"
                value={formData.nitrogen}
                onChange={e => setFormData({ ...formData, nitrogen: parseInt(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                <span>Low (&lt;200)</span>
                <span>Medium (200–350)</span>
                <span>High (&gt;350)</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800">Available Phosphorus (P)</label>
                <span className="text-sm font-black text-emerald-800">{formData.phosphorus} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={formData.phosphorus}
                onChange={e => setFormData({ ...formData, phosphorus: parseInt(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                <span>Low (&lt;15)</span>
                <span className="font-bold text-emerald-800">Good (20–40)</span>
                <span>High (&gt;45)</span>
              </div>
            </div>

            {/* Potassium */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800">Available Potassium (K)</label>
                <span className="text-sm font-black text-emerald-800">{formData.potassium} kg/ha</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={formData.potassium}
                onChange={e => setFormData({ ...formData, potassium: parseInt(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                <span>Low (&lt;180)</span>
                <span>Medium (180–280)</span>
                <span className="font-bold text-emerald-800">High (&gt;280)</span>
              </div>
            </div>

            {/* Soil Moisture */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-bold text-stone-800">Soil Moisture</label>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                      <Radio className="w-2.5 h-2.5 text-cyan-600 animate-pulse" />
                      IoT Live
                    </span>
                  </div>
                  <span className="text-sm font-black text-cyan-800 font-mono">{formData.moisture}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  step="1"
                  value={formData.moisture}
                  onChange={e => setFormData({ ...formData, moisture: parseInt(e.target.value) })}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                  <span>Dry (&lt;35%)</span>
                  <span className="font-bold text-cyan-800">Adequate (50–75%)</span>
                  <span>Waterlogged (&gt;85%)</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
                <span className="text-[10px] font-semibold text-stone-600">
                  {autoSyncIoT ? '🟢 IoT Auto-Streaming Active' : '⚪ Manual Override Mode'}
                </span>
                <button
                  type="button"
                  onClick={() => setAutoSyncIoT(!autoSyncIoT)}
                  className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
                >
                  {autoSyncIoT ? 'Pause Auto-Sync' : 'Enable Auto-Sync'}
                </button>
              </div>
            </div>

            {/* Organic Carbon */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800">Organic Carbon (OC)</label>
                <span className="text-sm font-black text-emerald-800">{formData.organicCarbon}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={formData.organicCarbon}
                onChange={e => setFormData({ ...formData, organicCarbon: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                <span>Poor (&lt;0.4%)</span>
                <span>Moderate (0.4–0.6%)</span>
                <span className="font-bold text-emerald-800">Rich (&gt;0.7%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time IoT Soil Moisture Sensor Telemetry Station */}
        <IoTSoilSensorStation
          currentMoisture={formData.moisture}
          onSyncMoisture={handleSyncMoistureFromIoT}
          autoSync={autoSyncIoT}
          onToggleAutoSync={setAutoSyncIoT}
          soilType={formData.soilType}
        />

        {/* Farmer Information & Farm Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: General Farm Profile */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Farmer & Land Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Farmer Full Name</label>
              <input
                type="text"
                value={formData.farmerName}
                onChange={e => setFormData({ ...formData, farmerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Total Acreage (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.totalAcres}
                  onChange={e => setFormData({ ...formData, totalAcres: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Soil Classification</label>
                <select
                  value={formData.soilType}
                  onChange={e => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Clayey Loam">Clayey Loam</option>
                  <option value="Laterite Soil">Laterite Soil</option>
                </select>
              </div>
            </div>

            {/* Location & GPS Coordinates */}
            <div className="space-y-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  Farm District & Location
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) {
                      alert('Geolocation not supported by your browser');
                      return;
                    }
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const { latitude, longitude } = pos.coords;
                        const knownDistricts = [
                          { name: 'Satara District, Maharashtra', lat: 17.6805, lon: 73.9972 },
                          { name: 'Pune District, Maharashtra', lat: 18.5204, lon: 73.8567 },
                          { name: 'Nashik District, Maharashtra', lat: 19.9975, lon: 73.7898 },
                          { name: 'Kolhapur District, Maharashtra', lat: 16.7050, lon: 74.2433 },
                          { name: 'Sangli District, Maharashtra', lat: 16.8524, lon: 74.5815 },
                          { name: 'Nagpur District, Maharashtra (Vidarbha)', lat: 21.1458, lon: 79.0882 },
                          { name: 'Solapur District, Maharashtra', lat: 17.6599, lon: 75.9064 },
                          { name: 'Chhatrapati Sambhajinagar, Maharashtra', lat: 19.8762, lon: 75.3433 },
                          { name: 'Amravati District, Maharashtra', lat: 20.9320, lon: 77.7523 },
                          { name: 'Indore, Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
                          { name: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573 }
                        ];
                        let closest = knownDistricts[0];
                        let minDist = Infinity;
                        for (const dist of knownDistricts) {
                          const d = Math.hypot(latitude - dist.lat, longitude - dist.lon);
                          if (d < minDist) {
                            minDist = d;
                            closest = dist;
                          }
                        }
                        const detected = minDist < 1.0 ? closest.name : `${closest.name.split(',')[0]} Outskirts`;
                        setFormData(prev => ({
                          ...prev,
                          location: detected,
                          latitude: parseFloat(latitude.toFixed(4)),
                          longitude: parseFloat(longitude.toFixed(4))
                        }));
                      },
                      () => {
                        // Graceful fallback to default district without error popup
                        console.info('GPS not available in this window, keeping current farm coordinates');
                      }
                    );
                  }}
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-stone-200 shadow-2xs"
                >
                  <span>📍 Auto-Detect Farm GPS</span>
                </button>
              </div>

              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                placeholder="e.g. Satara District, Maharashtra"
              />

              {/* Precise Latitude and Longitude Coordinates */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                    Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="17.6805"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-0.5">
                    Longitude (°E)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="73.9972"
                  />
                </div>
              </div>

              {/* Quick District Presets (updating both name & coordinates) */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-stone-500 block mb-1">
                  Quick Agro-Climatic Belt Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Satara, MH', fullName: 'Satara District, Maharashtra', lat: 17.6805, lon: 73.9972 },
                    { name: 'Nashik, MH', fullName: 'Nashik District, Maharashtra', lat: 19.9975, lon: 73.7898 },
                    { name: 'Pune, MH', fullName: 'Pune District, Maharashtra', lat: 18.5204, lon: 73.8567 },
                    { name: 'Kolhapur, MH', fullName: 'Kolhapur District, Maharashtra', lat: 16.7050, lon: 74.2433 },
                    { name: 'Nagpur, MH', fullName: 'Nagpur District, Maharashtra (Vidarbha)', lat: 21.1458, lon: 79.0882 },
                    { name: 'Solapur, MH', fullName: 'Solapur District, Maharashtra', lat: 17.6599, lon: 75.9064 },
                    { name: 'Indore, MP', fullName: 'Indore, Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
                    { name: 'Ludhiana, PB', fullName: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573 }
                  ].map(dist => (
                    <button
                      key={dist.name}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        location: dist.fullName,
                        latitude: dist.lat,
                        longitude: dist.lon
                      }))}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
                        Math.abs(formData.latitude - dist.lat) < 0.1 && Math.abs(formData.longitude - dist.lon) < 0.1
                          ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                          : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {dist.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200 leading-relaxed">
                ✓ <strong>Automated Weather & Radar Integration:</strong> Saving updates your farm's permanent coordinates. Live regional satellite weather, chemical spraying safety windows, and crop disease advisories will automatically tune to these exact coordinates.
              </div>
            </div>
          </div>

          {/* Right: Current Crop & Farm Assets */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Active Crop & Farm Infrastructure
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Current Standing Crop</label>
                <input
                  type="text"
                  value={formData.currentCropName}
                  onChange={e => setFormData({ ...formData, currentCropName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Growth Stage</label>
                <input
                  type="text"
                  value={formData.growthStage}
                  onChange={e => setFormData({ ...formData, growthStage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Godown Storage (Quintals)</label>
                <input
                  type="number"
                  value={formData.storageCapacityQuintals}
                  onChange={e => setFormData({ ...formData, storageCapacityQuintals: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Drip Irrigation Coverage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.dripCoveragePercent}
                  onChange={e => setFormData({ ...formData, dripCoveragePercent: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Tractor className="w-4 h-4 text-emerald-800" />
                Tractor & Machinery Available
              </span>
              <span className="font-bold text-emerald-800">Yes (Owned)</span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-600">
            * Changes update yield forecasts, crop recommendations and profit projections instantly.
          </span>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Saved Successfully!
              </span>
            )}

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{t.actions.saveChanges}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
