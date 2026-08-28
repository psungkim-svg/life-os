import React from 'react';
import { 
  CheckCircle2, Circle, Trash2, Calendar, Tag, 
  Home, Users, Plane, TrendingUp, BookOpen, HeartPulse, Brain, CheckSquare, Sparkles 
} from 'lucide-react';

const CATEGORY_MAP = {
  Home: { label: '집관리', icon: Home, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  Family: { label: '가족', icon: Users, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  Travel: { label: '여행', icon: Plane, color: 'bg-sky-50 text-sky-700 border-sky-200' },
  Investing: { label: '재무/투자', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Faith: { label: '신앙', icon: BookOpen, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  Health: { label: '건강', icon: HeartPulse, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  General: { label: '기타/생각', icon: Brain, color: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export default function MemoryCard({ item, onToggleComplete, onDelete }) {
  const categoryInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP.General;
  const CategoryIcon = categoryInfo.icon;

  const dateStr = item.created_at 
    ? new Date(item.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';

  const dueDateStr = item.due_date
    ? new Date(item.due_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div className={`bg-white rounded-2xl p-4 border transition-all hover:shadow-md ${
      item.is_completed ? 'opacity-60 bg-slate-50 border-slate-200' : 'border-slate-200/80 shadow-sm'
    }`}>
      
      {/* Top Header: Category & Type */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Category Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryInfo.color}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            {categoryInfo.label}
          </span>

          {/* Type Badge */}
          {item.is_actionable && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <CheckSquare className="w-3 h-3" />
              할 일
            </span>
          )}

          {item.type === 'faith' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-800 border border-purple-200">
              📖 말씀을 마음에 묵상
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {item.is_actionable && (
            <button
              onClick={() => onToggleComplete(item.id)}
              className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all"
              title={item.is_completed ? '미완료로 변경' : '완료로 표시'}
            >
              {item.is_completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-slate-300 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
            title="기록 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="my-2">
        <p className={`text-slate-800 text-sm leading-relaxed whitespace-pre-line ${
          item.is_completed ? 'line-through text-slate-500' : 'font-normal'
        }`}>
          {item.content}
        </p>
      </div>

      {/* Footer Info: Tags, Due Date, Timestamp */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1">
          {item.tags && item.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-0.5 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-3 ml-auto text-[11px]">
          {dueDateStr && (
            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Calendar className="w-3 h-3" />
              기한: {dueDateStr}
            </span>
          )}
          <span>{dateStr}</span>
        </div>

      </div>

    </div>
  );
}
