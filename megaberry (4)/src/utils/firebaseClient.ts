import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';
import { PredictionsMap } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyAlX1ASvDrf5BBtaB72AUYqSoW34YvP_y4",
  authDomain: "mrwan-dd795.firebaseapp.com",
  databaseURL: "https://mrwan-dd795-default-rtdb.firebaseio.com",
  projectId: "mrwan-dd795",
  storageBucket: "mrwan-dd795.firebasestorage.app",
  messagingSenderId: "12538399995",
  appId: "1:12538399995:web:4a7e6b40f611891fecb45e",
  measurementId: "G-KBTHXXDYBL"
};

// Initialize Firebase safely
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.warn("Firebase initialization warning:", e);
}

export const rtdb = app ? getDatabase(app) : null;

/**
 * Uploads predictions object to Realtime Database at path /m11
 */
export const uploadPredictionsToFirebase = async (predictions: PredictionsMap): Promise<boolean> => {
  let success = false;
  if (rtdb) {
    try {
      const m11Ref = ref(rtdb, 'm11');
      await set(m11Ref, predictions);
      success = true;
    } catch (err) {
      console.warn("Failed to write to Firebase RTDB via SDK:", err);
    }
  }

  if (!success) {
    try {
      const res = await fetch(`${firebaseConfig.databaseURL}/m11.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(predictions),
      });
      if (res.ok) {
        success = true;
      }
    } catch (err) {
      console.warn("Failed to write to Firebase RTDB via REST:", err);
    }
  }

  return success;
};

/**
 * Fetches predictions object from Realtime Database at path /m11
 */
export const fetchPredictionsFromFirebase = async (): Promise<PredictionsMap | null> => {
  if (rtdb) {
    try {
      const m11Ref = ref(rtdb, 'm11');
      const snapshot = await get(m11Ref);
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (val && Object.keys(val).length > 0) {
          return val as PredictionsMap;
        }
      }
    } catch (err) {
      console.warn("Failed to read from Firebase RTDB via SDK:", err);
    }
  }

  try {
    const res = await fetch(`${firebaseConfig.databaseURL}/m11.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        return data as PredictionsMap;
      }
    }
  } catch (err) {
    console.warn("Failed to read from Firebase RTDB via REST API:", err);
  }

  return null;
};

/**
 * Subscribes to realtime updates on path /m11
 */
export const subscribeToM11 = (onData: (preds: PredictionsMap) => void): (() => void) => {
  if (!rtdb) return () => {};
  try {
    const m11Ref = ref(rtdb, 'm11');
    const unsubscribe = onValue(m11Ref, (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.val() as PredictionsMap);
      }
    }, (error) => {
      console.warn("Firebase realtime listener error:", error);
    });
    return unsubscribe;
  } catch (e) {
    return () => {};
  }
};
