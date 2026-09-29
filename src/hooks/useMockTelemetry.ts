import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { TelemetryPoint, MotorHealthMetrics, MotorAlert, TelemetryStatus } from '../types/telemetry';

const TELEMETRY_API_URL = 'http://localhost:5000/telemetry';

interface LiveTelemetryResponse {
  temperature?: number | string;
  current?: number | string;
  voltage?: number | string;
  temp?: number | string;
  curr?: number | string;
  volt?: number | string;
  value?: number | string;
  amps?: number | string;
  volts?: number | string;
}

interface ParsedTelemetry {
  temperature: number | null;
  current: number | null;
  voltage: number | null;
}

async function fetchLiveTelemetry(): Promise<ParsedTelemetry | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 900);
    const response = await fetch(TELEMETRY_API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data: LiveTelemetryResponse = await response.json();
    if (!data || typeof data !== 'object') return null;

    const parseNum = (val: unknown): number | null => {
      if (typeof val === 'number' && !isNaN(val)) return val;
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) return parsed;
      }
      return null;
    };

    const rawTemp = parseNum(data.temperature ?? data.temp ?? data.value);
    const rawCurrent = parseNum(data.current ?? data.curr ?? data.amps);
    const rawVoltage = parseNum(data.voltage ?? data.volt ?? data.volts);

    if (rawTemp === null && rawCurrent === null && rawVoltage === null) {
      return null;
    }

    return {
      temperature: rawTemp !== null ? parseFloat(rawTemp.toFixed(2)) : null,
      current: rawCurrent !== null ? parseFloat(rawCurrent.toFixed(3)) : null,
      voltage: rawVoltage !== null ? parseFloat(rawVoltage.toFixed(1)) : null,
    };
  } catch {
    return null;
  }
}

export function useMockTelemetry() {
  const [isAnomalyMode, setIsAnomalyMode] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Store last valid readings to maintain state on temporary API disconnects/timeouts
  const lastKnownRef = useRef<{
    temperature: number;
    current: number;
    voltage: number;
  }>({
    temperature: 39.26,
    current: 0.1,
    voltage: 226.7,
  });

  // Generate initial rolling buffer for graphs
  const [history, setHistory] = useState<TelemetryPoint[]>(() => {
    const points: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const t = now - i * 1000;
      const d = new Date(t);
      const timeLabel = `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
      const temp = 39.26;
      const c = 0.1;
      const v = 226.7;
      const p = parseFloat(((v * c) / 1000).toFixed(3));

      points.push({
        timestamp: t,
        timeLabel,
        temperature: temp,
        current: c,
        voltage: v,
        power: p,
      });
    }
    return points;
  });

  useEffect(() => {
    if (isPaused) return;

    let isMounted = true;

    const poll = async () => {
      // 1. Fetch real hardware telemetry from local Flask API (http://localhost:5000/telemetry)
      const liveData = await fetchLiveTelemetry();
      if (!isMounted) return;

      if (liveData) {
        if (liveData.temperature !== null) {
          lastKnownRef.current.temperature = liveData.temperature;
        }
        if (liveData.current !== null) {
          lastKnownRef.current.current = liveData.current;
        }
        if (liveData.voltage !== null) {
          lastKnownRef.current.voltage = liveData.voltage;
        }
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }

      // Read real live values (retaining last valid sensor readings if fetch temporarily fails)
      let currentTemp = lastKnownRef.current.temperature;
      let currentVal = lastKnownRef.current.current;
      let voltageVal = lastKnownRef.current.voltage;

      // Simulated anomaly load surge overlay when operator manually tests anomaly trigger
      if (isAnomalyMode) {
        currentTemp = Math.max(currentTemp, 72.4);
        currentVal = Math.max(currentVal, 11.85);
        voltageVal = 221.0;
      }

      // Calculated instantaneous active power (kW, P = V × I / 1000)
      const powerVal = parseFloat(((voltageVal * currentVal) / 1000).toFixed(3));

      const now = Date.now();
      const d = new Date(now);
      const timeLabel = `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;

      const newPoint: TelemetryPoint = {
        timestamp: now,
        timeLabel,
        temperature: currentTemp,
        current: currentVal,
        voltage: voltageVal,
        power: powerVal,
      };

      setTick(prev => prev + 1);
      setHistory(prev => [...prev.slice(1), newPoint]);
    };

    poll();
    const pollInterval = setInterval(poll, 1000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [isAnomalyMode, isPaused]);

  const latestPoint = history[history.length - 1] || {
    timestamp: Date.now(),
    timeLabel: '00:00',
    temperature: lastKnownRef.current.temperature,
    current: lastKnownRef.current.current,
    voltage: lastKnownRef.current.voltage,
    power: parseFloat(((lastKnownRef.current.voltage * lastKnownRef.current.current) / 1000).toFixed(3)),
  };

  // Status calculations based on real live sensor data:
  // Temperature: >= 70°C → critical | >= 60°C → attention | < 60°C → normal
  const tempStatus: TelemetryStatus = useMemo(() => {
    const val = latestPoint.temperature;
    if (val >= 70.0) return 'critical';
    if (val >= 60.0 || isAnomalyMode) return 'attention';
    return 'normal';
  }, [latestPoint.temperature, isAnomalyMode]);

  // Current: >= 12.0A → critical | >= 9.5A → attention | < 9.5A → normal
  const currentStatus: TelemetryStatus = useMemo(() => {
    const val = latestPoint.current;
    if (val >= 12.0) return 'critical';
    if (val >= 9.5 || isAnomalyMode) return 'attention';
    return 'normal';
  }, [latestPoint.current, isAnomalyMode]);

  // Voltage: < 195V or > 260V → critical | < 210V or > 245V → attention | 210-245V → normal
  const voltageStatus: TelemetryStatus = useMemo(() => {
    const val = latestPoint.voltage;
    if (val < 195.0 || val > 260.0) return 'critical';
    if (val < 210.0 || val > 245.0) return 'attention';
    return 'normal';
  }, [latestPoint.voltage]);

  // Power status derived from current & voltage
  const powerStatus: TelemetryStatus = useMemo(() => {
    if (tempStatus === 'critical' || currentStatus === 'critical' || voltageStatus === 'critical') return 'critical';
    if (tempStatus === 'attention' || currentStatus === 'attention' || voltageStatus === 'attention' || isAnomalyMode) return 'attention';
    return 'normal';
  }, [tempStatus, currentStatus, voltageStatus, isAnomalyMode]);

  const isCrit = tempStatus === 'critical' || currentStatus === 'critical' || voltageStatus === 'critical';
  const isAnom = isAnomalyMode || tempStatus === 'attention' || currentStatus === 'attention' || voltageStatus === 'attention';

  const healthScore = isCrit ? 45 : isAnom ? 68 : 98;
  const sysStatus: 'NORMAL' | 'ATTENTION' | 'CRITICAL' = isCrit ? 'CRITICAL' : isAnom ? 'ATTENTION' : 'NORMAL';

  const metrics: MotorHealthMetrics = useMemo(() => {
    return {
      temperature: {
        value: latestPoint.temperature,
        unit: '°C',
        status: tempStatus,
        label: 'Motor Temperature',
        baseline: 40.0,
        threshold: 65.0,
        description:
          tempStatus === 'critical'
            ? 'Critical thermal warning: Surface sensor reading exceeds safety limit (70 °C)'
            : tempStatus === 'attention'
            ? 'Thermal gradient elevated above continuous duty rating'
            : 'Operating well within Class F insulation limits',
      },
      current: {
        value: latestPoint.current,
        unit: 'A',
        status: currentStatus,
        label: 'Motor Current',
        baseline: 0.1,
        threshold: 9.5,
        description:
          currentStatus === 'critical'
            ? 'Severe overcurrent detected exceeding safe operating limits'
            : currentStatus === 'attention'
            ? 'Abnormal current consumption exceeding nominal baseline'
            : 'Phase current draw matching nominal baseline',
      },
      voltage: {
        value: latestPoint.voltage,
        unit: 'V',
        status: voltageStatus,
        label: 'Supply Voltage',
        baseline: 230.0,
        threshold: 215.0,
        description:
          voltageStatus === 'critical'
            ? 'Severe supply voltage instability detected'
            : voltageStatus === 'attention'
            ? 'Supply voltage deviation outside optimal range'
            : 'Maintained within standard ±5% supply tolerance',
      },
      power: {
        value: latestPoint.power,
        unit: 'kW',
        status: powerStatus,
        label: 'Calculated Power (P = V × I)',
        baseline: 0.02,
        threshold: 2.10,
        description: 'Instantaneous active load computed in real time from live V & I',
        isDerived: true,
      },
      overallHealthScore: healthScore,
      systemStatus: sysStatus,
      activeMode: isAnomalyMode ? 'SIMULATED_ANOMALY' : 'NOMINAL',
      lastSyncTime: isConnected ? 'Live Hardware Telemetry (1.0s cycle)' : 'Live Hardware (Holding last state)',
      motorId: 'IM-UNIT-3P-415V',
    };
  }, [
    latestPoint,
    isAnomalyMode,
    tempStatus,
    currentStatus,
    voltageStatus,
    powerStatus,
    healthScore,
    sysStatus,
    isConnected,
  ]);

  const alerts: MotorAlert[] = useMemo(() => {
    const list: MotorAlert[] = [];

    if (tempStatus === 'critical') {
      list.push({
        id: 'alt-crit-temp',
        timestamp: 'Just now',
        type: 'CRITICAL',
        title: 'Critical Motor Temperature Limit Exceeded',
        parameter: 'Temperature',
        description: `Live sensor reading ${latestPoint.temperature} °C (≥ 70 °C threshold). Immediate load reduction advised.`,
      });
    } else if (tempStatus === 'attention') {
      list.push({
        id: 'alt-warn-temp',
        timestamp: 'Just now',
        type: 'ATTENTION',
        title: 'Thermal Gradient Warning',
        parameter: 'Temperature',
        description: `Live sensor reading ${latestPoint.temperature} °C. Operating above continuous rating.`,
      });
    }

    if (currentStatus === 'critical') {
      list.push({
        id: 'alt-crit-curr',
        timestamp: 'Just now',
        type: 'CRITICAL',
        title: 'Severe Overcurrent Limit Exceeded',
        parameter: 'Current',
        description: `Live current draw ${latestPoint.current} A exceeds equipment safety threshold.`,
      });
    } else if (currentStatus === 'attention') {
      list.push({
        id: 'alt-warn-curr',
        timestamp: 'Just now',
        type: 'ATTENTION',
        title: 'High Current Consumption Advisory',
        parameter: 'Current',
        description: `Live current draw ${latestPoint.current} A elevated above continuous baseline.`,
      });
    }

    if (voltageStatus === 'critical') {
      list.push({
        id: 'alt-crit-volt',
        timestamp: 'Just now',
        type: 'CRITICAL',
        title: 'Critical Supply Voltage Irregularity',
        parameter: 'Voltage',
        description: `Supply line voltage measuring ${latestPoint.voltage} V. Unstable grid supply.`,
      });
    } else if (voltageStatus === 'attention') {
      list.push({
        id: 'alt-warn-volt',
        timestamp: 'Just now',
        type: 'ATTENTION',
        title: 'Supply Voltage Deviation',
        parameter: 'Voltage',
        description: `Supply line voltage measuring ${latestPoint.voltage} V. Deviation from 230V nominal.`,
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'alt-00',
        timestamp: 'Live stream',
        type: 'INFO',
        title: 'Operating within Nameplate Limits',
        parameter: 'Power',
        description: 'Hardware telemetry streaming live: temperature, current, and voltage nominal.',
      });
    }

    return list;
  }, [tempStatus, currentStatus, voltageStatus, latestPoint]);

  const toggleAnomalyMode = useCallback(() => {
    setIsAnomalyMode(prev => !prev);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return {
    metrics,
    history,
    alerts,
    isAnomalyMode,
    isPaused,
    isConnected,
    tick,
    toggleAnomalyMode,
    togglePause,
  };
}

