import React, { useState, useEffect } from 'react';
import { X, Database, Sparkles, Key, CheckCircle2, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, getSupabase } from '../lib/supabase';
import { getGeminiKey, saveGeminiKey } from '../lib/gemini';

export default function SettingsModal({ isOpen, onClose, onConfigSaved, onPreloadSampleData }) {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setSupabaseUrl(cfg.url);
      setSupabaseKey(cfg.key);
      setGeminiKey(getGeminiKey());
      setStatusMsg({ type: '', text: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    saveGeminiKey(geminiKey);
    setStatusMsg({ type: 'success', text: '연동 키가 성공적으로 저장되었습니다!' });
    onConfigSaved();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Life OS 연동 키 설정</h2>
            <p className="text-xs text-slate-500">복사해두신 Supabase 열쇠와 Gemini AI 열쇠를 입력해주세요.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Supabase Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>1. Supabase (무료 데이터베이스 열쇠)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Project URL (예: https://qefchebhhsqhkmeatupn.supabase.co)
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xxxxxxxx.supabase.co"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                anon / public API Key (sb_publishable_... 또는 eyJhbGci...)
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="API Key 붙여넣기"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Gemini AI Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>2. Google Gemini API (무료 AI 열쇠)</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Gemini API Key (AIzaSy...)
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sample Data Preloader */}
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
            <div className="text-emerald-900">
              <strong className="font-semibold block">💡 미리 체험해보기</strong>
              <span>샘플 데이터 5개를 로드하여 앱을 먼저 테스트할 수 있습니다.</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onPreloadSampleData();
                setStatusMsg({ type: 'success', text: '샘플 데이터 5개가 로드되었습니다!' });
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium whitespace-nowrap"
            >
              샘플 넣기
            </button>
          </div>

          {/* Status Message */}
          {statusMsg.text && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              statusMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              닫기
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-5 py-2 rounded-xl shadow-sm transition-all"
            >
              설정 저장하기
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
