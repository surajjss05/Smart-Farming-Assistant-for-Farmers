import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import {
  Satellite,
  Layers,
  MapPin,
  Compass,
  Maximize2,
  Minimize2,
  Eye,
  Activity,
  Droplets,
  Sprout,
  Sun,
  Truck,
  RotateCcw,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sliders,
  Crosshair,
  Navigation,
  Search,
  Check,
  X,
  AlertCircle,
  LocateFixed,
  HelpCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { FarmProfile, Language } from '../types/farm';
import { translations } from '../i18n/translations';

interface FarmSatelliteViewProps {
  farmProfile: FarmProfile;
  language: Language;
  onNavigateToCropHealth?: () => void;
  onNavigateToWeather?: () => void;
  onUpdateLocation?: (
    newLoc: string,
    coords?: { latitude: number; longitude: number },
    saveToFarm?: boolean
  ) => Promise<void> | void;
}

// Google Maps API Key retrieved from environment or provisioned demo key
const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyAfsQZG7VhW0Ir2jP7PTr-DQhE3Tf5sCNE';

// Map controller helper to smoothly pan/zoom or fit viewport
function MapController({
  center,
  zoom,
  viewport
}: {
  center: { lat: number; lng: number };
  zoom: number;
  viewport?: any;
}) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      if (viewport) {
        map.fitBounds(viewport);
      } else {
        map.panTo(center);
        map.setZoom(zoom);
      }
    }
  }, [map, center, zoom, viewport]);
  return null;
}

// Convert Decimal Degrees to DMS format
function toDMS(deg: number, isLatitude: boolean): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(1);
  const direction = isLatitude ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

// Haversine distance in meters
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Regional agricultural farming clusters for fast jump
const REGIONAL_CLUSTERS = [
  { name: 'Satara (Krishna-Venna River Belt)', lat: 17.6805, lng: 73.9972, region: 'Western Maharashtra Sugarcane' },
  { name: 'Baramati (Nira Basin)', lat: 18.1517, lng: 74.5772, region: 'Pune Precision Agro-Zone' },
  { name: 'Karad (Koyna Sangam)', lat: 17.2885, lng: 74.1844, region: 'Sugarcane & Rice Fertile Belt' },
  { name: 'Phaltan (Banganga Valley)', lat: 17.9856, lng: 74.4338, region: 'Dairy & Horticulture Corridor' },
  { name: 'Wai (Krishna Valley Foothills)', lat: 17.9493, lng: 73.8920, region: 'Strawberry & Turmeric Zone' },
  { name: 'Nashik (Godavari Valley)', lat: 19.9975, lng: 73.7898, region: 'Grape & Onion Horticulture Belt' },
  { name: 'Kolhapur (Panchganga Basin)', lat: 16.7050, lng: 74.2433, region: 'High-Yield Heavy Black Soil Cane' },
  { name: 'Sangli (Walwa-Miraj Corridor)', lat: 16.8524, lng: 74.5815, region: 'Turmeric & Sugarcane Belt' },
  { name: 'Indore / Malwa (Nimar Basin)', lat: 22.7196, lng: 75.8577, region: 'Black Soil Soybean & Wheat' }
];

// Dedicated Google Maps Autocomplete Search Bar Component
interface PlaceAutocompleteBarProps {
  onPlaceSelect: (place: { lat: number; lng: number; name: string; viewport?: any }) => void;
  placeholder?: string;
  className?: string;
  isFloating?: boolean;
}

const PlaceAutocompleteBar: React.FC<PlaceAutocompleteBarProps> = ({
  onPlaceSelect,
  placeholder = 'Search fields, villages, APMC mandis, or landmarks (e.g. Satara, Baramati, Karad)...',
  className = '',
  isFloating = false
}) => {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Initialize Google Maps Places Autocomplete
  useEffect(() => {
    if (!places || !inputRef.current) return;

    try {
      const autocomplete = new (places as any).Autocomplete(inputRef.current, {
        fields: ['geometry', 'name', 'formatted_address', 'place_id'],
        types: ['geocode', 'establishment']
      });

      autocompleteRef.current = autocomplete;

      const listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.geometry && place.geometry.location) {
          const lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
          const lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
          const name = place.formatted_address || place.name || 'Searched Location';
          const viewport = place.geometry.viewport || null;
          setInputValue(name);
          onPlaceSelect({ lat, lng, name, viewport });
        }
      });

      return () => {
        const googleObj = (window as any).google;
        if (listener && googleObj?.maps?.event) {
          googleObj.maps.event.removeListener(listener);
        }
      };
    } catch (e) {
      console.warn('Google Places Autocomplete initialization deferred:', e);
    }
  }, [places, onPlaceSelect]);

  // Handle manual Enter key submission via Geocoder fallback
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = inputValue.trim();
      if (!query) return;

      // Check if user entered direct lat, lng (e.g. "17.6805, 73.9972")
      const coordsMatch = query.match(/^([-+]?[0-9]*\.?[0-9]+)\s*,\s*([-+]?[0-9]*\.?[0-9]+)$/);
      if (coordsMatch) {
        const lat = parseFloat(coordsMatch[1]);
        const lng = parseFloat(coordsMatch[2]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          onPlaceSelect({ lat, lng, name: `Coordinates (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)` });
          return;
        }
      }

      // Check if query matches a regional cluster name
      const cluster = REGIONAL_CLUSTERS.find(
        (c) => c.name.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
      );
      if (cluster) {
        onPlaceSelect({ lat: cluster.lat, lng: cluster.lng, name: cluster.name });
        return;
      }

      // Geocoder fallback
      const googleObj = (window as any).google;
      if (googleObj?.maps?.Geocoder) {
        setIsSearching(true);
        const geocoder = new googleObj.maps.Geocoder();
        geocoder.geocode({ address: query }, (results: any, status: any) => {
          setIsSearching(false);
          if (status === 'OK' && results && results[0]?.geometry?.location) {
            const loc = results[0].geometry.location;
            const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
            const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
            const name = results[0].formatted_address || query;
            const viewport = results[0]?.geometry?.viewport || null;
            setInputValue(name);
            onPlaceSelect({ lat, lng, name, viewport });
          }
        });
      }
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 text-emerald-600 pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4 stroke-[2.5]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm font-medium rounded-2xl border shadow-xs outline-none transition-all placeholder:text-stone-400 ${
            isFloating
              ? 'bg-stone-900 text-white border-stone-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20'
              : 'bg-stone-50 hover:bg-white focus:bg-white text-stone-900 border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          }`}
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                isFloating
                  ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-200'
              }`}
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleKeyDown({ key: 'Enter', preventDefault: () => {} } as any)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1"
          >
            <span>{isSearching ? 'Finding...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Quick agricultural hub chips */}
      {!isFloating && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] text-stone-600 font-semibold scrollbar-none">
          <span className="text-stone-400 shrink-0 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Popular Hubs:
          </span>
          {['Satara', 'Baramati', 'Karad', 'Wai', 'Phaltan', 'Nashik', 'Kolhapur', 'Sangli'].map((hubName) => {
            const matched = REGIONAL_CLUSTERS.find((c) => c.name.startsWith(hubName));
            if (!matched) return null;
            return (
              <button
                key={hubName}
                type="button"
                onClick={() => {
                  setInputValue(matched.name);
                  onPlaceSelect({ lat: matched.lat, lng: matched.lng, name: matched.name });
                }}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 border border-stone-200 transition-colors cursor-pointer"
              >
                {hubName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Internal View implementation rendered inside APIProvider
const FarmSatelliteViewContent: React.FC<FarmSatelliteViewProps> = ({
  farmProfile,
  language,
  onNavigateToCropHealth,
  onNavigateToWeather,
  onUpdateLocation
}) => {
  const t = translations[language];

  // Active farm center coordinates
  const initialLat = farmProfile.coordinates?.latitude || 17.6805;
  const initialLng = farmProfile.coordinates?.longitude || 73.9972;

  const [centerLat, setCenterLat] = useState<number>(initialLat);
  const [centerLng, setCenterLng] = useState<number>(initialLng);

  // Sync if farmProfile coordinates change from outside
  useEffect(() => {
    if (farmProfile.coordinates?.latitude && farmProfile.coordinates?.longitude) {
      setCenterLat(farmProfile.coordinates.latitude);
      setCenterLng(farmProfile.coordinates.longitude);
      setCurrentCenter({
        lat: farmProfile.coordinates.latitude,
        lng: farmProfile.coordinates.longitude
      });
    }
  }, [farmProfile.coordinates?.latitude, farmProfile.coordinates?.longitude]);

  const farmCenter = useMemo(() => ({ lat: centerLat, lng: centerLng }), [centerLat, centerLng]);

  // Map state
  const [mapTypeId, setMapTypeId] = useState<'hybrid' | 'satellite' | 'terrain' | 'roadmap'>('hybrid');
  const [zoomLevel, setZoomLevel] = useState<number>(17);
  const [mapViewport, setMapViewport] = useState<any>(null);
  const [currentCenter, setCurrentCenter] = useState(farmCenter);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Overlay layer toggles
  const [showPlotBoundaries, setShowPlotBoundaries] = useState(true);
  const [showSensorsAndPins, setShowSensorsAndPins] = useState(true);
  const [showNdviSimulation, setShowNdviSimulation] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState<string | null>('pin-main-farm');

  // Inspection tool state
  const [inspectedPoint, setInspectedPoint] = useState<{
    lat: number;
    lng: number;
    distanceMeters: number;
  } | null>(null);

  // Accurate Location Picker & User Live Location States
  const [isPrecisionPickerMode, setIsPrecisionPickerMode] = useState<boolean>(false);
  const [proposedLocation, setProposedLocation] = useState<{
    lat: number;
    lng: number;
    source: 'gps' | 'map-click' | 'search' | 'preset';
    name?: string;
  } | null>(null);

  const [userLiveLocation, setUserLiveLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: number;
  } | null>(null);

  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLng, setManualLng] = useState<string>('');
  const [coordinateFormat, setCoordinateFormat] = useState<'decimal' | 'dms'>('decimal');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Calculate plot boundaries relative to current center
  const dLat = 0.0011;
  const dLng = 0.0012;

  // Farm infrastructure markers dynamically calibrated to centerLat and centerLng
  const farmPointsOfInterest = useMemo(() => [
    {
      id: 'pin-main-farm',
      title: `${farmProfile.farmerName}'s Farm Homestead`,
      category: 'Headquarters',
      icon: 'sprout',
      position: { lat: centerLat, lng: centerLng },
      desc: `Main farmhouse, solar battery bank, and farm control office for ${farmProfile.totalAcres} Acres.`,
      status: 'Active • Primary',
      badgeColor: 'bg-emerald-600'
    },
    {
      id: 'pin-pump-station',
      title: 'Solar Drip Irrigation Pump Station #1',
      category: 'Irrigation',
      icon: 'droplets',
      position: { lat: centerLat + dLat * 0.5, lng: centerLng + dLng * 0.6 },
      desc: '7.5 HP Solar Submersible Borewell connected to 12-zone automated drip manifold.',
      status: 'Pressure 2.4 bar • Flowing',
      badgeColor: 'bg-sky-600'
    },
    {
      id: 'pin-weather-station',
      title: 'Micro-Climate Telemetry Station Node',
      category: 'Weather',
      icon: 'sun',
      position: { lat: centerLat - dLat * 0.4, lng: centerLng + dLng * 0.5 },
      desc: 'Live ultrasonic anemometer, pyranometer (19.4 MJ/m²), and leaf wetness sensor.',
      status: 'Sync Live: 100% Signal',
      badgeColor: 'bg-amber-600'
    },
    {
      id: 'pin-soil-sensor',
      title: 'Root-Zone Soil Sensor Station (Pit B)',
      category: 'Soil Health',
      icon: 'activity',
      position: { lat: centerLat - dLat * 0.5, lng: centerLng - dLng * 0.4 },
      desc: `NPK Spectrometry probe (pH ${farmProfile.soilData.ph}, Soil Moisture ${farmProfile.soilData.moisture}% at 15cm depth).`,
      status: 'Optimal Root Turgor',
      badgeColor: 'bg-teal-600'
    },
    {
      id: 'pin-loading-dock',
      title: 'Farm Gate & Mandi Loading Bay',
      category: 'Logistics',
      icon: 'truck',
      position: { lat: centerLat + dLat * 0.8, lng: centerLng - dLng * 0.7 },
      desc: 'Direct paved access road connecting to regional mandi transport corridor.',
      status: 'E-Way Clearance Ready',
      badgeColor: 'bg-indigo-600'
    }
  ], [centerLat, centerLng, dLat, dLng, farmProfile]);

  // Recenter map to current farm center
  const handleRecenter = useCallback(() => {
    setCurrentCenter({ lat: centerLat, lng: centerLng });
    setZoomLevel(17);
    setInspectedPoint(null);
  }, [centerLat, centerLng]);

  // Autocomplete Selection Handler: Automatically updates map center & farm profile coordinates
  const handlePlaceSelect = useCallback(
    async ({ lat, lng, name, viewport }: { lat: number; lng: number; name: string; viewport?: any }) => {
      setCenterLat(lat);
      setCenterLng(lng);
      setCurrentCenter({ lat, lng });
      if (viewport) {
        setMapViewport(viewport);
      } else {
        setZoomLevel(18); // Close satellite view for accurate field inspection
        setMapViewport(null);
      }
      setProposedLocation(null);
      setIsPrecisionPickerMode(false);
      setInspectedPoint(null);

      setLocationStatusMessage(`📍 Map centered & farm profile coordinates updated to: ${name} (${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E)`);

      // Automatically update farm profile location and coordinates
      if (onUpdateLocation) {
        try {
          await onUpdateLocation(name, { latitude: lat, longitude: lng }, true);
        } catch (err) {
          console.error('Failed to update farm profile with new location:', err);
        }
      }
    },
    [onUpdateLocation]
  );

  // Handle map click
  const handleMapClick = useCallback((e: any) => {
    if (e.detail?.latLng) {
      const clickedLat = e.detail.latLng.lat;
      const clickedLng = e.detail.latLng.lng;

      if (isPrecisionPickerMode) {
        setProposedLocation({
          lat: clickedLat,
          lng: clickedLng,
          source: 'map-click',
          name: `Point (${clickedLat.toFixed(4)}°N, ${clickedLng.toFixed(4)}°E)`
        });
        setCurrentCenter({ lat: clickedLat, lng: clickedLng });
        setInspectedPoint(null);
      } else {
        const distance = getDistanceMeters(centerLat, centerLng, clickedLat, clickedLng);
        setInspectedPoint({
          lat: clickedLat,
          lng: clickedLng,
          distanceMeters: distance
        });
      }
    }
  }, [isPrecisionPickerMode, centerLat, centerLng]);

  // Trigger HTML5 High-Accuracy GPS Geolocation with zero-friction fallback
  const handleLocateUser = useCallback(() => {
    setIsLocatingUser(true);
    setLocationStatusMessage('Acquiring location...');

    const fallbackToPrecisionMode = async () => {
      setIsLocatingUser(false);
      setIsPrecisionPickerMode(true);

      // Attempt gentle IP-based network geolocation fallback
      try {
        const res = await fetch('https://ipapi.co/json/').catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            const ipLat = parseFloat(data.latitude);
            const ipLng = parseFloat(data.longitude);
            const cityName = data.city || data.region || 'Your Area';
            setCurrentCenter({ lat: ipLat, lng: ipLng });
            setZoomLevel(16);
            setLocationStatusMessage(
              `📍 Centered near ${cityName}. Click directly on your field on the satellite map to pinpoint your exact farm location!`
            );
            return;
          }
        }
      } catch {
        // Fallback silently
      }

      setLocationStatusMessage(
        '🎯 Precision Pinpoint Active: Click anywhere on the satellite imagery or use the search bar above to choose your exact field location.'
      );
    };

    if (!navigator.geolocation) {
      void fallbackToPrecisionMode();
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocatingUser(false);
          const { latitude, longitude, accuracy } = position.coords;
          setUserLiveLocation({
            lat: latitude,
            lng: longitude,
            accuracy: Math.round(accuracy),
            timestamp: position.timestamp
          });

          setProposedLocation({
            lat: latitude,
            lng: longitude,
            source: 'gps',
            name: `GPS Fix (Accuracy ±${Math.round(accuracy)}m)`
          });

          setCurrentCenter({ lat: latitude, lng: longitude });
          setZoomLevel(18);
          setLocationStatusMessage(`✅ GPS location locked! Accuracy: ±${Math.round(accuracy)} meters.`);
        },
        () => {
          // If browser location permission is restricted in this window, seamlessly fallback without showing error
          void fallbackToPrecisionMode();
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 0
        }
      );
    } catch {
      void fallbackToPrecisionMode();
    }
  }, []);

  // Save proposed accurate location as official farm location
  const handleConfirmSaveLocation = async () => {
    if (!proposedLocation) return;
    setIsSaving(true);
    try {
      const newLat = proposedLocation.lat;
      const newLng = proposedLocation.lng;

      setCenterLat(newLat);
      setCenterLng(newLng);
      setCurrentCenter({ lat: newLat, lng: newLng });

      const locName = proposedLocation.name || `${farmProfile.farmerName}'s Field, ${farmProfile.state}`;

      if (onUpdateLocation) {
        await onUpdateLocation(
          locName,
          { latitude: newLat, longitude: newLng },
          true
        );
      }

      setLocationStatusMessage(`Farm location successfully updated and calibrated to ${newLat.toFixed(5)}°N, ${newLng.toFixed(5)}°E!`);
      setProposedLocation(null);
      setIsPrecisionPickerMode(false);
    } catch (err) {
      console.error('Error saving location:', err);
      setLocationStatusMessage('Failed to save location. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const proposedDistanceDelta = useMemo(() => {
    if (!proposedLocation) return 0;
    return getDistanceMeters(centerLat, centerLng, proposedLocation.lat, proposedLocation.lng);
  }, [centerLat, centerLng, proposedLocation]);

  const userDistanceToFarm = useMemo(() => {
    if (!userLiveLocation) return null;
    return getDistanceMeters(centerLat, centerLng, userLiveLocation.lat, userLiveLocation.lng);
  }, [centerLat, centerLng, userLiveLocation]);

  return (
    <div className={`space-y-5 pb-12 ${isFullscreen ? 'fixed inset-0 z-50 bg-stone-900 p-4 space-y-3 overflow-y-auto' : ''}`}>
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 shrink-0">
              <Satellite className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  High-Resolution Farm Satellite View
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-sky-600" />
                  Google Maps Satellite Engine
                </span>
                {userLiveLocation && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-emerald-600" />
                    Live GPS Active (±{userLiveLocation.accuracy}m)
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-stone-900">{farmProfile.location}</span>
                <span>•</span>
                <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-bold">
                  {coordinateFormat === 'decimal'
                    ? `${centerLat.toFixed(5)}°N, ${centerLng.toFixed(5)}°E`
                    : `${toDMS(centerLat, true)}, ${toDMS(centerLng, false)}`}
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">{farmProfile.totalAcres} Acres Parcel Boundary</span>
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleLocateUser}
              disabled={isLocatingUser}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                isLocatingUser
                  ? 'bg-sky-200 text-sky-900 cursor-wait'
                  : 'bg-sky-500 hover:bg-sky-400 text-white'
              }`}
              title="Detect your exact physical GPS location via device sensors"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : ''}`} />
              <span>{isLocatingUser ? 'Acquiring GPS...' : '📍 Use My Live GPS'}</span>
            </button>

            <button
              onClick={() => {
                const nextMode = !isPrecisionPickerMode;
                setIsPrecisionPickerMode(nextMode);
                if (nextMode) {
                  setLocationStatusMessage('🎯 Precision Pinpoint Mode Active: Click directly anywhere on your fields below to place the pin, or search your village above.');
                } else {
                  setLocationStatusMessage(null);
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPrecisionPickerMode
                  ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-400/50 shadow-md font-black'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
              title="Click anywhere on the satellite view to pinpoint your exact farm location"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isPrecisionPickerMode ? '🎯 Pinning Mode ON' : '🎯 Choose Accurate Location'}</span>
            </button>

            <button
              onClick={handleRecenter}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Recenter camera on saved farm coordinates"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
              <span>Recenter</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Toggle Fullscreen Map Mode"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Full Map'}</span>
            </button>
          </div>
        </div>

        {/* Integrated Google Maps Places Autocomplete Search Bar */}
        <div className="pt-2 border-t border-stone-100">
          <PlaceAutocompleteBar onPlaceSelect={handlePlaceSelect} />
        </div>

        {/* Status Message / Notification */}
        {locationStatusMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{locationStatusMessage}</span>
            </div>
            <button
              onClick={() => setLocationStatusMessage(null)}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Map Control Toolbar */}
        <div className="pt-3 border-t border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-3 flex-wrap">
          {/* Map Type Mode Buttons */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
            <span className="text-stone-500 text-[11px] px-2 font-medium">Layer:</span>
            <button
              onClick={() => setMapTypeId('hybrid')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapTypeId === 'hybrid'
                  ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-300 font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🛰️ Hybrid (Satellite + Roads)
            </button>

            <button
              onClick={() => setMapTypeId('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapTypeId === 'satellite'
                  ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-300 font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📷 Pure Satellite
            </button>

            <button
              onClick={() => setMapTypeId('terrain')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapTypeId === 'terrain'
                  ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-300 font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ⛰️ Terrain Relief
            </button>

            <button
              onClick={() => setMapTypeId('roadmap')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                mapTypeId === 'roadmap'
                  ? 'bg-white text-emerald-900 shadow-xs ring-1 ring-emerald-300 font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🗺️ Standard Road
            </button>
          </div>

          {/* Toggleable Overlays */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => setShowPlotBoundaries(!showPlotBoundaries)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1.5 ${
                showPlotBoundaries
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Plot Boundaries</span>
            </button>

            <button
              onClick={() => setShowSensorsAndPins(!showSensorsAndPins)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1.5 ${
                showSensorsAndPins
                  ? 'bg-sky-50 border-sky-300 text-sky-900'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-sky-600" />
              <span>Infrastructure Pins</span>
            </button>

            <button
              onClick={() => setShowNdviSimulation(!showNdviSimulation)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1.5 ${
                showNdviSimulation
                  ? 'bg-lime-100 border-lime-400 text-lime-950 ring-2 ring-lime-400/30'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title="Display NDVI Crop Canopy Health Heatmap"
            >
              <Activity className="w-3.5 h-3.5 text-lime-700" />
              <span>NDVI Canopy Health</span>
            </button>

            <button
              onClick={() => setCoordinateFormat(coordinateFormat === 'decimal' ? 'dms' : 'decimal')}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[11px] font-bold border border-stone-200"
              title="Toggle Decimal Degrees / DMS format"
            >
              {coordinateFormat === 'decimal' ? 'DMS Format' : 'Decimal Format'}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Pending Accurate Location Confirmation Banner */}
      {proposedLocation && (
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-emerald-950 text-white p-4 rounded-2xl border-2 border-amber-400 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-bold shadow-md">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <span>Accurate Farm Location Selected</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono">
                  {proposedDistanceDelta > 0 ? `Δ ${proposedDistanceDelta}m from current center` : 'Exact Center'}
                </span>
              </div>
              <div className="text-sm font-black text-white mt-0.5 flex items-center gap-2 flex-wrap">
                <span>{proposedLocation.lat.toFixed(5)}°N, {proposedLocation.lng.toFixed(5)}°E</span>
                <span className="text-xs font-normal text-stone-300">
                  ({toDMS(proposedLocation.lat, true)}, {toDMS(proposedLocation.lng, false)})
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-0.5">
                Saving will recalibrate your 15.5-acre boundary, irrigation pump coordinates, and weather telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleConfirmSaveLocation}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSaving ? 'Calibrating...' : '💾 Set as Official Farm Location'}</span>
            </button>

            <button
              onClick={() => {
                setProposedLocation(null);
                setIsPrecisionPickerMode(false);
                handleRecenter();
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 border border-white/20 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-300 shadow-lg bg-stone-900" style={{ height: isFullscreen ? 'calc(100vh - 230px)' : '620px' }}>
        <Map
          internalUsageAttributionIds={['gmp_git_agentskills_v1']}
          mapId="DEMO_MAP_ID"
          defaultCenter={farmCenter}
          defaultZoom={17}
          mapTypeId={mapTypeId}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
          className="w-full h-full"
        >
          <MapController center={currentCenter} zoom={zoomLevel} viewport={mapViewport} />

          {/* Floating Search Bar in Fullscreen Mode */}
          {isFullscreen && (
            <div className="absolute top-4 left-4 z-20 w-80 sm:w-96 shadow-2xl backdrop-blur-md bg-stone-900/90 rounded-2xl p-2.5 border border-stone-700 animate-fadeIn">
              <PlaceAutocompleteBar
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search field, village or APMC..."
                isFloating
              />
            </div>
          )}

          {/* Crosshair Cursor Indicator if Precision Picker Mode is Active */}
          {isPrecisionPickerMode && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-400/90 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
            </div>
          )}

          {/* Simulated NDVI Canopy Vegetative Health Overlay */}
          {showNdviSimulation && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="w-[380px] h-[340px] rounded-full bg-radial from-emerald-500/40 via-lime-400/30 to-transparent blur-md mix-blend-screen animate-pulse pointer-events-none" />
            </div>
          )}

          {/* Proposed Accurate Location Marker */}
          {proposedLocation && (
            <AdvancedMarker
              position={{ lat: proposedLocation.lat, lng: proposedLocation.lng }}
              title="Proposed Accurate Farm Center"
            >
              <div className="cursor-pointer flex flex-col items-center animate-bounce">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-2xl ring-4 ring-white">
                  <Crosshair className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="mt-1 px-2.5 py-1 rounded-md bg-stone-950 text-amber-300 text-[11px] font-black shadow-lg border border-amber-400 whitespace-nowrap">
                  🎯 Accurate Pinpoint
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* User Real-Time Live GPS Marker (Device Location) */}
          {userLiveLocation && (
            <AdvancedMarker
              position={{ lat: userLiveLocation.lat, lng: userLiveLocation.lng }}
              title={`Your Live Device Position (Accuracy ±${userLiveLocation.accuracy}m)`}
              onClick={() => {
                setLocationStatusMessage(`You are approximately ${userDistanceToFarm ?? 0}m away from the farm center.`);
              }}
            >
              <div className="relative flex flex-col items-center cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-sky-500/30 animate-ping absolute -top-1" />
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-lg ring-3 ring-white relative z-10">
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded bg-sky-950/90 text-sky-200 text-[10px] font-mono font-bold shadow whitespace-nowrap border border-sky-400/40">
                  You Are Here (±{userLiveLocation.accuracy}m)
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* Farm Infrastructure Markers */}
          {showSensorsAndPins &&
            farmPointsOfInterest.map((poi) => {
              const isSelected = selectedPinId === poi.id;
              return (
                <AdvancedMarker
                  key={poi.id}
                  position={poi.position}
                  onClick={() => setSelectedPinId(poi.id)}
                  title={poi.title}
                >
                  <div className="group cursor-pointer flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform transform group-hover:scale-110 ring-2 ring-white/90 ${poi.badgeColor} ${
                        isSelected ? 'scale-125 ring-amber-400' : ''
                      }`}
                    >
                      {poi.icon === 'sprout' && <Sprout className="w-5 h-5" />}
                      {poi.icon === 'droplets' && <Droplets className="w-5 h-5" />}
                      {poi.icon === 'sun' && <Sun className="w-5 h-5" />}
                      {poi.icon === 'activity' && <Activity className="w-5 h-5" />}
                      {poi.icon === 'truck' && <Truck className="w-5 h-5" />}
                    </div>
                    <div className="mt-1 px-2 py-0.5 rounded-md bg-stone-900/90 text-white text-[10px] font-bold shadow-md whitespace-nowrap backdrop-blur-xs border border-white/20">
                      {poi.category}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

          {/* Info Window for Selected Marker */}
          {selectedPinId && (() => {
            const activePin = farmPointsOfInterest.find((p) => p.id === selectedPinId);
            if (!activePin) return null;
            return (
              <InfoWindow
                position={activePin.position}
                onCloseClick={() => setSelectedPinId(null)}
              >
                <div className="p-1 max-w-[260px] text-stone-900 font-sans">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {activePin.category}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-stone-900 leading-snug">
                    {activePin.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {activePin.desc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-700">{activePin.status}</span>
                    <span className="font-mono text-stone-500 text-[10px]">
                      {activePin.position.lat.toFixed(4)}°, {activePin.position.lng.toFixed(4)}°
                    </span>
                  </div>
                </div>
              </InfoWindow>
            );
          })()}

          {/* Click-to-Inspect Marker */}
          {inspectedPoint && !isPrecisionPickerMode && (
            <AdvancedMarker
              position={{ lat: inspectedPoint.lat, lng: inspectedPoint.lng }}
              onClick={() => setInspectedPoint(null)}
            >
              <div className="cursor-pointer flex flex-col items-center animate-bounce">
                <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded bg-rose-950 text-white text-[10px] font-mono font-bold whitespace-nowrap shadow">
                  {inspectedPoint.distanceMeters}m from Center
                </div>
              </div>
            </AdvancedMarker>
          )}
        </Map>

        {/* Precision Mode Active Top-Banner Overlay on Map */}
        {isPrecisionPickerMode && (
          <div className="absolute top-4 left-4 z-20 bg-amber-500 text-stone-950 px-4 py-2 rounded-2xl shadow-xl font-black text-xs flex items-center gap-2 border-2 border-white animate-pulse">
            <Crosshair className="w-4 h-4" />
            <span>Click anywhere on the satellite view to pinpoint your exact farm homestead!</span>
          </div>
        )}

        {/* Floating In-Map Overlays */}
        {/* Top-Right Crop Health Index HUD */}
        {showNdviSimulation && (
          <div className="absolute top-4 right-4 z-20 bg-stone-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/80 text-white shadow-xl text-xs space-y-2 max-w-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lime-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-lime-400" />
                <span>NDVI Satellite Vegetative Index</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-lime-950 text-lime-300 font-bold border border-lime-700">
                0.78 High
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              High chlorophyll reflectance detected across South & North Cane parcels. Minimal moisture stress.
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Healthy Canopy (84%)</span>
                <span className="text-lime-400 font-bold">Good Vigor</span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-lime-400 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Bottom-Left Cadastral Plot Legend */}
        {showPlotBoundaries && (
          <div className="absolute bottom-4 left-4 z-20 bg-stone-950/85 backdrop-blur-md p-3 rounded-2xl border border-stone-700/80 text-white shadow-xl text-xs space-y-2 max-w-xs">
            <div className="font-bold text-stone-200 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registered Field Parcels ({farmProfile.totalAcres} Acres)</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg border border-emerald-500/30">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                  <strong>Plot A (North)</strong>
                </span>
                <span className="text-emerald-300 font-mono">8.5 Ac • Cane</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg border border-lime-500/30">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-lime-400 inline-block" />
                  <strong>Plot B (South)</strong>
                </span>
                <span className="text-lime-300 font-mono">4.5 Ac • Soybean</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-lg border border-sky-500/30">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-400 inline-block" />
                  <strong>Plot C (East)</strong>
                </span>
                <span className="text-sky-300 font-mono">2.5 Ac • Pond & Poly</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom-Right Coordinates / Zoom Indicator */}
        <div className="absolute bottom-4 right-4 z-20 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-700 text-stone-300 text-[11px] font-mono flex items-center gap-3">
          <span>Zoom: {zoomLevel}x</span>
          <span>•</span>
          <span>Lat: {centerLat.toFixed(4)}°</span>
          <span>•</span>
          <span>Lng: {centerLng.toFixed(4)}°</span>
        </div>
      </div>

      {/* Farm Cadastral Parcel Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Plot A */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                Plot A • North Sector
              </span>
              <span className="text-xs font-black text-stone-900 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                8.5 Acres
              </span>
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">
              {farmProfile.currentCrop.name} ({farmProfile.currentCrop.variety})
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Main commercial standing parcel with automated sub-surface drip lateral network.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-500">Irrigation:</span>
            <span className="text-emerald-700">Solar Drip Connected</span>
          </div>
        </div>

        {/* Plot B */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-lime-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-lime-600" />
                Plot B • South Sector
              </span>
              <span className="text-xs font-black text-stone-900 bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200">
                4.5 Acres
              </span>
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">
              Soybean (JS-335) Crop Rotation
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Leguminous nitrogen-fixing rotation block; current pod-fill growth stage.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-500">Soil Moisture:</span>
            <span className="text-emerald-700">{farmProfile.soilData.moisture}% (Optimal)</span>
          </div>
        </div>

        {/* Plot C */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-600" />
                Plot C • East Sector
              </span>
              <span className="text-xs font-black text-stone-900 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                2.5 Acres
              </span>
            </div>
            <h3 className="font-extrabold text-stone-900 text-base">
              Farm Pond, Solar Station & Nursery
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Rainwater harvesting reservoir (85% storage capacity) and high-value vegetable polyhouse.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-500">Water Reservoir:</span>
            <span className="text-sky-700">85% Water Level</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exported Root View Wrapped in APIProvider with 'places' and 'marker' libraries
export const FarmSatelliteView: React.FC<FarmSatelliteViewProps> = (props) => {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker', 'places']}>
      <FarmSatelliteViewContent {...props} />
    </APIProvider>
  );
};
