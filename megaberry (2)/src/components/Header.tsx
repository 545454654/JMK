import React from 'react';
import { LogOut, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { UserAuth } from '../types';

interface HeaderProps {
  user: UserAuth | null;
  onLogout: () => void;
  onOpenModal: () => void;
  isFirebaseConnected: boolean;
  onToggleFirebaseConfig?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onOpenModal,
  isFirebaseConnected,
  onToggleFirebaseConfig
}) => {
  return (
    <div className="relative z-20 flex items-center justify-between py-2 px-1" dir="rtl">
      {/* Brand Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-900/40 border border-[#C77DFF]/40 shadow-[0_0_10px_rgba(199,125,255,0.3)]">
          <Zap className="w-4 h-4 text-[#C77DFF] animate-pulse" />
        </div>
        <div>
          <div className="font-display text-[13px] font-bold tracking-[0.18em] text-[#D9A8FF]">
            Megaberry · رهان القرش V2
          </div>
          <div className="text-[9px] text-white/50 font-arabic">
            محرك التوقعات السحابي المباشر
          </div>
        </div>
      </div>

      {/* Connection & Actions */}
      <div className="flex items-center gap-2">
        {/* Firebase Config / Status Badge */}
        <button
          onClick={onToggleFirebaseConfig}
          className="flex items-center gap-1.5 h-[26px] px-2.5 rounded-full text-[10px] font-display tracking-wider text-white/85 transition-all hover:border-[#C77DFF]"
          style={{
            background: 'rgba(10, 2, 22, 0.6)',
            border: isFirebaseConnected
              ? '1px solid rgba(34, 255, 102, 0.5)'
              : '1px solid rgba(199, 125, 255, 0.48)',
            boxShadow: isFirebaseConnected
              ? '0 0 10px rgba(34, 255, 102, 0.25)'
              : '0 0 10px rgba(199, 125, 255, 0.25)',
          }}
          title="حالة اتصال السيرفر"
        >
          <span className="relative flex w-1.5 h-1.5">
            <span
              className={`absolute inset-0 rounded-full opacity-70 animate-ping ${
                isFirebaseConnected ? 'bg-[#22ff66]' : 'bg-[#C77DFF]'
              }`}
            />
            <span
              className={`relative rounded-full w-1.5 h-1.5 ${
                isFirebaseConnected ? 'bg-[#22ff66]' : 'bg-[#C77DFF]'
              }`}
            />
          </span>
          <span>{isFirebaseConnected ? 'السيرفر متصل' : 'النظام متصل بالإنترنت'}</span>
        </button>

        {user?.isAuthenticated && (
          <button
            onClick={onLogout}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
