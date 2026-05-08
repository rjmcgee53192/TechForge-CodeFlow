import { useState, useEffect } from 'react';

interface ReviewPanelProps {
  code: string;
  wpm: number;
  accuracy: number;
  isLive: boolean;
}

const ReviewPanel = ({ code, wpm, accuracy, isLive }: ReviewPanelProps) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const requestReview = async () => {
    if (!isLive) return;
    setLoading(true);
    setAnalysis('');
    setDisplayText('');

    try {
      const response = await fetch('https://guided-jews-promotional-donated.trycloudflare.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          metadata: { wpm, accuracy }
        })
      });
      const data = await response.json();
      setAnalysis(data.analysis || 'The Architect is silent.');
    } catch (error) {
      console.error('AI Review failed:', error);
      setAnalysis('The Architect is currently offline. Wake the Lab to enable.');
    } finally {
      setLoading(false);
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (analysis && !loading) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(analysis.slice(0, i + 1));
        i++;
        if (i >= analysis.length) {
          clearInterval(interval);
        }
      }, 25);
      return () => clearInterval(interval);
    }
  }, [analysis, loading]);

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 w-full shadow-2xl relative overflow-hidden group mt-6">
      {/* Glowing border effect */}
      <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 transition-all duration-500 rounded-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-300 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
          AI Architect Review
        </h3>
        <button
          onClick={requestReview}
          disabled={!isLive || loading}
          title={!isLive ? "AI Architect is currently offline. Wake the Lab to enable." : ""}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            !isLive ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' :
            loading ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' :
            'bg-cyan-500 text-slate-900 hover:bg-cyan-400 hover:scale-105 active:scale-95'
          }`}
        >
          {loading ? 'Analyzing...' : 'Request Review'}
        </button>
      </div>

      <div className="min-h-[120px] bg-slate-900/50 rounded-xl border border-slate-700/30 p-4 font-mono text-[11px] leading-relaxed relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[120px] space-y-3">
            <div className="text-cyan-400 animate-pulse uppercase tracking-[0.3em] text-[10px]">Matrix Analysis in Progress</div>
            <div className="w-32 h-0.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 animate-[shimmer_1.5s_infinite]" style={{ width: '100%' }} />
            </div>
          </div>
        ) : displayText ? (
          <div className="text-slate-300 whitespace-pre-wrap">
            <span className="text-cyan-500 mr-2 font-black">ARCHITECT_LOG:</span>
            {displayText}
            <span className="w-1.5 h-3 bg-cyan-500 inline-block ml-1 animate-pulse align-middle" />
          </div>
        ) : (
          <div className="text-slate-600 italic flex items-center justify-center h-[120px] text-center px-4">
            Awaiting code submission. The Architect does not tolerate mediocrity.
          </div>
        )}
      </div>

      {!isLive && (
        <div className="mt-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
          <span className="text-[9px] text-amber-500 uppercase font-bold tracking-widest">
            Offline: Wake A6000 Pod for AI Review
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewPanel;
