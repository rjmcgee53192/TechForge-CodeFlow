import { useState, useEffect } from 'react';

const SystemStats = ({ onStatusChange }: { onStatusChange: (status: boolean) => void }) => {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    memoryTotal: 16,
    gpuTemp: 0,
    status: 'CONNECTING',
    isLive: false
  });

  useEffect(() => {
    const fetchTelemetry = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        const response = await fetch('https://guided-jews-promotional-donated.trycloudflare.com/telemetry', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await response.json();
        setStats({
          cpu: data.utilization,
          memory: data.vram_used,
          memoryTotal: data.vram_total,
          gpuTemp: data.temperature,
          status: 'LIVE: RTX A6000',
          isLive: true
        });
        onStatusChange(true);
      } catch (error) {
        clearTimeout(timeoutId);
        // Failover to Demo Mode
        setStats(prev => ({
          ...prev,
          cpu: 15 + Math.random() * 10,
          memory: 4.2 + Math.random() * 0.5,
          memoryTotal: 48,
          gpuTemp: 32 + Math.random() * 5,
          status: 'DEMO MODE',
          isLive: false
        }));
        onStatusChange(false);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full max-w-xs space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-300 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${stats.isLive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
          System Diagnostics
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${stats.isLive ? 'bg-slate-700/50 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
          {stats.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* GPU Load */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>GPU Load</span>
            <span className="text-cyan-400 font-mono">{Math.round(stats.cpu)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(6,182,212,0.5)] ${stats.isLive ? 'bg-cyan-500' : 'bg-slate-500'}`}
              style={{ width: `${stats.cpu}%` }}
            />
          </div>
        </div>

        {/* VRAM Usage */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>VRAM Usage</span>
            <span className="text-cyan-400 font-mono">{stats.memory.toFixed(1)} GB / {stats.memoryTotal.toFixed(0)} GB</span>
          </div>
          <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${stats.isLive ? 'bg-cyan-400' : 'bg-slate-400'}`}
              style={{ width: `${(stats.memory / stats.memoryTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* GPU Temp */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400">Core Temp</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold font-mono ${stats.isLive ? (stats.gpuTemp > 75 ? 'text-orange-400' : 'text-cyan-400') : 'text-slate-400'}`}>
              {Math.round(stats.gpuTemp)}°C
            </span>
            <div className="text-[10px] text-slate-500 italic">NVIDIA RTX A6000</div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="text-[9px] text-slate-500 text-center uppercase tracking-[0.2em]">
          {stats.isLive ? 'Hardware Bridge: ACTIVE' : 'Hardware Bridge: OFFLINE (DEMO)'}
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
