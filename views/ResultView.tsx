
import { ChevronLeft, ShieldAlert, ShieldCheck, AlertTriangle, Info, Trash2, Globe, FileDigit, ExternalLink, BarChart3 } from 'lucide-react';
import { ScanResult, RiskLevel } from '../types';
import React from 'react';

interface ResultViewProps {
  result: ScanResult;
  onClose: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onClose }) => {
  const isHigh = result.riskLevel === RiskLevel.HIGH;

  const statusThemes = {
    [RiskLevel.HIGH]: {
      bg: 'bg-red-600',
      text: 'text-red-600',
      lightBg: 'bg-red-50',
      borderColor: 'border-red-100',
      icon: <ShieldAlert size={48} className="text-white" />
    },
    [RiskLevel.MEDIUM]: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      lightBg: 'bg-yellow-50',
      borderColor: 'border-yellow-100',
      icon: <AlertTriangle size={48} className="text-white" />
    },
    [RiskLevel.LOW]: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-600',
      lightBg: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      icon: <ShieldCheck size={48} className="text-white" />
    }
  };

  const theme = statusThemes[result.riskLevel];

  return (
    <div className="animate-fadeIn pb-24 space-y-6">
      <button 
        onClick={onClose} 
        className="flex items-center gap-1.5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Center
      </button>

      {/* Impact Header */}
      <div className={`${theme.bg} rounded-[40px] p-10 text-center shadow-2xl relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
          {/* Fix: Use React.ReactElement<any> to allow the 'size' prop when cloning Lucide icons */}
          {React.cloneElement(theme.icon as React.ReactElement<any>, { size: 200 })}
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-5 rounded-[32px] backdrop-blur-md border border-white/20 shadow-xl">
              {theme.icon}
            </div>
          </div>
          <h2 className="text-4xl font-black mb-1 uppercase tracking-tighter text-white">
            {result.riskLevel} Risk
          </h2>
          <div className="text-[10px] bg-black/20 text-white/80 inline-block px-4 py-1 rounded-full font-black uppercase tracking-widest backdrop-blur-sm">
            Analysis Complete • {result.timestamp.split(',')[0]}
          </div>
        </div>
      </div>

      {/* Option B: High Risk STOP Warning */}
      {isHigh && (
        <div className="bg-red-600 rounded-[32px] p-8 text-white shadow-xl animate-pulse border-4 border-red-400">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white text-red-600 p-3 rounded-2xl">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter">STOP! DANGER DETECTED</h3>
              <p className="text-xs font-bold text-red-100">Security protocols recommend immediate termination.</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed font-medium bg-black/20 p-4 rounded-2xl border border-white/10">
            Our AI has identified critical threats that could compromise your personal data, financial accounts, or device integrity. 
            <span className="block mt-2 font-black underline">DO NOT PROCEED WITH THIS {result.type}.</span>
          </p>
        </div>
      )}

      {/* Source Details Card */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${result.type === 'URL' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
            {result.type === 'URL' ? <Globe size={28} /> : <FileDigit size={28} />}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target {result.type}</span>
            <div className="font-bold text-slate-800 break-all text-sm leading-snug">{result.name}</div>
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Info size={14} className="text-blue-600" />
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Detailed Analysis</h3>
        </div>
        
        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-6 text-slate-700 text-sm leading-relaxed font-medium shadow-inner">
          {result.explanation}
        </div>
      </section>

      {/* Detected Threats */}
      {result.detectedIssues.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <ShieldAlert size={14} className="text-red-600" />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identified Indicators</h3>
          </div>
          
          <div className="grid gap-2">
            {result.detectedIssues.map((issue, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-4 bg-white border ${theme.borderColor} rounded-2xl animate-fadeIn`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${theme.bg}`}></div>
                <span className="text-[11px] font-bold text-slate-700 leading-tight">{issue}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="pt-4 space-y-3">
        {isHigh && (
          <button 
            onClick={() => {
              alert("Security protocols activated. The threat has been isolated and your device is now protected.");
              onClose();
            }}
            className="w-full py-5 bg-red-600 text-white font-black rounded-[28px] shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 size={20} /> Safeguard Device Now
          </button>
        )}
        <button 
          onClick={onClose}
          className="w-full py-5 bg-slate-900 text-white font-black rounded-[28px] shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95 border border-white/10"
        >
          Finish Security Review
        </button>
      </div>
    </div>
  );
};
