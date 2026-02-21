import { Bell } from 'lucide-react';
import type { Alert } from '@/hooks/usePumpData';

interface AlertsPanelProps {
  alerts: Alert[];
  onClearAlerts: () => void;
}

const SEVERITY_STYLES = {
  normal: 'border-l-success/50 text-success',
  warning: 'border-l-warning/50 text-warning',
  critical: 'border-l-destructive/50 text-destructive',
};

const AlertsPanel = ({ alerts, onClearAlerts }: AlertsPanelProps) => {
  return (
    <div className="card-industrial flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary/70" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Alerts</h3>
        </div>
        <button
          onClick={onClearAlerts}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          Clear All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto max-h-64 space-y-2 pr-1 scrollbar-thin">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No alerts</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-2 pl-3 py-2 ${SEVERITY_STYLES[alert.severity]}`}
            >
              <p className="text-sm text-foreground/90">{alert.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {alert.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-medium">
                  {alert.severity}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
