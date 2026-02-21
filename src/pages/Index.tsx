import { useState, useCallback } from 'react';
import { usePumpData } from '@/hooks/usePumpData';
import DashboardHeader from '@/components/DashboardHeader';
import MetricCards from '@/components/MetricCards';
import SystemStatus from '@/components/SystemStatus';
import AlertsPanel from '@/components/AlertsPanel';
import LiveChart from '@/components/LiveChart';
import ControlPanel from '@/components/ControlPanel';

const Index = () => {
  const { metrics, systemState, diagnosticMessage, alerts: rawAlerts, chartData, isOnline } = usePumpData();
  const [alerts, setAlerts] = useState(rawAlerts);

  // Sync alerts from hook
  useState(() => {
    const id = setInterval(() => {
      setAlerts(rawAlerts);
    }, 500);
    return () => clearInterval(id);
  });

  const handleClearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <DashboardHeader isOnline={isOnline} />
      <MetricCards metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SystemStatus state={systemState} message={diagnosticMessage} />
        <div className="lg:col-span-2">
          <AlertsPanel alerts={rawAlerts} onClearAlerts={handleClearAlerts} />
        </div>
      </div>

      <div className="mb-6">
        <LiveChart data={chartData} />
      </div>

      <ControlPanel />
    </div>
  );
};

export default Index;
