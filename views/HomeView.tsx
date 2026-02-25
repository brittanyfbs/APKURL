
import React from 'react';
import { Link2, FileCode, ChevronRight, ArrowUpRight, Layout as LayoutIcon } from 'lucide-react';
import { Stats, ScanResult, RiskLevel } from '../types';

interface HomeViewProps {
  stats: Stats;
  recentScans: ScanResult[];
  onScanURL: () => void;
  onScanAPK: () => void;
  onViewAll: () => void;
  onSelectItem: (item: ScanResult) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ stats, recentScans, onScanURL, onScanAPK, onViewAll, onSelectItem }) => {
  return (
    <div className="animate-fadeIn space-y-8">
      {/* Welcome Section */}
      <section>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Security Center</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">Dual-engine AI protection is active and monitoring.</p>
      </section>

      {/* Main Actions Grid */}
      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <ActionButton 
            onClick={onScanURL} 
            icon={<Link2 size={24} />} 
            title="Scan URL" 
            subtitle="Check phishing links"
            color="bg-blue-600"
          />
          <ActionButton 
            onClick={onScanAPK} 
            icon={<FileCode size={24} />} 
            title="Scan APK" 
            subtitle="Analyze app safety"
            color="bg-indigo-600"
          />
        </div>
      </section>

      {/* Insight Dashboard */}
      <section className="dark-glass rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden border border-white/5">
        <div className="absolute -right-4 -top-4 opacity-10 blur-xl w-32 h-32 bg-blue-500 rounded-full"></div>
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dashboard Overview</span>
          </div>
          
          <div className="grid grid-cols-2 gap-8 divide-x divide-white/10">
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter">{stats.totalScans}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Total Scans</span>
            </div>
            <div className="flex flex-col pl-8">
              <span className="text-3xl font-black tracking-tighter text-red-400">{stats.highRiskCount}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">High Risks</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Last Scan Activity</span>
              <span className="font-bold text-slate-200">{stats.lastScanTime.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity List */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Recent Activity</h3>
          <button 
            onClick={onViewAll} 
            className="flex items-center gap-1 text-blue-600 text-[11px] font-black uppercase tracking-wider group"
          >
            All History <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="space-y-3">
          {recentScans.length === 0 ? (
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[28px] py-12 text-center">
              <p className="text-slate-400 text-xs font-medium italic">Your security history is empty.</p>
            </div>
          ) : (
            recentScans.map((scan) => (
              <button
                key={scan.id}
                onClick={() => onSelectItem(scan)}
                className="w-full group flex items-center justify-between p-4 bg-white rounded-[24px] border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left animate-fadeIn"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                    scan.type === 'URL' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                  }`}>
                    {scan.type === 'URL' ? <Link2 size={20} /> : <FileCode size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm truncate max-w-[140px] leading-tight mb-0.5">{scan.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{scan.type} • {scan.timestamp.split(',')[0]}</div>
                  </div>
                </div>
                <div className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                  scan.riskLevel === RiskLevel.HIGH ? 'bg-red-50 text-red-600' :
                  scan.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-50 text-yellow-600' :
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {scan.riskLevel}
                </div>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ActionButton = ({ onClick, icon, title, subtitle, color }: { onClick: () => void, icon: React.ReactNode, title: string, subtitle: string, color: string }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start p-5 bg-white border border-slate-200 rounded-[32px] hover:shadow-2xl hover:shadow-slate-200 transition-all group relative overflow-hidden active:scale-95"
  >
    <div className={`w-12 h-12 ${color} rounded-[20px] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-inherit/20`}>
      {icon}
    </div>
    <div className="text-left">
      <h4 className="font-black text-slate-900 text-sm tracking-tight">{title}</h4>
      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{subtitle}</p>
    </div>
    <div className="absolute top-4 right-4 text-slate-200 group-hover:text-slate-400 transition-colors">
      <ArrowUpRight size={16} />
    </div>
  </button>
);
