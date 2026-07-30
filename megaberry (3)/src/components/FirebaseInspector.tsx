import React, { useState } from 'react';
import { Copy, Check, Database, Code, ShieldCheck } from 'lucide-react';
import { PredictionsMap } from '../types';
import { sounds } from '../utils/audio';

interface FirebaseInspectorProps {
  predictions: PredictionsMap | null;
}

export const FirebaseInspector: React.FC<FirebaseInspectorProps> = ({ predictions }) => {
  const [copied, setCopied] = useState(false);

  const fullFirebaseObject = {
    m11: predictions || {},
  };

  const jsonString = JSON.stringify(fullFirebaseObject, null, 2);

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-3 font-arabic" dir="rtl">
      {/* Inspector Header */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/40 border border-[#C77DFF]/40">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#C77DFF]" />
          <div>
            <div className="font-bold text-sm text-white">مسار البيانات: Realtime Database /m11</div>
            <div className="text-[11px] text-white/60">الهيكل المتداخل لـ 50 تفاحة (m1 إلى m50)</div>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg bg-[#C77DFF]/20 border border-[#C77DFF]/40 text-xs font-bold text-white flex items-center gap-1.5 hover:bg-[#C77DFF]/30 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#22ff66]" /> : <Copy className="w-3.5 h-3.5 text-white" />}
          {copied ? 'تم النسخ' : 'نسخ JSON'}
        </button>
      </div>

      {/* JSON Viewer */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/80 dir-ltr text-left">
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-[11px] font-mono text-white/50">
          <span>Server Path: /m11</span>
          <span>Format: Nested Objects</span>
        </div>
        <pre className="p-4 text-[12px] font-mono text-green-400 overflow-x-auto max-h-[360px] leading-relaxed">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
