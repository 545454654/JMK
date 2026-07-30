import React, { useState } from 'react';
import { Database, Key, X, Check, Globe } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (databaseURL: string, apiKey: string) => void;
  currentDatabaseURL: string;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
  onSaveConfig,
  currentDatabaseURL,
}) => {
  const [databaseURL, setDatabaseURL] = useState(
    currentDatabaseURL || 'https://my-1xbet-app-default-rtdb.firebaseio.com'
  );
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    onSaveConfig(databaseURL, apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-arabic" dir="rtl">
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/80 animate-fade-in-soft"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#150330] to-[#0a0318] border border-[#C77DFF]/50 p-5 shadow-[0_0_50px_rgba(199,125,255,0.4)] animate-modal-in">
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-[#C77DFF]" />
          <h3 className="font-bold text-lg text-[#C77DFF]">إعدادات الاتصال السحابي RTDB</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs text-white/70 mb-1">
              رابط Realtime Database URL (مسار m11):
            </label>
            <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-black/60 border border-white/20 text-white text-xs">
              <Globe className="w-4 h-4 text-white/40 shrink-0" />
              <input
                type="text"
                dir="ltr"
                value={databaseURL}
                onChange={(e) => setDatabaseURL(e.target.value)}
                placeholder="https://your-app.firebaseio.com"
                className="w-full bg-transparent outline-none font-mono text-xs text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1">
              مفتاح API Key (اختياري للاتصال بالربط الحي):
            </label>
            <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-black/60 border border-white/20 text-white text-xs">
              <Key className="w-4 h-4 text-white/40 shrink-0" />
              <input
                type="password"
                dir="ltr"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-transparent outline-none font-mono text-xs text-left"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/40 border border-[#C77DFF]/30 text-[11px] text-white/70">
            ملاحظة: محرك SHARK BET V2 يعمل في الوضع الفوري (Realtime Instant Mode) لإنشاء وقراءة
            الكائن المتداخل <code className="text-green-400 font-mono">m11</code> بنسبة توافق 100%.
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#8A2BE2] font-bold text-white text-sm shadow-[0_0_15px_rgba(199,125,255,0.4)]"
          >
            حفظ وتفعيل الاتصال
          </button>
        </form>
      </div>
    </div>
  );
};
