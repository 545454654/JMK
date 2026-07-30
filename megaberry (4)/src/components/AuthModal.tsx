import React, { useState } from 'react';
import { TriangleAlert, Copy, ExternalLink, X, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    sounds.playClick();
    navigator.clipboard.writeText('JMK2');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md animate-fade-in-soft"
        style={{ background: 'rgba(5, 1, 12, 0.75)' }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-sm animate-modal-in">
        <div
          className="relative rounded-2xl mx-auto w-full max-w-[360px] px-5 pt-6 pb-6"
          style={{
            background: 'linear-gradient(180deg, rgb(21, 3, 48) 0%, rgb(10, 3, 24) 100%)',
            border: '1px solid rgba(199, 125, 255, 0.5)',
            boxShadow: '0 0 50px rgba(199, 125, 255, 0.45)',
          }}
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            style={{
              background: 'rgba(15, 3, 30, 0.7)',
              border: '1px solid rgba(199, 125, 255, 0.4)',
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-4 pr-1">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(199, 125, 255, 0.15)',
                border: '1px solid rgba(199, 125, 255, 0.5)',
                boxShadow: '0 0 10px rgba(199, 125, 255, 0.5)',
              }}
            >
              <TriangleAlert className="w-5 h-5 text-[#C77DFF]" />
            </div>
            <div className="flex-1 text-right">
              <h3
                className="font-arabic font-black text-[18px] leading-none"
                style={{
                  color: 'rgb(199, 125, 255)',
                  textShadow: '0 0 10px rgba(199, 125, 255, 0.7)',
                }}
              >
                شروط تفعل المحرك
              </h3>
              <p className="text-[11px] text-white/55 font-arabic mt-1">
                اتباع الخطوات لتفعيل التوقعات بنسبة 100%
              </p>
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-2 mb-3.5" dir="rtl">
            <div
              className="flex items-center gap-2.5 px-3 py-2 rounded-md"
              style={{
                background: 'rgba(199, 125, 255, 0.1)',
                border: '1px solid rgba(199, 125, 255, 0.28)',
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 font-display"
                style={{
                  background: 'linear-gradient(rgb(199, 125, 255), rgb(42, 8, 69))',
                  boxShadow: '0 0 6px rgba(199, 125, 255, 0.6)',
                }}
              >
                1
              </span>
              <span className="text-[13px] font-arabic text-white/95 flex-1 text-right">
                استخدم حساباً جديداً
              </span>
            </div>

            <div
              className="flex items-center gap-2.5 px-3 py-2 rounded-md"
              style={{
                background: 'rgba(199, 125, 255, 0.1)',
                border: '1px solid rgba(199, 125, 255, 0.28)',
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 font-display"
                style={{
                  background: 'linear-gradient(rgb(199, 125, 255), rgb(42, 8, 69))',
                  boxShadow: '0 0 6px rgba(199, 125, 255, 0.6)',
                }}
              >
                2
              </span>
              <span className="text-[13px] font-arabic text-white/95 flex-1 text-right">
                الحد أدنى للإيداع المالي <span className="text-[#22ff66] font-bold">150 ج.م أو <span dir="ltr">3$</span></span>
              </span>
            </div>

            <div
              className="flex items-center gap-2.5 px-3 py-2 rounded-md"
              style={{
                background: 'rgba(199, 125, 255, 0.1)',
                border: '1px solid rgba(199, 125, 255, 0.28)',
              }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 font-display"
                style={{
                  background: 'linear-gradient(rgb(199, 125, 255), rgb(42, 8, 69))',
                  boxShadow: '0 0 6px rgba(199, 125, 255, 0.6)',
                }}
              >
                3
              </span>
              <span className="text-[13px] font-arabic text-white/95 flex-1 text-right">
                أدخل البروموكود عند التسجيل
              </span>
            </div>
          </div>

          {/* Warning Note Box */}
          <div
            className="rounded-lg px-3 py-2.5 mb-3.5 text-right"
            style={{
              background: 'rgba(40, 22, 0, 0.5)',
              border: '1px solid rgba(255, 180, 0, 0.4)',
            }}
          >
            <p className="text-[12px] text-[#ffd27a] font-arabic leading-relaxed">
              <span className="font-bold">ملاحظة:</span> سيرفر الشروط ويقبل الإيداعات بالتأكيد{' '}
              <span className="font-bold text-[#22ff66]">150 ج.م أو <span dir="ltr">3$</span></span> أو أكثر فقط، يجب ألا تقل عن إيداعك{' '}
              <span className="font-bold text-[#22ff66]">150 ج.م أو <span dir="ltr">3$</span></span>.
            </p>
          </div>

          {/* Promo Code Copy Bar */}
          <div className="flex flex-col gap-1.5 mb-3.5">
            <div className="flex items-center justify-between text-[11px] text-white/70 font-arabic px-1">
              <span>كود البروموكود المعتمد:</span>
              <span className="text-[12px] font-bold text-[#C77DFF] font-display">JMK2</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-transform active:scale-90"
                style={{
                  background: 'linear-gradient(rgb(199, 125, 255), rgb(42, 8, 69))',
                  border: '1px solid rgba(199, 125, 255, 0.4)',
                  boxShadow: '0 0 10px rgba(199, 125, 255, 0.5)',
                }}
                title="نسخ كود البروموكود"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#22ff66]" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
              <div
                className="flex-1 h-10 rounded-lg flex items-center justify-center font-display font-bold text-white text-lg tracking-[0.3em]"
                style={{
                  background: 'rgba(10, 2, 22, 0.85)',
                  border: '1px dashed rgba(199, 125, 255, 0.6)',
                  textShadow: '0 0 6px rgba(199, 125, 255, 0.7)',
                }}
              >
                JMK2
              </div>
            </div>
          </div>

          {/* Megaberry Download Link Button */}
          <div className="mb-3">
            <a
              href="https://9624703mp.pro/ar"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="w-full h-11 rounded-xl font-arabic text-[13px] font-bold text-[#22ff66] flex items-center justify-center gap-2 active:scale-95 transition-all"
              style={{
                background: 'rgba(34, 255, 102, 0.12)',
                border: '1.5px solid rgba(34, 255, 102, 0.55)',
                boxShadow: '0 0 14px rgba(34, 255, 102, 0.25)',
              }}
            >
              <ExternalLink className="w-4 h-4 text-[#22ff66]" />
              تحميل تطبيق Megaberry
            </a>
          </div>

          {/* Accept & Continue Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="relative w-full h-11 rounded-lg font-arabic font-bold text-[14px] text-white overflow-hidden active:scale-[0.98] transition-all"
            style={{
              background: 'linear-gradient(rgb(199, 125, 255) 0%, rgb(138, 43, 226) 60%, rgb(26, 5, 48) 100%)',
              border: '1px solid rgba(199, 125, 255, 0.45)',
              boxShadow: '0 0 16px rgba(199, 125, 255, 0.6)',
            }}
          >
            <span className="relative z-10">فهمت، ومتابعة إلى المحرك</span>
            <span className="absolute inset-0 animate-shimmer opacity-40" />
          </button>
        </div>
      </div>
    </div>
  );
};
