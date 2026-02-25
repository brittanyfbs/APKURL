
import React from 'react';
import { 
  Calendar, CheckSquare, Rocket, 
  Target, Zap, AlertCircle, 
  ChevronRight, ListTodo, GraduationCap 
} from 'lucide-react';

export const IncubatorView: React.FC = () => {
  const roadmap = [
    { week: '1-2', title: 'Data Acquisition', task: 'Source 50/50 Balanced Dataset (PhishTank + Tranco)', status: 'todo' },
    { week: '3-4', title: 'Feature Extraction', task: 'Convert URLs to Numeric Vectors (Python)', status: 'todo' },
    { week: '5-6', title: 'UI Core Build', task: 'Develop React Components & Gemini Integration', status: 'current' },
    { week: '7-8', title: 'Model Integration', task: 'Deploy Custom ML Engine via API/TFJS', status: 'upcoming' },
    { week: '9-10', title: 'Hardening', task: 'Final Security Audit & Edge Case Testing', status: 'upcoming' },
  ];

  return (
    <div className="animate-fadeIn pb-20">
      <div className="mb-8 mt-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">10-Week Incubator</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Your step-by-step path to a successful build.</p>
      </div>

      {/* Progress Card */}
      <section className="bg-blue-600 rounded-[32px] p-6 text-white mb-8 shadow-xl shadow-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-200" />
            <span className="text-xs font-black uppercase tracking-widest">Active Sprint</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold">Week 5-6</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">Building the Frontend</h3>
        <p className="text-blue-100 text-xs leading-relaxed mb-6">
          Focusing on the React UI and integrating the Gemini API for initial threat logic.
        </p>
        <div className="w-full bg-blue-700 h-2 rounded-full overflow-hidden">
          <div className="bg-emerald-400 h-full w-[45%]" />
        </div>
      </section>

      {/* Success Checklist */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">ML Success Checklist</h3>
        </div>
        <div className="bg-white border border-slate-100 rounded-[32px] p-2 shadow-sm">
          <CheckItem title="Strict 50/50 Class Balance" desc="Prevents the model from guessing the majority class." checked />
          <CheckItem title="Numeric Feature Extraction" desc="Converting URL text into math the model understands." checked />
          <CheckItem title="Train/Test Leakage Check" desc="Ensure the model hasn't seen the test data during training." />
          <CheckItem title="API Key Security" desc="Safely handling environment variables for Gemini." />
        </div>
      </section>

      {/* 10-Week Roadmap */}
      <section>
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Full Project Timeline</h3>
        </div>
        <div className="space-y-4">
          {roadmap.map((item, i) => (
            <div key={i} className={`p-5 rounded-3xl border transition-all ${
              item.status === 'current' ? 'bg-white border-blue-500 shadow-md scale-[1.02]' : 
              item.status === 'todo' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100'
            }`}>
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                   item.status === 'current' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>Week {item.week}</span>
                {item.status === 'current' && <Rocket className="w-4 h-4 text-blue-600" />}
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1">{item.task}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const CheckItem = ({ title, desc, checked = false }: { title: string, desc: string, checked?: boolean }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
      checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white'
    }`}>
      {checked && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
    <div>
      <h5 className={`text-xs font-bold ${checked ? 'text-slate-800' : 'text-slate-400'}`}>{title}</h5>
      <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
    </div>
  </div>
);
