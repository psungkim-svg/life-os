import React from 'react';
import { Brain, Settings, Database, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  onOpenSettings, 
  onOpenCapture, 
  hasSupabase, 
  hasGemini, 
  itemCount 
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg leading-tight">김부장님 Life OS</h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                외장 두뇌 V1
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>기억된 항목: <strong className="text-emerald-700 font-semibold">{itemCount}개</strong></span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Status Badges */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${hasSupabase ? 'bg-emerald-100 text-emerald-800 font-medium' : 'bg-slate-200 text-slate-600'}`}>
              <Database className="w-3 h-3" />
              {hasSupabase ? 'DB 연결됨' : 'DB 미연결'}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${hasGemini ? 'bg-amber-100 text-amber-800 font-medium' : 'bg-slate-200 text-slate-600'}`}>
              <Sparkles className="w-3 h-3" />
              {hasGemini ? 'AI 두뇌 가동' : 'AI 미연결'}
            </span>
          </div>

          {/* Capture Quick Button */}
          <button
            onClick={onOpenCapture}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-medium text-sm px-3.5 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden xs:inline">생각/메모</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 rounded-xl border border-slate-200 transition-all"
            title="연동 설정"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}
