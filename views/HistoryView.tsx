
import React from 'react';
import { Trash2, Link2, FileCode } from 'lucide-react';
import { ScanResult, RiskLevel } from '../types';

interface HistoryViewProps {
  history: ScanResult[];
  onSelectItem: (item: ScanResult) => void;
  onClear: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectItem, onClear }) => {
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Scan History</h2>
        {history.length > 0 && (
          <button onClick={onClear} className="text-red-500 hover:text-red-600 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Clock className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No history found</p>
            <p className="text-slate-400 text-xs mt-1">
              Your scan history will appear here.
            </p>
          </div>
        ) : (
          history.map((scan) => (
            <button
              key={scan.id}
              onClick={() => onSelectItem(scan)}
              className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${scan.type === 'URL' ? 'bg-blue-100' : 'bg-indigo-100'}`}>
                  {scan.type === 'URL' ? <Link2 className="w-5 h-5 text-blue-600" /> : <FileCode className="w-5 h-5 text-indigo-600" />}
                </div>
                <div className="overflow-hidden">
                  <div className="font-semibold text-slate-800 truncate max-w-[180px]">{scan.name}</div>
                  <div className="text-[10px] text-slate-400">{scan.timestamp}</div>
                </div>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${
                scan.riskLevel === RiskLevel.HIGH ? 'bg-red-100 text-red-600' :
                scan.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-100 text-yellow-600' :
                'bg-green-100 text-green-600'
              }`}>
                {scan.riskLevel}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
