import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import MemoryCard from './components/MemoryCard';
import CaptureModal from './components/CaptureModal';
import SettingsModal from './components/SettingsModal';
import { getSupabaseConfig, getSupabase } from './lib/supabase';
import { getGeminiKey, analyzeMemoryWithGemini } from './lib/gemini';
import { INITIAL_SAMPLE_MEMORIES } from './lib/sampleData';
import { Plus, Filter, Sparkles, Brain, Home, Users, Plane, TrendingUp, BookOpen, HeartPulse, CheckSquare } from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: '전체', icon: Brain },
  { id: 'TASKS', label: '할 일만', icon: CheckSquare },
  { id: 'Home', label: '집관리', icon: Home },
  { id: 'Family', label: '가족', icon: Users },
  { id: 'Travel', label: '여행', icon: Plane },
  { id: 'Investing', label: '재무/투자', icon: TrendingUp },
  { id: 'Faith', label: '신앙', icon: BookOpen },
];

export default function App() {
  const [memories, setMemories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasSupabase, setHasSupabase] = useState(false);
  const [hasGemini, setHasGemini] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load memories & check configs on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const { url, key } = getSupabaseConfig();
    const gKey = getGeminiKey();

    setHasGemini(!!gKey);

    const supabase = getSupabase();
    if (supabase) {
      setHasSupabase(true);
      try {
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setMemories(data);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Supabase load fallback:", err);
      }
    } else {
      setHasSupabase(false);
    }

    // Local Storage or Sample fallback
    const local = localStorage.getItem('LIFEOS_LOCAL_MEMORIES');
    if (local) {
      try {
        setMemories(JSON.parse(local));
      } catch (e) {
        setMemories(INITIAL_SAMPLE_MEMORIES);
      }
    } else {
      setMemories(INITIAL_SAMPLE_MEMORIES);
    }
    setIsLoading(false);
  };

  // Preload sample data handler
  const handlePreloadSampleData = () => {
    setMemories(INITIAL_SAMPLE_MEMORIES);
    localStorage.setItem('LIFEOS_LOCAL_MEMORIES', JSON.stringify(INITIAL_SAMPLE_MEMORIES));
  };

  // Save new memory
  const handleSaveMemory = async (text) => {
    // 1. Analyze with Gemini
    const analyzed = await analyzeMemoryWithGemini(text);

    const newItem = {
      id: 'mem-' + Date.now(),
      created_at: new Date().toISOString(),
      content: analyzed.content || text,
      category: analyzed.category || 'General',
      type: analyzed.type || 'thought',
      tags: analyzed.tags || ['생각'],
      source: 'voice',
      is_actionable: analyzed.is_actionable || false,
      is_completed: false,
      due_date: analyzed.due_date || null,
      importance: analyzed.importance || 3
    };

    // 2. Save to Supabase if connected
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('memories')
          .insert([{
            content: newItem.content,
            category: newItem.category,
            type: newItem.type,
            tags: newItem.tags,
            source: newItem.source,
            is_actionable: newItem.is_actionable,
            is_completed: newItem.is_completed,
            due_date: newItem.due_date,
            importance: newItem.importance
          }])
          .select();

        if (!error && data && data.length > 0) {
          newItem.id = data[0].id;
        }
      } catch (e) {
        console.error("Supabase insert error:", e);
      }
    }

    // Update state & localStorage
    const updated = [newItem, ...memories];
    setMemories(updated);
    localStorage.setItem('LIFEOS_LOCAL_MEMORIES', JSON.stringify(updated));
  };

  // Toggle Task Completion
  const handleToggleComplete = async (id) => {
    const updated = memories.map((item) => {
      if (item.id === id) {
        return { ...item, is_completed: !item.is_completed };
      }
      return item;
    });

    setMemories(updated);
    localStorage.setItem('LIFEOS_LOCAL_MEMORIES', JSON.stringify(updated));

    const targetItem = updated.find((i) => i.id === id);
    const supabase = getSupabase();
    if (supabase && targetItem && !id.startsWith('sample-')) {
      try {
        await supabase
          .from('memories')
          .update({ is_completed: targetItem.is_completed })
          .eq('id', id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Delete Memory
  const handleDelete = async (id) => {
    const updated = memories.filter((item) => item.id !== id);
    setMemories(updated);
    localStorage.setItem('LIFEOS_LOCAL_MEMORIES', JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase && !id.startsWith('sample-')) {
      try {
        await supabase.from('memories').delete().eq('id', id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Filter Memories
  const filteredMemories = memories.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'TASKS') return item.is_actionable;
    return item.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCapture={() => setIsCaptureOpen(true)}
        hasSupabase={hasSupabase}
        hasGemini={hasGemini}
        itemCount={memories.length}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Banner for configuration status if not set */}
        {(!hasSupabase || !hasGemini) && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-sm font-bold block">100% 무료 연동 준비 상태</strong>
                <p className="text-xs text-amber-800">
                  {hasSupabase ? '✅ Supabase 연결됨' : '⚠️ Supabase 키 등록 필요'} | {hasGemini ? '✅ Gemini AI 연결됨' : '⚠️ Gemini AI 키 등록 필요'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl transition-all shadow-sm"
            >
              열쇠 입력하기
            </button>
          </div>
        )}

        {/* AI Second Brain Query Box */}
        <SearchSection memories={memories} hasGemini={hasGemini} />

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Memory Cards Grid */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400 text-sm">기억 데이터를 불러오는 중...</div>
          ) : filteredMemories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 my-4">
              <Brain className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">선택한 카테고리에 저장된 기억이 없습니다.</p>
              <p className="text-xs text-slate-400 mt-1">상단의 [+ 생각/메모] 버튼을 눌러 음성이나 글로 생각을 기록해보세요!</p>
            </div>
          ) : (
            filteredMemories.map((item) => (
              <MemoryCard
                key={item.id}
                item={item}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

      </main>

      {/* Floating Action Button (FAB) for Mobile */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCaptureOpen(true)}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-full shadow-lg shadow-emerald-300 flex items-center justify-center transition-all"
          title="생각 수집"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Modals */}
      <CaptureModal
        isOpen={isCaptureOpen}
        onClose={() => setIsCaptureOpen(false)}
        onSave={handleSaveMemory}
        hasGemini={hasGemini}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={loadData}
        onPreloadSampleData={handlePreloadSampleData}
      />

    </div>
  );
}
