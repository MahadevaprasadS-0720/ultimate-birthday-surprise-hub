import React, { useEffect, useRef, useState } from 'react';
import './BirthdayIntroModal.css';

/**
 * ===================================================================
 * BirthdayIntroModal - Reusable 3D Little Bheem Character Intro Component
 * ===================================================================
 * Compatible with React, Next.js, and Vite.
 *
 * Props:
 * - onComplete: () => void (Callback when the user finishes or skips the intro)
 * - autoStart: boolean (Whether to bypass initial tap trigger if user already consented)
 */
export const BirthdayIntroModal = ({ onComplete, autoStart = false }) => {
  const [currentPose, setCurrentPose] = useState('running');
  const [isStarted, setIsStarted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [speechText, setSpeechText] = useState('ನಿಮಗಾಗಿ ಒಬ್ಬ ಮುದ್ದಾದ ಗೆಳೆಯ ಬಂದಿದ್ದಾನೆ! ✨');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [showCta, setShowCta] = useState(false);

  const DIALOGUE_CHUNKS = [
    { kannada: "ಹೇಯ್... ನಿಲ್ಲು ನಿಲ್ಲು! ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯಾ? 🏃‍♂️", pose: "panting", duration: 2200 },
    { kannada: "ನಿನಗೋಸ್ಕರನೇ ಇಷ್ಟೊತ್ತು ಓಡ್ಕೊಂಡು, ಆಡ್ಕೊಂಡು ಬಂದಿದ್ದೀನಿ! 😅💨", pose: "panting", duration: 2400 },
    { kannada: "ಹೂಂ, ಕೇಳು... ನಿನಗೆ ಗೊತ್ತಾ? ಇವತ್ತು ಜಗತ್ತಿನಲ್ಲೇ ಒಬ್ಬ ಮುದ್ದಾದ, ಸ್ಪೆಷಲ್ ಹುಡುಗಿಯ ಹುಟ್ಟುಹಬ್ಬ! 🌟✨", pose: "waving", duration: 3800 },
    { kannada: "ಆ ಕ್ಯೂಟ್ ಹುಡುಗಿ ಬೇರೆ ಯಾರೂ ಅಲ್ಲ... ನೀನೇ! 💖🥰", pose: "waving", duration: 2500 },
    { kannada: "Happy Birthday to you! 🎂🎉✨", pose: "waving", duration: 2200 },
    { kannada: "ನಿನ್ನ ಮುಖದಲ್ಲಿ ಈ ನಗು ಯಾವತ್ತೂ ಹೀಗೇ ಇರಲಿ. ನಿನ್ನ ಎಲ್ಲಾ ಕನಸುಗಳು ನನಸಾಗಲಿ! 🌈💫", pose: "waving", duration: 3400 },
    { kannada: "ಬಾ, ನಿನಗೋಸ್ಕರ ಒಳಗಡೆ ಇನ್ಯಾರೋ ತುಂಬಾ ಪ್ರೀತಿಯಿಂದ ದೊಡ್ಡ ಸರ್ಪ್ರೈಸ್ ರೆಡಿ ಮಾಡಿ ಇಟ್ಟಿದ್ದಾರೆ... 🎁", pose: "pointing", duration: 3500 },
    { kannada: "ಬೇಗ ಓಪನ್ ಮಾಡಿ ನೋಡು! 👉🎀✨", pose: "pointing", duration: 2200 }
  ];

  const timersRef = useRef([]);

  const fireConfetti = (count = 50) => {
    if (typeof window !== 'undefined' && typeof window.confetti === 'function') {
      try {
        window.confetti({
          particleCount: count,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#ff4081', '#d81b60', '#ffeb3b', '#ff80ab', '#ffffff']
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setCurrentPose('running');
    fireConfetti(45);

    // 2.5s Panting
    const t1 = setTimeout(() => {
      setCurrentPose('panting');
      setShowSpeechBubble(true);
      setSpeechText(DIALOGUE_CHUNKS[0].kannada);
      setIsSpeaking(true);
    }, 2500);
    timersRef.current.push(t1);

    // 4.5s Waving & Dialogue
    const t2 = setTimeout(() => {
      let idx = 1;
      const nextChunk = () => {
        if (idx < DIALOGUE_CHUNKS.length) {
          const chunk = DIALOGUE_CHUNKS[idx];
          setCurrentPose(chunk.pose);
          setSpeechText(chunk.kannada);
          if (chunk.pose === 'pointing') {
            fireConfetti(35);
          }
          idx++;
          const t = setTimeout(nextChunk, chunk.duration);
          timersRef.current.push(t);
        } else {
          setCurrentPose('pointing');
          setIsSpeaking(false);
          setShowCta(true);
        }
      };
      nextChunk();
    }, 4500);
    timersRef.current.push(t2);
  };

  const handleExit = () => {
    timersRef.current.forEach(clearTimeout);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    fireConfetti(90);
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 820);
  };

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [autoStart]);

  return (
    <div
      id="birthdayIntroOverlay"
      className={isExiting ? 'intro-exiting' : ''}
      role="dialog"
      aria-modal="true"
      aria-label="Birthday Surprise Character Intro"
    >
      {/* Ambient Visuals */}
      <div className="intro-ambient-bg">
        <div className="intro-light-spotlight" />
        <div className="intro-balloon b1" />
        <div className="intro-balloon b2" />
        <div className="intro-balloon b3" />
        <div className="intro-balloon b4" />
        <div className="intro-sparkle" style={{ top: '20%', left: '15%', width: 8, height: 8 }} />
        <div className="intro-sparkle" style={{ top: '28%', right: '20%', width: 10, height: 10, animationDelay: '0.7s' }} />
        <div className="intro-sparkle" style={{ top: '62%', left: '12%', width: 6, height: 6, animationDelay: '1.2s' }} />
        <div className="intro-sparkle" style={{ top: '75%', right: '15%', width: 9, height: 9, animationDelay: '0.4s' }} />
      </div>

      {/* Skip Button */}
      <button className="intro-skip-btn" onClick={handleExit} title="Skip to Birthday Surprise">
        <span>Skip / Explore Surprise</span>
        <i className="fas fa-forward" />
      </button>

      {/* Main Stage */}
      <div className="intro-stage-container">
        {/* Speech Card */}
        <div className={`intro-speech-card ${showSpeechBubble ? 'show-bubble' : ''}`}>
          <div className="intro-speaker-badge">
            <span className="intro-speaker-dot" />
            <span>ಮುದ್ದು ಭೀಮ್ (Little Bheem) 🎈</span>
          </div>
          <div className="intro-kannada-text">
            <span className="karaoke-glow">{speechText}</span>
          </div>
          <div className={`intro-audio-wave ${isSpeaking ? 'speaking' : ''}`}>
            <span className="intro-wave-bar" />
            <span className="intro-wave-bar" />
            <span className="intro-wave-bar" />
            <span className="intro-wave-bar" />
            <span className="intro-wave-bar" />
          </div>
        </div>

        {/* 3D Character Actor */}
        <div className={`intro-actor-wrapper ${isStarted ? 'approaching' : ''}`}>
          <img
            src="bheem-running.png"
            alt="Little Bheem Running"
            className={`intro-pose-img pose-running ${currentPose === 'running' ? 'active-pose' : ''}`}
          />
          <img
            src="bheem-panting.png"
            alt="Little Bheem Panting"
            className={`intro-pose-img pose-panting ${currentPose === 'panting' ? 'active-pose' : ''}`}
          />
          <img
            src="bheem-waving.png"
            alt="Little Bheem Waving"
            className={`intro-pose-img pose-waving ${currentPose === 'waving' ? 'active-pose' : ''}`}
          />
          <img
            src="bheem-pointing.png"
            alt="Little Bheem Pointing"
            className={`intro-pose-img pose-pointing ${currentPose === 'pointing' ? 'active-pose' : ''}`}
          />
        </div>

        {/* 3D Contact Shadow */}
        <div
          className="intro-actor-shadow"
          style={{
            transform: isStarted ? 'scale(1)' : 'scale(0.35)',
            opacity: isStarted ? 0.6 : 0.3
          }}
        />

        {/* Action Controls */}
        <div className="intro-actions-bar">
          {!isStarted && (
            <button className="intro-trigger-btn" onClick={handleStart}>
              <span>Tap to open your birthday surprise 🎁</span>
              <i className="fas fa-sparkles" />
            </button>
          )}

          <button
            className={`intro-cta-btn ${showCta ? 'show-cta' : ''}`}
            onClick={handleExit}
          >
            <span>🎀 Explore Surprise ➡️ (ಸರ್ಪ್ರೈಸ್ ನೋಡಿ) ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BirthdayIntroModal;
