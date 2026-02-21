import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { ChartDataPoint, ConnectionStatus } from '@/hooks/useDeviceConnection';

interface LiveChartProps {
  data: ChartDataPoint[];
  connectionStatus: ConnectionStatus;
}

const LiveChart = ({ data, connectionStatus }: LiveChartProps) => {
  const isWaiting = connectionStatus === 'disconnected' || connectionStatus === 'connecting';
  const hasData = data.length > 0;

  return (
    <div id="live-chart" className="card-industrial">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary/70" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live Telemetry</h3>
      </div>
      <div className="h-64">
        {isWaiting || !hasData ? (
          <div className="h-full flex items-center justify-center border border-dashed border-border rounded-md">
            <p className="text-sm text-muted-foreground font-mono">
              {isWaiting ? 'Waiting for device…' : 'No data received yet'}
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 20%)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'hsl(215 12% 50%)' }}
                stroke="hsl(220 13% 20%)"
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(215 12% 50%)' }}
                stroke="hsl(220 13% 20%)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220 18% 13%)',
                  border: '1px solid hsl(220 13% 20%)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'hsl(210 20% 92%)',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: 'hsl(215 12% 50%)' }}
              />
              <Line
                type="monotone"
                dataKey="flow"
                name="Flow (L/min)"
                stroke="hsl(187 70% 45%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: 'hsl(187 70% 45%)' }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="current"
                name="Current (A)"
                stroke="hsl(152 60% 42%)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: 'hsl(152 60% 42%)' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default LiveChart;
