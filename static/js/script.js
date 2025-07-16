// Music functionality
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('background-music');
        this.musicBtn = document.getElementById('music-btn');
        this.isPlaying = false;
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        // Set initial volume
        if (this.audio) {
            this.audio.volume = 0.3;
            this.audio.loop = true;
        }
        
        // Initialize Web Audio API as primary music system
        this.loadFallbackMusic();
        
        // Bind events
        if (this.musicBtn) {
            this.musicBtn.addEventListener('click', () => this.toggle());
        }
        
        // Auto-play attempt (will be blocked by most browsers until user interaction)
        document.addEventListener('click', () => {
            if (!this.initialized) {
                this.initialized = true;
                // Don't auto-start, let user control
            }
        }, { once: true });
        
        // Handle audio events if using regular audio element
        if (this.audio) {
            this.audio.addEventListener('play', () => {
                if (!this.isUsingWebAudio) {
                    this.isPlaying = true;
                    this.updateButton();
                }
            });
            
            this.audio.addEventListener('pause', () => {
                if (!this.isUsingWebAudio) {
                    this.isPlaying = false;
                    this.updateButton();
                }
            });
        }
    }
    
    loadFallbackMusic() {
        // If audio files fail, create soft ambient tones using Web Audio API
        try {
            this.createAmbientMusic();
        } catch (error) {
            console.log('Web Audio API not available, music disabled');
            this.showMusicMessage('Music is not available in this browser');
        }
    }
    
    createAmbientMusic() {
        // Create a gentle ambient soundscape using Web Audio API
        if (!window.AudioContext && !window.webkitAudioContext) {
            return;
        }
        
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isUsingWebAudio = true;
        
        // Create a simple ambient drone with gentle frequencies
        this.createAmbientDrone();
    }
    
    createAmbientDrone() {
        if (!this.audioContext) return;
        
        // Create multiple oscillators for a rich ambient sound
        const frequencies = [220, 330, 440, 660]; // Gentle piano-like frequencies
        this.oscillators = [];
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            
            // Very low volume for ambient effect
            gainNode.gain.setValueAtTime(0.02 + (index * 0.005), this.audioContext.currentTime);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            this.oscillators.push({ oscillator, gainNode });
        });
    }
    
    playWebAudio() {
        if (!this.oscillators || !this.audioContext) return;
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.oscillators.forEach(({ oscillator }) => {
            try {
                oscillator.start();
            } catch (e) {
                // Oscillator may already be started
            }
        });
        
        this.isPlaying = true;
        this.updateButton();
    }
    
    stopWebAudio() {
        if (!this.oscillators) return;
        
        this.oscillators.forEach(({ oscillator }) => {
            try {
                oscillator.stop();
            } catch (e) {
                // Oscillator may already be stopped
            }
        });
        
        // Recreate oscillators for next play
        this.createAmbientDrone();
        
        this.isPlaying = false;
        this.updateButton();
    }
    
    toggle() {
        try {
            if (this.isUsingWebAudio) {
                if (this.isPlaying) {
                    this.stopWebAudio();
                } else {
                    this.playWebAudio();
                }
                return;
            }
            
            if (!this.audio) {
                this.loadFallbackMusic();
                return;
            }
            
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                const playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Audio file playback failed, switching to Web Audio:', error);
                        this.loadFallbackMusic();
                        if (this.isUsingWebAudio) {
                            this.playWebAudio();
                        }
                    });
                }
            }
        } catch (error) {
            console.log('Music playback error:', error);
            this.loadFallbackMusic();
        }
    }
    
    updateButton() {
        if (!this.musicBtn) return;
        
        const icon = this.musicBtn.querySelector('i');
        if (this.isPlaying) {
            this.musicBtn.classList.add('playing');
            if (icon) icon.className = 'fas fa-pause';
            this.musicBtn.title = 'Pause Music';
        } else {
            this.musicBtn.classList.remove('playing');
            if (icon) icon.className = 'fas fa-music';
            this.musicBtn.title = 'Play Music';
        }
    }
    
    showMusicMessage(customMessage = null) {
        // Create a temporary message for music issues
        const message = document.createElement('div');
        message.className = 'flash-message';
        message.textContent = customMessage || 'Music playback requires user permission. Click the music button to enable.';
        
        let flashContainer = document.querySelector('.flash-messages');
        if (!flashContainer) {
            flashContainer = document.createElement('div');
            flashContainer.className = 'flash-messages';
            document.body.appendChild(flashContainer);
        }
        flashContainer.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// Page transitions and animations
class PageAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.addFadeInAnimations();
        this.addScrollAnimations();
        this.enhanceChapterCards();
        this.handleFormSubmissions();
    }
    
    addFadeInAnimations() {
        // Add fade-in effect to main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';
            mainContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }, 100);
        }
    }
    
    addScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.quote-card, .chapter-card, .comment');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Add CSS for animated state
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    enhanceChapterCards() {
        const chapterCards = document.querySelectorAll('.chapter-card');
        chapterCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    handleFormSubmissions() {
        const commentForm = document.querySelector('.comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                const submitBtn = commentForm.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sharing...</span>';
                    submitBtn.disabled = true;
                }
            });
        }
    }
}

// Reading progress tracker
class ReadingProgress {
    constructor() {
        this.init();
    }
    
    init() {
        this.addProgressBar();
        this.trackScrollProgress();
    }
    
    addProgressBar() {
        // Create reading progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #ff6b8a, #c44569);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    trackScrollProgress() {
        const progressBar = document.getElementById('reading-progress');
        if (!progressBar) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        });
    }
}

// Typing effect for quotes
class TypingEffect {
    constructor() {
        this.init();
    }
    
    init() {
        const quotes = document.querySelectorAll('.chapter-quote p');
        quotes.forEach(quote => {
            if (quote.textContent.length > 0) {
                this.typeText(quote);
            }
        });
    }
    
    typeText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30);
    }
}

// Theme customization
class ThemeCustomizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.addSeasonalEffects();
        this.addRandomFloatingElements();
    }
    
    addSeasonalEffects() {
        // Add subtle seasonal touches based on current date
        const now = new Date();
        const month = now.getMonth();
        
        if (month >= 10 || month <= 1) { // Winter
            this.addSnowflakes();
        } else if (month >= 2 && month <= 4) { // Spring
            this.addPetals();
        }
    }
    
    addSnowflakes() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => this.createSnowflake(), i * 100);
        }
    }
    
    addPetals() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => this.createPetal(), i * 200);
        }
    }
    
    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '❄';
        snowflake.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * 100}vw;
            color: rgba(255, 255, 255, 0.1);
            font-size: ${Math.random() * 10 + 10}px;
            pointer-events: none;
            z-index: -1;
            animation: fall ${Math.random() * 5 + 5}s linear infinite;
        `;
        
        document.body.appendChild(snowflake);
        
        setTimeout(() => {
            snowflake.remove();
        }, 10000);
    }
    
    createPetal() {
        const petal = document.createElement('div');
        petal.innerHTML = '🌸';
        petal.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * 100}vw;
            color: rgba(255, 107, 138, 0.1);
            font-size: ${Math.random() * 8 + 8}px;
            pointer-events: none;
            z-index: -1;
            animation: fall ${Math.random() * 6 + 6}s linear infinite;
        `;
        
        document.body.appendChild(petal);
        
        setTimeout(() => {
            petal.remove();
        }, 12000);
    }
    
    addRandomFloatingElements() {
        // Add CSS animation for falling elements
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Local storage for user preferences
class UserPreferences {
    constructor() {
        this.init();
    }
    
    init() {
        this.loadMusicPreference();
        this.saveMusicPreference();
    }
    
    loadMusicPreference() {
        const musicEnabled = localStorage.getItem('musicEnabled');
        if (musicEnabled === 'true') {
            // Auto-enable music if user previously enabled it
            setTimeout(() => {
                const musicBtn = document.getElementById('music-btn');
                if (musicBtn) {
                    musicBtn.click();
                }
            }, 1000);
        }
    }
    
    saveMusicPreference() {
        const musicBtn = document.getElementById('music-btn');
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                setTimeout(() => {
                    const audio = document.getElementById('background-music');
                    if (audio) {
                        localStorage.setItem('musicEnabled', audio.paused ? 'false' : 'true');
                    }
                }, 100);
            });
        }
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
    new PageAnimations();
    new ReadingProgress();
    new TypingEffect();
    new ThemeCustomizer();
    new UserPreferences();
    
    // Remove loading state
    document.body.classList.add('loaded');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    const audio = document.getElementById('background-music');
    if (audio && !audio.paused) {
        if (document.hidden) {
            audio.pause();
        } else {
            audio.play().catch(e => console.log('Resume play failed:', e));
        }
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('chapter-card')) {
        const link = e.target.querySelector('a');
        if (link) {
            link.click();
        }
    }
});
