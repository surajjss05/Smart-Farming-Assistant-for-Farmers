import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  Radio,
  Activity,
  RefreshCw,
  Cpu,
  Gauge,
  Zap,
  Play,
  Pause,
  Thermometer,
  Sliders,
  Send,
  BatteryCharging,
  Clock,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Droplets,
  HardDrive
} from 'lucide-react';

export interface IoTSoilTelemetryData {
  nodeId: string;
  nodeName: string;
  depth15cm: number;
  depth30cm: number;
  depth45cm: number;
  soilTempC: number;
  soilECDsm: number;
  batteryPercent: number;
  signalRssi: number;
  timestamp: string;
  status: 'Optimal' | 'Moisture Deficit' | 'Near Field Capacity' | 'Saturated';
}

interface IoTSoilSensorStationProps {
  currentMoisture: number;
  onSyncMoisture: (newMoisture: number) => void;
  autoSync: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
  soilType?: string;
}

const SENSOR_NODES = [
  {
    id: 'NODE-01',
    name: 'Plot A • Sugarcane Multi-Depth LoRa Probe',
    location: 'North Sector (Heavy Black Soil)',
    depthModel: 'Sentek Drill & Drop (15/30/45cm)',
    rssi: -64,
    battery: 95
  },
  {
    id: 'NODE-02',
    name: 'Plot B • Soybean Root-Zone Sensor',
    location: 'South Sector (Clayey Loam)',
    depthModel: 'METER Teros-12 SDI-12 Probe',
    rssi: -71,
    battery: 89
  },
  {
    id: 'NODE-03',
    name: 'Plot C • Polyhouse Raised-Bed Array',
    location: 'East Sector (Nursery & Polyhouse)',
    depthModel: 'Capacitive High-Res Moisture Node',
    rssi: -58,
    battery: 98
  }
];

export const IoTSoilSensorStation: React.FC<IoTSoilSensorStationProps> = ({
  currentMoisture,
  onSyncMoisture,
  autoSync,
  onToggleAutoSync,
  soilType = 'Black Cotton Soil (Regur)'
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('NODE-01');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [packetsReceived, setPacketsReceived] = useState<number>(142);
  const [lastPacketTime, setLastPacketTime] = useState<string>('Just now');
  const [activeScenario, setActiveScenario] = useState<
    'normal' | 'evaporation' | 'drip' | 'rain'
  >('normal');

  // Sensor telemetry state
  const [depth15, setDepth15] = useState<number>(currentMoisture || 62.4);
  const [depth30, setDepth30] = useState<number>(Math.min(95, (currentMoisture || 62.4) + 4.2));
  const [depth45, setDepth45] = useState<number>(Math.min(98, (currentMoisture || 62.4) + 7.5));
  const [soilTemp, setSoilTemp] = useState<number>(24.6);
  const [soilEC, setSoilEC] = useState<number>(1.14);
  const [battery, setBattery] = useState<number>(94);
  const [signalRssi, setSignalRssi] = useState<number>(-64);

  // History buffer for sparkline (last 12 readings)
  const [history, setHistory] = useState<Array<{ time: string; value: number }>>([
    { time: '10m', value: 61.2 },
    { time: '9m', value: 61.5 },
    { time: '8m', value: 61.8 },
    { time: '7m', value: 62.0 },
    { time: '6m', value: 62.2 },
    { time: '5m', value: 62.1 },
    { time: '4m', value: 62.5 },
    { time: '3m', value: 62.3 },
    { time: '2m', value: 62.4 },
    { time: '1m', value: 62.6 },
    { time: '30s', value: 62.4 },
    { time: 'Now', value: currentMoisture || 62.4 }
  ]);

  // MQTT / LoRaWAN Raw Packet Inspector
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [customMoistureInput, setCustomMoistureInput] = useState<string>('68.0');
  const [testPacketStatus, setTestPacketStatus] = useState<string | null>(null);

  // Reference for stable callbacks
  const autoSyncRef = useRef(autoSync);
  autoSyncRef.current = autoSync;
  const onSyncMoistureRef = useRef(onSyncMoisture);
  onSyncMoistureRef.current = onSyncMoisture;

  // Real-Time Telemetry Simulation Loop
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setDepth15((prev) => {
        let delta = (Math.random() - 0.48) * 0.4; // natural random micro-drift

        if (activeScenario === 'evaporation') {
          delta = -0.5 - Math.random() * 0.3; // drying
        } else if (activeScenario === 'drip') {
          delta = 0.8 + Math.random() * 0.4; // wetting from drip
        } else if (activeScenario === 'rain') {
          delta = 1.4 + Math.random() * 0.6; // rapid wetting
        }

        const nextVal = Math.min(92, Math.max(22, parseFloat((prev + delta).toFixed(1))));

        // Adjust lower depths with slight percolation lag
        setDepth30((p30) => {
          const lagDelta = delta * 0.7;
          return Math.min(94, Math.max(25, parseFloat((p30 + lagDelta).toFixed(1))));
        });

        setDepth45((p45) => {
          const deepDelta = delta * 0.4;
          return Math.min(96, Math.max(28, parseFloat((p45 + deepDelta).toFixed(1))));
        });

        // Slight micro-variations in temperature and EC
        setSoilTemp((t) => parseFloat((24.5 + (Math.random() - 0.5) * 0.3).toFixed(1)));
        setSoilEC((ec) => parseFloat((1.12 + (Math.random() - 0.5) * 0.04).toFixed(2)));

        // Update packet stats
        setPacketsReceived((count) => count + 1);
        setLastPacketTime('Just now');

        // Update history sparkline
        setHistory((prevHist) => {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const newEntry = { time: nowStr, value: nextVal };
          return [...prevHist.slice(1), newEntry];
        });

        // If Auto-Sync is turned on, propagate to farm profile
        if (autoSyncRef.current) {
          onSyncMoistureRef.current(nextVal);
        }

        return nextVal;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveStreaming, activeScenario]);

  // Compute status description
  const soilStatus =
    depth15 < 40
      ? { label: 'Moisture Deficit (Irrigation Required)', color: 'text-amber-700 bg-amber-50 border-amber-300' }
      : depth15 > 82
      ? { label: 'Near Saturation (Waterlogging Risk)', color: 'text-indigo-700 bg-indigo-50 border-indigo-300' }
      : { label: 'Optimal Root-Zone Turgor (Safe)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };

  // Manual Trigger to Apply Current Telemetry to Profile
  const handleApplyToProfile = () => {
    onSyncMoisture(depth15);
    setTestPacketStatus(`Applied live sensor moisture (${depth15}%) to your official farm profile!`);
    setTimeout(() => setTestPacketStatus(null), 3500);
  };

  // Inject Custom Payload (Simulate incoming hardware transmission)
  const handleInjectCustomPayload = () => {
    const customVal = parseFloat(customMoistureInput);
    if (!isNaN(customVal) && customVal >= 10 && customVal <= 100) {
      setDepth15(customVal);
      setDepth30(Math.min(95, parseFloat((customVal + 3.5).toFixed(1))));
      setDepth45(Math.min(98, parseFloat((customVal + 6.0).toFixed(1))));
      setPacketsReceived((c) => c + 1);
      setLastPacketTime('Just now (Manual Injected)');

      if (autoSync) {
        onSyncMoisture(customVal);
      }

      setTestPacketStatus(`Custom MQTT packet verified! Soil moisture calibrated to ${customVal}%.`);
      setTimeout(() => setTestPacketStatus(null), 4000);
    }
  };

  // Current active node metadata
  const activeNode = SENSOR_NODES.find((n) => n.id === selectedNodeId) || SENSOR_NODES[0];

  return (
    <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 rounded-3xl p-6 text-white border border-stone-700 shadow-xl space-y-6">
      {/* Top Banner: IoT Hardware Grid Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
              <Radio className="w-6 h-6 stroke-[2.2]" />
            </div>
            {isLiveStreaming && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-stone-900" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                IoT Soil Moisture Telemetry Station
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                LoRaWAN Gateway Online
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SF7 • 868 MHz
              </span>
            </div>

            <p className="text-xs text-stone-300 mt-1 flex items-center gap-2 flex-wrap">
              <span>Node ID: <strong className="font-mono text-cyan-300">{activeNode.id}</strong></span>
              <span>•</span>
              <span className="text-stone-400">{activeNode.depthModel}</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-semibold">
                {packetsReceived} packets received ({lastPacketTime})
              </span>
            </p>
          </div>
        </div>

        {/* Live Controls: Stream Toggle & Auto-Sync Switch */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Pause / Resume Live Streaming */}
          <button
            type="button"
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isLiveStreaming
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Pause Stream' : 'Resume Live Feed'}</span>
          </button>

          {/* Auto-Sync to Farm Profile Toggle */}
          <button
            type="button"
            onClick={() => onToggleAutoSync(!autoSync)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              autoSync
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
            }`}
            title="When active, real-time telemetry automatically updates your official farm moisture!"
          >
            <Zap className={`w-3.5 h-3.5 ${autoSync ? 'text-emerald-400 fill-emerald-400' : 'text-stone-400'}`} />
            <span>Auto-Sync: {autoSync ? 'ON' : 'OFF'}</span>
          </button>

          {/* Apply Live Reading Now */}
          <button
            type="button"
            onClick={handleApplyToProfile}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Manually apply the current sensor reading into the form slider"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync to Profile ({depth15}%)</span>
          </button>
        </div>
      </div>

      {/* Sensor Node Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SENSOR_NODES.map((node) => {
          const isSelected = node.id === selectedNodeId;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-800/90 border-cyan-400 ring-2 ring-cyan-400/20 shadow-lg'
                  : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 text-stone-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">{node.name.split('•')[0]}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-cyan-300 font-bold border border-stone-700">
                  {node.id}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-1 truncate">{node.location}</p>
              <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-between text-[10px]">
                <span className="text-stone-400">Battery: {node.battery}%</span>
                <span className="text-emerald-400 font-mono">RSSI: {node.rssi} dBm</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Telemetry Gauges (Multi-Depth Profiling) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Topsoil (15cm) - Primary Control Depth */}
        <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              15 cm • Topsoil Root Zone
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-200 font-mono font-bold">
              Primary VWC
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>{depth15}%</span>
              <span className="text-xs font-medium text-stone-400">VWC</span>
            </div>
            <div className="w-full bg-stone-700/60 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, depth15)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-stone-300 flex items-center justify-between pt-2 border-t border-stone-700/50">
            <span>Soil Temp: <strong className="text-amber-300">{soilTemp}°C</strong></span>
            <span className="text-emerald-400 font-bold">Optimal</span>
          </div>
        </div>

        {/* Active Root Zone (30cm) */}
        <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              30 cm • Active Root Layer
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-200 font-mono font-bold">
              Mid Subsoil
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>{depth30}%</span>
              <span className="text-xs font-medium text-stone-400">VWC</span>
            </div>
            <div className="w-full bg-stone-700/60 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, depth30)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-stone-300 flex items-center justify-between pt-2 border-t border-stone-700/50">
            <span>Pore EC: <strong className="text-cyan-300">{soilEC} dS/m</strong></span>
            <span className="text-teal-400 font-bold">Field Capacity</span>
          </div>
        </div>

        {/* Deep Subsoil (45cm) */}
        <div className="p-4 rounded-2xl bg-stone-800/70 border border-stone-700 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              45 cm • Deep Capillary Reserve
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-200 font-mono font-bold">
              Subsoil
            </span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
              <span>{depth45}%</span>
              <span className="text-xs font-medium text-stone-400">VWC</span>
            </div>
            <div className="w-full bg-stone-700/60 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, depth45)}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-stone-300 flex items-center justify-between pt-2 border-t border-stone-700/50">
            <span>Capillary Water: <strong className="text-emerald-300">High</strong></span>
            <span className="text-emerald-400 font-bold">Plentiful</span>
          </div>
        </div>

        {/* Agronomic Status & Soil Health Condition Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-850 to-stone-900 border border-stone-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                Agronomic State
              </span>
              <span className="text-[10px] font-mono text-stone-400">{soilType.split(' ')[0]}</span>
            </div>
            <div className={`p-2.5 rounded-xl border text-xs font-black ${soilStatus.color}`}>
              {soilStatus.label}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-700/60 text-[11px] text-stone-300 space-y-1">
            <div className="flex justify-between">
              <span>Readily Available Water:</span>
              <strong className="text-white font-mono">42 mm</strong>
            </div>
            <div className="flex justify-between">
              <span>Drip Trigger Threshold:</span>
              <strong className="text-amber-300 font-mono">38% VWC</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry Sparkline & Trend History */}
      <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-stone-200">
              Live Soil Moisture Infiltration & Depletion Telemetry (Rolling 12 Readings)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              15cm Live Probe
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 border-t border-dashed border-emerald-400 inline-block" />
              Field Capacity (75%)
            </span>
          </div>
        </div>

        {/* Animated SVG Trend Curve */}
        <div className="h-24 w-full relative flex items-end pt-3">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Field Capacity Reference line at 75% */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#10b981" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.6" />
            {/* Wilting Point Reference line at 30% */}
            <line x1="0" y1="70" x2="100" y2="70" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.6" />

            {/* Sparkline Polyline */}
            {history.length > 1 && (
              <>
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={history
                    .map((pt, idx) => {
                      const x = (idx / (history.length - 1)) * 100;
                      // map value 20-95% to 0-100 svg y (inverted)
                      const y = 100 - ((pt.value - 20) / 75) * 100;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
                {/* Data point dots */}
                {history.map((pt, idx) => {
                  const x = (idx / (history.length - 1)) * 100;
                  const y = 100 - ((pt.value - 20) / 75) * 100;
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r={idx === history.length - 1 ? 3.5 : 2}
                      className={idx === history.length - 1 ? 'fill-cyan-300 stroke-stone-900 stroke-2 animate-ping' : 'fill-cyan-400'}
                    />
                  );
                })}
              </>
            )}
          </svg>
        </div>

        <div className="flex justify-between text-[10px] text-stone-500 font-mono">
          <span>~40 mins ago</span>
          <span>Rolling Sensor Stream</span>
          <span className="text-cyan-400 font-bold">Now ({depth15}%)</span>
        </div>
      </div>

      {/* Environmental Scenario Simulators */}
      <div className="p-4 rounded-2xl bg-stone-850/80 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Simulate Agricultural Environmental Conditions:
          </span>
          <span className="text-[11px] text-stone-400">
            Active Scenario: <strong className="text-cyan-300 uppercase">{activeScenario}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => setActiveScenario('normal')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeScenario === 'normal'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                : 'bg-stone-900 border-stone-700 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <div className="text-xs font-black flex items-center gap-1">
              <span>🌱 Normal Diurnal</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Natural root uptake (~62%)</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveScenario('evaporation')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeScenario === 'evaporation'
                ? 'bg-amber-950/80 border-amber-400 text-amber-200'
                : 'bg-stone-900 border-stone-700 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <div className="text-xs font-black flex items-center gap-1">
              <span>☀️ Midday Sun Stress</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Rapid topsoil depletion (↓)</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveScenario('drip')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeScenario === 'drip'
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                : 'bg-stone-900 border-stone-700 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <div className="text-xs font-black flex items-center gap-1">
              <span>💧 Drip Fertigation</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Percolation pulse to 76% (↑)</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveScenario('rain')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              activeScenario === 'rain'
                ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200'
                : 'bg-stone-900 border-stone-700 hover:bg-stone-800 text-stone-300'
            }`}
          >
            <div className="text-xs font-black flex items-center gap-1">
              <span>🌧️ Monsoon Downpour</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">Heavy saturation (&gt;82%)</div>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {testPacketStatus && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{testPacketStatus}</span>
        </div>
      )}

      {/* Collapsible MQTT / LoRaWAN Hardware Packet Inspector */}
      <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-950/80">
        <button
          type="button"
          onClick={() => setShowInspector(!showInspector)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-stone-300 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Developer / Field Hardware Inspector: MQTT & LoRaWAN Live JSON Ingestion</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono">
            <span>{showInspector ? 'Hide Telemetry Packet' : 'Inspect Telemetry Payload'}</span>
            {showInspector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showInspector && (
          <div className="p-4 border-t border-stone-800 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Raw JSON Stream */}
              <div>
                <div className="text-[11px] font-mono text-stone-400 mb-1 flex items-center justify-between">
                  <span>Incoming LoRaWAN Uplink Frame (Port 14):</span>
                  <span className="text-emerald-400">CRC OK</span>
                </div>
                <pre className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{JSON.stringify(
  {
    device_eui: '70B3D57ED005E21A',
    gateway_id: 'GW-MAH-SAT-04',
    node_id: selectedNodeId,
    depth_15cm_vwc: depth15,
    depth_30cm_vwc: depth30,
    depth_45cm_vwc: depth45,
    soil_temp_c: soilTemp,
    soil_ec_dsm: soilEC,
    battery_pct: battery,
    rssi_dbm: signalRssi,
    snr_db: 9.2,
    timestamp: new Date().toISOString()
  },
  null,
  2
)}
                </pre>
              </div>

              {/* Right: Manual Packet Injection Tool */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-stone-300">
                  Transmit Custom Soil Moisture Test Packet:
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Enter a target soil moisture percentage to simulate an incoming transmission from an external physical sensor or probe.
                </p>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.1"
                      min="15"
                      max="95"
                      value={customMoistureInput}
                      onChange={(e) => setCustomMoistureInput(e.target.value)}
                      placeholder="e.g. 68.5"
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <span className="absolute right-3 top-2 text-xs text-stone-400 font-mono">% VWC</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleInjectCustomPayload}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Packet</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-[10px] text-stone-400 leading-relaxed">
                  💡 <strong>Direct Hardware Webhook:</strong> In production deployments, physical ESP32 or Dragino LoRaWAN gateways post directly to <code>/api/v1/telemetry/soil</code>.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
