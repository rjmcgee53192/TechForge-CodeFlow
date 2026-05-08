import { useState } from 'react'
import TypingEngine from './components/TypingEngine'
import SystemStats from './components/SystemStats'
import PerformanceGraph from './components/PerformanceGraph'
import ReviewPanel from './components/ReviewPanel'

function App() {
  const [isLive, setIsLive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [code, setCode] = useState('');

  return (
    <div className="flex min-h-screen w-full bg-slate-900 overflow-hidden">
      {/* Sidebar / Stats Panel (Left) */}
      <div className="hidden lg:flex flex-col p-6 border-r border-slate-800 bg-slate-900/50 space-y-6 w-80 xl:w-96 shrink-0 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
            TYPE<span className="text-cyan-500">STREAM</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
            Agentic Core v2.4
          </p>
        </div>
        
        <SystemStats onStatusChange={setIsLive} />
        <PerformanceGraph />
        <ReviewPanel code={code} wpm={wpm} accuracy={100} isLive={isLive} />
        
        <div className="flex-grow" />
        
        <div className="bg-slate-800/20 p-4 rounded-xl border border-slate-700/30">
          <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Active Node</p>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 ${isLive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'} rounded-full`} />
            <span className="text-xs text-slate-300 font-mono">us-east-runpod-a6000</span>
          </div>
        </div>
      </div>

      {/* Main Content (Center) */}
      <main className="flex-grow relative overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h1 className="text-xl font-black text-white tracking-tighter">
            TYPE<span className="text-cyan-500">STREAM</span>
          </h1>
        </div>

        <TypingEngine onComplete={(c, w) => { setCode(c); setWpm(w); }} />
      </main>
    </div>
  )
}

export default App
