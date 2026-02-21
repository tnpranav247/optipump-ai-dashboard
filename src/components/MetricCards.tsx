import { type LucideIcon, Droplets, Zap, Gauge, Waves, Activity } from 'lucide-react';
import type { PumpMetrics } from '@/hooks/useDeviceConnection';
import type { ConnectionStatus } from '@/hooks/useDeviceConnection';

interface MetricConfig {
  key: keyof PumpMetrics;
  label: string;
  unit: string;
  icon: LucideIcon;
  id: string; // ID for future data binding from ESP32
}

const METRIC_CONFIGS: MetricConfig[] = [
  { key: 'flowRate', label: 'Flow Rate', unit: 'L/min', icon: Droplets, id: 'metric-flow-rate' },
  { key: 'current', label: 'Current', unit: 'A', icon: Zap, id: 'metric-current' },
  { key: 'voltage', label: 'Voltage', unit: 'V', icon: Activity, id: 'metric-voltage' },
  { key: 'pressure', label: 'Pressure', unit: 'bar', icon: Gauge, id: 'metric-pressure' },
  { key: 'vibration', label: 'Vibration', unit: 'mm/s', icon: Waves, id: 'metric-vibration' },
];

interface MetricCardsProps {
  metrics: PumpMetrics;
  connectionStatus: ConnectionStatus;
}

const MetricCards = ({ metrics, connectionStatus }: MetricCardsProps) => {
  const isWaiting = connectionStatus === 'disconnected' || connectionStatus === 'connecting';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {METRIC_CONFIGS.map(({ key, label, unit, icon: Icon, id }, index) => {
        const value = metrics[key];
        return (
          <div
            key={key}
            id={id}
            className="card-industrial fade-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-primary/70" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {label}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-semibold text-foreground value-transition">
                {value !== null ? value : '--'}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {unit}
              </span>
            </div>
            {isWaiting && (
              <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                Waiting for device…
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;
