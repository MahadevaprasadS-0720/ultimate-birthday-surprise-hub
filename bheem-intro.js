/**
 * Mighty Little Bheem 3D Animated Birthday Surprise Intro
 * Features:
 * - 4 Animated Poses (Running, Panting, Waving/Speaking, Pointing/Winking)
 * - Complete Kannada dialogue with synchronized karaoke highlights
 * - Web SpeechSynthesis (Kannada kn-IN / voice fallback) & Web Audio sound effects
 * - Seamless transition to Birthday Step 1
 */

(function () {
  'use strict';

  // Kannada Dialogue Script Segments with timing hints
  const DIALOGUE_SEGMENTS = [
    {
      id: 0,
      kannada: "ಹೇಯ್... ನಿಲ್ಲು ನಿಲ್ಲು! ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯಾ? 🏃‍♂️",
      english: "Hey... stop, wait! Where are you going?",
      pose: "panting",
      duration: 2200
    },
    {
      id: 1,
      kannada: "ನಿನಗೋಸ್ಕರನೇ ಇಷ್ಟೊತ್ತು ಓಡ್ಕೊಂಡು, ಆಡ್ಕೊಂಡು ಬಂದಿದ್ದೀನಿ! 😅💨",
      english: "I've been running and tumbling all this way just for you!",
      pose: "panting",
      duration: 2400
    },
    {
      id: 2,
      kannada: "ಹೂಂ, ಕೇಳು... ನಿನಗೆ ಗೊತ್ತಾ? ಇವತ್ತು ಜಗತ್ತಿನಲ್ಲೇ ಒಬ್ಬ ಮುದ್ದಾದ, ಸ್ಪೆಷಲ್ ಹುಡುಗಿಯ ಹುಟ್ಟುಹಬ್ಬ! 🌟✨",
      english: "Mmm, listen... do you know? Today is the birthday of the cutest, most special girl in the whole world!",
      pose: "waving",
      duration: 3800
    },
    {
      id: 3,
      kannada: "ಆ ಕ್ಯೂಟ್ ಹುಡುಗಿ ಬೇರೆ ಯಾರೂ ಅಲ್ಲ... ನೀನೇ! 💖🥰",
      english: "And that cute girl is none other than... YOU!",
      pose: "waving",
      duration: 2500
    },
    {
      id: 4,
      kannada: "Happy Birthday to you! 🎂🎉✨",
      english: "Happy Birthday to you!",
      pose: "waving",
      duration: 2200
    },
    {
      id: 5,
      kannada: "ನಿನ್ನ ಮುಖದಲ್ಲಿ ಈ ನಗು ಯಾವತ್ತೂ ಹೀಗೇ ಇರಲಿ. ನಿನ್ನ ಎಲ್ಲಾ ಕನಸುಗಳು ನನಸಾಗಲಿ! 🌈💫",
      english: "May this smile always shine on your face. May all your dreams come true!",
      pose: "waving",
      duration: 3400
    },
    {
      id: 6,
      kannada: "ಬಾ, ನಿನಗೋಸ್ಕರ ಒಳಗಡೆ ಇನ್ಯಾರೋ ತುಂಬಾ ಪ್ರೀತಿಯಿಂದ ದೊಡ್ಡ ಸರ್ಪ್ರೈಸ್ ರೆಡಿ ಮಾಡಿ ಇಟ್ಟಿದ್ದಾರೆ... 🎁",
      english: "Come, someone has prepared a big, lovely surprise inside just for you with so much love...",
      pose: "pointing",
      duration: 3500
    },
    {
      id: 7,
      kannada: "ಬೇಗ ಓಪನ್ ಮಾಡಿ ನೋಡು! 👉🎀✨",
      english: "Hurry up, open it and see!",
      pose: "pointing",
      duration: 2200
    }
  ];

  // Web Audio Synthesizer for rich, zero-dependency sound effects
  class BheemAudioEffects {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Play cheerful toddler giggle / musical chime
    playGiggle() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    }

    // Play cute panting breath / pop effect
    playPantingPop() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    }

    // Play fanfare chime when pointing to surprise
    playFanfare() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chords = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      chords.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.25);
      });
    }

    // Play party popper sound on modal completion
    playPopper() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    }
  }

  // Main Bheem Intro Controller
  class BheemIntroController {
    constructor() {
      this.modal = document.getElementById('bheemIntroModal');
      this.actorWrapper = document.getElementById('bheemActorWrapper');
      this.shadow = document.getElementById('bheemShadow');
      this.speechCard = document.getElementById('bheemSpeechCard');
      this.kannadaTextEl = document.getElementById('bheemKannadaText');
      this.audioWave = document.getElementById('bheemAudioWave');
      this.btnStart = document.getElementById('bheemBtnStart');
      this.btnCta = document.getElementById('bheemBtnCta');
      this.btnSkip = document.getElementById('bheemBtnSkip');
      
      this.poses = {
        running: document.getElementById('poseRunning'),
        panting: document.getElementById('posePanting'),
        waving: document.getElementById('poseWaving'),
        pointing: document.getElementById('posePointing')
      };

      this.audio = new BheemAudioEffects();
      this.isSpeaking = false;
      this.currentSegmentIdx = 0;
      this.kannadaVoice = null;
      this.speechUtterance = null;
      this.timelineTimers = [];

      this.initVoices();
      this.bindEvents();
    }

    // Try to find a Kannada or friendly Indian voice
    initVoices() {
      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          // Priority 1: Kannada (kn-IN)
          this.kannadaVoice = voices.find(v => v.lang.includes('kn') || v.lang.includes('kannada'));
          // Priority 2: Indian English or Hindi as melodic fallback
          if (!this.kannadaVoice) {
            this.kannadaVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('en-IN') || v.lang.includes('IN'));
          }
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = loadVoices;
        }
      }
    }

    bindEvents() {
      if (this.btnStart) {
        this.btnStart.addEventListener('click', () => this.startSequence());
      }
      if (this.btnCta) {
        this.btnCta.addEventListener('click', () => this.finishAndOpenSurprise());
      }
      if (this.btnSkip) {
        this.btnSkip.addEventListener('click', () => this.finishAndOpenSurprise());
      }
    }

    // Switch between character poses with smooth crossfade
    setPose(poseName) {
      Object.keys(this.poses).forEach(key => {
        if (this.poses[key]) {
          if (key === poseName) {
            this.poses[key].classList.add('active-pose');
          } else {
            this.poses[key].classList.remove('active-pose');
          }
        }
      });
    }

    // Sequence Start triggered by user interaction
    startSequence() {
      this.audio.init();
      this.audio.playGiggle();

      // Hide start button
      if (this.btnStart) {
        this.btnStart.style.display = 'none';
      }

      // 1. SEQUENCE START: 0s - 2.5s (Running & Toddling towards camera)
      this.setPose('running');
      if (this.actorWrapper) {
        this.actorWrapper.classList.add('approaching');
      }
      if (this.shadow) {
        this.shadow.style.transform = 'scale(1)';
        this.shadow.style.opacity = '0.6';
      }

      // 2. 2.5s - 4.5s (Stops, hands on knees, panting and catching breath)
      const t1 = setTimeout(() => {
        this.setPose('panting');
        this.audio.playPantingPop();
        
        // Show speech bubble with introductory panting lines
        this.showSpeechBubble();
        this.renderSegment(0);
        
        // Gentle panting sound after a moment
        const tPop = setTimeout(() => this.audio.playPantingPop(), 900);
        this.timelineTimers.push(tPop);
      }, 2500);
      this.timelineTimers.push(t1);

      // 3. 4.5s onwards: Stands up, waves cheerfully, speaks Kannada dialogue
      const t2 = setTimeout(() => {
        this.startDialogueSequence(1);
      }, 4500);
      this.timelineTimers.push(t2);
    }

    showSpeechBubble() {
      if (this.speechCard) {
        this.speechCard.classList.add('show-bubble');
      }
    }

    renderSegment(idx) {
      if (idx >= DIALOGUE_SEGMENTS.length) return;
      const seg = DIALOGUE_SEGMENTS[idx];
      this.currentSegmentIdx = idx;

      // Update pose if segment calls for it
      if (seg.pose) {
        this.setPose(seg.pose);
      }

      // Render Kannada text with highlight animation
      if (this.kannadaTextEl) {
        this.kannadaTextEl.innerHTML = `<span class="karaoke-phrase active-phrase">${seg.kannada}</span>`;
      }

      // Animate wave indicator
      if (this.audioWave) {
        this.audioWave.classList.add('speaking');
      }
    }

    // Step through the dialogue segments progressively
    startDialogueSequence(startIdx) {
      let currentIdx = startIdx;

      // Full Kannada text for SpeechSynthesis if available
      const fullKannadaText = "ಹೇಯ್... ನಿಲ್ಲು ನಿಲ್ಲು! ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯಾ? ನಿನಗೋಸ್ಕರನೇ ಇಷ್ಟೊತ್ತು ಓಡ್ಕೊಂಡು, ಆಡ್ಕೊಂಡು ಬಂದಿದ್ದೀನಿ! ಹೂಂ, ಕೇಳು... ನಿನಗೆ ಗೊತ್ತಾ? ಇವತ್ತು ಜಗತ್ತಿನಲ್ಲೇ ಒಬ್ಬ ಮುದ್ದಾದ, ಸ್ಪೆಷಲ್ ಹುಡುಗಿಯ ಹುಟ್ಟುಹಬ್ಬ! ಆ ಕ್ಯೂಟ್ ಹುಡುಗಿ ಬೇರೆ ಯಾರೂ ಅಲ್ಲ... ನೀನೇ! Happy Birthday to you! ನಿನ್ನ ಮುಖದಲ್ಲಿ ಈ ನಗು ಯಾವತ್ತೂ ಹೀಗೇ ಇರಲಿ. ನಿನ್ನ ಎಲ್ಲಾ ಕನಸುಗಳು ನನಸಾಗಲಿ. ಬಾ, ನಿನಗೋಸ್ಕರ ಒಳಗಡೆ ಇನ್ಯಾರೋ ತುಂಬಾ ಪ್ರೀತಿಯಿಂದ ದೊಡ್ಡ ಸರ್ಪ್ರೈಸ್ ರೆಡಿ ಮಾಡಿ ಇಟ್ಟಿದ್ದಾರೆ... ಬೇಗ ಓಪನ್ ಮಾಡಿ ನೋಡು!";

      this.speakKannadaText(fullKannadaText);

      const nextSegment = () => {
        if (currentIdx < DIALOGUE_SEGMENTS.length) {
          const seg = DIALOGUE_SEGMENTS[currentIdx];
          this.renderSegment(currentIdx);

          if (seg.pose === 'pointing') {
            this.audio.playFanfare();
          }

          currentIdx++;
          const timer = setTimeout(nextSegment, seg.duration);
          this.timelineTimers.push(timer);
        } else {
          // Finished dialogue: Show Final CTA Button and Pointing Pose!
          this.finishDialogue();
        }
      };

      nextSegment();
    }

    speakKannadaText(text) {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        this.speechUtterance = new SpeechSynthesisUtterance(text);
        if (this.kannadaVoice) {
          this.speechUtterance.voice = this.kannadaVoice;
        }
        // Melodic cute toddler-like pitch & pacing
        this.speechUtterance.pitch = 1.35;
        this.speechUtterance.rate = 1.02;
        this.speechUtterance.lang = 'kn-IN';

        this.speechUtterance.onend = () => {
          if (this.audioWave) this.audioWave.classList.remove('speaking');
        };

        window.speechSynthesis.speak(this.speechUtterance);
      } catch (err) {
        console.warn('SpeechSynthesis error or blocked:', err);
      }
    }

    finishDialogue() {
      if (this.audioWave) {
        this.audioWave.classList.remove('speaking');
      }
      this.setPose('pointing');

      // Reveal Final CTA Button with glowing animation
      if (this.btnCta) {
        this.btnCta.classList.add('show-cta');
      }
    }

    // Modal Completion & Transition to Birthday Step 1
    finishAndOpenSurprise() {
      // Clear timers and stop speech
      this.timelineTimers.forEach(t => clearTimeout(t));
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      this.audio.init();
      this.audio.playPopper();

      // Confetti burst if confetti library is loaded
      if (typeof window.confetti === 'function') {
        window.confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      // Automatically start background romantic music if available and not yet playing
      if (typeof window.toggleMusic === 'function' && !window.isMusicPlaying) {
        try {
          window.toggleMusic();
        } catch (e) {
          console.log('Music start on intro finish:', e);
        }
      }

      // Smooth fade-out of intro modal
      if (this.modal) {
        this.modal.classList.add('modal-hidden');
        setTimeout(() => {
          this.modal.style.display = 'none';
        }, 850);
      }
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.bheemIntro = new BheemIntroController();
    });
  } else {
    window.bheemIntro = new BheemIntroController();
  }
})();
