
import React from 'react';
import { Home, History, Settings, ShieldCheck, BrainCircuit } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, showNav = true }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden ring-1 ring-slate-200">
      {/* Premium Header */}
      <header className="glass border-b border-white/50 p-4 sticky top-0 z-[60] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-1.5 rounded-xl shadow-lg shadow-blue-200">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="text-base font-extrabold text-slate-800 tracking-tight">APKURL<span className="text-blue-600">.</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            PRO
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto ${showNav ? 'pb-40' : 'pb-10'} px-5 pt-6 no-scrollbar`}>
        {children}
      </main>

      {/* Ultra-Premium Obsidian Floating Navigation Bar */}
      {showNav && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[94%] max-w-[390px] z-[70]">
          <nav className="bg-[#03050a] backdrop-blur-3xl rounded-[44px] flex justify-around items-center px-4 py-4 shadow-[0_30px_70px_rgba(0,0,0,0.7)] border border-white/5 ring-1 ring-white/[0.02]">
            <NavButton 
              active={activeTab === 'home'} 
              onClick={() => setActiveTab('home')} 
              icon={<Home size={24} strokeWidth={2.2} />} 
              label="Home" 
            />
            <NavButton 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')} 
              icon={<History size={24} strokeWidth={2.2} />} 
              label="History" 
            />
            <NavButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
              icon={<Settings size={24} strokeWidth={2.2} />} 
              label="Settings" 
            />
          </nav>
        </div>
      )}
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className="relative flex flex-col items-center justify-center flex-1 h-[72px] group outline-none select-none transition-all"
  >
    {/* Even Larger Blue Circular Highlight - Frames both Icon and Text comfortably */}
    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] rounded-full transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${
      active 
        ? 'bg-blue-600 opacity-100 scale-100 shadow-[0_0_35px_rgba(37,99,235,0.7)]' 
        : 'bg-transparent opacity-0 scale-50'
    }`} />
    
    {/* Icon Container - Elevated when active */}
    <div className={`relative z-10 transition-all duration-300 transform ${
      active ? 'text-white scale-110 translate-y-[-2px]' : 'text-slate-600 group-hover:text-slate-400'
    }`}>
      {icon}
    </div>
    
    {/* Label - Sentence Case, High Visibility */}
    <span className={`relative z-10 text-[11px] font-bold tracking-tight mt-1 transition-all duration-300 ${
      active ? 'text-white' : 'text-slate-700'
    }`}>
      {label}
    </span>
    
    {/* Premium Animated Indicator Dot */}
    <div className={`absolute bottom-[-10px] w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-500 ease-spring ${
      active ? 'opacity-100 scale-100 translate-y-0 shadow-[0_0_10px_#60a5fa]' : 'opacity-0 scale-0 translate-y-2'
    }`} />
  </button>
);
