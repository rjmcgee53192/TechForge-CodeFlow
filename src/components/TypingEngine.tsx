import React, { useState, useEffect, useRef, useMemo } from 'react';
import AlgoVisual from './AlgoVisual';
import { LibrarySchema, Challenge } from '../schemas/librarySchema';
import libraryRaw from '../data/library.json';



const TypingEngine: React.FC<{ onComplete: (code: string, wpm: number) => void }> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  // Stutter-Check: Use refs for high-frequency data
  const inputRef = useRef(input);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundjay.com/communication/typewriter-key-1.mp3');
    if (audioRef.current) audioRef.current.volume = 0.2;
  }, []);

  const playClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Zod Validation & Library Init
  const library = useMemo(() => {
    try {
      return LibrarySchema.parse(libraryRaw);
    } catch (e) {
      console.error("Library Validation Failed", e);
      return [];
    }
  }, []);

  const detectAlgoType = (title: string) => {
    if (title.toLowerCase().includes('sort')) return 'Sorting';
    if (title.toLowerCase().includes('search')) return 'Searching';
    if (title.toLowerCase().includes('tree')) return 'Tree Traversal';
    if (title.toLowerCase().includes('graph')) return 'Graph Traversal';
    return 'Data Processing';
  };

  useEffect(() => {
    // Initialize with a random challenge from the library
    if (library && library.length > 0) {
      const randomChallenge = library[Math.floor(Math.random() * library.length)];
      setCurrentChallenge(randomChallenge);
    }
  }, [library]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    inputRef.current = val; // Direct ref update for zero-lag tracking
    playClick();
    
    if (!startTime) setStartTime(Date.now());
    setInput(val);
    setIsTyping(true);

    // Throttled UI Updates
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);

    if (currentChallenge && val === currentChallenge.code) {
      const timeTaken = (Date.now() - (startTime || Date.now())) / 1000 / 60;
      const words = currentChallenge.code.split(' ').length;
      const finalWpm = Math.round(words / timeTaken);
      setWpm(finalWpm);
      onComplete(val, finalWpm);
    }
  };

  if (!currentChallenge) return <div className="text-white">Loading challenges...</div>;

  return (
    <div className="flex flex-col items-center justify-center p-8 font-mono relative overflow-hidden">
      {/* CRT Scanline Effect Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanline opacity-20" />
      
      <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-sm rounded-xl shadow-[0_0_50px_rgba(0,243,255,0.1)] overflow-hidden border border-slate-800 relative z-10">
        <div className="bg-slate-800/50 px-6 py-3 flex justify-between items-center border-b border-slate-700">
          <span className="text-cyan-400 font-bold animate-matrix-glow">{currentChallenge.title}</span>
          <span className="text-xs uppercase tracking-widest text-slate-500 font-black">{currentChallenge.difficulty} | {currentChallenge.language}</span>
        </div>
        
        <div className="p-8 space-y-8">
          <AlgoVisual 
            algorithmType={detectAlgoType(currentChallenge.title)} 
            isTyping={isTyping} 
          />

          <div className="relative">
            <pre className="text-lg leading-relaxed whitespace-pre-wrap break-all opacity-50 select-none">
              {currentChallenge.code}
            </pre>
            <textarea
              autoFocus
              className="absolute top-0 left-0 w-full h-full bg-transparent text-lg leading-relaxed whitespace-pre-wrap break-all outline-none resize-none text-cyan-300 caret-cyan-500"
              value={input}
              onChange={handleInputChange}
              spellCheck={false}
            />
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-slate-700">
            <div className="flex space-x-8">
              <div>
                <p className="text-xs text-slate-500 uppercase">WPM</p>
                <p className="text-2xl font-bold text-cyan-400">{wpm}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Accuracy</p>
                <p className="text-2xl font-bold text-emerald-400">100%</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 transition-colors rounded-lg font-bold text-sm"
            >
              Next Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingEngine;
