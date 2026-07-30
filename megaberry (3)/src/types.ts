export interface PredictionCell {
  [key: string]: string; // e.g. { "m1": "1" }
}

export type PredictionsMap = Record<string, PredictionCell>;

export interface TargetRow {
  mult: string;
  row: number;
  safeCount: number;
}

export interface UserAuth {
  userId: string;
  isAuthenticated: boolean;
  loginTime: string;
  sessionToken: string;
}

export interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  safeCount: number;
  topRowSafeCol: number;
  predictions: PredictionsMap;
}
