import { Play, Square, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const ControlPanel = () => {
  const [pumpRunning, setPumpRunning] = useState(true);

  return (
    <div className="card-industrial">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Controls
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setPumpRunning(true)}
          disabled={pumpRunning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
            bg-success/10 text-success border border-success/20 hover:bg-success/20 
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Start Pump
        </button>
        <button
          onClick={() => setPumpRunning(false)}
          disabled={!pumpRunning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
            bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Square className="w-4 h-4" />
          Stop Pump
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200
            bg-secondary text-secondary-foreground border border-border hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Alert
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
