
import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Send, ShieldAlert, Loader2, 
  ExternalLink, User, CheckCircle2, ShieldX 
} from 'lucide-react';
import { analyzeContent } from '../services/geminiService';
import { ScanResult, RiskLevel } from '../types';

interface Message {
  id: string;
  sender: 'other' | 'me';
  text: string;
  timestamp: string;
}

interface ChatProtectionViewProps {
  onScanComplete: (result: ScanResult) => void;
}

export const ChatProtectionView: React.FC<ChatProtectionViewProps> = ({ onScanComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'other', text: 'Hey, I just found this amazing deal! Check it out.', timestamp: '10:02 AM' },
  ]);
  const [input, setInput] = useState('');
  const [detectedUrl, setDetectedUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // URL Detection Logic (Regex)
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');

    // Trigger auto-reply simulation after 1 second
    setTimeout(() => {
      const replyText = "Check this out: http://update-secure-bank-login.net/verify";
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'other',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
      
      // Auto-detect link in the reply
      const match = replyText.match(urlRegex);
      if (match) {
        setDetectedUrl(match[0]);
        setShowPopup(true); // Trigger "System" notification popup
      }
    }, 1500);
  };

  const runDetection = async () => {
    if (!detectedUrl) return;
    setIsScanning(true);
    
    // Use Gemini Service
    const analysis = await analyzeContent(detectedUrl, 'URL');
    
    const result: ScanResult = {
      id: Math.random().toString(36).substr(2, 9),
      name: detectedUrl,
      type: 'URL',
      timestamp: new Date().toLocaleString(),
      ...analysis
    };

    setIsScanning(false);
    setShowPopup(false);
    onScanComplete(result);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] animate-fadeIn">
      {/* Simulation Header */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 mb-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-100">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Mock Conversation</h3>
          <p className="text-[10px] text-emerald-500 font-bold">Online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
              m.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
            }`}>
              {m.text}
              <div className={`text-[9px] mt-1 text-right ${m.sender === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="w-full p-4 pr-12 bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none shadow-lg"
        />
        <button 
          onClick={handleSend}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* "System" Overlay / Popup for Detection */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-xs p-6 shadow-2xl border border-white/20 animate-scaleIn">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
              <ShieldAlert className="w-8 h-8 text-red-600 animate-pulse" />
            </div>
            <h4 className="text-lg font-black text-slate-800 text-center mb-2">Suspicious Link!</h4>
            <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed">
              Our AI engine detected a URL in your latest message. It might be a phishing attempt.
            </p>
            <p className="text-[9px] text-slate-400 text-center mb-6 italic">
              * AI is not always 100% right.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl mb-6 truncate text-[10px] font-mono text-slate-400 border border-slate-100">
              {detectedUrl}
            </div>

            <div className="space-y-3">
              <button 
                onClick={runDetection}
                disabled={isScanning}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 flex items-center justify-center gap-2 transition-all"
              >
                {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run AI Security Scan'}
              </button>
              <button 
                onClick={() => setShowPopup(false)}
                className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
              >
                Ignore Risk
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Instruction Badge */}
      <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <MessageCircle className="w-4 h-4 text-indigo-600" />
        </div>
        <p className="text-[10px] text-indigo-700 font-medium">
          <span className="font-bold">Auto-Scan Active:</span> Links received in messages will trigger a security evaluation overlay.
        </p>
      </div>
    </div>
  );
};
