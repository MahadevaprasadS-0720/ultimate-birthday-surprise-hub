import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KrishnaScene } from './KrishnaScene';
import { useAudioLipSync } from '../hooks/useAudioLipSync';

const SESSION_KEY = 'krishna_intro_seen';

export default function KrishnaIntro({ children }) {
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [actionPhase, setActionPhase] = useState('enter'); // 'enter' -> 'speaking' -> 'ending'
  const [showCta, setShowCta] = useState(false);

  const { amplitude, isEnded, needsInteraction, play } = useAudioLipSync(
    '/audio/krishna_birthday_kn.mp3'
  );

  // Auto-start audio and transition when Krishna stops at center
  const handleEntered = () => {
    setActionPhase('speaking');
    play();
  };

  // Show "Open Surprise" button when speech finishes
  useEffect(() => {
    if (isEnded) {
      setActionPhase('ending');
      setShowCta(true);
    }
  }, [isEnded]);

  // Complete and transition into the homepage
  const handleComplete = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setHasSeenIntro(true);
  };

  // If already seen in this session, render the website directly with zero delay
  if (hasSeenIntro) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Existing Website in background ready for instant reveal */}
      <div className="w-full h-full pointer-events-none opacity-0">
        {children}
      </div>

      {/* Fullscreen 3D Intro Layer */}
      <AnimatePresence>
        {!hasSeenIntro && (
          <motion.div
            key="krishna-intro-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0826] via-[#2c1236] to-[#0d0314]"
          >
            {/* Top-Right Skip Button */}
            <button
              onClick={handleComplete}
              className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider text-amber-100 uppercase rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Skip Intro ➔
            </button>

            {/* Unmute Prompt (Only shown if browser autoplay blocked audio) */}
            {needsInteraction && (
              <button
                onClick={play}
                className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-full bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg animate-pulse"
              >
                🔊 ಧ್ವನಿ ಆಲಿಸಿ / Tap to Unmute
              </button>
            )}

            {/* 3D WebGL Canvas */}
            <div className="w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center">
              <KrishnaScene
                amplitude={amplitude}
                actionPhase={actionPhase}
                onEntered={handleEntered}
              />
            </div>

            {/* Glowing Call-To-Action Button */}
            <AnimatePresence>
              {showCta && (
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute bottom-12 z-50"
                >
                  <button
                    onClick={handleComplete}
                    className="relative group px-10 py-4 rounded-full font-bold text-lg text-white shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
                  >
                    {/* Glowing animated gradient */}
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-pink-500 to-rose-600 animate-gradient-x" />
                    <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-3 drop-shadow-md">
                      <span>🎁 Open Surprise</span>
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
