/**
 * ===================================================================
 * BIRTHDAY INTRO MODAL - 3D LITTLE BHEEM WebGL ANIMATION ENGINE
 * ===================================================================
 * Built with Three.js (r128)
 * - Real 3D Disney/Pixar-style Toddler Character Model
 * - 60 FPS Skeletal Keyframe Animation:
 *     (0.0s - 2.5s): Runs from 3D depth into center frame with 3D confetti burst
 *     (2.5s - 4.5s): Stops, hands on knees/hips, panting & catching breath
 *     (4.5s - End): Waves joyfully, speaks Kannada dialogue with 3D mouth lip-sync,
 *                   finishes pointing down to interactive button
 * - Autoplays immediately on page load with zero clicks needed
 * - Real child-voice Kannada audio playback (bheem-birthday-audio.webm)
 * ===================================================================
 */

(function () {
  'use strict';

  // Kannada Dialogue Segments matching the audio track
  const KANNADA_SEGMENTS = [
    { text: "ಹೇಯ್... ನಿಲ್ಲು ನಿಲ್ಲು! ಎಲ್ಲಿಗೆ ಹೋಗ್ತಿದ್ದೀಯಾ? 🏃‍♂️", start: 2.5, end: 5.0 },
    { text: "ನಿನಗೋಸ್ಕರನೇ ಇಷ್ಟೊತ್ತು ಓಡ್ಕೊಂಡು, ಆಡ್ಕೊಂಡು ಬಂದಿದ್ದೀನಿ! 😅💨", start: 5.0, end: 8.5 },
    { text: "ಹೂಂ, ಕೇಳು... ನಿನಗೆ ಗೊತ್ತಾ? ಇವತ್ತು ಜಗತ್ತಿನಲ್ಲೇ ಒಬ್ಬ ಮುದ್ದಾದ ಹುಡುಗಿಯ ಹುಟ್ಟುಹಬ್ಬ! 🌟", start: 8.5, end: 13.5 },
    { text: "ಆ ಕ್ಯೂಟ್ ಹುಡುಗಿ ಬೇರೆ ಯಾರೂ ಅಲ್ಲ... ನೀನೇ! 💖🥰", start: 13.5, end: 17.0 },
    { text: "Happy Birthday to you! 🎂🎉✨", start: 17.0, end: 20.5 },
    { text: "ನಿನ್ನ ಮುಖದಲ್ಲಿ ಈ ನಗು ಯಾವತ್ತೂ ಹೀಗೇ ಇರಲಿ. ನಿನ್ನ ಎಲ್ಲಾ ಕನಸುಗಳು ನನಸಾಗಲಿ! 🌈", start: 20.5, end: 25.0 },
    { text: "ಬಾ, ನಿನಗೋಸ್ಕರ ಒಳಗಡೆ ತುಂಬಾ ಪ್ರೀತಿಯಿಂದ ದೊಡ್ಡ ಸರ್ಪ್ರೈಸ್ ರೆಡಿ ಮಾಡಿ ಇಟ್ಟಿದ್ದಾರೆ... 🎁", start: 25.0, end: 29.5 },
    { text: "ಬೇಗ ಓಪನ್ ಮಾಡಿ ನೋಡು! 👉🎀✨", start: 29.5, end: 34.0 }
  ];

  class Bheem3DExperience {
    constructor() {
      this.overlay = document.getElementById('birthdayIntroOverlay');
      this.canvas = document.getElementById('bheem3DCanvas');
      this.speechCard = document.getElementById('introSpeechCard');
      this.kannadaTextEl = document.getElementById('introKannadaText');
      this.audioWave = document.getElementById('introAudioWave');
      this.ctaBtn = document.getElementById('introCtaBtn');
      this.skipBtn = document.getElementById('introSkipBtn');
      this.unmuteBtn = document.getElementById('introUnmuteBtn');
      this.audio = document.getElementById('introAudioTrack');

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.clock = new THREE.Clock();

      // Model parts
      this.bheemGroup = null;
      this.headGroup = null;
      this.torso = null;
      this.leftArm = null;
      this.rightArm = null;
      this.leftLeg = null;
      this.rightLeg = null;
      this.leftEye = null;
      this.rightEye = null;
      this.leftEyelid = null;
      this.rightEyelid = null;
      this.mouthMesh = null;
      this.tongueMesh = null;
      this.shadowMesh = null;
      this.confettiGroup = null;

      // State
      this.currentTime = 0;
      this.isExiting = false;
      this.lastBlinkTime = 0;
      this.isBlinking = false;
      this.mouthOpenAmount = 0;

      this.initThree();
      this.buildCharacter();
      this.buildConfetti();
      this.bindEvents();
      this.startAudioAndSequence();
      this.animate();
    }

    initThree() {
      const width = this.canvas.clientWidth || 380;
      const height = this.canvas.clientHeight || 420;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      this.camera.position.set(0, 1.5, 7.5);
      this.camera.lookAt(0, 0.8, 0);

      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Studio 3D Lighting (Disney/Pixar warmth)
      const ambientLight = new THREE.AmbientLight(0xfff0f5, 0.9);
      this.scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xfff5ea, 1.3);
      mainLight.position.set(4, 7, 6);
      mainLight.castShadow = true;
      this.scene.add(mainLight);

      const rimLight = new THREE.PointLight(0xff4081, 0.9, 20);
      rimLight.position.set(-4, 3, -3);
      this.scene.add(rimLight);

      const goldenBacklight = new THREE.PointLight(0xffd54f, 0.8, 20);
      goldenBacklight.position.set(0, 4, -4);
      this.scene.add(goldenBacklight);

      // Handle resize
      window.addEventListener('resize', () => {
        if (!this.canvas) return;
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        if (w && h && this.camera && this.renderer) {
          this.camera.aspect = w / h;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(w, h);
        }
      });
    }

    buildCharacter() {
      this.bheemGroup = new THREE.Group();
      this.bheemGroup.position.set(0, 0, -14); // starts in distance
      this.scene.add(this.bheemGroup);

      // Materials
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xf3ad88,
        roughness: 0.45,
        metalness: 0.05
      });
      const blushMat = new THREE.MeshStandardMaterial({
        color: 0xff6b81,
        roughness: 0.6,
        transparent: true,
        opacity: 0.55
      });
      const diaperMat = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        roughness: 0.55
      });
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xffc107,
        metalness: 0.85,
        roughness: 0.25
      });
      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x2b170c,
        roughness: 0.85
      });
      const eyeWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2
      });
      const pupilMat = new THREE.MeshStandardMaterial({
        color: 0x120805,
        roughness: 0.1
      });
      const tilakMat = new THREE.MeshStandardMaterial({
        color: 0xc6102a,
        roughness: 0.4
      });
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x550816 });
      const tongueMat = new THREE.MeshStandardMaterial({ color: 0xff5277, roughness: 0.3 });
      const toothMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

      // 1. Torso (Chubby toddler belly)
      const torsoGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.1, 24);
      this.torso = new THREE.Mesh(torsoGeo, skinMat);
      this.torso.position.y = 1.05;
      this.bheemGroup.add(this.torso);

      // Belly sphere for baby chubbiness
      const bellyGeo = new THREE.SphereGeometry(0.68, 20, 20);
      const belly = new THREE.Mesh(bellyGeo, skinMat);
      belly.position.set(0, -0.05, 0.15);
      belly.scale.set(1.0, 0.9, 1.05);
      this.torso.add(belly);

      // 2. Orange Diaper / Loincloth
      const diaperGeo = new THREE.CylinderGeometry(0.67, 0.62, 0.6, 24);
      const diaper = new THREE.Mesh(diaperGeo, diaperMat);
      diaper.position.set(0, -0.32, 0.05);
      this.torso.add(diaper);

      // 3. Gold Amulet Necklace
      const necklaceGeo = new THREE.TorusGeometry(0.48, 0.035, 12, 32);
      const necklace = new THREE.Mesh(necklaceGeo, goldMat);
      necklace.rotation.x = Math.PI / 2.2;
      necklace.position.set(0, 0.52, 0.05);
      this.torso.add(necklace);

      const pendantGeo = new THREE.BoxGeometry(0.12, 0.15, 0.06);
      const pendant = new THREE.Mesh(pendantGeo, goldMat);
      pendant.position.set(0, -0.45, 0.12);
      necklace.add(pendant);

      // 4. Head Group
      this.headGroup = new THREE.Group();
      this.headGroup.position.set(0, 1.95, 0.05);
      this.bheemGroup.add(this.headGroup);

      // Head Sphere (Toddler proportions - large head, chubby cheeks)
      const headGeo = new THREE.SphereGeometry(0.85, 32, 32);
      const head = new THREE.Mesh(headGeo, skinMat);
      head.scale.set(1.08, 1.0, 1.05);
      this.headGroup.add(head);

      // Rosy Chubby Cheeks
      const cheekGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const leftCheek = new THREE.Mesh(cheekGeo, blushMat);
      leftCheek.position.set(-0.52, -0.15, 0.62);
      leftCheek.scale.set(1.1, 0.8, 0.5);
      this.headGroup.add(leftCheek);

      const rightCheek = new THREE.Mesh(cheekGeo, blushMat);
      rightCheek.position.set(0.52, -0.15, 0.62);
      rightCheek.scale.set(1.1, 0.8, 0.5);
      this.headGroup.add(rightCheek);

      // Red Tilak / Bindi on forehead
      const tilakGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const tilak = new THREE.Mesh(tilakGeo, tilakMat);
      tilak.position.set(0, 0.35, 0.85);
      tilak.scale.set(0.7, 1.2, 0.2);
      this.headGroup.add(tilak);

      // Button Nose
      const noseGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const nose = new THREE.Mesh(noseGeo, skinMat);
      nose.position.set(0, 0.02, 0.88);
      nose.scale.set(1.1, 0.8, 0.9);
      this.headGroup.add(nose);

      // Big Expressive Eyes
      const eyeGeo = new THREE.SphereGeometry(0.22, 20, 20);
      this.leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      this.leftEye.position.set(-0.34, 0.15, 0.76);
      this.leftEye.scale.set(0.9, 1.15, 0.6);
      this.headGroup.add(this.leftEye);

      this.rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      this.rightEye.position.set(0.34, 0.15, 0.76);
      this.rightEye.scale.set(0.9, 1.15, 0.6);
      this.headGroup.add(this.rightEye);

      // Pupils with cute specular spark
      const pupilGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
      leftPupil.position.set(0, 0, 0.15);
      this.leftEye.add(leftPupil);

      const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
      rightPupil.position.set(0, 0, 0.15);
      this.rightEye.add(rightPupil);

      const sparkGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const leftSpark = new THREE.Mesh(sparkGeo, eyeWhiteMat);
      leftSpark.position.set(0.04, 0.04, 0.12);
      leftPupil.add(leftSpark);

      const rightSpark = new THREE.Mesh(sparkGeo, eyeWhiteMat);
      rightSpark.position.set(0.04, 0.04, 0.12);
      rightPupil.add(rightSpark);

      // Eyelids for blinking
      const eyelidGeo = new THREE.SphereGeometry(0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      this.leftEyelid = new THREE.Mesh(eyelidGeo, skinMat);
      this.leftEyelid.rotation.x = -Math.PI / 2;
      this.leftEyelid.visible = false;
      this.leftEye.add(this.leftEyelid);

      this.rightEyelid = new THREE.Mesh(eyelidGeo, skinMat);
      this.rightEyelid.rotation.x = -Math.PI / 2;
      this.rightEyelid.visible = false;
      this.rightEye.add(this.rightEyelid);

      // 3D Animated Mouth (For lip-sync!)
      const mouthGeo = new THREE.SphereGeometry(0.2, 16, 16);
      this.mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
      this.mouthMesh.position.set(0, -0.28, 0.78);
      this.mouthMesh.scale.set(1.2, 0.5, 0.5);
      this.headGroup.add(this.mouthMesh);

      // Single cute baby tooth
      const toothGeo = new THREE.BoxGeometry(0.08, 0.08, 0.06);
      const tooth = new THREE.Mesh(toothGeo, toothMat);
      tooth.position.set(0, 0.09, 0.15);
      this.mouthMesh.add(tooth);

      // Tongue
      const tongueGeo = new THREE.SphereGeometry(0.1, 12, 12);
      this.tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
      this.tongueMesh.position.set(0, -0.06, 0.12);
      this.tongueMesh.scale.set(1.1, 0.6, 0.8);
      this.mouthMesh.add(this.tongueMesh);

      // Hair: Cute Little Bheem Topknot & locks
      const hairBunGeo = new THREE.SphereGeometry(0.38, 16, 16);
      const hairBun = new THREE.Mesh(hairBunGeo, hairMat);
      hairBun.position.set(0, 0.88, -0.1);
      hairBun.scale.set(1.1, 0.9, 1.1);
      this.headGroup.add(hairBun);

      const hairTopGeo = new THREE.ConeGeometry(0.24, 0.45, 12);
      const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
      hairTop.position.set(0, 1.15, -0.05);
      this.headGroup.add(hairTop);

      // 5. Arms
      const armGeo = new THREE.CylinderGeometry(0.18, 0.15, 0.7, 16);
      const handGeo = new THREE.SphereGeometry(0.18, 16, 16);

      // Left Arm
      this.leftArm = new THREE.Group();
      this.leftArm.position.set(-0.7, 1.4, 0);
      const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
      leftArmMesh.position.y = -0.35;
      this.leftArm.add(leftArmMesh);
      const leftHand = new THREE.Mesh(handGeo, skinMat);
      leftHand.position.y = -0.7;
      this.leftArm.add(leftHand);
      this.bheemGroup.add(this.leftArm);

      // Right Arm (Will wave & point!)
      this.rightArm = new THREE.Group();
      this.rightArm.position.set(0.7, 1.4, 0);
      const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
      rightArmMesh.position.y = -0.35;
      this.rightArm.add(rightArmMesh);
      const rightHand = new THREE.Mesh(handGeo, skinMat);
      rightHand.position.y = -0.7;
      this.rightArm.add(rightHand);
      this.bheemGroup.add(this.rightArm);

      // 6. Legs
      const legGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.7, 16);
      const footGeo = new THREE.BoxGeometry(0.24, 0.16, 0.4);

      // Left Leg
      this.leftLeg = new THREE.Group();
      this.leftLeg.position.set(-0.35, 0.55, 0);
      const leftLegMesh = new THREE.Mesh(legGeo, skinMat);
      leftLegMesh.position.y = -0.35;
      this.leftLeg.add(leftLegMesh);
      const leftFoot = new THREE.Mesh(footGeo, skinMat);
      leftFoot.position.set(0, -0.7, 0.08);
      this.leftLeg.add(leftFoot);
      this.bheemGroup.add(this.leftLeg);

      // Right Leg
      this.rightLeg = new THREE.Group();
      this.rightLeg.position.set(0.35, 0.55, 0);
      const rightLegMesh = new THREE.Mesh(legGeo, skinMat);
      rightLegMesh.position.y = -0.35;
      this.rightLeg.add(rightLegMesh);
      const rightFoot = new THREE.Mesh(footGeo, skinMat);
      rightFoot.position.set(0, -0.7, 0.08);
      this.rightLeg.add(rightFoot);
      this.bheemGroup.add(this.rightLeg);

      // 7. Dynamic Floor Contact Shadow
      const shadowGeo = new THREE.CircleGeometry(0.85, 32);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x881133,
        transparent: true,
        opacity: 0.28
      });
      this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      this.shadowMesh.rotation.x = -Math.PI / 2;
      this.shadowMesh.position.set(0, -0.22, 0);
      this.bheemGroup.add(this.shadowMesh);
    }

    buildConfetti() {
      this.confettiGroup = new THREE.Group();
      this.scene.add(this.confettiGroup);

      const colors = [0xff4081, 0xd81b60, 0xffd700, 0xff80ab, 0xffffff, 0x00e676];
      const count = 75;

      for (let i = 0; i < count; i++) {
        const geo = new THREE.PlaneGeometry(0.12, 0.12);
        const mat = new THREE.MeshBasicMaterial({
          color: colors[i % colors.length],
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 8,
          Math.random() * 8 + 2,
          (Math.random() - 0.5) * 8
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        mesh.userData = {
          speedY: Math.random() * 0.04 + 0.02,
          rotSpeedX: Math.random() * 0.06 - 0.03,
          rotSpeedY: Math.random() * 0.06 - 0.03
        };
        this.confettiGroup.add(mesh);
      }
    }

    bindEvents() {
      if (this.ctaBtn) {
        this.ctaBtn.addEventListener('click', () => this.exitIntro());
      }
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', () => this.exitIntro());
      }
      if (this.unmuteBtn) {
        this.unmuteBtn.addEventListener('click', () => {
          if (this.audio) {
            this.audio.muted = false;
            this.audio.play();
          }
          this.unmuteBtn.style.display = 'none';
        });
      }

      // Tap anywhere to unmute if autoplay sound was blocked
      document.addEventListener('click', () => {
        if (this.audio && this.audio.muted) {
          this.audio.muted = false;
          this.audio.play().catch(() => {});
          if (this.unmuteBtn) this.unmuteBtn.style.display = 'none';
        }
      }, { once: true });
    }

    // Automatic playback immediately on page load!
    startAudioAndSequence() {
      if (!this.audio) return;
      this.audio.currentTime = 0;
      
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy blocked sound: Show subtle unmute button and keep muted audio running
          this.audio.muted = true;
          this.audio.play().catch(() => {});
          if (this.unmuteBtn) {
            this.unmuteBtn.style.display = 'flex';
          }
        });
      }
    }

    // 60 FPS Render & Animation Loop
    animate() {
      if (this.isExiting) return;
      requestAnimationFrame(() => this.animate());

      const delta = this.clock.getDelta();
      this.currentTime += delta;
      const t = this.currentTime;

      // Update 3D Confetti Particles
      if (this.confettiGroup) {
        this.confettiGroup.children.forEach(c => {
          c.position.y -= c.userData.speedY;
          c.rotation.x += c.userData.rotSpeedX;
          c.rotation.y += c.userData.rotSpeedY;
          if (c.position.y < -1) {
            c.position.y = 8;
          }
        });
      }

      // Blinking Eyes Animation
      if (t - this.lastBlinkTime > 3.2) {
        this.isBlinking = true;
        if (this.leftEyelid && this.rightEyelid) {
          this.leftEyelid.visible = true;
          this.rightEyelid.visible = true;
        }
        if (t - this.lastBlinkTime > 3.35) {
          this.isBlinking = false;
          if (this.leftEyelid && this.rightEyelid) {
            this.leftEyelid.visible = false;
            this.rightEyelid.visible = false;
          }
          this.lastBlinkTime = t;
        }
      }

      // =======================================================
      // PHASE 1: (0.0s - 2.5s) Running & Approach from depth
      // =======================================================
      if (t < 2.5) {
        const progress = Math.min(t / 2.5, 1);
        // Ease-out approach
        const easeOut = 1 - Math.pow(1 - progress, 2.5);
        this.bheemGroup.position.z = -14 + easeOut * 14;
        this.bheemGroup.position.y = Math.abs(Math.sin(t * 12)) * 0.25;

        // Running leg swing
        const legAngle = Math.sin(t * 12) * 0.65;
        this.leftLeg.rotation.x = legAngle;
        this.rightLeg.rotation.x = -legAngle;

        // Pumping arms
        this.leftArm.rotation.x = -legAngle * 0.8;
        this.rightArm.rotation.x = legAngle * 0.8;

        // Head bounce & waddle
        this.headGroup.rotation.z = Math.sin(t * 6) * 0.08;
        this.headGroup.rotation.x = Math.sin(t * 12) * 0.05;

        // Shadow scale
        if (this.shadowMesh) {
          const shadowScale = 0.5 + easeOut * 0.5 - this.bheemGroup.position.y * 0.3;
          this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
        }
      }
      // =======================================================
      // PHASE 2: (2.5s - 4.8s) Stops, hands on knees, panting
      // =======================================================
      else if (t >= 2.5 && t < 4.8) {
        this.bheemGroup.position.z = 0;
        this.bheemGroup.position.y = 0;

        // Legs standing slightly bent
        this.leftLeg.rotation.x = 0;
        this.rightLeg.rotation.x = 0;

        // Torso leaning forward
        this.torso.rotation.x = 0.25;
        this.torso.position.y = 0.95;

        // Hands resting on knees/hips
        this.leftArm.rotation.x = -0.65;
        this.leftArm.rotation.z = -0.3;
        this.rightArm.rotation.x = -0.65;
        this.rightArm.rotation.z = 0.3;

        // Heavy breathing / panting cycle
        const breath = Math.sin((t - 2.5) * 8);
        this.torso.scale.set(1 + breath * 0.06, 1 - breath * 0.04, 1 + breath * 0.06);
        this.headGroup.position.y = 1.85 + breath * 0.04;
        this.headGroup.rotation.x = 0.15 + breath * 0.08;

        // Mouth open panting
        if (this.mouthMesh) {
          this.mouthMesh.scale.set(1.3, 0.9 + breath * 0.2, 0.8);
        }
        if (this.tongueMesh) {
          this.tongueMesh.position.z = 0.15 + breath * 0.05;
        }

        // Show speech bubble
        if (this.speechCard && !this.speechCard.classList.contains('show-bubble')) {
          this.speechCard.classList.add('show-bubble');
        }
      }
      // =======================================================
      // PHASE 3: (4.8s - 30.0s) Stands up, waves, speaks with lip-sync!
      // =======================================================
      else if (t >= 4.8 && t < 30.0) {
        // Stand upright
        this.torso.rotation.x = 0;
        this.torso.position.y = 1.05;
        this.torso.scale.set(1, 1, 1);
        this.leftLeg.rotation.x = 0;
        this.rightLeg.rotation.x = 0;

        // Left arm rests gently by side / hip
        this.leftArm.rotation.x = 0.1;
        this.leftArm.rotation.z = -0.25;

        // Right arm waves joyfully!
        this.rightArm.rotation.x = -2.2;
        this.rightArm.rotation.z = 0.4 + Math.sin(t * 7) * 0.35;

        // Head tilts cheerfully
        this.headGroup.position.y = 1.95;
        this.headGroup.rotation.x = Math.sin(t * 3) * 0.04;
        this.headGroup.rotation.y = Math.sin(t * 2) * 0.08;
        this.headGroup.rotation.z = Math.sin(t * 2.5) * 0.05;

        // 3D Lip-Sync: Animate mouth opening/closing with speech
        const speechMouthCycle = Math.abs(Math.sin(t * 14)) * 0.8 + Math.abs(Math.cos(t * 9)) * 0.4;
        if (this.mouthMesh) {
          this.mouthMesh.scale.set(1.2 + speechMouthCycle * 0.3, 0.5 + speechMouthCycle * 0.7, 0.6);
        }
      }
      // =======================================================
      // PHASE 4: (30.0s+) Final Pose: Points down to CTA with a wink!
      // =======================================================
      else {
        // Pointing arm
        this.rightArm.rotation.x = -1.2;
        this.rightArm.rotation.y = -0.3;
        this.rightArm.rotation.z = 0.2;

        this.leftArm.rotation.x = 0;
        this.leftArm.rotation.z = -0.3;

        // Toddler confident cute tilt
        this.headGroup.rotation.set(-0.05, -0.15, 0.12);

        // Wink left eye!
        if (this.leftEyelid) {
          this.leftEyelid.visible = true;
        }
        if (this.rightEyelid) {
          this.rightEyelid.visible = false;
        }

        // Happy wide smile
        if (this.mouthMesh) {
          this.mouthMesh.scale.set(1.5, 0.8, 0.6);
        }

        // Reveal CTA Button
        if (this.ctaBtn && !this.ctaBtn.classList.contains('show-cta')) {
          this.ctaBtn.classList.add('show-cta');
        }
      }

      // Synchronize Kannada Subtitles
      this.updateSubtitles(t);

      // Render
      this.renderer.render(this.scene, this.camera);
    }

    updateSubtitles(time) {
      if (!this.kannadaTextEl) return;
      const activeSeg = KANNADA_SEGMENTS.find(s => time >= s.start && time < s.end);
      if (activeSeg) {
        if (this.kannadaTextEl.innerHTML.indexOf(activeSeg.text) === -1) {
          this.kannadaTextEl.innerHTML = `<span class="karaoke-glow">${activeSeg.text}</span>`;
        }
        if (this.audioWave) this.audioWave.classList.add('speaking');
      } else if (time >= 30.0) {
        this.kannadaTextEl.innerHTML = `<span class="karaoke-glow">ಬೇಗ ಓಪನ್ ಮಾಡಿ ನೋಡು! 👉🎀✨</span>`;
        if (this.audioWave) this.audioWave.classList.remove('speaking');
      }
    }

    // Smooth exit transition to main website
    exitIntro() {
      if (this.isExiting) return;
      this.isExiting = true;

      // Stop intro audio
      if (this.audio) {
        this.audio.pause();
      }

      // Celebrate with confetti
      if (typeof window.confetti === 'function') {
        try {
          window.confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }

      // Start website's background romantic music
      if (typeof window.toggleMusic === 'function' && !window.isMusicPlaying) {
        try {
          window.toggleMusic();
        } catch (e) {}
      }

      // Smooth fade-out and unmount
      if (this.overlay) {
        this.overlay.classList.add('intro-exiting');
        setTimeout(() => {
          this.overlay.classList.add('intro-hidden');
        }, 820);
      }
    }
  }

  // Self-start immediately when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.bheem3DExperience = new Bheem3DExperience();
    });
  } else {
    window.bheem3DExperience = new Bheem3DExperience();
  }
})();
