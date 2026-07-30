import React from 'react';
import { Eye, EyeOff, Sparkles, RefreshCw, Play, Database, ShieldCheck, Trophy } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ControlPanelProps {
  hasRevealed: boolean;
  onToggleReveal: () => void;
  onStartNow: () => void;
  isGenerating: boolean;
  activeTab: 'grid' | 'simulator' | 'php';
  onTabChange: (tab: 'grid' | 'simulator' | 'php') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  hasRevealed,
  onToggleReveal,
  onStartNow,
  isGenerating,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full my-2" dir="rtl">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-[#C77DFF]/30">
        <button
          onClick={() => {
            sounds.playClick();
            onTabChange('grid');
          }}
          className={`flex-1 py-2 px-2.5 rounded-lg text-[12px] font-arabic font-bold transition-all ${
            activeTab === 'grid'
              ? 'bg-[#C77DFF] text-black shadow-[0_0_10px_rgba(199,125,255,0.4)]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          صفحة الفواكه (تفاحة الحظ)
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onTabChange('simulator');
          }}
          className={`flex-1 py-2 px-2.5 rounded-lg text-[12px] font-arabic font-bold transition-all ${
            activeTab === 'simulator'
              ? 'bg-[#C77DFF] text-black shadow-[0_0_10px_rgba(199,125,255,0.4)]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          اختبار التوقع
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onTabChange('php');
          }}
          className={`py-2 px-2.5 rounded-lg text-[12px] font-arabic font-bold transition-all ${
            activeTab === 'php'
              ? 'bg-[#C77DFF] text-black shadow-[0_0_10px_rgba(199,125,255,0.4)]'
              : 'text-white/70 hover:text-white'
          }`}
        >
          سكربت PHP
        </button>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Start Now Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onStartNow();
          }}
          disabled={isGenerating}
          className="relative h-12 rounded-xl font-arabic font-black text-[16px] text-white overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background:
              'linear-gradient(135deg, rgb(34, 255, 102) 0%, rgb(16, 185, 129) 60%, rgb(6, 78, 59) 100%)',
            border: '1px solid rgba(34, 255, 102, 0.6)',
            boxShadow: '0 0 18px rgba(34, 255, 102, 0.4)',
          }}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              جاري التحديث...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              ابدأ الآن
            </>
          )}
        </button>

        {/* Toggle Reveal */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleReveal();
          }}
          className="h-12 rounded-xl font-arabic font-bold text-[13px] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: hasRevealed
              ? 'rgba(199, 125, 255, 0.2)'
              : 'rgba(15, 3, 30, 0.7)',
            border: hasRevealed
              ? '1px solid rgba(199, 125, 255, 0.6)'
              : '1px solid rgba(199, 125, 255, 0.4)',
            color: hasRevealed ? '#D9A8FF' : '#ffffff',
            boxShadow: hasRevealed ? '0 0 12px rgba(199, 125, 255, 0.3)' : 'none',
          }}
        >
          {hasRevealed ? (
            <>
              <Eye className="w-4 h-4 text-[#D9A8FF]" />
              إخفاء المسار
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-[#C77DFF]" />
              كشف المسار الآمن
            </>
          )}
        </button>
      </div>
    </div>
  );
};
