import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Flame, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PredictionsMap } from '../types';
import { isSafeApple, TARGET_ROWS } from '../utils/firebaseEngine';
import { sounds } from '../utils/audio';
import { PredictionGrid } from './PredictionGrid';

interface LiveSimulatorProps {
  predictions: PredictionsMap | null;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({ predictions }) => {
  const [currentRow, setCurrentRow] = useState<number>(0); // Starts at Row 0
  const [userSelectionMap, setUserSelectionMap] = useState<Record<number, number>>({});
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [accumulatedMult, setAccumulatedMult] = useState<string>('x1.00');

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    if (gameStatus !== 'playing') return;

    // Must play strictly from row 0 to 9 in sequence
    if (rowIdx !== currentRow) {
      sounds.playBombExplosion();
      return;
    }

    const isSafe = isSafeApple(predictions, rowIdx, colIdx);
    const updatedSelections = { ...userSelectionMap, [rowIdx]: colIdx };
    setUserSelectionMap(updatedSelections);

    const rowObj = TARGET_ROWS.find((r) => r.row === rowIdx);

    if (isSafe) {
      sounds.playSafeChime();
      setAccumulatedMult(rowObj?.mult || 'x1.00');

      if (rowIdx === 9) {
        // Reached top! Win!
        setGameStatus('won');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setCurrentRow(rowIdx + 1);
      }
    } else {
      sounds.playBombExplosion();
      setGameStatus('lost');
    }
  };

  const resetGame = () => {
    sounds.playClick();
    setCurrentRow(0);
    setUserSelectionMap({});
    setGameStatus('playing');
    setAccumulatedMult('x1.00');
  };

  return (
    <div className="flex flex-col gap-3 font-arabic" dir="rtl">
      {/* Simulator Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 to-black border border-[#C77DFF]/40 shadow-[0_0_20px_rgba(199,125,255,0.2)] flex items-center justify-between">
        <div>
          <div className="text-xs text-[#D9A8FF] font-bold">محاكاة التسلق التفاعلية</div>
          <div className="text-[11px] text-white/60">
            ابدأ من الصف الأول (الأسفل) واصعد إلى الصف العاشر لتجربة التوقع
          </div>
        </div>

        <div className="text-left" dir="ltr">
          <div className="text-[10px] text-white/40 uppercase tracking-widest font-display">
            Current Multiplier
          </div>
          <div className="text-xl font-black text-[#22ff66] font-display">{accumulatedMult}</div>
        </div>
      </div>

      {/* Game Status Banner */}
      {gameStatus === 'won' && (
        <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-300 text-center font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
          <Trophy className="w-5 h-5 text-yellow-400" />
          مبارك! أكملت كافة الصفوف وحققت أعلى مضاعف x349.68 بنجاح!
        </div>
      )}

      {gameStatus === 'lost' && (
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-center font-bold text-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          اخترت تفاحة تالفة في الصف {currentRow + 1}! يمكنك إعادة المحاولة.
        </div>
      )}

      {/* Grid with interactive mode */}
      <PredictionGrid
        predictions={predictions}
        hasRevealed={gameStatus !== 'playing'}
        activeTestRow={gameStatus === 'playing' ? currentRow : null}
        userSelectionMap={userSelectionMap}
        onCellClick={handleCellClick}
      />

      {/* Reset button */}
      <button
        onClick={resetGame}
        className="mt-2 py-2.5 px-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
      >
        <RefreshCw className="w-4 h-4 text-[#C77DFF]" />
        إعادة محاكاة اللعب من الصف الأول
      </button>
    </div>
  );
};
