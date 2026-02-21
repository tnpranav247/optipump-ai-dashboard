import { type LucideIcon, Droplets, Zap, Gauge, Waves, Activity } from 'lucide-react';
import type { PumpMetrics } from '@/hooks/usePumpData';

interface MetricConfig {
  key: keyof PumpMetrics;
  label: string;
  unit: string;
  icon: LucideIcon;
}

const METRIC_CONFIGS: MetricConfig[] = [
  { key: 'flowRate', label: 'Flow Rate', unit: 'L/min', icon: Droplets },
  { key: 'current', label: 'Current', unit: 'A', icon: Zap },
  { key: 'voltage', label: 'Voltage', unit: 'V', icon: Activity },
  { key: 'pressure', label: 'Pressure', unit: 'bar', icon: Gauge },
  { key: 'vibration', label: 'Vibration', unit: 'mm/s', icon: Waves },
];

interface MetricCardsProps {
  metrics: PumpMetrics;
}

const MetricCards = ({ metrics }: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {METRIC_CONFIGS.map(({ key, label, unit, icon: Icon }, index) => (
        <div
          key={key}
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
              {metrics[key]}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
