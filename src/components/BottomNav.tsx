import { Home, Terminal, History, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'console', icon: Terminal, label: 'Console' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="flex justify-around items-center bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-3xl shadow-lg p-4 h-20">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full transition-all duration-300 ${
              activeTab === item.id
                ? 'text-blue-600 dark:text-blue-400 scale-110'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}