/**
 * ===================================================================
 * BIRTHDAY INTRO MODAL - 3D LITTLE BHEEM EXPERIENCE (Isolated Component)
 * ===================================================================
 * Principal Full-Stack Web Animator & 3D Creative Engineer Implementation
 *
 * Features:
 * - High-definition 3D Little Bheem character animation pipeline (4 poses)
 * - Timeline:
 *     (0.0s - 2.5s): Toddling & running into center-frame with confetti burst
 *     (2.5s - 4.5s): Stops abruptly, hands on knees/hips, panting & catching breath
 *     (4.5s - End): Waves enthusiastically, speaks Kannada birthday dialogue
 *                   with synchronized karaoke highlights & audio wave, points down to CTA
 * - Exact design token matching: Romantic Rose (#d81b60, #ff4081), Glassmorphism, Montserrat
 * - Zero breaking changes, preloaded assets, error boundaries, responsive scaling
 * ===================================================================
 */

(function () {
  'use strict';

  // Kannada Dialogue Segments with duration hints
  const DIALOGUE_CHUNKS = [
    {
      kannada: "ಹೇಯ್... ನಿಲ್ಲು ನಿಲ್ಲು! ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯಾ? 🏃‍♂️",
      english: "Hey... stop, wait! Where are you going?",
      pose: "panting",
      duration: 2200
    },
    {
      kannada: "ನಿನಗೋಸ್ಕರನೇ ಇಷ್ಟೊತ್ತು ಓಡ್ಕೊಂಡು, ಆಡ್ಕೊಂಡು ಬಂದಿದ್ದೀನಿ! 😅💨",
      english: "I've been running and tumbling all this way just for you!",
      pose: "panting",
      duration: 2400
    },
    {
      kannada: "ಹೂಂ, ಕೇಳು... ನಿನಗೆ ಗೊತ್ತಾ? ಇವತ್ತು ಜಗತ್ತಿನಲ್ಲೇ ಒಬ್ಬ ಮುದ್ದಾದ, ಸ್ಪೆಷಲ್ ಹುಡುಗಿಯ ಹುಟ್ಟುಹಬ್ಬ! 🌟✨",
      english: "Mmm, listen... do you know? Today is the birthday of the cutest, most special girl in the world!",
      pose: "waving",
      duration: 3800
    },
    {
      kannada: "ಆ ಕ್ಯೂಟ್ ಹುಡುಗಿ ಬೇರೆ ಯಾರೂ ಅಲ್ಲ... ನೀನೇ! 💖🥰",
      english: "And that cute girl is none other than... YOU!",
      pose: "waving",
      duration: 2500
    },
    {
      kannada: "Happy Birthday to you! 🎂🎉✨",
      english: "Happy Birthday to you!",
      pose: "waving",
      duration: 2200
    },
    {
      kannada: "ನಿನ್ನ ಮುಖದಲ್ಲಿ ಈ ನಗು ಯಾವತ್ತೂ ಹೀಗೇ ಇರಲಿ. ನಿನ್ನ ಎಲ್ಲಾ ಕನಸುಗಳು ನನಸಾಗಲಿ! 🌈💫",
      english: "May this smile always shine on your face. May all your dreams come true!",
      pose: "waving",
      duration: 3400
    },
    {
      kannada: "ಬಾ, ನಿನಗೋಸ್ಕರ ಒಳಗಡೆ ಇನ್ಯಾರೋ ತುಂಬಾ ಪ್ರೀತಿಯಿಂದ ದೊಡ್ಡ ಸರ್ಪ್ರೈಸ್ ರೆಡಿ ಮಾಡಿ ಇಟ್ಟಿದ್ದಾರೆ... 🎁",
      english: "Come, someone has prepared a big, lovely surprise inside just for you with so much love...",
      pose: "pointing",
      duration: 3500
    },
    {
      kannada: "ಬೇಗ ಓಪನ್ ಮಾಡಿ ನೋಡು! 👉🎀✨",
      english: "Hurry up, open it and see!",
      pose: "pointing",
      duration: 2200
    }
  ];

  const ASSET_IMAGES = [
    'bheem-running.png',
    'bheem-panting.png',
    'bheem-waving.png',
    'bheem-pointing.png'
  ];

  // Synthesized Web Audio Effects for zero external dependencies
  class IntroAudioSynthesizer {
    constructor() {
      this.ctx = null;
    }

    init() {
      try {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      } catch (err) {
        console.warn('[IntroAudio] Web Audio initialization warning:', err);
      }
    }

    // Cheerful toddler giggle arpeggio
    playGiggle() {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.075);
          gain.gain.setValueAtTime(0.16, now + idx * 0.075);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.075 + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.075);
          osc.stop(now + idx * 0.075 + 0.32);
        });
      } catch (e) {
        console.warn(e);
      }
    }

    // Playful panting pop effect
    playPantingPop() {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(170, now + 0.14);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {
        console.warn(e);
      }
    }

    // Chime fanfare when pointing to surprise
    playFanfare() {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const chords = [587.33, 739.99, 880.00, 1174.66];
        chords.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 1.15);
        });
      } catch (e) {
        console.warn(e);
      }
    }

    // Party celebration sound on exit
    playPopper() {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.22;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.045));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  // Main Birthday Intro Modal Component Controller
  class BirthdayIntroExperience {
    constructor() {
      this.overlay = document.getElementById('birthdayIntroOverlay');
      this.actorWrapper = document.getElementById('introActorWrapper');
      this.actorShadow = document.getElementById('introActorShadow');
      this.speechCard = document.getElementById('introSpeechCard');
      this.kannadaTextEl = document.getElementById('introKannadaText');
      this.audioWave = document.getElementById('introAudioWave');
      this.triggerBtn = document.getElementById('introTriggerBtn');
      this.ctaBtn = document.getElementById('introCtaBtn');
      this.skipBtn = document.getElementById('introSkipBtn');

      this.poses = {
        running: document.getElementById('poseRunning'),
        panting: document.getElementById('posePanting'),
        waving: document.getElementById('poseWaving'),
        pointing: document.getElementById('posePointing')
      };

      this.audio = new IntroAudioSynthesizer();
      this.kannadaVoice = null;
      this.speechUtterance = null;
      this.timers = [];
      this.isSequenceStarted = false;

      this.preloadAssets();
      this.initSpeechVoices();
      this.bindEvents();
    }

    // Preload all 4 poses into memory
    preloadAssets() {
      ASSET_IMAGES.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }

    // Find best Kannada or melodic Indian voice
    initSpeechVoices() {
      if ('speechSynthesis' in window) {
        const updateVoices = () => {
          try {
            const voices = window.speechSynthesis.getVoices();
            this.kannadaVoice = voices.find(v => v.lang.includes('kn') || v.lang.includes('kannada'));
            if (!this.kannadaVoice) {
              this.kannadaVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('en-IN') || v.lang.includes('IN'));
            }
          } catch (e) {
            console.warn('[IntroSpeech] Voice load warning:', e);
          }
        };
        updateVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = updateVoices;
        }
      }
    }

    bindEvents() {
      if (this.triggerBtn) {
        this.triggerBtn.addEventListener('click', () => this.startIntroSequence());
      }
      if (this.ctaBtn) {
        this.ctaBtn.addEventListener('click', () => this.exitIntro());
      }
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', () => this.exitIntro());
      }
    }

    // Switch between character poses with smooth crossfade
    setPose(poseName) {
      Object.keys(this.poses).forEach(name => {
        const el = this.poses[name];
        if (el) {
          if (name === poseName) {
            el.classList.add('active-pose');
          } else {
            el.classList.remove('active-pose');
          }
        }
      });
    }

    // Fire festive confetti around Bheem
    burstConfetti(count = 50) {
      if (typeof window.confetti === 'function') {
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
    }

    // Main Timeline Sequence
    startIntroSequence() {
      if (this.isSequenceStarted) return;
      this.isSequenceStarted = true;

      // Unlock AudioContext
      this.audio.init();
      this.audio.playGiggle();

      // Hide initial trigger button
      if (this.triggerBtn) {
        this.triggerBtn.style.display = 'none';
      }

      // =======================================================
      // (0.0s - 2.5s): Toddling & running into center-frame with confetti
      // =======================================================
      this.setPose('running');
      if (this.actorWrapper) {
        this.actorWrapper.classList.add('approaching');
      }
      if (this.actorShadow) {
        this.actorShadow.style.transform = 'scale(1)';
        this.actorShadow.style.opacity = '0.6';
      }
      this.burstConfetti(45);

      // =======================================================
      // (2.5s - 4.5s): Stops abruptly, hands on knees/hips, panting & catching breath
      // =======================================================
      const t1 = setTimeout(() => {
        this.setPose('panting');
        this.audio.playPantingPop();
        
        // Show speech bubble with introductory panting dialogue
        if (this.speechCard) {
          this.speechCard.classList.add('show-bubble');
        }
        this.renderDialogueSegment(0);

        const tPop = setTimeout(() => this.audio.playPantingPop(), 850);
        this.timers.push(tPop);
      }, 2500);
      this.timers.push(t1);

      // =======================================================
      // (4.5s - End): Waves enthusiastically, speaks Kannada dialogue
      // =======================================================
      const t2 = setTimeout(() => {
        this.startDialogueProgress(1);
      }, 4500);
      this.timers.push(t2);
    }

    renderDialogueSegment(idx) {
      if (idx >= DIALOGUE_CHUNKS.length) return;
      const seg = DIALOGUE_CHUNKS[idx];

      if (seg.pose) {
        this.setPose(seg.pose);
      }

      if (this.kannadaTextEl) {
        this.kannadaTextEl.innerHTML = `<span class="karaoke-glow">${seg.kannada}</span>`;
      }

      if (this.audioWave) {
        this.audioWave.classList.add('speaking');
      }
    }

    startDialogueProgress(startIdx) {
      let currentIdx = startIdx;

      // Full Kannada spoken dialogue for SpeechSynthesis
      const fullText = "ಹೇಯ್... ನಿಲ್ಲು ನಿಲ್ಲು! ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯಾ? ನಿನಗೋಸ್ಕರನೇ ಇಷ್ಟೊತ್ತು ಓಡ್ಕೊಂಡು, ಆಡ್ಕೊಂಡು ಬಂದಿದ್ದೀನಿ! ಹೂಂ, ಕೇಳು... ನಿನಗೆ ಗೊತ್ತಾ? ಇವತ್ತು ಜಗತ್ತಿನಲ್ಲೇ ಒಬ್ಬ ಮುದ್ದಾದ, ಸ್ಪೆಷಲ್ ಹುಡುಗಿಯ ಹುಟ್ಟುಹಬ್ಬ! ಆ ಕ್ಯೂಟ್ ಹುಡುಗಿ ಬೇರೆ ಯಾರೂ ಅಲ್ಲ... ನೀನೇ! Happy Birthday to you! ನಿನ್ನ ಮುಖದಲ್ಲಿ ಈ ನಗು ಯಾವತ್ತೂ ಹೀಗೇ ಇರಲಿ. ನಿನ್ನ ಎಲ್ಲಾ ಕನಸುಗಳು ನನಸಾಗಲಿ. ಬಾ, ನಿನಗೋಸ್ಕರ ಒಳಗಡೆ ಇನ್ಯಾರೋ ತುಂಬಾ ಪ್ರೀತಿಯಿಂದ ದೊಡ್ಡ ಸರ್ಪ್ರೈಸ್ ರೆಡಿ ಮಾಡಿ ಇಟ್ಟಿದ್ದಾರೆ... ಬೇಗ ಓಪನ್ ಮಾಡಿ ನೋಡು!";

      this.speakKannada(fullText);

      const stepNext = () => {
        if (currentIdx < DIALOGUE_CHUNKS.length) {
          const seg = DIALOGUE_CHUNKS[currentIdx];
          this.renderDialogueSegment(currentIdx);

          if (seg.pose === 'pointing') {
            this.audio.playFanfare();
            this.burstConfetti(35);
          }

          currentIdx++;
          const t = setTimeout(stepNext, seg.duration);
          this.timers.push(t);
        } else {
          // Finished dialogue: Show Final CTA Button and Pointing Pose!
          this.finishDialogue();
        }
      };

      stepNext();
    }

    speakKannada(text) {
      if (!('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        this.speechUtterance = new SpeechSynthesisUtterance(text);
        if (this.kannadaVoice) {
          this.speechUtterance.voice = this.kannadaVoice;
        }
        this.speechUtterance.pitch = 1.35; // Cute toddler pitch
        this.speechUtterance.rate = 1.02;
        this.speechUtterance.lang = 'kn-IN';

        this.speechUtterance.onend = () => {
          if (this.audioWave) this.audioWave.classList.remove('speaking');
        };

        window.speechSynthesis.speak(this.speechUtterance);
      } catch (err) {
        console.warn('[IntroSpeech] SpeechSynthesis speak warning:', err);
      }
    }

    finishDialogue() {
      if (this.audioWave) {
        this.audioWave.classList.remove('speaking');
      }
      this.setPose('pointing');

      // Reveal Final CTA Button
      if (this.ctaBtn) {
        this.ctaBtn.classList.add('show-cta');
      }
    }

    // Buttery-smooth exit transition to main website
    exitIntro() {
      this.timers.forEach(t => clearTimeout(t));
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      this.audio.init();
      this.audio.playPopper();
      this.burstConfetti(90);

      // Automatically start background romantic music if available and not yet playing
      if (typeof window.toggleMusic === 'function' && !window.isMusicPlaying) {
        try {
          window.toggleMusic();
        } catch (e) {
          console.log('Background music autoplay on exit:', e);
        }
      }

      // Smooth fade-out / scale-down exit animation
      if (this.overlay) {
        this.overlay.classList.add('intro-exiting');
        setTimeout(() => {
          this.overlay.classList.add('intro-hidden');
        }, 820);
      }
    }
  }

  // Self-initializing production export
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.birthdayIntroExperience = new BirthdayIntroExperience();
    });
  } else {
    window.birthdayIntroExperience = new BirthdayIntroExperience();
  }
})();
