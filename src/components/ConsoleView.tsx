'use client';

import { useState } from 'react';
import { Play, Square, Loader2, Send, Zap, Sparkles } from 'lucide-react';
import { useVideoMemory } from '@/hooks/useVideoMemory';
import { askGemini } from '@/app/actions';

export default function ConsoleView() {
  const { 
    isRecording, 
    bufferUsage, 
    startRecording, 
    stopRecording, 
    videoRef, 
    canvasRef,
    getRecentFrames 
  } = useVideoMemory();

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // CIRCULAR PROGRESS VISUALIZATION
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (bufferUsage / 100) * circumference;

  const handleStop = () => {
    stopRecording();
  };

  const handleAsk = async () => {
     if (!query.trim()) return;
     
     const currentQuery = query;
     setMessages(prev => [...prev, { role: 'user', text: currentQuery }]);
     setQuery(''); 
     setIsAnalyzing(true); 

     const frames = getRecentFrames(5); 

     if (frames.length === 0) {
       setMessages(prev => [...prev, { role: 'ai', text: "I haven't seen anything yet! Tap the play button to let me watch for a while first." }]);
       setIsAnalyzing(false);
       return;
     }

     try {
       const result = await askGemini(currentQuery, frames);
       
       if (result.success) {
         setMessages(prev => [...prev, { role: 'ai', text: result.text }]);
       } else {
         setMessages(prev => [...prev, { role: 'ai', text: result.text || "Error connecting to AI." }]);
       }
       
     } catch (err) {
       console.error(err);
       setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error processing your memory." }]);
     } finally {
       setIsAnalyzing(false);
     }
  };

  return (
    <div className="flex flex-col h-full gap-4 max-w-md mx-auto">
      
      {/* CONTROL PANEL CARD */}
      <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-700 shadow-xl transition-all">
        
        {/* Buffer "Eye" Indicator */}
        <div className="relative w-16 h-16 flex items-center justify-center">
           <svg className="transform -rotate-90 w-full h-full">
             <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200 dark:text-slate-700" />
             <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" 
                     strokeDasharray={circumference} 
                     strokeDashoffset={strokeDashoffset}
                     strokeLinecap="round"
                     className={`${bufferUsage > 90 ? 'text-red-500' : 'text-blue-500'} transition-all duration-500 ease-out`} />
           </svg>
           <span className="absolute text-[10px] font-bold text-slate-600 dark:text-slate-300">{bufferUsage}%</span>
        </div>

        {/* Status Text */}
        <div className="flex-1 px-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {isRecording ? <span className="text-red-500 animate-pulse">● Rec</span> : 'Standby'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRecording ? 'Observing surroundings...' : 'Ready to help'}
            </p>
        </div>

        {/* Main Toggle Button */}
        <button
            onClick={isRecording ? handleStop : startRecording}
            className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
                isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
            }`}
        >
            {isRecording ? <Square fill="currentColor" size={20} /> : <Play fill="currentColor" size={24} className="ml-1"/>}
        </button>
      </div>

      {/* DUAL DISPLAY AREA */}
      <div className="flex-1 relative overflow-hidden rounded-3xl bg-black border border-slate-800 shadow-2xl">
         
         <canvas ref={canvasRef} className="hidden" width={640} height={480} />

         {/* LAYER 1: LIVE CAMERA FEED */}
         <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isRecording ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         />

         {/* LAYER 2: CHAT INTERFACE */}
         <div className={`absolute inset-0 flex flex-col bg-slate-50 dark:bg-slate-900 transition-opacity duration-500 ${!isRecording ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 space-y-2">
                        <Zap size={48} /> 
                        <p className="text-sm font-medium">Ask me about what I just saw.</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                            m.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isAnalyzing && (
                     <div className="flex justify-start">
                        <div className="bg-slate-200 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none animate-pulse text-xs font-mono flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" /> Thinking...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Bar & Footer */}
            <div className="bg-white dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800">
                <div className="p-3 flex gap-2">
                    <input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Where are my keys?"
                        disabled={isAnalyzing}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    />
                    <button 
                        onClick={handleAsk}
                        disabled={isAnalyzing || !query.trim()}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
                
                {/* POWERED BY GEMINI BADGE */}
                <div className="pb-2 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700 text-[10px] font-bold tracking-wide text-blue-600 dark:text-blue-400 shadow-sm">
                        <Sparkles size={10} fill="currentColor" />
                        POWERED BY GEMINI 3
                    </span>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}