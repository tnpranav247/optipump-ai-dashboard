import { useState } from 'react';
import { useDeviceConnection } from '@/hooks/useDeviceConnection';
import DashboardHeader from '@/components/DashboardHeader';
import MetricCards from '@/components/MetricCards';
import SystemStatus from '@/components/SystemStatus';
import AlertsPanel from '@/components/AlertsPanel';
import LiveChart from '@/components/LiveChart';
import ControlPanel from '@/components/ControlPanel';

// ============================================================
// Set the ESP32 device IP address here, or null to stay in
// "Waiting for device…" state. Example: '192.168.1.100'
// ============================================================
const DEVICE_IP: string | null = null;

const Index = () => {
  const { metrics, systemState, diagnosticMessage, alerts, chartData, connectionStatus } =
    useDeviceConnection(DEVICE_IP);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <DashboardHeader connectionStatus={connectionStatus} />
      <MetricCards metrics={metrics} connectionStatus={connectionStatus} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <SystemStatus state={systemState} message={diagnosticMessage} connectionStatus={connectionStatus} />
        <div className="lg:col-span-2">
          <AlertsPanel alerts={alerts} connectionStatus={connectionStatus} />
        </div>
      </div>

      <div className="mb-6">
        <LiveChart data={chartData} connectionStatus={connectionStatus} />
      </div>

      <ControlPanel />
    </div>
  );
};

export default Index;
