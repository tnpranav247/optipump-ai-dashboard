import { Shield, AlertTriangle, XOctagon } from 'lucide-react';
import type { SystemState } from '@/hooks/usePumpData';

interface SystemStatusProps {
  state: SystemState;
  message: string;
}

const STATUS_CONFIG: Record<SystemState, { label: string; icon: typeof Shield; colorClass: string; glowClass: string }> = {
  normal: {
    label: 'Normal',
    icon: Shield,
    colorClass: 'text-success border-success/30 bg-success/5',
    glowClass: 'glow-success',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    colorClass: 'text-warning border-warning/30 bg-warning/5',
    glowClass: 'glow-warning',
  },
  critical: {
    label: 'Critical',
    icon: XOctagon,
    colorClass: 'text-destructive border-destructive/30 bg-destructive/5',
    glowClass: 'glow-destructive',
  },
};

const SystemStatus = ({ state, message }: SystemStatusProps) => {
  const config = STATUS_CONFIG[state];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border p-5 transition-all duration-500 ${config.colorClass} ${config.glowClass}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">System State</p>
          <p className="text-lg font-semibold">{config.label}</p>
        </div>
      </div>
      <p className="text-sm opacity-80 font-mono">{message}</p>
    </div>
  );
};

export default SystemStatus;
