import { Activity } from 'lucide-react';
import type { ConnectionStatus } from '@/hooks/useDeviceConnection';

interface DashboardHeaderProps {
  connectionStatus: ConnectionStatus;
}

const STATUS_DISPLAY: Record<ConnectionStatus, { label: string; colorClass: string }> = {
  disconnected: { label: 'Disconnected', colorClass: 'bg-muted-foreground' },
  connecting: { label: 'Connecting…', colorClass: 'bg-warning' },
  online: { label: 'Online', colorClass: 'bg-success' },
  offline: { label: 'Offline', colorClass: 'bg-destructive' },
};

const DashboardHeader = ({ connectionStatus }: DashboardHeaderProps) => {
  const status = STATUS_DISPLAY[connectionStatus];

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            OptiPump AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Intelligent Pump Monitoring Dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-border">
        <span className={`w-2 h-2 rounded-full status-pulse ${status.colorClass}`} />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {status.label}
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
