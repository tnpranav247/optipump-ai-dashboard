import { useState, useEffect, useCallback, useRef } from 'react';

export interface PumpMetrics {
  flowRate: number;
  current: number;
  voltage: number;
  pressure: number;
  vibration: number;
}

export interface Alert {
  id: string;
  timestamp: Date;
  message: string;
  severity: 'normal' | 'warning' | 'critical';
}

export interface ChartDataPoint {
  time: string;
  flow: number;
  current: number;
}

export type SystemState = 'normal' | 'warning' | 'critical';

export interface PumpData {
  metrics: PumpMetrics;
  systemState: SystemState;
  diagnosticMessage: string;
  alerts: Alert[];
  chartData: ChartDataPoint[];
  isOnline: boolean;
}

const DIAGNOSTIC_MESSAGES: Record<SystemState, string[]> = {
  normal: ['Operating Normally', 'All Systems Nominal', 'Steady State Achieved'],
  warning: ['Vibration Above Threshold', 'Flow Rate Fluctuation Detected', 'Minor Pressure Deviation'],
  critical: ['Dry Run Detected', 'Overcurrent Protection Active', 'Critical Pressure Drop'],
};

function randomInRange(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function usePumpData(): PumpData {
  const [metrics, setMetrics] = useState<PumpMetrics>({
    flowRate: 42.5,
    current: 12.3,
    voltage: 380,
    pressure: 4.2,
    vibration: 2.1,
  });

  const [systemState, setSystemState] = useState<SystemState>('normal');
  const [diagnosticMessage, setDiagnosticMessage] = useState('Operating Normally');
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', timestamp: new Date(Date.now() - 300000), message: 'System started successfully', severity: 'normal' },
    { id: '2', timestamp: new Date(Date.now() - 180000), message: 'Calibration complete', severity: 'normal' },
    { id: '3', timestamp: new Date(Date.now() - 60000), message: 'Minor vibration spike detected', severity: 'warning' },
  ]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const counterRef = useRef(0);

  const generateChartPoint = useCallback((flow: number, current: number): ChartDataPoint => ({
    time: formatTime(new Date()),
    flow: parseFloat(flow.toFixed(1)),
    current: parseFloat(current.toFixed(1)),
  }), []);

  useEffect(() => {
    // Initialize chart data
    const initial: ChartDataPoint[] = [];
    for (let i = 20; i >= 0; i--) {
      const t = new Date(Date.now() - i * 2000);
      initial.push({
        time: formatTime(t),
        flow: randomInRange(38, 46),
        current: randomInRange(11, 14),
      });
    }
    setChartData(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      counterRef.current += 1;

      // Determine system state periodically
      let newState: SystemState = 'normal';
      if (counterRef.current % 30 === 0) {
        newState = 'critical';
      } else if (counterRef.current % 12 === 0) {
        newState = 'warning';
      }

      const newMetrics: PumpMetrics = {
        flowRate: newState === 'critical' ? randomInRange(5, 15) : randomInRange(38, 46),
        current: newState === 'critical' ? randomInRange(18, 22) : randomInRange(11, 14),
        voltage: randomInRange(375, 385, 0),
        pressure: newState === 'warning' ? randomInRange(2.5, 3.2) : randomInRange(3.8, 4.5),
        vibration: newState === 'warning' ? randomInRange(5, 7) : randomInRange(1.5, 3),
      };

      setMetrics(newMetrics);
      setSystemState(newState);

      const msgs = DIAGNOSTIC_MESSAGES[newState];
      setDiagnosticMessage(msgs[Math.floor(Math.random() * msgs.length)]);

      // Add alert on state change
      if (newState !== 'normal') {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          timestamp: new Date(),
          message: msgs[Math.floor(Math.random() * msgs.length)],
          severity: newState,
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 50));
      }

      setChartData(prev => [...prev.slice(-30), generateChartPoint(newMetrics.flowRate, newMetrics.current)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [generateChartPoint]);

  return {
    metrics,
    systemState,
    diagnosticMessage,
    alerts,
    chartData,
    isOnline: true,
  };
}
