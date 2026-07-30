import React, { useState, useEffect } from 'react';
import { ParticleBackground } from './components/ParticleBackground';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { AuthModal } from './components/AuthModal';
import { PredictionGrid } from './components/PredictionGrid';
import { ControlPanel } from './components/ControlPanel';
import { FirebaseInspector } from './components/FirebaseInspector';
import { LiveSimulator } from './components/LiveSimulator';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { UserAuth, PredictionsMap } from './types';
import {
  generatePredictionsData,
  savePredictionsLocally,
  getLocalPredictions,
  isSafeApple,
  TARGET_ROWS,
} from './utils/firebaseEngine';
import {
  uploadPredictionsToFirebase,
  fetchPredictionsFromFirebase,
  subscribeToM11,
} from './utils/firebaseClient';
import { sounds } from './utils/audio';
import { ShieldCheck, Cpu, History, Sparkles, AlertCircle, Clock } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserAuth | null>(null);
  const [predictions, setPredictions] = useState<PredictionsMap | null>(null);
  const [hasRevealed, setHasRevealed] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'simulator'>('grid');

  const [predictionTime, setPredictionTime] = useState<string>(
    new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [countdownSeconds, setCountdownSeconds] = useState<number>(60);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState<boolean>(false);
  const [firebaseUrl, setFirebaseUrl] = useState<string>('https://mrwan-dd795-default-rtdb.firebaseio.com');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto countdown effect for automatic timing updates
  useEffect(() => {
    if (!user?.isAuthenticated) return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          const nowStr = new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          setPredictionTime(nowStr);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Load or generate initial predictions & listen to Firebase RTDB
  useEffect(() => {
    // 1. Fetch live expectations from Firebase RTDB at /m11 first
    fetchPredictionsFromFirebase().then((remoteData) => {
      if (remoteData && Object.keys(remoteData).length > 0) {
        setPredictions(remoteData);
        savePredictionsLocally(remoteData);
      } else {
        const initial = generatePredictionsData();
        savePredictionsLocally(initial);
        setPredictions(initial);
        uploadPredictionsToFirebase(initial);
      }
    });

    // 2. Subscribe to Firebase RTDB realtime path /m11
    const unsubscribe = subscribeToM11((liveData) => {
      if (liveData && Object.keys(liveData).length > 0) {
        setPredictions(liveData);
        savePredictionsLocally(liveData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Show temporary toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handle Login when clicking "ابدأ" - Keeps apples hidden until user starts!
  const handleLoginSuccess = (userId: string) => {
    const nowTime = new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const newUser: UserAuth = {
      userId,
      isAuthenticated: true,
      loginTime: nowTime,
      sessionToken: `SHARK-V2-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    setUser(newUser);
    setPredictionTime(nowTime);
    setCountdownSeconds(60);
    setHasRevealed(false); // Wait for user to click Start Now!
    showToast(`مرحباً بك! اضغط على "ابدأ الآن" لكشف التفوق والمسار.`);
  };

  // Handle Start Now button click - updates time, fetches/generates expectations on Firebase RTDB & reveals path!
  const handleStartNow = async (timeOverride?: string) => {
    setIsGenerating(true);
    sounds.playClick();

    const nowTime = timeOverride || new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setPredictionTime(nowTime);
    setCountdownSeconds(60);

    // Generate fresh predictions, save to Firebase RTDB path /m11
    const newPreds = generatePredictionsData();
    await uploadPredictionsToFirebase(newPreds);

    // Fetch and set expectations directly from Firebase RTDB
    const fetchedPreds = await fetchPredictionsFromFirebase();
    const activePreds = fetchedPreds || newPreds;

    savePredictionsLocally(activePreds);
    setPredictions(activePreds);

    setIsGenerating(false);
    setHasRevealed(true); // Explicitly reveal apples when clicking Start Now!
    sounds.playSuccessGen();
    showToast(`تم جلب ومزامنة التوقعات المباشرة من الفايربيز (/m11)! التوقيت: ${nowTime}`);
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col px-4 pt-4 pb-6 select-none" dir="rtl">
      {/* Background Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(at center top, rgba(138, 43, 226, 0.35) 0%, rgba(3, 8, 12, 0) 55%), radial-gradient(at center bottom, rgba(199, 125, 255, 0.18) 0%, rgba(3, 8, 12, 0) 60%), rgb(10, 3, 24)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid-bg opacity-30"
        style={{ maskImage: 'radial-gradient(black 30%, transparent 80%)' }}
      />

      {/* Ambient Particle Engine */}
      <ParticleBackground />

      {/* Top Header */}
      <Header
        user={user}
        onLogout={() => {
          setUser(null);
          showToast('تم تسجيل الخروج من المحرك');
        }}
        onOpenModal={() => setIsAuthModalOpen(true)}
        isFirebaseConnected={true}
        onToggleFirebaseConfig={() => setIsFirebaseConfigOpen(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-purple-950/90 border border-[#C77DFF] text-white text-xs font-arabic shadow-[0_0_20px_rgba(199,125,255,0.5)] flex items-center gap-2 animate-fade-down">
          <Sparkles className="w-4 h-4 text-[#22ff66]" />
          {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start mt-2">
        {!user?.isAuthenticated ? (
          /* Authentication Form */
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onOpenRequirementsModal={() => setIsAuthModalOpen(true)}
          />
        ) : (
          /* Authenticated Dashboard Workspace */
          <div className="w-full max-w-md mx-auto flex flex-col gap-3">
            {/* User Account Bar */}
            <div className="p-3 rounded-2xl bg-black/50 border border-[#C77DFF]/40 flex items-center justify-between shadow-[0_0_15px_rgba(199,125,255,0.15)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C77DFF]/20 border border-[#C77DFF]/50 flex items-center justify-center font-display font-bold text-[#D9A8FF]">
                  ID
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-display">
                    المعرف: {user.userId}
                  </div>
                  <div className="text-[10px] text-white/50 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#22ff66]" />
                    رمز الجلسة: {user.sessionToken}
                  </div>
                </div>
              </div>

              <div className="text-left" dir="ltr">
                <div className="text-[9px] text-[#22ff66] font-display font-bold">
                  PRECISION 99.8%
                </div>
                <div className="text-[10px] text-white/50 font-arabic">مزامنة حية متصلة</div>
              </div>
            </div>

            {/* Main Active Tab View (Apples Grid) */}
            {activeTab === 'grid' && (
              <div className="p-3 rounded-2xl bg-black/40 border border-[#C77DFF]/30 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3 px-1 text-xs">
                  <span className="font-bold text-[#D9A8FF] flex items-center gap-1.5 font-arabic">
                    <Cpu className="w-4 h-4 text-[#C77DFF]" />
                    صفحة الفواكه (تفاحة الحظ - 10 صفوف)
                  </span>
                  <span className="text-[11px] text-[#22ff66] font-display font-bold">
                    {hasRevealed ? 'التوقعات مكشوفة' : 'التوقعات مخفية - اضغط ابدأ الآن'}
                  </span>
                </div>

                <PredictionGrid predictions={predictions} hasRevealed={hasRevealed} />
              </div>
            )}

            {activeTab === 'simulator' && <LiveSimulator predictions={predictions} />}

            {/* Live Timing Auto-Update Bar (Under Apples) */}
            <div className="p-2.5 rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/40 flex items-center justify-between text-xs font-arabic">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#22ff66] animate-pulse" />
                <span className="text-white/80">التوقيت الحقيقي:</span>
                <span className="font-bold text-[#22ff66] font-display text-sm">{predictionTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60 text-[11px]">
                <span>التحديث القادم:</span>
                <span className="font-bold text-[#C77DFF] font-display tabular-nums">{countdownSeconds}ث</span>
              </div>
            </div>

            {/* Control Panel Buttons & Options (Under Apples) */}
            <ControlPanel
              hasRevealed={hasRevealed}
              onToggleReveal={() => setHasRevealed(!hasRevealed)}
              onStartNow={handleStartNow}
              isGenerating={isGenerating}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        )}
      </main>

      {/* Reusable Auth Requirements Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Firebase Config Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseConfigOpen}
        onClose={() => setIsFirebaseConfigOpen(false)}
        onSaveConfig={(url) => {
          setFirebaseUrl(url);
          showToast('تم تحديث رابط Realtime Database بنجاح');
        }}
        currentDatabaseURL={firebaseUrl}
      />
    </div>
  );
}
