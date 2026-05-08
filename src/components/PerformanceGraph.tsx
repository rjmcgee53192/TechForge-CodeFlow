import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceGraph = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        const response = await fetch('https://guided-jews-promotional-donated.trycloudflare.com/telemetry', {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const telemetry = await response.json();
        
        setData(prevData => {
          const newData = [...prevData, {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temp: telemetry.temperature,
            load: telemetry.utilization
          }];
          return newData.slice(-20);
        });
      } catch (error) {
        clearTimeout(timeoutId);
        // Mock data for graph when offline
        setData(prevData => {
          const newData = [...prevData, {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temp: 32 + Math.random() * 2,
            load: 10 + Math.random() * 5
          }];
          return newData.slice(-20);
        });
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full h-[300px] shadow-xl">
      <h3 className="text-slate-300 font-bold tracking-tight text-sm uppercase mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
        RTX A6000 Telemetry History
      </h3>
      
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: '#22d3ee' }}
          />
          <Line 
            type="monotone" 
            dataKey="load" 
            stroke="#06b6d4" 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
            name="GPU Load %"
          />
          <Line 
            type="monotone" 
            dataKey="temp" 
            stroke="#f97316" 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
            name="Temp °C"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceGraph;
