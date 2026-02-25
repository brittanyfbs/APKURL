
import React, { useState } from 'react';
import { ChevronLeft, Globe } from 'lucide-react';
import { analyzeContent } from '../services/geminiService';
import { ScanResult } from '../types';

interface URLScanViewProps {
  onCancel: () => void;
  onComplete: (result: ScanResult) => void;
}

export const URLScanView: React.FC<URLScanViewProps> = ({ onCancel, onComplete }) => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const startScan = async () => {
    if (!url) return;
    setIsScanning(true);
    setProgress(0);
    
    // Start AI analysis immediately
    const analysisPromise = analyzeContent(url, 'URL');
    
    const steps = ["Initializing...", "Analyzing...", "Checking Patterns...", "Finalizing..."];
    
    // Dynamic progress racing - Faster approach
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += (100 - currentProgress) * 0.25; // Faster asymptotic approach
      const p = Math.floor(currentProgress);
      setProgress(p);
      setStatus(steps[Math.floor(p / 25)] || steps[3]);
      
      if (currentProgress > 99) clearInterval(interval);
    }, 80);

    // Wait for AI
    const analysis = await analysisPromise;
    clearInterval(interval);
    
    setProgress(100);
    setStatus("Complete!");
    // Instant transition

    const result: ScanResult = {
      id: Math.random().toString(36).substr(2, 9),
      name: url,
      type: 'URL',
      timestamp: new Date().toLocaleString(),
      ...analysis
    };

    onComplete(result);
  };

  // SVG Circle Constants
  const size = 200;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 10; // Extra padding to prevent clipping
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="animate-fadeIn min-h-[60vh] flex flex-col">
      <button 
        onClick={onCancel} 
        className="mb-6 flex items-center gap-1.5 text-slate-400 hover:text-slate-800 transition-colors font-bold text-sm group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      {!isScanning ? (
        <div className="space-y-6 flex-1">
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">URL Scanner</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Analyze links for phishing patterns and malicious redirects instantly.</p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Globe size={20} />
              </div>
              <input 
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://suspicous-link.com"
                className="w-full p-5 pl-14 bg-white border border-slate-200 rounded-[28px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-medium text-slate-700 placeholder:text-slate-300"
              />
            </div>

            <button 
              disabled={!url}
              onClick={startScan}
              className={`w-full py-5 rounded-[28px] font-black text-white tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 ${
                !url ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20'
              }`}
            >
              Start Security Analysis
            </button>
          </div>

          <div className="glass rounded-[32px] p-6 border border-white/50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Capabilities</h4>
            <div className="space-y-3">
              <CapabilityItem text="Typosquatting Detection" />
              <CapabilityItem text="Domain Trust Verification" />
              <CapabilityItem text="Suspicious Metadata Analysis" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-4 text-center animate-fadeIn">
          <div className="relative mb-10 flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx={center} cy={center} r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx={center} cy={center} r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="text-blue-600 transition-all duration-300 ease-out"
              />
            </svg>
            
            {/* Center Content */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">
                {progress}<span className="text-blue-600 text-3xl">%</span>
              </span>
            </div>
          </div>

          <div className="space-y-3 px-4">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Scanning URL...</h3>
            <div className="flex justify-center">
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] animate-pulse border border-blue-100">
                {status}
              </span>
            </div>
          </div>

          <div className="mt-12 max-w-[240px]">
            <p className="text-[11px] font-bold text-slate-400 bg-white/50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm leading-tight">
              AI is currently inspecting the link structure for security threats.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const CapabilityItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{text}</span>
  </div>
);
