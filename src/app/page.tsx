'use client';

import { useState, useEffect } from 'react';
import { History, Settings, Moon, Sun, Cpu, ShieldCheck, Eye, MessageSquare, Trash2, Lock } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ConsoleView from '@/components/ConsoleView';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode Class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100 transition-colors duration-500 overflow-hidden relative">
      
      {/* Content Area */}
      <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 scroll-smooth">
        
        {/* VIEW: HOME */}
        {activeTab === 'home' && (
          <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500 pb-20">
            
            {/* HERO SECTION */}
            <div className="text-center space-y-6 mt-8">
                <div className="relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30 animate-pulse"></div>
                <div className="relative bg-white dark:bg-slate-800 p-4 rounded-full shadow-xl">
                    <Cpu size={48} className="text-blue-600 dark:text-blue-400" />
                </div>
                </div>

                <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight">
                Recall.ai
                </h1>
                
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                Your external memory. I watch what you see, so you don't have to worry about forgetting.
                </p>

                <button 
                onClick={() => setActiveTab('console')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 w-full max-w-xs"
                >
                Start Remembering
                </button>
            </div>

            {/* WHAT IS THIS? */}
            <div className="w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 dark:border-slate-700 shadow-lg">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Eye className="text-blue-500" size={20}/> What is Recall?
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Recall is an AI-powered memory assistant designed for people who sometimes forget where they placed things. It acts like a temporary "dashcam" for your life, remembering the last 15 minutes of video so you can ask questions about it later.
                </p>
            </div>

            {/* HOW IT WORKS */}
            <div className="w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold ml-2">How it Works</h2>
                
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center gap-4 border border-white/20">
                        <div className="bg-blue-100 dark:bg-slate-700 p-3 rounded-full text-blue-600 dark:text-blue-400">
                            <Eye size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">1. Record</h3>
                            <p className="text-xs opacity-70">Point your camera at your room or desk. We store a temporary loop of the last 15 minutes.</p>
                        </div>
                    </div>

                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center gap-4 border border-white/20">
                        <div className="bg-purple-100 dark:bg-slate-700 p-3 rounded-full text-purple-600 dark:text-purple-400">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">2. Ask</h3>
                            <p className="text-xs opacity-70">Forgot something? Stop recording and ask "Where are my keys?" or "Did I take my pills?".</p>
                        </div>
                    </div>

                    <div className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center gap-4 border border-white/20">
                        <div className="bg-green-100 dark:bg-slate-700 p-3 rounded-full text-green-600 dark:text-green-400">
                            <Trash2 size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">3. Forget</h3>
                            <p className="text-xs opacity-70">Privacy first. Old video is automatically deleted forever every 15 minutes.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRIVACY POLICY */}
            <div className="w-full max-w-md bg-slate-900 text-slate-300 p-6 rounded-3xl shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                    <Lock className="text-green-400" size={20}/> Privacy Policy
                </h2>
                <ul className="space-y-3 text-sm list-disc pl-4 marker:text-green-500">
                    <li>
                        <strong className="text-white">Local First:</strong> Video is stored in your device's RAM (Random Access Memory), not on our servers.
                    </li>
                    <li>
                        <strong className="text-white">Auto-Wipe:</strong> If you close this tab or refresh the page, your video memory is instantly erased.
                    </li>
                    <li>
                        <strong className="text-white">AI Processing:</strong> Only when you ask a question do we send specific still images to Google Gemini for analysis. These images are not stored permanently.
                    </li>
                </ul>
            </div>

          </div>
        )}

        {/* VIEW: CONSOLE */}
        {activeTab === 'console' && (
          <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
             <ConsoleView />
          </div>
        )}

        {/* VIEW: HISTORY */}
        {activeTab === 'history' && (
           <div className="animate-in slide-in-from-right duration-300 h-full">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <History className="text-blue-500" />
              Memory Log
            </h2>
            <div className="flex flex-col items-center justify-center h-3/4 text-slate-400 dark:text-slate-500 space-y-4">
               <History size={64} strokeWidth={1} />
               <p>No memories recorded yet.</p>
            </div>
           </div>
        )}

        {/* VIEW: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="animate-in slide-in-from-right duration-300">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <Settings className="text-blue-500" />
              Settings
            </h2>
            
            <div className="space-y-4">
              <div className="p-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-slate-700 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-slate-700 rounded-xl">
                    {isDarkMode ? <Moon size={20} className="text-blue-600 dark:text-blue-300"/> : <Sun size={20} className="text-orange-500"/>}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Appearance</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}