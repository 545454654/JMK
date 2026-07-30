import React, { useState, useRef, useEffect } from 'react';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { sounds } from '../utils/audio';
import sharkLogoImg from '../assets/images/shark_logo_1785345692807.jpg';

interface LoginFormProps {
  onLoginSuccess: (userId: string) => void;
  onOpenRequirementsModal: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onOpenRequirementsModal,
}) => {
  const [digits, setDigits] = useState<string[]>(['5', '6', '6', '6', '0', '0', '9', '1', '8', '7']);
  const [password, setPassword] = useState<string>('JMK2');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Calculate filled count
  const filledCount = digits.filter((d) => d !== '').length;

  // Handle digit change
  const handleDigitChange = (index: number, value: string) => {
    sounds.playClick();
    setErrorMsg('');
    const newDigits = [...digits];

    // If pasted multi-character string
    if (value.length > 1) {
      const pasteData = value.replace(/\D/g, '').slice(0, 10);
      for (let i = 0; i < 10; i++) {
        newDigits[i] = pasteData[i] || '';
      }
      setDigits(newDigits);
      const nextFocus = Math.min(pasteData.length, 9);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    // Single digit input
    const cleanVal = value.replace(/\D/g, '');
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    if (cleanVal && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Password progress percentage
  const passProgress = Math.min((password.length / 6) * 100, 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();

    const fullId = digits.join('');
    if (fullId.length < 10) {
      setErrorMsg('يرجى إدخال معرف الحساب المكون من 10 أرقام كاملاً');
      sounds.playBombExplosion();
      return;
    }

    if (!password) {
      setErrorMsg('يرجى إدخال كلمة المرور للمصادقة');
      sounds.playBombExplosion();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(fullId);
      sounds.playSuccessGen();
    }, 1000);
  };

  const fillDemoId = () => {
    sounds.playClick();
    const demo = '5666009187'.split('');
    setDigits(demo);
    setPassword('JMK2');
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-between min-h-[520px]">
      <div>
        {/* Pulsing Shark Logo Header */}
        <div className="relative z-10 flex justify-center mt-[10px]">
          <div className="relative w-[180px] h-[180px] flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full animate-ring-pulse"
              style={{
                border: '1px solid rgba(199, 125, 255, 0.42)',
                boxShadow:
                  '0 0 30px rgba(199, 125, 255, 0.38), 0 0 30px rgba(199, 125, 255, 0.2) inset',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: '14px',
                border: '1px solid rgba(199, 125, 255, 0.62)',
                boxShadow: '0 0 22px rgba(199, 125, 255, 0.5)',
              }}
            />
            <div
              className="absolute rounded-full animate-pulse-red"
              style={{
                inset: '28px',
                background:
                  'radial-gradient(circle at 50% 60%, rgba(199, 125, 255, 0.6) 0%, rgba(15, 3, 30, 0.22) 55%, transparent 75%)',
                border: '1.5px solid rgba(199, 125, 255, 0.88)',
              }}
            />
            <div
              className="relative rounded-full overflow-hidden"
              style={{
                width: '120px',
                height: '120px',
                border: '2px solid rgba(199, 125, 255, 0.35)',
                boxShadow:
                  '0 0 28px rgba(199, 125, 255, 0.7), 0 0 16px rgba(0, 0, 0, 0.55) inset',
                background: 'rgb(10, 3, 24)',
              }}
            >
              <img
                alt="رهان القرش V2"
                className="w-full h-full object-cover"
                src={sharkLogoImg}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mt-[14px] space-y-1.5 animate-fade-up">
          <h1
            className="font-arabic font-bold text-[25px] leading-tight"
            style={{
              background:
                'linear-gradient(rgb(217, 168, 255) 0%, rgb(106, 27, 184) 30%, rgb(138, 43, 226) 60%, rgb(42, 8, 69) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 14px rgba(199, 125, 255, 0.6))',
            }}
          >
            بوابة الوصول لمحرك التوقعات
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-[#22ff66] text-[11px] font-arabic font-bold">
            <span>✨ دخول مجاني تلقائي (بدون كتابة يدوي)</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-[12px] text-center font-arabic animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Automatic Info Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-right font-arabic space-y-2 text-xs">
          <div className="flex justify-between items-center text-white/90">
            <span className="text-[#22ff66] font-bold font-mono">5666009187</span>
            <span className="text-white/70">المعرف التجريبي (مستخرج آلياً):</span>
          </div>
          <div className="flex justify-between items-center text-white/90">
            <span className="text-[#22ff66] font-bold font-mono">JMK2</span>
            <span className="text-white/70">كود البروموكود (كلمة السر):</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 mt-[14px] space-y-[12px]">
          {/* User ID Display */}
          <div className="flex items-center justify-between" dir="ltr">
            <span className="text-[11px] text-[#22ff66] font-display font-bold tabular-nums">
              مُدخل تلقائياً ✓
            </span>
            <span className="font-arabic text-xs text-white">
              رقم الحساب <span className="text-[#C77DFF] font-display font-bold">(5666009187)</span>
            </span>
          </div>

          {/* Readonly/Interactive 10 Digit Display */}
          <div className="flex gap-[5px] justify-between" dir="ltr">
            {digits.map((digit, idx) => (
              <div
                key={idx}
                className="flex-1 h-[40px] max-w-[31px] rounded-[12px] flex items-center justify-center transition-all"
                style={{
                  background:
                    'linear-gradient(rgba(10, 2, 22, 0.62), rgba(5, 1, 12, 0.84))',
                  border: '1.5px solid rgba(34, 255, 102, 0.8)',
                  boxShadow: '0 0 10px rgba(34, 255, 102, 0.3)',
                }}
              >
                <input
                  ref={(el) => (inputRefs.current[idx] = el)}
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full h-full bg-transparent text-center outline-none text-[#22ff66] font-display text-[17px] font-bold tabular-nums"
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                />
              </div>
            ))}
          </div>

          {/* Encrypted Password Label */}
          <div className="flex items-center justify-between pt-[2px]" dir="ltr">
            <span className="font-arabic text-[11px] text-[#22ff66] font-bold">
              كود بروموكود مُعتمد ✓
            </span>
            <span className="font-arabic text-xs text-white">كلمة السر (JMK2)</span>
          </div>

          {/* Password Input */}
          <div
            className="rounded-[16px] h-[46px] px-4 flex items-center gap-2.5 transition-all"
            style={{
              background:
                'linear-gradient(rgba(15, 3, 30, 0.68), rgba(5, 1, 12, 0.86))',
              border: '1.5px solid rgba(34, 255, 102, 0.7)',
              boxShadow:
                '0 0 16px rgba(34, 255, 102, 0.25), 0 0 11px rgba(199, 125, 255, 0.1) inset',
            }}
          >
            <Lock className="w-4 h-4 text-[#22ff66] shrink-0" />
            <input
              dir="ltr"
              className="flex-1 bg-transparent outline-none text-[#22ff66] text-base tracking-[0.2em] text-right font-display font-bold"
              placeholder="JMK2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Direct Free Entry Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full h-[52px] rounded-[20px] font-arabic text-[18px] font-black text-white overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-[4px] tracking-wide"
            style={{
              background:
                'linear-gradient(rgb(199, 125, 255) 0%, rgb(138, 43, 226) 52%, rgb(26, 5, 48) 100%)',
              boxShadow:
                '0 0 34px rgba(199, 125, 255, 0.62), 0 1px 0 rgba(199, 125, 255, 0.24) inset, 0 -7px 16px rgba(0, 0, 0, 0.42) inset',
              border: '1px solid rgba(199, 125, 255, 0.46)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الدخول والمزامنة...
                </>
              ) : (
                '🚀 دخول مجاني مباشر (بدون كتابة)'
              )}
            </span>
            <span className="absolute inset-0 animate-shimmer opacity-50" />
          </button>
        </form>

        {/* Quick Demo Helper & Requirements Trigger */}
        <div className="flex items-center justify-between mt-3 px-1 text-[11px] font-arabic">
          <button
            type="button"
            onClick={fillDemoId}
            className="text-[#C77DFF] hover:text-white transition-colors flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3" />
            تعبئة نموذج تجريبي
          </button>
          <button
            type="button"
            onClick={onOpenRequirementsModal}
            className="text-white/60 hover:text-[#C77DFF] underline transition-colors"
          >
            عرض الشروط والبروموكود (JMK2)
          </button>
        </div>
      </div>

      {/* Footer copyright */}
      <p className="relative z-10 mt-6 pt-2 text-center text-[10px] text-white/40 font-display tracking-wider">
        شارك بيت الإصدار الثاني · محرك مميز ©
      </p>
    </div>
  );
};
