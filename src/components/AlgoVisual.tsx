import React, { useState, useEffect } from 'react';

interface AlgoVisualProps {
  algorithmType: string;
  isTyping: boolean;
}

const AlgoVisual: React.FC<AlgoVisualProps> = ({ algorithmType, isTyping }) => {
  const [data, setData] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);

  // Initialize random data
  useEffect(() => {
    setData(Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10));
  }, [algorithmType]);

  // Simulate "Sorting" animation
  useEffect(() => {
    if (!isTyping) return;

    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const idx = Math.floor(Math.random() * (newData.length - 1));
        
        // Randomly swap or shift to simulate progress
        if (newData[idx] > newData[idx + 1]) {
          [newData[idx], newData[idx + 1]] = [newData[idx + 1], newData[idx]];
          setActiveIndices([idx, idx + 1]);
        } else {
          setActiveIndices([]);
        }
        
        return newData;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <div className="bg-slate-800/20 border border-slate-700/30 rounded-2xl p-6 w-full h-48 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
          Algorithm Visualization Engine
        </h4>
        <div className="flex gap-2">
          <span className="text-[9px] text-cyan-400 font-mono italic">{algorithmType}</span>
          <div className={`w-1.5 h-1.5 rounded-full ${isTyping ? 'bg-cyan-500 animate-pulse' : 'bg-slate-600'}`} />
        </div>
      </div>

      <div className="flex-grow flex items-end justify-between gap-1 px-2">
        {data.map((val, i) => (
          <div
            key={i}
            className={`w-full transition-all duration-300 rounded-t-sm ${
              activeIndices.includes(i) 
                ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]' 
                : 'bg-slate-700/50'
            }`}
            style={{ height: `${val}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between text-[8px] text-slate-600 font-mono uppercase">
        <span>O(n log n) Expected</span>
        <span>Buffer: 1024kb</span>
      </div>
    </div>
  );
};

export default AlgoVisual;
