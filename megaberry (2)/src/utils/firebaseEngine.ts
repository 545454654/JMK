import { PredictionsMap } from '../types';

const LOCAL_PREDICTIONS_KEY = 'shark_bet_m11_predictions';
const HISTORY_KEY = 'shark_bet_predictions_history';

/**
 * Checks if a specific cell at (rowIdx, colIdx) contains a safe apple ("1")
 * Row index runs from 0 (bottom) to 9 (top). Column index runs from 0 to 4.
 * mIndex formula: rowIdx * 5 + colIdx + 1 (m1 to m50)
 */
export const isSafeApple = (predictions: PredictionsMap | null | undefined, rowIdx: number, colIdx: number): boolean => {
  if (!predictions || Object.keys(predictions).length === 0) return false;
  
  // 1. Calculate sequential index m1 to m50
  const mIndex = rowIdx * 5 + colIdx + 1;
  const mKey = `m${mIndex}`;
  
  // 2. Read nested object for cell
  const mObj = (predictions as any)[mKey];
  
  // 3. Verify object value equals "1"
  if (mObj && typeof mObj === 'object' && mObj[mKey] === '1') {
    return true; // Safe Apple
  }
  
  return false; // Rotten Apple / Bomb
};

/**
 * Generates predictions according to difficulty rules:
 * - Rows 0 to 3: 4 safe apples, 1 rotten
 * - Rows 4 to 6: 3 safe apples, 2 rotten
 * - Rows 7 to 8: 2 safe apples, 3 rotten
 * - Row 9: 1 safe apple, 4 rotten
 */
export const generatePredictionsData = (): PredictionsMap => {
  const finalObject: Record<string, any> = {};

  for (let r = 0; r < 10; r++) {
    let safeCount = 4;
    if (r >= 4 && r < 7) safeCount = 3;      // Rows 4, 5, 6
    if (r >= 7 && r < 9) safeCount = 2;      // Rows 7, 8
    if (r >= 9) safeCount = 1;               // Row 9

    const safeCols: number[] = [];
    while (safeCols.length < safeCount) {
      const randomCol = Math.floor(Math.random() * 5);
      if (!safeCols.includes(randomCol)) {
        safeCols.push(randomCol);
      }
    }

    for (let c = 0; c < 5; c++) {
      const mIndex = r * 5 + c + 1;
      const value = safeCols.includes(c) ? "1" : "0";
      finalObject[`m${mIndex}`] = { [`m${mIndex}`]: value };
    }
  }

  return finalObject as PredictionsMap;
};

/**
 * Save predictions locally (fallback / default realtime cache)
 */
export const savePredictionsLocally = (predictions: PredictionsMap) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_PREDICTIONS_KEY, JSON.stringify(predictions));
    
    // Save to history log
    try {
      const currentHistory = getPredictionsHistory();
      const newEntry = {
        id: `M11-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        safeCount: 29, // 4*4 + 3*3 + 2*2 + 1*1 = 16 + 9 + 4 + 1 = 30 safe apples out of 50
        topRowSafeCol: getTopRowSafeCol(predictions),
        predictions
      };
      const updatedHistory = [newEntry, ...currentHistory].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('History save error:', e);
    }
  }
};

/**
 * Retrieve current cached predictions
 */
export const getLocalPredictions = (): PredictionsMap | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(LOCAL_PREDICTIONS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

/**
 * Retrieve prediction history logs
 */
export const getPredictionsHistory = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(HISTORY_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    }
  }
  return [];
};

/**
 * Find safe column index on row 9
 */
export const getTopRowSafeCol = (predictions: PredictionsMap): number => {
  for (let c = 0; c < 5; c++) {
    if (isSafeApple(predictions, 9, c)) {
      return c;
    }
  }
  return 0;
};

/**
 * Target Row multipliers (rendered bottom to top in app view)
 */
export const TARGET_ROWS = [
  { mult: "x349.68", row: 9, safeCount: 1 }, // Top row
  { mult: "x69.93",  row: 8, safeCount: 2 },
  { mult: "x27.92",  row: 7, safeCount: 2 },
  { mult: "x11.18",  row: 6, safeCount: 3 },
  { mult: "x6.71",   row: 5, safeCount: 3 },
  { mult: "x4.02",   row: 4, safeCount: 3 },
  { mult: "x2.41",   row: 3, safeCount: 4 },
  { mult: "x1.93",   row: 2, safeCount: 4 },
  { mult: "x1.54",   row: 1, safeCount: 4 },
  { mult: "x1.23",   row: 0, safeCount: 4 }, // Bottom row where player starts
];
