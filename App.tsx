
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { RiskLevel, ScanResult, Stats } from './types';
import { HomeView } from './views/HomeView';
import { URLScanView } from './views/URLScanView';
import { APKScanView } from './views/APKScanView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { ResultView } from './views/ResultView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('main');
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('apkurl_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (result: ScanResult) => {
    const updated = [result, ...history];
    setHistory(updated);
    localStorage.setItem('apkurl_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('apkurl_history');
  };

  const stats: Stats = {
    totalScans: history.length,
    highRiskCount: history.filter(h => h.riskLevel === RiskLevel.HIGH).length,
    lastScanTime: history.length > 0 ? history[0].timestamp : 'Never',
  };

  const renderContent = () => {
    if (currentView === 'url_scan') {
      return (
        <URLScanView 
          onCancel={() => setCurrentView('main')} 
          onComplete={(res) => {
            saveToHistory(res);
            setSelectedResult(res);
            setCurrentView('result');
          }} 
        />
      );
    }

    if (currentView === 'apk_scan') {
      return (
        <APKScanView 
          onCancel={() => setCurrentView('main')} 
          onComplete={(res) => {
            saveToHistory(res);
            setSelectedResult(res);
            setCurrentView('result');
          }} 
        />
      );
    }

    if (currentView === 'result' && selectedResult) {
      return (
        <ResultView 
          result={selectedResult} 
          onClose={() => {
            setCurrentView('main');
            setSelectedResult(null);
          }} 
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            stats={stats} 
            recentScans={history.slice(0, 5)} 
            onScanURL={() => setCurrentView('url_scan')}
            onScanAPK={() => setCurrentView('apk_scan')}
            onViewAll={() => setActiveTab('history')}
            onSelectItem={(item) => {
              setSelectedResult(item);
              setCurrentView('result');
            }}
          />
        );
      case 'history':
        return (
          <HistoryView 
            history={history} 
            onSelectItem={(item) => {
              setSelectedResult(item);
              setCurrentView('result');
            }}
            onClear={clearHistory}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView stats={stats} recentScans={history.slice(0, 5)} onScanURL={() => {}} onScanAPK={() => {}} onViewAll={() => {}} onSelectItem={() => {}} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      showNav={currentView === 'main'}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
