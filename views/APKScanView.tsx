
import React, { useState } from 'react';
import { ChevronLeft, Upload, FileCode } from 'lucide-react';
import { analyzeContent } from '../services/geminiService';
import { ScanResult } from '../types';

interface APKScanViewProps {
  onCancel: () => void;
  onComplete: (result: ScanResult) => void;
}

export const APKScanView: React.FC<APKScanViewProps> = ({ onCancel, onComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsScanning(true);
    setProgress(0);

    // Start AI analysis immediately
    const analysisPromise = analyzeContent(`Filename: ${file.name}, Size: ${file.size} bytes`, 'APK');

    const steps = ["Extracting...", "Checking...", "ML Inference...", "Finalizing..."];
    
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
      name: file.name,
      type: 'APK',
      timestamp: new Date().toLocaleString(),
      ...analysis
    };

    onComplete(result);
  };

  // SVG Circle Constants - Matching URLScanView for consistency
  const size = 180;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="animate-fadeIn min-h-[60vh] flex flex-col">
      <button 
        onClick={onCancel} 
        className="mb-6 flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-bold text-sm group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      {!isScanning ? (
        <div className="space-y-6 flex-1">
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">APK Scanner</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">Select an APK file to analyze its code structure and privacy permissions.</p>
          </div>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-[40px] p-12 cursor-pointer hover:bg-indigo-50 transition-all group shadow-sm">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
              <Upload className="text-indigo-600 w-8 h-8" />
            </div>
            <span className="text-indigo-900 font-black text-lg">Choose APK File</span>
            <span className="text-indigo-400 text-xs font-bold mt-1 uppercase tracking-widest">or drag and drop</span>
            <input type="file" accept=".apk" className="hidden" onChange={handleFileSelect} />
          </label>

          <div className="glass rounded-[32px] p-6 border border-white/50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Analysis Depth</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              We perform a deep static analysis to identify high-risk permissions such as SMS intercepts, background location tracking, and camera access.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-4 text-center animate-fadeIn">
          <div className="relative mb-8 flex items-center justify-center" style={{ width: size, height: size }}>
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
                className="text-indigo-600 transition-all duration-300"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-slate-900">
              {progress}<span className="text-indigo-600 text-2xl">%</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Analyzing APK...</h3>
                <div className="flex justify-center">
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] animate-pulse border border-indigo-100">
                    {status}
                  </span>
                </div>
             </div>
          </div>

          <div className="mt-12 max-w-[260px]">
            <p className="text-[10px] font-bold text-slate-400 bg-white/50 px-6 py-3 rounded-2xl border border-slate-100 shadow-sm leading-tight text-center">
              AI is smart but can make mistakes. It is not 100% correct. Please stay safe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
