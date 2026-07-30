import React from 'react';
import { PredictionsMap } from '../types';
import { isSafeApple, TARGET_ROWS } from '../utils/firebaseEngine';
import goodAppleImg from '../assets/images/good_apple_image_1785345707284.jpg';
import badAppleImg from '../assets/images/bad_apple_image_1785345722478.jpg';
import { sounds } from '../utils/audio';

interface PredictionGridProps {
  predictions: PredictionsMap | null;
  hasRevealed: boolean;
  activeTestRow?: number | null;
  userSelectionMap?: Record<number, number>; // row -> col selected
  onCellClick?: (rowIdx: number, colIdx: number) => void;
}

export const PredictionGrid: React.FC<PredictionGridProps> = ({
  predictions,
  hasRevealed,
  activeTestRow = null,
  userSelectionMap = {},
  onCellClick,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full select-none" dir="rtl">
      {TARGET_ROWS.map((rowInfo) => {
        const isCurrentActiveRow = activeTestRow === rowInfo.row;

        return (
          <div
            key={rowInfo.row}
            className={`flex items-center gap-2.5 p-1 rounded-xl transition-all ${
              isCurrentActiveRow
                ? 'bg-[#C77DFF]/10 border border-[#C77DFF]/40 shadow-[0_0_12px_rgba(199,125,255,0.2)]'
                : 'bg-transparent border border-transparent'
            }`}
          >
            {/* Multiplier Badge */}
            <div
              className={`w-14 h-8 rounded-lg flex items-center justify-center font-display font-bold text-[11px] shrink-0 border transition-all ${
                isCurrentActiveRow
                  ? 'bg-[#C77DFF] text-black border-[#C77DFF] shadow-[0_0_10px_rgba(199,125,255,0.5)]'
                  : 'bg-white/5 border-white/10 text-[#D9A8FF]'
              }`}
              dir="ltr"
            >
              {rowInfo.mult}
            </div>

            {/* 5 Column Grid */}
            <div className="grid grid-cols-5 gap-1.5 flex-1">
              {Array.from({ length: 5 }).map((_, cIdx) => {
                const isSafe = isSafeApple(predictions, rowInfo.row, cIdx);
                const isSelected = userSelectionMap[rowInfo.row] === cIdx;
                const mIndex = rowInfo.row * 5 + cIdx + 1;

                // Determine display mode:
                // If hasRevealed is true, reveal safe vs rotten
                // If cell was clicked in test mode, reveal its individual state
                const isRevealedForCell = hasRevealed || isSelected;

                return (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => {
                      if (onCellClick) {
                        sounds.playClick();
                        onCellClick(rowInfo.row, cIdx);
                      }
                    }}
                    className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                      isRevealedForCell && isSafe
                        ? 'border-green-500/60 bg-green-500/15 shadow-[0_0_14px_rgba(57,255,20,0.35)]'
                        : isRevealedForCell && !isSafe
                        ? 'border-red-500/50 bg-red-500/10 shadow-[0_0_10px_rgba(255,50,50,0.25)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-[#C77DFF]/40 hover:bg-white/[0.07]'
                    } ${isSelected ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black' : ''}`}
                    title={`الصف ${rowInfo.row + 1} العمود ${cIdx + 1}`}
                  >
                    {/* Cell Content */}
                    {isRevealedForCell ? (
                      isSafe ? (
                        <div className="relative w-[78%] h-[78%] flex items-center justify-center animate-scale-in">
                          <img
                            src={goodAppleImg}
                            alt="تفاحة سليمة"
                            className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(34,255,102,0.8)]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="relative w-[78%] h-[78%] flex items-center justify-center animate-scale-in">
                          <img
                            src={badAppleImg}
                            alt="تفاحة تالفة"
                            className="w-full h-full object-contain opacity-40 grayscale hover:grayscale-0 transition-all"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )
                    ) : (
                      /* Hidden tile graphic */
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C77DFF]/20 border border-[#C77DFF]/40 shadow-[0_0_6px_rgba(199,125,255,0.3)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
