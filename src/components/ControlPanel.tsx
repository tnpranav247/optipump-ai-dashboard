import { Play, Square, RotateCcw } from 'lucide-react';

// ============================================================
// Control Panel – UI Only
// ============================================================
// These buttons are visual prototypes. Wire them to the ESP32
// by sending commands via REST or WebSocket:
//   fetch(`http://${DEVICE_IP}/control`, { method: 'POST', body: JSON.stringify({ action: 'start' }) })
// ============================================================

const ControlPanel = () => {
  return (
    <div id="control-panel" className="card-industrial">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Controls
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          id="btn-start-pump"
          className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
            bg-success/10 text-success border border-success/20 hover:bg-success/20"
        >
          <Play className="w-4 h-4" />
          Start Pump
        </button>
        <button
          id="btn-stop-pump"
          className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
            bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20"
        >
          <Square className="w-4 h-4" />
          Stop Pump
        </button>
        <button
          id="btn-reset-alarm"
          className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
            bg-secondary text-secondary-foreground border border-border hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Alarm
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
