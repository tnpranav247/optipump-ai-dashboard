import { Shield, AlertTriangle, XOctagon, Loader2 } from 'lucide-react';
import type { SystemState, ConnectionStatus } from '@/hooks/useDeviceConnection';

interface SystemStatusProps {
  state: SystemState | null;
  message: string;
  connectionStatus: ConnectionStatus;
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
  fault: {
    label: 'Fault',
    icon: XOctagon,
    colorClass: 'text-destructive border-destructive/30 bg-destructive/5',
    glowClass: 'glow-destructive',
  },
};

const SystemStatus = ({ state, message, connectionStatus }: SystemStatusProps) => {
  const isWaiting = !state || connectionStatus === 'disconnected' || connectionStatus === 'connecting';

  if (isWaiting) {
    return (
      <div id="system-status" className="rounded-lg border border-border bg-card p-5 transition-all duration-500">
        <div className="flex items-center gap-3 mb-3">
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">System State</p>
            <p className="text-lg font-semibold text-muted-foreground">--</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-mono">Waiting for device…</p>
      </div>
    );
  }

  const config = STATUS_CONFIG[state];
  const Icon = config.icon;

  return (
    <div id="system-status" className={`rounded-lg border p-5 transition-all duration-500 ${config.colorClass} ${config.glowClass}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5" />
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">System State</p>
          <p id="system-state-label" className="text-lg font-semibold">{config.label}</p>
        </div>
      </div>
      <p id="diagnostic-message" className="text-sm opacity-80 font-mono">{message}</p>
    </div>
  );
};

export default SystemStatus;
