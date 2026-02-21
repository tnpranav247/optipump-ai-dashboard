import { Activity } from 'lucide-react';

interface DashboardHeaderProps {
  isOnline: boolean;
}

const DashboardHeader = ({ isOnline }: DashboardHeaderProps) => {
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
            Intelligent Pump Monitoring System
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full status-pulse ${
            isOnline ? 'bg-success' : 'bg-destructive'
          }`}
        />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </header>
  );
};

export default DashboardHeader;
