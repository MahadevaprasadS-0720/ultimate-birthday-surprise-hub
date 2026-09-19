
// Initialize variables
let currentStep = 1;
const totalSteps = 7;
let userName = "My Love";
let isMusicPlaying = false;
let ytPlayer = null;
let ytReady = false;


// Initialize particles.js — Lightweight Enchanted Sparkles (optimized for smooth 60fps on all devices)
const isMobileDevice = (window.innerWidth < 768) || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const particleCount = isMobileDevice ? 24 : 42;

if (typeof particlesJS === 'function') {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": particleCount,
                "density": { "enable": true, "value_area": 900 }
            },
            "color": {
                "value": ["#ffffff", "#ffd6e0", "#ffb6c1", "#ffe4ec", "#f8bbd0", "#b76e79"]
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.65,
                "random": true,
                "anim": { "enable": false }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": { "enable": false }
            },
            "line_linked": {
                "enable": false
            },
            "move": {
                "enable": true,
                "speed": 0.55,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": { "enable": false }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": !isMobileDevice, "mode": "bubble" },
                "onclick": { "enable": true, "mode": "repulse" },
                "resize": true
            },
            "modes": {
                "bubble": {
                    "distance": 100,
                    "size": 5,
                    "duration": 1.5,
                    "opacity": 0.8,
                    "speed": 2
                },
                "repulse": {
                    "distance": 120,
                    "duration": 0.3
                }
            }
        },
        "retina_detect": false
    });
}

// Initialize GSAP animations
document.addEventListener('DOMContentLoaded', function () {
    showStep(currentStep);
    createPetals();
    initDynamicGreeting();     // Feature 1: personalized time greeting
    initSlider();              // Feature 3: photo slider autoplay

    // Animate the heart message
    const heartMessage = document.getElementById('heartMessage');
    const interactiveHeart = document.getElementById('interactiveHeart');
    if (interactiveHeart && heartMessage) {
        interactiveHeart.addEventListener('click', function () {
            setTimeout(() => {
                heartMessage.classList.add('show');
            }, 500);
        });
    }

    // Set countdown (example: next 24 hours)
    setCountdown();
});

// Function to show current step
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(el => {
        el.classList.remove('active');
    });

    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    // Update progress bar
    const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100;
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        gsap.to(progressBar, {
            width: `${progressPercentage}%`,
            duration: 1,
            ease: "power2.out"
        });
    }

    // Special animations for each step
    switch (step) {
        case 1:
            // Animate envelope if it exists
            const envelope = document.getElementById("envelope");
            if (envelope) {
                gsap.from(envelope, {
                    y: 100,
                    opacity: 0,
                    duration: 1,
                    ease: "back.out(1.7)"
                });
            }
            break;
        case 2:
            // Animate input if it exists
            const nameInputEl = document.querySelector(".name-input");
            if (nameInputEl) {
                gsap.from(nameInputEl, {
                    scale: 0.5,
                    opacity: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)"
                });
            }
            break;
        case 3:
            // Animate heart if it exists
            const interactiveHeart = document.getElementById("interactiveHeart");
            if (interactiveHeart) {
                gsap.from(interactiveHeart, {
                    scale: 0.5,
                    rotation: 180,
                    duration: 1,
                    ease: "elastic.out(1, 0.5)"
                });
            }
            const heartName = document.getElementById('heartName');
            if (heartName) {
                heartName.textContent = userName;
            }
            break;
        case 4:
            // Type out message
            typeMessage();
            // Animate photo frame if it exists
            const photoFrame = document.querySelector(".photo-frame");
            if (photoFrame) {
                gsap.from(photoFrame, {
                    y: 50,
                    rotation: -10,
                    opacity: 0,
                    duration: 1,
                    ease: "back.out(1.7)"
                });
            }
            break;
        case 5:
            // Start the photo slider autoplay
            goToSlide(0);
            startSliderAuto();
            // Animate slider wrapper entrance
            const sliderWrap = document.querySelector('.slider-wrap');
            if (sliderWrap) {
                gsap.from(sliderWrap, {
                    y: 50,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'back.out(1.7)'
                });
            }
            break;
        case 6:
            // Animate "10 Reasons Why" cards staggered
            animateReasonCards();
            break;
        case 7:
            // Create fireworks on the final step
            createFireworks();
            // Update final name safely — only set text, keep gradient-title span intact
            const finalNameEl = document.getElementById('finalName');
            if (finalNameEl) finalNameEl.textContent = userName;

            // Reset interactive cake state
            candlesBlown = false;
            const cakeSec = document.getElementById('cakeSection');
            const wishContent = document.getElementById('wishRevealContent');
            if (cakeSec) {
                cakeSec.style.display = 'flex';
                cakeSec.style.opacity = '1';
                cakeSec.style.transform = 'none';
            }
            if (wishContent) {
                wishContent.style.display = 'none';
                wishContent.style.opacity = '0';
            }
            for (let i = 1; i <= 3; i++) {
                const flame = document.getElementById(`flame-${i}`);
                const smoke = document.getElementById(`smoke-${i}`);
                if (flame) flame.classList.remove('blown');
                if (smoke) smoke.classList.remove('puff');
            }

            // Reset love counter game state
            loveCounterIndex = 0;
            loveCounterStarted = false;
            const loveText = document.getElementById('loveReasonText');
            const loveNum = document.getElementById('loveReasonNumber');
            const loveFill = document.getElementById('loveProgressFill');
            const loveBtn = document.getElementById('loveHeartBtn');
            const loveBtnTxt = document.getElementById('loveBtnText');
            const loveProg = document.getElementById('loveCounterProgress');
            const loveComp = document.getElementById('loveCompleteMsg');
            if (loveText) loveText.textContent = 'Press the heart to discover why I love you...';
            if (loveNum) loveNum.innerHTML = '<span class="color-emoji">💖</span>';
            if (loveFill) loveFill.style.width = '0%';
            if (loveProg) loveProg.style.display = 'none';
            if (loveComp) loveComp.style.display = 'none';
            if (loveBtn) { loveBtn.style.display = ''; loveBtn.style.opacity = '1'; }
            if (loveBtnTxt) loveBtnTxt.innerHTML = 'Reveal a Reason <span class="color-emoji">✨</span>';
            document.querySelectorAll('.love-dot').forEach(d => d.classList.remove('done', 'current'));
            break;
    }
}

// Function to go to next step
function nextStep() {
    if (currentStep < totalSteps) {
        // Stop slider if leaving step 5
        if (currentStep === 5) stopSliderAuto();

        currentStep++;
        showStep(currentStep);

        // Open envelope if on step 1
        if (currentStep === 2) {
            const envelope = document.getElementById('envelope');
            if (envelope) {
                envelope.classList.add('open');
            }
        }
    }
}

// Function to save name
function saveName() {
    const nameInputEl = document.getElementById('nameInput');
    if (!nameInputEl) return;
    const nameInput = nameInputEl.value.trim();
    if (nameInput) {
        userName = nameInput;
        const displayName = document.getElementById('displayName');
        if (displayName) displayName.textContent = userName;
        const finalName = document.getElementById('finalName');
        if (finalName) finalName.textContent = userName;
        const heartName = document.getElementById('heartName');
        if (heartName) heartName.textContent = userName;
        nextStep();

        // Animate success
        const nameInputSelector = document.querySelector(".name-input");
        if (nameInputSelector) {
            gsap.to(nameInputSelector, {
                backgroundColor: "#e8f5e9",
                borderColor: "#81c784",
                duration: 0.5,
                yoyo: true,
                repeat: 1
            });
        }
    } else {
        // Animate error
        const nameInputSelector = document.querySelector(".name-input");
        if (nameInputSelector) {
            gsap.to(nameInputSelector, {
                backgroundColor: "#ffebee",
                borderColor: "#e53935",
                duration: 0.5,
                yoyo: true,
                repeat: 1
            });
        }
        alert("Please enter your beautiful name to continue");
    }
}

// Function to create floating hearts
function createHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    const colors = ['#ff4081', '#f06292', '#f8bbd0', '#d81b60', '#ff80ab'];

    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.animationDuration = `${3 + Math.random() * 3}s`;
        heart.style.fontSize = `${20 + Math.random() * 25}px`;
        heart.style.top = `${60 + Math.random() * 30}%`;

        container.appendChild(heart);

        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 4000);
    }

    // Animate heart click
    const interactiveHeart = document.getElementById("interactiveHeart");
    if (interactiveHeart) {
        gsap.to(interactiveHeart, {
            scale: 1.3,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }
}

// Function to create falling petals (optimized for smooth 60fps)
function createPetals() {
    const container = document.getElementById('petalsContainer');
    if (!container) return;
    const petalColors = ['#ffcdd2', '#f8bbd0', '#fce4ec', '#f48fb1'];
    const count = (window.innerWidth < 768) ? 5 : 8;

    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const petalType = i % 3;
        let petalShape = petalType === 0
            ? "M50,0 C60,15 60,30 50,45 C40,30 40,15 50,0"
            : (petalType === 1
                ? "M50,0 C70,20 70,40 50,50 C30,40 30,20 50,0"
                : "M50,0 C55,10 55,25 50,35 C45,25 45,10 50,0");

        const size = 12 + (i % 3) * 5;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${(i * (100 / count)) + Math.random() * 8}%`;
        petal.style.top = `-25px`;
        petal.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);
        petal.style.willChange = 'transform';

        petal.innerHTML = `
            <svg viewBox="0 0 100 50" width="100%" height="100%">
                <path d="${petalShape}" fill="${petalColors[i % petalColors.length]}" />
            </svg>
        `;

        container.appendChild(petal);

        const duration = 10 + Math.random() * 8;
        const delay = (i * 1.2) % 6;
        const sway = 30 + Math.random() * 40;

        gsap.to(petal, {
            y: window.innerHeight + 50,
            x: `+=${(i % 2 === 0 ? 1 : -1) * sway}`,
            rotation: 360,
            duration: duration,
            delay: delay,
            ease: "none",
            repeat: -1,
            repeatRefresh: true,
            force3D: true
        });
    }
}

// Function to type out message
function typeMessage() {
    const messages = [
        `Dear ${userName},`,
        "On your special day, I want you to know...",
        "You are the most amazing person I've ever met.",
        "Your smile brightens my darkest days.",
        "Your laugh is my favorite sound in the world.",
        "Your love gives me strength and happiness.",
        "I'm so grateful to have you in my life.",
        "May this year bring you all the joy you deserve.",
        "You deserve the world and more.",
        "Happy Birthday, my love! ❤"
    ];

    const typingText = document.getElementById('typingText');
    if (!typingText) return;
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentMessage = messages[messageIndex];

        if (isDeleting) {
            typingText.innerHTML = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.innerHTML = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentMessage.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of message
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % messages.length;
            typingSpeed = 500; // Pause before next message
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing after a short delay
    setTimeout(() => {
        const typedMessage = document.getElementById('typedMessage');
        if (typedMessage) {
            typedMessage.classList.add('show');
        }
        type();
    }, 500);
}

// Function to create fireworks (hardware-accelerated, zero DOM overhead)
function createFireworks() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#ff4081', '#f06292', '#f8bbd0', '#d81b60', '#ffeb3b', '#ffffff']
        });
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 75,
                origin: { x: 0.15, y: 0.65 },
                colors: ['#ff80ab', '#ff4081', '#ffffff']
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 75,
                origin: { x: 0.85, y: 0.65 },
                colors: ['#ff80ab', '#ff4081', '#ffffff']
            });
        }, 400);
    }
}

// Function to set countdown
function setCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        // Countdown elements do not exist in HTML, exit safely
        return;
    }

    // Set target date (next 24 hours from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        const countdownEl = document.getElementById('countdown');
        if (diff <= 0) {
            if (countdownEl) {
                countdownEl.innerHTML = "<span>Happy Birthday!</span>";
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}



// Function to share on social media
function shareOnSocial(platform) {
    let url = '';
    const text = `Check out this beautiful birthday wish for ${userName}! ${window.location.href}`;

    switch (platform) {
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
            break;
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            break;
    }

    window.open(url, '_blank', 'width=600,height=400');

    // Animate share button
    gsap.to(`.social-icon:nth-child(${['facebook', 'twitter', 'whatsapp'].indexOf(platform) + 1})`, {
        scale: 1.3,
        duration: 0.3,
        yoyo: true,
        repeat: 1
    });
}

// =====================================================
// CONFETTI CANNON — fires on "Open Your Gift" click
// =====================================================
function openGiftWithConfetti() {
    // Rose gold, magenta, soft white palette
    const colors = [
        '#b76e79', // rose gold
        '#e91e8c', // magenta
        '#ff4081', // hot pink
        '#f8bbd0', // blush
        '#ffffff', // white
        '#d4a0a7', // dusty rose
        '#ffd6e0', // soft pink
        '#c2185b', // deep rose
    ];

    // First burst — center cannon
    confetti({
        particleCount: 120,
        spread: 80,
        startVelocity: 55,
        origin: { x: 0.5, y: 0.65 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.1,
        gravity: 0.9,
        drift: 0.1,
        ticks: 300,
    });

    // Second burst — left cannon
    setTimeout(() => {
        confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            startVelocity: 50,
            origin: { x: 0.0, y: 0.7 },
            colors: colors,
            shapes: ['circle', 'square'],
            scalar: 0.9,
            ticks: 250,
        });
    }, 150);

    // Third burst — right cannon
    setTimeout(() => {
        confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            startVelocity: 50,
            origin: { x: 1.0, y: 0.7 },
            colors: colors,
            shapes: ['circle', 'square'],
            scalar: 0.9,
            ticks: 250,
        });
    }, 300);

    // Final shower — top cascade
    setTimeout(() => {
        confetti({
            particleCount: 60,
            spread: 120,
            startVelocity: 25,
            origin: { x: 0.5, y: 0.0 },
            colors: colors,
            shapes: ['circle'],
            scalar: 0.7,
            gravity: 0.6,
            ticks: 400,
        });
    }, 500);

    // Animate the gift button with a pop
    const btn = document.getElementById('openGiftBtn');
    if (btn) {
        gsap.to(btn, {
            scale: 1.15,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
            onComplete: () => {
                // Proceed to next step after confetti fires
                setTimeout(() => nextStep(), 700);
            }
        });
    } else {
        setTimeout(() => nextStep(), 900);
    }
}

// =====================================================
// YOUTUBE IFRAME API — Khairiyat (Chhichhore)
// =====================================================
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-player', {
        height: '1', width: '1',
        videoId: 'hoNb6HuNmU0',
        playerVars: {
            autoplay: 0, controls: 0, disablekb: 1,
            fs: 0, iv_load_policy: 3, loop: 1,
            modestbranding: 1, playlist: 'hoNb6HuNmU0',
            rel: 0, showinfo: 0,
        },
        events: { onReady: () => { ytReady = true; } }
    });
}

// =====================================================
// MUSIC TOGGLE — play/pause Khairiyat
// =====================================================
function toggleMusic() {
    const btn = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    const bars = document.getElementById('musicBars');
    const audio = document.getElementById('bgMusic');

    // 1. If YouTube is ready, use YouTube player
    if (ytReady && ytPlayer) {
        if (isMusicPlaying) {
            ytPlayer.pauseVideo();
            isMusicPlaying = false;
            if (icon) icon.textContent = '🎵';
            if (bars) bars.classList.remove('playing');
            if (btn) btn.classList.remove('playing');
            if (btn) gsap.to(btn, { scale: 0.92, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        } else {
            // Stop local audio if it's playing
            if (audio) audio.pause();
            
            ytPlayer.setVolume(0);
            ytPlayer.playVideo();
            isMusicPlaying = true;
            if (icon) icon.textContent = '🎶';
            if (bars) bars.classList.add('playing');
            if (btn) btn.classList.add('playing');

            let vol = 0;
            const fadeIn = setInterval(() => {
                vol = Math.min(vol + 5, 60);
                ytPlayer.setVolume(vol);
                if (vol >= 60) clearInterval(fadeIn);
            }, 80);

            if (btn) gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        }
    } 
    // 2. Otherwise fallback to local MP3 player
    else if (audio) {
        if (isMusicPlaying) {
            audio.pause();
            isMusicPlaying = false;
            if (icon) icon.textContent = '🎵';
            if (bars) bars.classList.remove('playing');
            if (btn) btn.classList.remove('playing');
            if (btn) gsap.to(btn, { scale: 0.92, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        } else {
            audio.volume = 0;
            audio.play().then(() => {
                isMusicPlaying = true;
                if (icon) icon.textContent = '🎶';
                if (bars) bars.classList.add('playing');
                if (btn) btn.classList.add('playing');

                let vol = 0;
                const fadeIn = setInterval(() => {
                    vol = Math.min(vol + 0.05, 0.65);
                    audio.volume = vol;
                    if (vol >= 0.65) clearInterval(fadeIn);
                }, 80);

                if (btn) gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
            }).catch((err) => {
                console.warn('Local audio play blocked or failed:', err);
            });
        }
    }
}

        // =====================================================
        // FEATURE 1: DYNAMIC PERSONALIZED GREETING
        // =====================================================
        function initDynamicGreeting() {
            const now = new Date();
            const hour = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const h12 = ((hour % 12) || 12);
            const timeStr = `${h12}:${minutes} ${ampm}`;

            // Time-based greeting
            let timeLabel;
            if (hour < 5) timeLabel = '🌙 Late Night';
            else if (hour < 12) timeLabel = '🌅 Good Morning';
            else if (hour < 17) timeLabel = '☀️ Good Afternoon';
            else if (hour < 20) timeLabel = '🌇 Good Evening';
            else timeLabel = '🌙 Good Night';

            // Time-specific personalized badge messages
            const msgs = {
                morning: 'The magic begins at ' + timeStr + ' for the most special girl ✨',
                afternoon: 'This beautiful afternoon at ' + timeStr + ' is all yours, princess 🌸',
                evening: 'The stars are out early at ' + timeStr + ' — just for you 💫',
                night: 'Even at ' + timeStr + ', my heart beats only for you 💖',
            };

            let msg;
            if (hour < 12) msg = msgs.morning;
            else if (hour < 17) msg = msgs.afternoon;
            else if (hour < 20) msg = msgs.evening;
            else msg = msgs.night;

            // Populate elements
            const greetingTimeEl = document.getElementById('greetingTime');
            const greetingMsgEl = document.getElementById('greetingMsg');

            if (greetingTimeEl) {
                greetingTimeEl.textContent = `${timeLabel}  ·  ${timeStr}`;
            }
            if (greetingMsgEl) {
                greetingMsgEl.textContent = msg;
            }

            // Tick the time display every second
            setInterval(() => {
                const n = new Date();
                const h = n.getHours();
                const m = n.getMinutes().toString().padStart(2, '0');
                const s = n.getSeconds().toString().padStart(2, '0');
                const ap = h >= 12 ? 'PM' : 'AM';
                const h12 = ((h % 12) || 12);
                if (greetingTimeEl) {
                    greetingTimeEl.textContent = `${timeLabel}  ·  ${h12}:${m}:${s} ${ap}`;
                }
            }, 1000);
        }

        // =====================================================
        // FEATURE 2: GIFT BOX REVEAL
        // =====================================================
        let giftBoxOpened = false;

        function openGiftBox() {
            if (giftBoxOpened) return;
            giftBoxOpened = true;

            const lid = document.querySelector('.gift-lid');
            const hint = document.getElementById('giftTapHint');
            const wrap = document.getElementById('giftBoxWrap');
            const reveal = document.getElementById('giftRevealContent');
            const giftBox = document.getElementById('giftBox');

            // 1. Stop the wiggle animation, do a big bounce pop
            if (giftBox) {
                giftBox.style.animation = 'none';
                gsap.to(giftBox, {
                    scale: 1.12,
                    duration: 0.18,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out',
                });
            }

            // 2. Fly lid off
            setTimeout(() => {
                if (lid) lid.classList.add('open');

                // Sparkle confetti burst from box
                confetti({
                    particleCount: 60,
                    spread: 70,
                    startVelocity: 35,
                    origin: { x: 0.5, y: 0.55 },
                    colors: ['#b76e79', '#e91e8c', '#ff4081', '#f8bbd0', '#ffffff', '#ffd6e0'],
                    scalar: 0.85,
                    ticks: 200,
                });
            }, 200);

            // 3. Fade out hint text
            if (hint) {
                setTimeout(() => { hint.style.opacity = '0'; hint.style.pointerEvents = 'none'; }, 300);
            }

            // 4. Slide the box up & reveal form
            setTimeout(() => {
                if (wrap) {
                    gsap.to(wrap, {
                        y: -20,
                        opacity: 0,
                        duration: 0.55,
                        ease: 'power2.in',
                        onComplete: () => {
                            wrap.style.display = 'none';
                            // Show name form with smooth transition
                            if (reveal) {
                                reveal.style.display = 'flex';
                                // Force reflow, then add visible class for CSS transition
                                requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                        reveal.classList.add('visible');
                                        // Focus input
                                        const inp = document.getElementById('nameInput');
                                        if (inp) inp.focus();
                                    });
                                });
                            }
                        }
                    });
                }
            }, 900);
        }

        // =====================================================
        // FEATURE 3: PHOTO SLIDER
        // =====================================================
        let currentSlide = 0;
        let totalSlides = 0;
        let sliderInterval = null;
        const SLIDE_DURATION = 4000; // ms between auto-advance

        function initSlider() {
            const slides = document.querySelectorAll('.slide');
            totalSlides = slides.length;
            if (totalSlides === 0) return;

            // Reset to first slide
            goToSlide(0);

            // Start auto-play (only when on step 5)
            // We'll call startSliderAuto() from showStep(5)
        }

        function startSliderAuto() {
            stopSliderAuto();
            sliderInterval = setInterval(() => {
                goToSlide((currentSlide + 1) % totalSlides);
            }, SLIDE_DURATION);
        }

        function stopSliderAuto() {
            if (sliderInterval) {
                clearInterval(sliderInterval);
                sliderInterval = null;
            }
        }

        function goToSlide(index) {
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');
            if (slides.length === 0) return;

            // Clamp
            index = ((index % slides.length) + slides.length) % slides.length;

            // Remove active from current
            if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

            // Set new active
            currentSlide = index;
            if (slides[currentSlide]) slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        function sliderNext() {
            stopSliderAuto();
            goToSlide(currentSlide + 1);
            startSliderAuto();
        }

        function sliderPrev() {
            stopSliderAuto();
            goToSlide(currentSlide - 1);
            startSliderAuto();
        }

        // =====================================================
        // FEATURE 4a: ANIMATE "10 REASONS WHY" CARDS
        // =====================================================
        function animateReasonCards() {
            const cards = document.querySelectorAll('.reason-card');
            if (cards.length === 0) return;

            // Reset first
            cards.forEach(card => {
                gsap.set(card, { opacity: 0, y: 40, scale: 0.92 });
            });

            // Stagger each card in
            cards.forEach((card, i) => {
                const delay = parseInt(card.dataset.delay || 0) / 1000;
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.55,
                    delay: delay + 0.2,
                    ease: 'back.out(1.6)',
                });
            });

            // Small confetti burst when all cards are revealed
            setTimeout(() => {
                confetti({
                    particleCount: 40,
                    spread: 65,
                    startVelocity: 28,
                    origin: { x: 0.5, y: 0.4 },
                    colors: ['#d81b60', '#f06292', '#f8bbd0', '#ffffff', '#ff4081'],
                    scalar: 0.8,
                    ticks: 160,
                });
            }, 1400);
        }

        // =====================================================
        // FEATURE 4b: ADVENTURE PANEL (FUTURE DATE PLANNER)
        // =====================================================
        let selectedDateIdea = '';

        function openAdventurePanel() {
            const overlay = document.getElementById('adventureOverlay');
            const panel = document.getElementById('adventurePanel');
            const success = document.getElementById('adventureSuccess');
            const form = document.querySelector('.adventure-form');

            // Reset state
            if (success) {
                success.style.display = 'none';
                success.style.opacity = '1';
                success.style.transform = 'none';
            }
            if (form) {
                form.style.display = 'flex';
                form.style.opacity = '1';
                form.style.transform = 'none';
            }
            document.querySelectorAll('.date-idea-card').forEach(c => c.classList.remove('selected'));
            selectedDateIdea = '';

            // Set min date to today
            const dateInput = document.getElementById('adventureDateInput');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.setAttribute('min', today);
            }

            if (overlay) {
                overlay.style.display = 'block';
                requestAnimationFrame(() => overlay.classList.add('visible'));
            }
            if (panel) {
                panel.style.display = 'flex';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => panel.classList.add('open'));
                });
            }

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        function closeAdventurePanel() {
            const overlay = document.getElementById('adventureOverlay');
            const panel = document.getElementById('adventurePanel');

            if (overlay) overlay.classList.remove('visible');
            if (panel) panel.classList.remove('open');

            setTimeout(() => {
                if (overlay) overlay.style.display = 'none';
                if (panel) panel.style.display = 'none';
                document.body.style.overflow = '';
            }, 400);
        }

        function selectIdea(el) {
            // Toggle selection
            document.querySelectorAll('.date-idea-card').forEach(c => c.classList.remove('selected'));
            el.classList.add('selected');
            selectedDateIdea = el.querySelector('.date-idea-label').textContent;

            // Tiny bounce
            gsap.from(el, { scale: 0.88, duration: 0.3, ease: 'back.out(2.5)' });
        }

        function sendAdventure() {
            const dateInput = document.getElementById('adventureDateInput');
            const msgInput = document.getElementById('adventureMessage');
            const successEl = document.getElementById('adventureSuccess');
            const msgText = document.getElementById('adventureSuccessMsg');
            const form = document.querySelector('.adventure-form');

            // Validation: Require date idea selection
            if (!selectedDateIdea) {
                const ideasContainer = document.querySelector('.date-ideas');
                if (ideasContainer) {
                    gsap.to(ideasContainer, { x: 8, duration: 0.1, yoyo: true, repeat: 5 });
                }
                alert("Please choose a date activity! 🌸");
                return;
            }

            // Validation: Require a date picker value
            if (!dateInput || !dateInput.value) {
                if (dateInput) {
                    gsap.to(dateInput, { x: 8, duration: 0.1, yoyo: true, repeat: 5 });
                }
                alert("Please pick a date for our adventure! 📅");
                return;
            }

            // Build a pretty date string
            let dateStr = 'soon';
            if (dateInput && dateInput.value) {
                const parts = dateInput.value.split('-');
                if (parts.length === 3) {
                    const d = new Date(parts[0], parts[1] - 1, parts[2]);
                    if (!isNaN(d.getTime())) {
                        dateStr = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    }
                } else {
                    const d = new Date(dateInput.value);
                    if (!isNaN(d.getTime())) {
                        dateStr = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    }
                }
            }

            const ideaLabel = selectedDateIdea ? `a ${selectedDateIdea}` : 'something magical';

            // Build success message
            if (msgText) {
                msgText.textContent = `${ideaLabel.charAt(0).toUpperCase() + ideaLabel.slice(1)} on ${dateStr} — a promise from my heart to yours! 💫`;
            }

            // Celebrate with hearts confetti
            confetti({
                particleCount: 80,
                spread: 100,
                startVelocity: 40,
                origin: { x: 0.5, y: 0.6 },
                colors: ['#d81b60', '#f06292', '#f8bbd0', '#ff4081', '#ffffff', '#c2185b'],
                shapes: ['circle'],
                scalar: 1,
                ticks: 250,
            });

            // Fade out form, slide in success
            if (form) {
                gsap.to(form, {
                    opacity: 0, y: -20, duration: 0.4, ease: 'power2.in',
                    onComplete: () => {
                        form.style.display = 'none';
                        if (successEl) {
                            successEl.style.display = 'flex';
                            gsap.from(successEl, { opacity: 0, scale: 0.85, duration: 0.55, ease: 'back.out(1.7)' });
                        }
                    }
                });
            }
        }

        // Close adventure panel on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const panel = document.getElementById('adventurePanel');
                if (panel && panel.classList.contains('open')) {
                    closeAdventurePanel();
                }
                const letterModal = document.getElementById('letterModal');
                if (letterModal && letterModal.classList.contains('open')) {
                    closeLetter();
                }
            }
        });

        // =====================================================
        // FEATURE 6: "OPEN WHEN" DIGITAL LETTERS SYSTEM
        // =====================================================
        const openWhenLetters = {
            smile: `<h3>Hey there, beautiful...</h3>
            <p>If you're reading this, it means you need a little spark today. Well, close your eyes and remember this: <strong>your smile is my absolute favorite thing in the universe.</strong> It has this magical way of lighting up an entire room and making all my worries disappear.</p>
            <p>Here are a few quick things to make you smile:</p>
            <ul>
                <li>I think you are incredibly cute when you laugh.</li>
                <li>There is a 100% chance I am thinking of you right at this exact moment.</li>
                <li>Remember that time we couldn't stop laughing over nothing? I still treasure that.</li>
            </ul>
            <p>So take a deep breath, look in the mirror, and show the world that gorgeous smile of yours. You've got this! 😊</p>`,

            miss: `<h3>To the one who holds my heart...</h3>
           <p>Whenever you're reading this and feeling the distance between us, please know that <strong>distance is just a number.</strong> No matter how many miles separate us, you are in every single heartbeat of mine, in every thought, and in every dream.</p>
           <p>Close your eyes for a second. Take a deep breath. Can you feel that? That's me sending you the warmest, tightest hug. I'm always looking at the same sky as you, and counting down the hours until I can hold you in my arms again. You are my home, and I am always right there with you. 💖</p>`,

            motivation: `<h3>My champion...</h3>
                 <p>I know things might feel overwhelming, tiring, or difficult right now. But I need you to pause and listen to me: <strong>you are one of the strongest, most brilliant, and most capable people I have ever met.</strong></p>
                 <p>Look at how much you've already overcome. Look at how hard you work. You have this amazing spark inside you that can conquer anything. Don't let a temporary storm make you forget how bright your sun shines. I believe in you, so, so much. Go out there and show them what you're made of. I'm cheering for you, always! 💪⭐</p>`,

            comfort: `<h3>I'm here for you...</h3>
              <p>I'm sorry today is a bad day. I wish I could be there to make it all disappear, to make you tea, and to just sit quietly beside you until the rain stops. But since I can't be there physically, let this letter be a gentle sanctuary.</p>
              <p>It's okay to feel tired. It's okay to feel down. You don't have to be strong all the time. Let yourself rest. Take a warm shower, wrap yourself in a cozy blanket, and let go of today's weights. Tomorrow is a brand new page. I'm sending you all the love and comfort in my soul. You are safe, you are loved, and everything is going to be okay. 🌧️💖</p>`
        };

        let letterTimers = [];

        function openLetter(type) {
            const overlay = document.getElementById('letterOverlay');
            const modal = document.getElementById('letterModal');
            const textEl = document.getElementById('letterText');
            const dateEl = document.getElementById('letterDate');
            const flap = document.getElementById('envelopeFlap');
            const wrapper = document.getElementById('envelopeWrapper');

            if (!overlay || !modal || !textEl || !flap || !wrapper) return;

            // Clear any previous animations running
            letterTimers.forEach(t => clearTimeout(t));
            letterTimers = [];

            // Populate letter date and text
            if (dateEl) {
                const today = new Date();
                dateEl.textContent = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }
            textEl.innerHTML = openWhenLetters[type] || 'A small surprise letter awaits you...';

            // Show modal and overlay
            overlay.style.display = 'block';
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Force repaint
            modal.offsetHeight;

            // Trigger overlay fade-in and modal scale-up
            overlay.classList.add('visible');
            modal.classList.add('open');

            // 1. Open the envelope flap (starts after modal stabilizes)
            letterTimers.push(setTimeout(() => {
                flap.classList.add('open');
            }, 350));

            // 2. Slide the letter sheet out of the envelope
            letterTimers.push(setTimeout(() => {
                wrapper.classList.add('open');
            }, 850));
        }

        function closeLetter() {
            const overlay = document.getElementById('letterOverlay');
            const modal = document.getElementById('letterModal');
            const flap = document.getElementById('envelopeFlap');
            const wrapper = document.getElementById('envelopeWrapper');

            if (!overlay || !modal || !flap || !wrapper) return;

            // Clear active open animations if any
            letterTimers.forEach(t => clearTimeout(t));
            letterTimers = [];

            // 1. Slide letter sheet back into envelope
            wrapper.classList.remove('open');

            // 2. Close envelope flap
            letterTimers.push(setTimeout(() => {
                flap.classList.remove('open');
            }, 300));

            // 3. Fade modal and overlay out
            letterTimers.push(setTimeout(() => {
                modal.classList.remove('open');
                overlay.classList.remove('visible');
            }, 600));

            // 4. Hide display elements completely
            letterTimers.push(setTimeout(() => {
                overlay.style.display = 'none';
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 1000));
        }

        // =====================================================
        // FEATURE 7: "CANDLE-BLOWING" INTERACTIVE CAKE
        // =====================================================
        let candlesBlown = false;
        let audioContext = null;
        let audioStream = null;
        let analyserNode = null;
        let micMonitoring = false;

        function blowOutCandles() {
            if (candlesBlown) return;
            candlesBlown = true;

            // 1. Turn off flame visuals and start smoke puffs
            for (let i = 1; i <= 3; i++) {
                const flame = document.getElementById(`flame-${i}`);
                const smoke = document.getElementById(`smoke-${i}`);
                if (flame) flame.classList.add('blown');
                if (smoke) smoke.classList.add('puff');
            }

            // 2. Stop microphone listening
            stopMicListening();

            // 3. Fire a massive celebratory confetti shower!
            setTimeout(() => {
                const colors = ['#ff80ab', '#ff4081', '#d81b60', '#ffeb3b', '#e0f2f1'];
                confetti({
                    particleCount: 140,
                    spread: 90,
                    origin: { y: 0.75 },
                    colors: colors
                });
            }, 200);

            // 4. Staggered GSAP reveal of wishes content
            const cakeSec = document.getElementById('cakeSection');
            const wishContent = document.getElementById('wishRevealContent');

            if (cakeSec && wishContent) {
                gsap.to(cakeSec, {
                    opacity: 0,
                    y: -20,
                    duration: 0.6,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        cakeSec.style.display = 'none';

                        // Show wish content container
                        wishContent.style.display = 'flex';
                        wishContent.style.flexDirection = 'column';
                        wishContent.style.alignItems = 'center';

                        // Fade in children elements in a beautiful staggered sequence
                        gsap.fromTo(wishContent,
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
                        );

                        const children = wishContent.children;
                        gsap.fromTo(children,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }
                        );
                    }
                });
            }
        }

        async function initMicBlow() {
            if (candlesBlown || micMonitoring) return;

            const micBtn = document.getElementById('micToggleBtn');
            if (!micBtn) return;

            try {
                // Query user microphone media permissions
                audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

                // Setup AudioContext Analyser
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaStreamSource(audioStream);
                analyserNode = audioContext.createAnalyser();
                analyserNode.fftSize = 256;
                source.connect(analyserNode);

                micMonitoring = true;
                micBtn.textContent = '🎙️ Listening... Blow now!';
                micBtn.classList.add('listening');

                const bufferLength = analyserNode.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                // Continuous volume polling loop
                function checkBlowVolume() {
                    if (!micMonitoring || candlesBlown) return;

                    analyserNode.getByteFrequencyData(dataArray);

                    // Calculate average audio level in frequency spectrum
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / bufferLength;

                    // Blow threshold value (higher average indicates blowing/screaming input)
                    if (average > 62) {
                        blowOutCandles();
                        return;
                    }

                    requestAnimationFrame(checkBlowVolume);
                }

                checkBlowVolume();
            } catch (err) {
                console.error('Microphone access denied or unsupported:', err);
                micBtn.textContent = '❌ Mic Blocked - Tap Cake Instead';
                micBtn.style.background = 'linear-gradient(135deg, #e53935, #d32f2f)';

                // Shake animation for error feedback
                gsap.to(micBtn, { x: 10, duration: 0.1, yoyo: true, repeat: 5 });
            }
        }

        function stopMicListening() {
            micMonitoring = false;
            const micBtn = document.getElementById('micToggleBtn');
            if (micBtn) {
                micBtn.classList.remove('listening');
                micBtn.textContent = '🎂 Candles Extinguished!';
                micBtn.disabled = true;
            }
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
            if (audioContext) {
                audioContext.close();
            }
        }

        // =====================================================
        // FEATURE 4: "WHY I LOVE YOU" COUNTER
        // =====================================================

        const whyILoveYouReasons = [
            "Because your laugh is the most beautiful sound I've ever heard — it makes the whole world brighter.",
            "Because you are kind without even trying. It's just who you are, and it's absolutely magical.",
            "Because the way your eyes light up when you talk about something you love is my favorite thing in the universe.",
            "Because you make me want to be a better person just by being in the same room as you.",
            "Because you are stronger than you know — you carry so much, yet you still manage to shine.",
            "Because even in the smallest moments, you find a way to make everything feel special.",
            "Because your smile — that one, the real one — can turn any bad day into the best day.",
            "Because you are the kind of person people are lucky to know, and I am the luckiest of all.",
            "Because the way you care about others says everything about the beautiful soul you carry.",
            "Because you make ordinary days feel like adventures just by being part of them.",
            "Because you are endlessly patient, warm, and full of a love that is genuinely rare in this world.",
            "Because your presence alone is enough to calm every storm inside me.",
            "Because every single version of you — silly, serious, tired, happy — is someone I deeply adore.",
            "Because you have no idea how incredible you truly are, and that makes you even more incredible.",
            "Because you exist. That alone is reason enough for my whole world to feel complete."
        ];

        let loveCounterIndex = 0;
        let loveCounterStarted = false;

        function initLoveCounter() {
            const dotsContainer = document.getElementById('loveDots');
            if (!dotsContainer) return;

            // Build the 15 dots
            dotsContainer.innerHTML = '';
            whyILoveYouReasons.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.className = 'love-dot';
                dot.id = `love-dot-${i}`;
                dotsContainer.appendChild(dot);
            });
        }

        function revealNextReason() {
            if (loveCounterIndex >= whyILoveYouReasons.length) return;

            const card = document.getElementById('loveReasonCard');
            const textEl = document.getElementById('loveReasonText');
            const numberEl = document.getElementById('loveReasonNumber');
            const sparkles = document.getElementById('loveSparkles');
            const btn = document.getElementById('loveHeartBtn');
            const btnText = document.getElementById('loveBtnText');
            const progress = document.getElementById('loveCounterProgress');
            const currentNum = document.getElementById('loveCurrentNum');
            const fillBar = document.getElementById('loveProgressFill');
            const completeEl = document.getElementById('loveCompleteMsg');

            if (!textEl || !btn) return;

            // First click — show progress bar
            if (!loveCounterStarted) {
                loveCounterStarted = true;
                initLoveCounter();
                if (progress) progress.style.display = 'block';
                gsap.from(progress, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' });
            }

            // Heartbeat animation on button
            btn.classList.remove('beating');
            void btn.offsetWidth; // reflow to restart
            btn.classList.add('beating');
            setTimeout(() => btn.classList.remove('beating'), 450);

            // Sparkle burst
            sparkles.classList.remove('burst');
            void sparkles.offsetWidth;
            sparkles.classList.add('burst');
            setTimeout(() => sparkles.classList.remove('burst'), 700);

            // Animate card glow
            card.classList.add('animating');
            setTimeout(() => card.classList.remove('animating'), 600);

            const reason = whyILoveYouReasons[loveCounterIndex];
            const reasonNum = loveCounterIndex + 1;

            // --- Text swap with fade ---
            textEl.classList.add('fade-out');

            setTimeout(() => {
                // Update content
                textEl.textContent = reason;
                numberEl.innerHTML = `<span class="color-emoji">💖</span> Reason #${reasonNum}`;

                // Update counter number
                if (currentNum) currentNum.textContent = reasonNum;

                // Update progress fill bar
                const pct = (reasonNum / whyILoveYouReasons.length) * 100;
                if (fillBar) fillBar.style.width = pct + '%';

                // Update dots
                for (let i = 0; i < whyILoveYouReasons.length; i++) {
                    const dot = document.getElementById(`love-dot-${i}`);
                    if (!dot) continue;
                    dot.classList.remove('done', 'current');
                    if (i < loveCounterIndex) dot.classList.add('done');
                    else if (i === loveCounterIndex) dot.classList.add('current');
                }

                // Fade text back in
                textEl.classList.remove('fade-out');
                textEl.classList.add('fade-in');
                setTimeout(() => textEl.classList.remove('fade-in'), 300);

                loveCounterIndex++;

                // Milestone confetti every 5th reason
                if (reasonNum % 5 === 0 && reasonNum < whyILoveYouReasons.length) {
                    confetti({
                        particleCount: 55,
                        spread: 75,
                        origin: { y: 0.65 },
                        colors: ['#ff4081', '#f48fb1', '#ffeb3b', '#d81b60', '#fff']
                    });
                }

                // Update button text
                if (reasonNum < whyILoveYouReasons.length) {
                    btnText.innerHTML = `Next Reason <span class="color-emoji">💕</span>`;
                }

                // Last reason — celebrate!
                if (loveCounterIndex >= whyILoveYouReasons.length) {
                    // Mark last dot as done
                    const lastDot = document.getElementById(`love-dot-${loveCounterIndex - 1}`);
                    if (lastDot) { lastDot.classList.remove('current'); lastDot.classList.add('done'); }

                    // Hide button after a moment, show completion
                    setTimeout(() => {
                        gsap.to(btn, {
                            opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in',
                            onComplete: () => {
                                btn.style.display = 'none';
                                if (completeEl) {
                                    completeEl.style.display = 'block';
                                    gsap.from(completeEl, { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(2)' });
                                }
                            }
                        });

                        // Grand confetti finale
                        confetti({ particleCount: 150, spread: 120, origin: { y: 0.6 }, colors: ['#ff4081', '#d81b60', '#f48fb1', '#ffeb3b', '#fff'] });
                        setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { x: 0.1, y: 0.7 }, colors: ['#ff80ab', '#ffeb3b', '#ff4081'] }), 300);
                        setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { x: 0.9, y: 0.7 }, colors: ['#d81b60', '#f48fb1', '#fff'] }), 600);
                    }, 600);
                }

            }, 260);
        }

        function restartLoveCounter() {
            loveCounterIndex = 0;
            loveCounterStarted = false;

            const textEl = document.getElementById('loveReasonText');
            const numberEl = document.getElementById('loveReasonNumber');
            const btn = document.getElementById('loveHeartBtn');
            const btnText = document.getElementById('loveBtnText');
            const currentNum = document.getElementById('loveCurrentNum');
            const fillBar = document.getElementById('loveProgressFill');
            const completeEl = document.getElementById('loveCompleteMsg');
            const progress = document.getElementById('loveCounterProgress');

            if (textEl) textEl.textContent = 'Press the heart to discover why I love you...';
            if (numberEl) numberEl.innerHTML = '<span class="color-emoji">💖</span>';
            if (currentNum) currentNum.textContent = '0';
            if (fillBar) fillBar.style.width = '0%';
            if (completeEl) completeEl.style.display = 'none';
            if (progress) progress.style.display = 'none';

            // Clear all dots
            const dots = document.querySelectorAll('.love-dot');
            dots.forEach(d => d.classList.remove('done', 'current'));

            if (btn) {
                btn.style.display = '';
                btn.style.opacity = '1';
                btn.style.transform = '';
                gsap.from(btn, { opacity: 0, scale: 0.85, duration: 0.45, ease: 'back.out(2)' });
            }
            if (btnText) btnText.innerHTML = 'Reveal a Reason <span class="color-emoji">✨</span>';
        }
