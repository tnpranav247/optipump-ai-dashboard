import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// ESP32 Device Connection Hook
// ============================================================
// This hook manages the connection to the ESP32 device via:
//   1. REST API:   http://<DEVICE_IP>/data
//   2. WebSocket:  ws://<DEVICE_IP>/ws
//
// Set the device IP before use:
//   const { ... } = useDeviceConnection('192.168.1.100');
//
// Data format expected from the ESP32:
// {
//   "flowRate": 42.5,
//   "current": 12.3,
//   "voltage": 380,
//   "pressure": 4.2,
//   "vibration": 2.1,
//   "status": "normal" | "warning" | "fault",
//   "diagnosticMessage": "Operating Normally",
//   "alerts": [
//     { "timestamp": "...", "message": "...", "severity": "normal" | "warning" | "critical" }
//   ]
// }
// ============================================================

export interface PumpMetrics {
  flowRate: number | null;
  current: number | null;
  voltage: number | null;
  pressure: number | null;
  vibration: number | null;
}

export interface Alert {
  id: string;
  timestamp: string;
  message: string;
  severity: 'normal' | 'warning' | 'critical';
}

export interface ChartDataPoint {
  time: string;
  flow: number | null;
  current: number | null;
}

export type SystemState = 'normal' | 'warning' | 'fault';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'online' | 'offline';

export interface DeviceData {
  metrics: PumpMetrics;
  systemState: SystemState | null;
  diagnosticMessage: string;
  alerts: Alert[];
  chartData: ChartDataPoint[];
  connectionStatus: ConnectionStatus;
}

const EMPTY_METRICS: PumpMetrics = {
  flowRate: null,
  current: null,
  voltage: null,
  pressure: null,
  vibration: null,
};

/**
 * Updates the metric cards with incoming ESP32 data.
 * Called automatically when new data arrives via REST or WebSocket.
 */
export function updateMetrics(current: PumpMetrics, data: Record<string, unknown>): PumpMetrics {
  return {
    flowRate: typeof data.flowRate === 'number' ? data.flowRate : current.flowRate,
    current: typeof data.current === 'number' ? data.current : current.current,
    voltage: typeof data.voltage === 'number' ? data.voltage : current.voltage,
    pressure: typeof data.pressure === 'number' ? data.pressure : current.pressure,
    vibration: typeof data.vibration === 'number' ? data.vibration : current.vibration,
  };
}

/**
 * Updates the system status panel with incoming data.
 */
export function updateStatus(data: Record<string, unknown>): { state: SystemState | null; message: string } {
  const state = ['normal', 'warning', 'fault'].includes(data.status as string)
    ? (data.status as SystemState)
    : null;
  const message = typeof data.diagnosticMessage === 'string' ? data.diagnosticMessage : '';
  return { state, message };
}

/**
 * Updates the alerts log with incoming data.
 */
export function updateAlerts(existing: Alert[], data: Record<string, unknown>): Alert[] {
  if (!Array.isArray(data.alerts)) return existing;
  const incoming: Alert[] = (data.alerts as Record<string, unknown>[]).map((a, i) => ({
    id: `alert-${Date.now()}-${i}`,
    timestamp: typeof a.timestamp === 'string' ? a.timestamp : new Date().toISOString(),
    message: typeof a.message === 'string' ? a.message : 'Unknown alert',
    severity: (['normal', 'warning', 'critical'].includes(a.severity as string)
      ? a.severity
      : 'normal') as Alert['severity'],
  }));
  return [...incoming, ...existing].slice(0, 100);
}

/**
 * Updates chart data arrays with latest metrics for live graphing.
 */
export function updateCharts(
  existing: ChartDataPoint[],
  metrics: PumpMetrics,
  maxPoints = 30
): ChartDataPoint[] {
  const now = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const point: ChartDataPoint = {
    time: now,
    flow: metrics.flowRate,
    current: metrics.current,
  };
  return [...existing.slice(-(maxPoints - 1)), point];
}

/**
 * Main hook: connects to the ESP32 device and provides reactive data.
 * Pass null or empty string to stay in disconnected/waiting state.
 */
export function useDeviceConnection(deviceIp: string | null): DeviceData {
  const [metrics, setMetrics] = useState<PumpMetrics>(EMPTY_METRICS);
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [diagnosticMessage, setDiagnosticMessage] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Process incoming JSON payload from either REST or WebSocket
  const processData = useCallback((data: Record<string, unknown>) => {
    setMetrics((prev) => {
      const updated = updateMetrics(prev, data);
      // Update chart data with new metrics
      setChartData((cd) => updateCharts(cd, updated));
      return updated;
    });

    const { state, message } = updateStatus(data);
    if (state) setSystemState(state);
    if (message) setDiagnosticMessage(message);

    setAlerts((prev) => updateAlerts(prev, data));
    setConnectionStatus('online');
  }, []);

  // REST polling: GET http://<DEVICE_IP>/data
  const fetchData = useCallback(async () => {
    if (!deviceIp) return;
    try {
      const response = await fetch(`http://${deviceIp}/data`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      processData(data);
    } catch {
      // REST fetch failed – connection may be lost
      setConnectionStatus((prev) => (prev === 'online' ? 'offline' : prev));
    }
  }, [deviceIp, processData]);

  // WebSocket connection: ws://<DEVICE_IP>/ws
  useEffect(() => {
    if (!deviceIp) {
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('connecting');

    const connectWebSocket = () => {
      const ws = new WebSocket(`ws://${deviceIp}/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('online');
        console.log('[OptiPump] WebSocket connected to', deviceIp);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          processData(data);
        } catch {
          console.warn('[OptiPump] Invalid WebSocket message');
        }
      };

      ws.onerror = () => {
        console.warn('[OptiPump] WebSocket error');
      };

      ws.onclose = () => {
        setConnectionStatus('offline');
        console.log('[OptiPump] WebSocket disconnected, retrying in 5s...');
        // Auto-reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();

    // Also start REST polling as fallback (every 3 seconds)
    pollRef.current = setInterval(fetchData, 3000);

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [deviceIp, processData, fetchData]);

  return {
    metrics,
    systemState,
    diagnosticMessage,
    alerts,
    chartData,
    connectionStatus,
  };
}
