import React, { useState } from 'react';
import { Search, Sparkles, Loader2, Brain, ArrowRight } from 'lucide-react';
import { askSecondBrain } from '../lib/gemini';

export default function SearchSection({ memories, hasGemini }) {
  const [query, setQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setAiAnswer('');
    const answer = await askSecondBrain(query.trim(), memories);
    setAiAnswer(answer);
    setIsSearching(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xl mb-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>외장 두뇌 AI 질문 / 검색</span>
            <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gemini AI
            </span>
          </h2>
          <p className="text-xs text-slate-300">"예전에 아내랑 가기로 한 여행지가 어디였지?", "투자 관련해서 내가 무슨 결정했지?" 질문해 보세요.</p>
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleAiSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="자연어로 물어보세요 (예: 지난달에 메모해둔 부동산 관련 내용 알려줘)"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isSearching}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>질문하기</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Answer Area */}
      {aiAnswer && (
        <div className="mt-4 p-4 bg-slate-800/90 rounded-xl border border-slate-700/80 text-sm text-slate-100 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>AI 외장 두뇌 답변:</span>
          </div>
          <p className="leading-relaxed whitespace-pre-line text-slate-200">
            {aiAnswer}
          </p>
        </div>
      )}
    </div>
  );
}
