
import React, { useState } from 'react';
import { 
  Shield, Bell, Database, Trash2, Info, 
  ChevronRight, Lock, Globe, Smartphone, 
  ExternalLink, Github
} from 'lucide-react';

interface SettingsViewProps {
}

export const SettingsView: React.FC<SettingsViewProps> = () => {
  const [settings, setSettings] = useState({
    realtimeProtection: true,
    notifications: true,
    autoScanUrl: false,
    analytics: true
  });
  const [dbVersion, setDbVersion] = useState('2024.03.18.01');
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdate = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setTimeout(() => {
      const now = new Date();
      const newVersion = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}.02`;
      setDbVersion(newVersion);
      setIsUpdating(false);
      alert("Security database successfully updated to the latest version!");
    }, 2000);
  };

  return (
    <div className="animate-fadeIn pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure your protection engine.</p>
      </div>

      <div className="space-y-6">
        {/* Security Section */}
        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Security Engine</h3>
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <ToggleItem 
              icon={<Shield className="text-blue-500" />} 
              title="Real-time Protection" 
              description="Monitor active processes for threats"
              checked={settings.realtimeProtection}
              onChange={() => toggleSetting('realtimeProtection')}
            />
            <ToggleItem 
              icon={<Globe className="text-emerald-500" />} 
              title="URL Auto-Scan" 
              description="Automatically scan URLs in clipboard"
              checked={settings.autoScanUrl}
              onChange={() => toggleSetting('autoScanUrl')}
            />
            <div className="flex items-center justify-between p-4 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <Database className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Security Database</div>
                  <div className="text-[10px] text-slate-400">Version: {dbVersion}</div>
                </div>
              </div>
              <button 
                onClick={handleUpdate}
                disabled={isUpdating}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform ${
                  isUpdating ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'
                }`}
              >
                {isUpdating ? 'Updating...' : 'Update Now'}
              </button>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">App Preferences</h3>
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <ToggleItem 
              icon={<Bell className="text-orange-500" />} 
              title="Notifications" 
              description="Push alerts for detected phishing"
              checked={settings.notifications}
              onChange={() => toggleSetting('notifications')}
            />
          </div>
        </section>

        {/* About Section */}
        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">About</h3>
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">APKURL Blocker</h4>
                <p className="text-[10px] text-slate-400">Gemini-Powered Security V1.0.4</p>
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[10px] font-medium text-slate-400">Build: 2026-FEB-25</span>
              </div>
              <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded">SYSTEM STABLE</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ToggleItem = ({ icon, title, description, checked, onChange }: { 
  icon: React.ReactNode, title: string, description: string, checked: boolean, onChange: () => void 
}) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <div className="text-sm font-bold text-slate-800 leading-none mb-1">{title}</div>
        <div className="text-[10px] text-slate-400 font-medium">{description}</div>
      </div>
    </div>
    <button 
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-all duration-300 relative ${checked ? 'bg-blue-600 shadow-inner' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 transform ${checked ? 'translate-x-[20px]' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

const AboutLink = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <button className="flex items-center justify-between w-full group">
    <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-600 transition-colors">
      <div className="p-1 rounded bg-slate-50 group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <span className="text-xs font-bold">{text}</span>
    </div>
    <ChevronRight className="w-3 h-3 text-slate-200 group-hover:text-blue-300 transition-colors" />
  </button>
);
