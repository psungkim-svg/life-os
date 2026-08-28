import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, X, Sparkles, Loader2, Volume2 } from 'lucide-react';

export default function CaptureModal({ isOpen, onClose, onSave, hasGemini }) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'ko-KR';

        recog.onresult = (event) => {
          let currentText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          if (currentText) {
            setText((prev) => (prev ? prev + ' ' + currentText : currentText));
          }
        };

        recog.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        setRecognition(recog);
      }
    }
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }

    setIsAnalyzing(true);
    await onSave(text.trim());
    setIsAnalyzing(false);
    setText('');
    onClose();
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

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">새로운 생각 / 기억 수집</h2>
            <p className="text-xs text-slate-500">말로 말씀하시거나 글로 적으시면 AI 외장 두뇌가 자동 정리합니다.</p>
          </div>
        </div>

        {/* Voice Recording Box */}
        {speechSupported && (
          <div className="mb-4">
            <button
              type="button"
              onClick={toggleListening}
              className={`w-full py-4 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all border ${
                isListening 
                  ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-200 animate-pulse' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5 animate-spin" />
                  <span>듣고 있습니다... (누르면 중지)</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 text-emerald-600" />
                  <span>🎙️ 음성으로 말하기 (버튼 누르고 말씀하세요)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Input Text Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="예: '나중에 아내랑 일본 교토 여행 가볼 것', '다음주 월요일까지 보일러 필터 청소하기', '투자용 상가 수익률 계산하기'"
              className="w-full p-3.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
          </div>

          {/* AI Banner info */}
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {hasGemini ? 'Gemini AI가 카테고리·날짜·태그를 자동 분류합니다.' : 'AI 미연결 (기본 메모로 저장됩니다)'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!text.trim() || isAnalyzing}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm px-5 py-2 rounded-xl shadow-sm transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI 분석 및 저장 중...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>외장 두뇌에 저장</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
