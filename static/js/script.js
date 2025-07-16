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
        
        // Handle audio events
        if (this.audio) {
            this.audio.addEventListener('play', () => {
                this.isPlaying = true;
                this.updateButton();
            });
            
            this.audio.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updateButton();
            });
            
            this.audio.addEventListener('error', (e) => {
                console.log('Audio failed to load, using fallback');
                this.loadFallbackMusic();
            });
        }
    }
    
    loadFallbackMusic() {
        // If the original source fails, try a different approach
        if (this.audio) {
            // Use a web-based piano music API or service
            this.audio.src = 'https://www.soundjay.com/misc/sounds/piano-moment.mp3';
            // Alternative: use a different service or disable music gracefully
        }
    }
    
    toggle() {
        if (!this.audio) return;
        
        try {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                const playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Auto-play prevented:', error);
                        // Show a user-friendly message
                        this.showMusicMessage();
                    });
                }
            }
        } catch (error) {
            console.log('Music playback error:', error);
            this.showMusicMessage();
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
    
    showMusicMessage() {
        // Create a temporary message for music issues
        const message = document.createElement('div');
        message.className = 'flash-message';
        message.textContent = 'Music playback requires user permission. Click the music button to enable.';
        
        const flashContainer = document.querySelector('.flash-messages') || document.body;
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
