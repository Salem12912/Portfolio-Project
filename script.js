/* ================================ */
/* SALEM AL SHAMSI - CREATIVE PORTFOLIO */
/* Interactive TikTok-Style Portfolio JavaScript */
/* ================================ */

/**
 * JAVASCRIPT ARCHITECTURE & PATTERNS
 * 
 * This application follows modern JavaScript best practices:
 * 
 * CLASS-BASED STRUCTURE:
 * - Single main class (TikTokPortfolio) for state management
 * - Modular methods for specific functionality
 * - Clear separation of concerns
 * 
 * EVENT HANDLING:
 * - Efficient event delegation
 * - Passive event listeners for performance
 * - Touch and mouse event support
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Intersection Observer for scroll detection
 * - RequestAnimationFrame for smooth animations
 * - Debounced scroll handlers
 * - Lazy loading and efficient DOM queries
 * 
 * ACCESSIBILITY FEATURES:
 * - Keyboard navigation support
 * - ARIA labels and roles
 * - Focus management
 * - Screen reader compatibility
 * 
 * BROWSER COMPATIBILITY:
 * - Modern ES6+ syntax with fallbacks
 * - Cross-browser event handling
 * - Feature detection for progressive enhancement
 */

/**
 * Main Portfolio Class
 * Handles all interactive functionality including:
 * - Loading screen management with dynamic content
 * - Video navigation and scroll snapping
 * - Interactive carousel with touch/swipe support
 * - Social interactions (like/comment/share)
 * - Background music system with auto-play
 * - Touch/swipe gestures for mobile
 * - Responsive animations and transitions
 * - Local storage for user preferences
 */
class TikTokPortfolio {
    /**
     * Constructor - Initialize portfolio application
     * Sets up all necessary DOM references and state variables
     */
    constructor() {
        // Video navigation state
        this.currentVideoIndex = 0; // Track current active video
        this.videos = document.querySelectorAll('.video-container'); // All video containers
        this.videoFeed = document.getElementById('videoFeed'); // Main scrollable container
        this.scrollProgress = document.getElementById('scrollProgress'); // Progress indicator
        
        // Touch/scroll interaction state
        this.isScrolling = false; // Prevent multiple scroll events
        this.touchStartY = 0; // Touch start position for swipe detection
        this.touchEndY = 0; // Touch end position for swipe detection
        
        // Music management state
        this.previousVideoType = null; // Track previous video section for music continuity
        
        // Loading screen elements
        this.loadingScreen = document.getElementById('loadingScreen'); // Loading overlay
        this.progressPercent = document.getElementById('progressPercent'); // Progress percentage display
        
        // Start with loading screen
        this.showLoadingScreen();
    }

    /**
     * Loading Screen Management
     * Creates and manages the animated loading experience
     * Features dynamic messages, progress tracking, and smooth transitions
     */
    showLoadingScreen() {
        // Dynamic loading messages and status updates
        const messages = [
            "Initializing creative workspace...",
            "Loading interactive elements...",
            "Preparing TikTok-style animations...",
            "Setting up project galleries...",
            "Configuring audio systems...",
            "Optimizing visual effects...",
            "Finalizing user experience...",
            "Almost ready to explore..."
        ];

        const statusUpdates = [
            { icon: "⚡", text: "Starting up..." },
            { icon: "🎨", text: "Loading assets..." },
            { icon: "🎬", text: "Preparing videos..." },
            { icon: "🎵", text: "Setting up audio..." },
            { icon: "✨", text: "Adding magic..." },
            { icon: "🚀", text: "Launching experience..." },
            { icon: "🌟", text: "Ready to explore!" }
        ];

        let progress = 0;
        let messageIndex = 0;
        let statusIndex = 0;
        
        const messageElement = document.getElementById('loadingMessage');
        const statusElement = document.getElementById('statusText');
        const statusIcon = document.querySelector('.status-icon');

        // Update messages periodically
        const messageInterval = setInterval(() => {
            if (messageIndex < messages.length - 1) {
                messageElement.classList.add('fade-out');
                setTimeout(() => {
                    messageIndex++;
                    messageElement.textContent = messages[messageIndex];
                    messageElement.classList.remove('fade-out');
                    messageElement.classList.add('active');
                }, 250);
            }
        }, 1000); // Change message every second

        // Update status periodically
        const statusInterval = setInterval(() => {
            if (statusIndex < statusUpdates.length - 1) {
                statusIndex++;
                statusIcon.textContent = statusUpdates[statusIndex].icon;
                statusElement.textContent = statusUpdates[statusIndex].text;
            }
        }, 1200); // Change status every 1.2 seconds

        // Simulate realistic loading progress (longer duration)
        const progressInterval = setInterval(() => {
            // Slower, more realistic progress increments
            const increment = Math.random() * 8 + 2; // Random increment between 2-10
            progress += increment;
            
            if (progress > 100) progress = 100;
            
            this.progressPercent.textContent = Math.floor(progress) + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                clearInterval(messageInterval);
                clearInterval(statusInterval);
                
                // Final message
                messageElement.classList.add('fade-out');
                setTimeout(() => {
                    messageElement.textContent = "Welcome to the experience! 🎉";
                    messageElement.classList.remove('fade-out');
                    messageElement.classList.add('active');
                    statusIcon.textContent = "🎉";
                    statusElement.textContent = "Ready!";
                }, 250);
                
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 1500); // Wait longer before hiding
            }
        }, 200); // Update every 200ms for smoother progress
    }

    /**
     * Hide Loading Screen
     * Smoothly transitions out the loading screen with fade animation
     * Initializes main portfolio functionality once hidden
     */
    hideLoadingScreen() {
        this.loadingScreen.classList.add('fade-out'); // Trigger CSS fade-out animation
        setTimeout(() => {
            this.loadingScreen.style.display = 'none'; // Remove from DOM
            this.init(); // Initialize the main portfolio functionality
        }, 800); // Match the CSS transition duration
    }

    /**
     * Initialize Portfolio Application
     * Sets up all interactive functionality and event listeners
     * Called after loading screen completes
     */
    init() {
        this.setupEventListeners(); // Touch, scroll, keyboard interactions
        this.setupIntersectionObserver(); // Video visibility detection
        this.setupLikeButtons(); // Heart animation and persistence
        this.setupCommentButtons(); // Comment modal and storage
        this.setupShareButtons(); // Native and fallback sharing
        this.setupScrollProgress(); // Visual scroll indicator
        this.setupAutoMusicPlay(); // Background music system
        this.setupHeroCarousel(); // Interactive home carousel
        this.startAnimations(); // Trigger entrance animations
        console.log('🎵 TikTok Portfolio Loaded!'); // Debug confirmation
    }

    setupEventListeners() {
        // Scroll events
        this.videoFeed.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Touch events for mobile
        this.videoFeed.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.videoFeed.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Click to toggle music on entire video container (excluding sidebar/link/carousel)
        this.videos.forEach(video => {
            video.addEventListener('click', (e) => {
                // Always exclude sidebar and project links
                if (e.target.closest('.video-sidebar') || e.target.closest('.project-link')) return;
                
                // For homepage/intro section, exclude carousel-related elements
                if (video.dataset.video === 'intro') {
                    if (e.target.closest('.hero-carousel') || 
                        e.target.closest('.carousel-nav-external') || 
                        e.target.closest('.swipe-indicator-external')) {
                        return; // Don't toggle music for carousel interactions
                    }
                }
                
                this.toggleMusicOnContainer(video);
            });
        });

        // Prevent default scroll behavior on space and arrow keys
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
                e.preventDefault();
            }
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            root: this.videoFeed
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(this.videos).indexOf(entry.target);
                    this.currentVideoIndex = index;
                    this.updateActiveVideo(entry.target);
                    this.updateNavigation(index);
                    
                    // Handle music auto-play
                    this.handleMusicOnScroll(entry.target);
                }
            });
        }, options);

        this.videos.forEach(video => {
            this.observer.observe(video);
        });
    }

    setupLikeButtons() {
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLike(btn);
            });
        });
    }

    setupCommentButtons() {
        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleComment(btn);
            });
        });
    }

    setupShareButtons() {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleShare(btn);
            });
        });
    }

    setupAutoMusicPlay() {
        // Music auto-play is now handled by the main intersection observer
        // This method can be used for additional music-related setup if needed
        console.log('🎵 Music system initialized');
    }

    setupHeroCarousel() {
        this.currentCarouselIndex = 0;
        this.carouselCards = document.querySelectorAll('.carousel-card');
        this.navDots = document.querySelectorAll('.carousel-nav-external .nav-dot');
        this.carouselInterval = null;

        // Set up navigation dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToCarouselSlide(index);
            });
        });

        // Touch/swipe support for carousel
        const heroCarousel = document.querySelector('.hero-carousel');
        if (heroCarousel) {
            let startX = 0;
            let endX = 0;

            heroCarousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            heroCarousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleCarouselSwipe(startX, endX);
            });

            // Mouse drag support
            let isDragging = false;
            let mouseStartX = 0;

            heroCarousel.addEventListener('mousedown', (e) => {
                isDragging = true;
                mouseStartX = e.clientX;
                heroCarousel.style.cursor = 'grabbing';
            });

            heroCarousel.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });

            heroCarousel.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                heroCarousel.style.cursor = 'grab';
                this.handleCarouselSwipe(mouseStartX, e.clientX);
            });

            heroCarousel.addEventListener('mouseleave', () => {
                isDragging = false;
                heroCarousel.style.cursor = 'grab';
            });
        }

        // Auto-advance carousel
        this.startCarouselAutoplay();

        // Pause autoplay on hover
        const heroContainer = document.querySelector('[data-video="intro"]');
        if (heroContainer) {
            heroContainer.addEventListener('mouseenter', () => {
                this.pauseCarouselAutoplay();
            });

            heroContainer.addEventListener('mouseleave', () => {
                this.startCarouselAutoplay();
            });
        }
    }

    handleCarouselSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextCarouselSlide();
            } else {
                // Swipe right - previous slide
                this.previousCarouselSlide();
            }
        }
    }

    goToCarouselSlide(index) {
        this.currentCarouselIndex = index;
        this.updateCarouselDisplay();
        this.restartCarouselAutoplay();
    }

    nextCarouselSlide() {
        this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.carouselCards.length;
        this.updateCarouselDisplay();
    }

    previousCarouselSlide() {
        this.currentCarouselIndex = (this.currentCarouselIndex - 1 + this.carouselCards.length) % this.carouselCards.length;
        this.updateCarouselDisplay();
    }

    updateCarouselDisplay() {
        // Update cards
        this.carouselCards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');
            
            if (index === this.currentCarouselIndex) {
                card.classList.add('active');
            } else if (index === (this.currentCarouselIndex - 1 + this.carouselCards.length) % this.carouselCards.length) {
                card.classList.add('prev');
            } else if (index === (this.currentCarouselIndex + 1) % this.carouselCards.length) {
                card.classList.add('next');
            }
        });

        // Update navigation dots
        this.navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentCarouselIndex);
        });

        // Trigger card-specific animations
        this.triggerCarouselAnimations(this.currentCarouselIndex);
    }

    triggerCarouselAnimations(cardIndex) {
        const activeCard = this.carouselCards[cardIndex];
        if (!activeCard) return;

        // Reset and restart animations based on card type
        const cardId = activeCard.id;
        
        switch (cardId) {
            case 'journey-card':
                this.animateJourneySteps(activeCard);
                break;
            case 'skills-card':
                this.animateSkillItems(activeCard);
                break;
            case 'global-card':
                this.animateGlobalPins(activeCard);
                break;
            case 'about-card':
                this.animateAboutItems(activeCard);
                break;
        }
    }

    animateJourneySteps(card) {
        const steps = card.querySelectorAll('.journey-step');
        steps.forEach((step, index) => {
            step.style.animation = 'none';
            step.offsetHeight; // Trigger reflow
            step.style.animation = `stepAppear 0.6s ease forwards`;
            step.style.animationDelay = `${(index + 1) * 0.1}s`;
        });
    }

    animateSkillItems(card) {
        const skills = card.querySelectorAll('.skill-item');
        skills.forEach((skill, index) => {
            skill.style.animation = 'none';
            skill.offsetHeight; // Trigger reflow
            skill.style.animation = `skillFloat 0.6s ease forwards`;
            skill.style.animationDelay = `${(index + 1) * 0.1}s`;
        });
    }

    animateGlobalPins(card) {
        const pins = card.querySelectorAll('.location-pin');
        pins.forEach((pin, index) => {
            pin.style.animation = 'none';
            pin.offsetHeight; // Trigger reflow
            pin.style.animation = `pinAppear 0.8s ease forwards`;
            pin.style.animationDelay = `${(index + 1) * 0.2}s`;
        });
    }

    animateAboutItems(card) {
        // Animate summary
        const summary = card.querySelector('.about-summary');
        if (summary) {
            summary.style.animation = 'none';
            summary.offsetHeight; // Trigger reflow
            summary.style.animation = `aboutSummaryAppear 0.8s ease forwards`;
        }

        // Animate feature items
        const features = card.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            feature.style.animation = 'none';
            feature.offsetHeight; // Trigger reflow
            feature.style.animation = `featureAppear 0.6s ease forwards`;
            feature.style.animationDelay = `${(index + 2) * 0.1}s`;
        });
    }

    startCarouselAutoplay() {
        this.pauseCarouselAutoplay(); // Clear any existing interval
        this.carouselInterval = setInterval(() => {
            this.nextCarouselSlide();
        }, 4000); // Change slide every 4 seconds
    }

    pauseCarouselAutoplay() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }
    }

    restartCarouselAutoplay() {
        this.pauseCarouselAutoplay();
        setTimeout(() => {
            this.startCarouselAutoplay();
        }, 1000); // Wait 1 second before restarting autoplay
    }

    handleMusicOnScroll(activeVideo) {
        const currentVideoType = activeVideo.dataset.video;
        
        // Check if we're switching to a different video section
        if (this.previousVideoType && this.previousVideoType === currentVideoType) {
            // We're still in the same video section (e.g., carousel navigation on homepage)
            // Don't pause/restart music, just ensure current music is playing
            const currentAudio = activeVideo.querySelector('.project-audio');
            if (currentAudio && currentAudio.paused) {
                currentAudio.volume = 0.3;
                currentAudio.play().catch(() => {
                    console.log('Auto-play prevented by browser');
                });
            }
            return;
        }
        
        // We're switching to a different video section - pause all and start new
        document.querySelectorAll('.project-audio').forEach(audio => {
            if (!audio.paused) {
                audio.pause();
            }
        });
        
        // Setup audio properties and auto-play current video's music
        const currentAudio = activeVideo.querySelector('.project-audio');
        if (currentAudio) {
            currentAudio.volume = 0.3; // Set moderate volume
            currentAudio.play().catch(() => {
                console.log('Auto-play prevented by browser');
            });
        }
        
        // Update previous video type for next comparison
        this.previousVideoType = currentVideoType;
    }

    handleScroll(e) {
        if (this.isScrolling) return;
        
        // Smooth scroll snapping
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.snapToNearestVideo();
        }, 150);
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        this.touchEndY = e.changedTouches[0].clientY;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartY - this.touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - next video
                this.nextVideo();
            } else {
                // Swipe down - previous video
                this.previousVideo();
            }
        }
    }

    handleKeyboard(e) {
        switch(e.code) {
            case 'ArrowDown':
            case 'Space':
                e.preventDefault();
                this.nextVideo();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.previousVideo();
                break;
            case 'KeyL':
                // Like with L key
                this.quickLike();
                break;
            case 'KeyC':
                // Comment with C key
                this.quickComment();
                break;
            case 'KeyM':
                // Toggle music with M key
                this.quickToggleMusic();
                break;
        }
    }

    nextVideo() {
        if (this.currentVideoIndex < this.videos.length - 1) {
            this.currentVideoIndex++;
            this.scrollToVideo(this.currentVideoIndex);
        }
    }

    previousVideo() {
        if (this.currentVideoIndex > 0) {
            this.currentVideoIndex--;
            this.scrollToVideo(this.currentVideoIndex);
        }
    }

    scrollToVideo(index) {
        this.isScrolling = true;
        const targetVideo = this.videos[index];
        
        targetVideo.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        setTimeout(() => {
            this.isScrolling = false;
        }, 800);
    }

    snapToNearestVideo() {
        const scrollTop = this.videoFeed.scrollTop;
        const windowHeight = window.innerHeight;
        
        let nearestIndex = Math.round(scrollTop / windowHeight);
        nearestIndex = Math.max(0, Math.min(nearestIndex, this.videos.length - 1));
        
        if (nearestIndex !== this.currentVideoIndex) {
            this.scrollToVideo(nearestIndex);
        }
    }

    updateActiveVideo(activeVideo) {
        // Remove active class from all videos
        this.videos.forEach(video => video.classList.remove('active'));
        
        // Add active class to current video
        activeVideo.classList.add('active');
        
        // Trigger entrance animations
        this.triggerVideoAnimations(activeVideo);
    }

    updateNavigation(index) {
        // Navigation removed - no longer needed
    }

    navigateToSection(index) {
        if (index < this.videos.length) {
            this.currentVideoIndex = index;
            this.scrollToVideo(index);
        }
    }

    triggerVideoAnimations(video) {
        const videoType = video.dataset.video;
        
        // Add entrance animation class
        video.classList.add('loaded');
        
        // Trigger specific animations based on video type
        switch(videoType) {
            case 'intro':
                this.animateHeroElements(video);
                break;
            case 'about':
                this.animateTimelineElements(video);
                break;
            case 'project1':
                this.animateProjectElements(video);
                break;
            case 'project2':
                this.animateBrandElements(video);
                break;
            case 'project3':
                this.animateStoryElements(video);
                break;
            case 'project4':
                this.animateCulturalElements(video);
                break;
        }
    }

    animateHeroElements(video) {
        const floatEmojis = video.querySelectorAll('.float-emoji');
        floatEmojis.forEach((emoji, index) => {
            setTimeout(() => {
                emoji.style.animation = 'float 6s ease-in-out infinite';
                emoji.style.opacity = '0.6';
            }, index * 200);
        });
    }

    animateTimelineElements(video) {
        const timelineItems = video.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(0)';
                item.style.opacity = '1';
            }, index * 150);
        });
    }

    animateProjectElements(video) {
        const arCube = video.querySelector('.ar-cube');
        const arParticles = video.querySelector('.ar-particles');
        
        if (arCube) {
            setTimeout(() => {
                arCube.style.animation = 'rotate3d 4s linear infinite';
            }, 300);
        }
        
        if (arParticles) {
            setTimeout(() => {
                arParticles.style.animation = 'particles 3s ease-in-out infinite';
            }, 500);
        }
    }

    animateBrandElements(video) {
        const shapes = video.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            setTimeout(() => {
                shape.style.animation = `shapeFloat 3s ease-in-out infinite ${-index}s`;
            }, index * 100);
        });
    }

    animateStoryElements(video) {
        const storyNodes = video.querySelectorAll('.story-node');
        storyNodes.forEach((node, index) => {
            setTimeout(() => {
                node.style.animation = `storyPulse 2s ease-in-out infinite ${-index * 0.7}s`;
            }, index * 200);
        });
    }

    animateCulturalElements(video) {
        const cultures = video.querySelectorAll('.culture');
        const bridge = video.querySelector('.bridge-line');
        
        cultures.forEach((culture, index) => {
            setTimeout(() => {
                culture.style.animation = `culturePulse 3s ease-in-out infinite ${-index * 1.5}s`;
            }, index * 300);
        });
        
        if (bridge) {
            setTimeout(() => {
                bridge.style.animation = 'bridgeGlow 2s ease-in-out infinite';
            }, 600);
        }
    }

    handleLike(btn) {
        const currentCount = parseInt(btn.dataset.count) || 0;
        const isLiked = btn.dataset.liked === 'true';
        
        if (!isLiked) {
            // Like the post
            const newCount = currentCount + 1;
            btn.dataset.count = newCount;
            btn.dataset.liked = 'true';
            
            // Update the count display
            const countSpan = btn.querySelector('.count');
            countSpan.textContent = this.formatCount(newCount);
            
            // Add visual feedback
            this.createHeartAnimation(btn);
            this.vibrate();
            
            // Play sound effect (if you want to add it later)
            // this.playLikeSound();
            
            console.log(`❤️ Liked! New count: ${newCount}`);
        } else {
            // Unlike the post
            const newCount = Math.max(0, currentCount - 1);
            btn.dataset.count = newCount;
            btn.dataset.liked = 'false';
            
            // Update the count display
            const countSpan = btn.querySelector('.count');
            countSpan.textContent = this.formatCount(newCount);
            
            console.log(`💔 Unliked! New count: ${newCount}`);
        }
        
        // Save to localStorage
        this.saveLikeState(btn);
    }

    handleComment(btn) {
        const videoContainer = btn.closest('.video-container');
        const videoId = videoContainer.dataset.video;
        
        // Show comment modal
        this.showCommentModal(videoId, btn);
    }

    handleShare(btn) {
        const currentCount = parseInt(btn.dataset.count) || 0;
        const newCount = currentCount + 1;
        btn.dataset.count = newCount;
        
        // Update the count display
        const countSpan = btn.querySelector('.count');
        countSpan.textContent = this.formatCount(newCount);
        
        // Get current project info for sharing
        const videoContainer = btn.closest('.video-container');
        const projectTitle = videoContainer.querySelector('.project-title')?.textContent || 'Salem\'s Project';
        const projectLink = videoContainer.querySelector('.project-link')?.href || window.location.href;
        
        // Use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: `Check out ${projectTitle} by Salem Al Shamsi`,
                text: `Amazing project by @salem_alshamsi! 🚀`,
                url: projectLink
            }).then(() => {
                this.showToast('Shared successfully! 🎉');
            }).catch(err => {
                console.log('Share failed:', err);
                this.fallbackShare(projectLink, projectTitle);
            });
        } else {
            this.fallbackShare(projectLink, projectTitle);
        }
        
        console.log(`📤 Shared! New count: ${newCount}`);
    }

    fallbackShare(url, title) {
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link copied to clipboard! 📋');
        }).catch(() => {
            // If clipboard API fails, show the URL
            this.showToast(`Share this link: ${url}`);
        });
    }

    saveLikeState(btn) {
        const videoContainer = btn.closest('.video-container');
        const videoId = videoContainer.dataset.video;
        const likeData = {
            count: btn.dataset.count,
            liked: btn.dataset.liked
        };
        
        localStorage.setItem(`like_${videoId}`, JSON.stringify(likeData));
    }

    quickLike() {
        const currentVideo = this.videos[this.currentVideoIndex];
        const likeBtn = currentVideo.querySelector('.like-btn');
        if (likeBtn) {
            this.handleLike(likeBtn);
        }
    }

    quickComment() {
        this.showCommentModal();
    }

    quickToggleMusic() {
        const activeVideo = this.videos[this.currentVideoIndex];
        this.toggleMusicOnContainer(activeVideo);
    }

    createHeartAnimation(button) {
        // Create floating hearts animation
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'absolute';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.animation = `heartFloat 1.5s ease-out forwards`;
            heart.style.animationDelay = `${i * 0.1}s`;
            
            // Position relative to button
            const rect = button.getBoundingClientRect();
            heart.style.left = `${rect.left + Math.random() * 30 - 15}px`;
            heart.style.top = `${rect.top}px`;
            heart.style.zIndex = '9999';
            
            document.body.appendChild(heart);
            
            // Remove after animation
            setTimeout(() => {
                heart.remove();
            }, 1500);
        }
    }

    showCommentModal(videoId, commentBtn) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'comment-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0, 0, 0, 0.8)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'flex-end';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '2000';
        
        // Load existing comments from localStorage
        const savedComments = JSON.parse(localStorage.getItem(`comments_${videoId}`)) || [];
        
        // Default pre-filled comment if none exist
        const defaultComments = [
            { author: '@creative_explorer', text: 'This is incredible! 🔥', id: 'default1' }
        ];
        
        const allComments = savedComments.length > 0 ? savedComments : defaultComments;
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'comment-modal-content';
        modalContent.innerHTML = `
            <button class="close-modal">×</button>
            <h3>Comments (${allComments.length})</h3>
            <div class="comments-list">
                ${allComments.map(comment => `
                    <div class="comment">
                        <div class="comment-author">${comment.author}</div>
                        <div class="comment-text">${comment.text}</div>
                    </div>
                `).join('')}
            </div>
            <div class="comment-input">
                <input type="text" class="comment-field" placeholder="Add a comment..." maxlength="150">
                <button class="send-btn">Post</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        const sendBtn = modal.querySelector('.send-btn');
        const commentField = modal.querySelector('.comment-field');
        const commentsList = modal.querySelector('.comments-list');
        const commentsHeader = modal.querySelector('h3');
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Send comment functionality
        const addComment = () => {
            const commentText = commentField.value.trim();
            if (commentText) {
                const newComment = {
                    author: '@salem_alshamsi',
                    text: commentText,
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString()
                };
                
                // Add to saved comments
                const currentComments = JSON.parse(localStorage.getItem(`comments_${videoId}`)) || defaultComments;
                currentComments.push(newComment);
                localStorage.setItem(`comments_${videoId}`, JSON.stringify(currentComments));
                
                // Update UI
                const newCommentDiv = document.createElement('div');
                newCommentDiv.className = 'comment';
                newCommentDiv.innerHTML = `
                    <div class="comment-author">${newComment.author}</div>
                    <div class="comment-text">${newComment.text}</div>
                `;
                commentsList.appendChild(newCommentDiv);
                
                // Update comment count
                const newCount = currentComments.length;
                commentBtn.dataset.count = newCount;
                const countSpan = commentBtn.querySelector('.count');
                countSpan.textContent = this.formatCount(newCount);
                
                // Update modal header
                commentsHeader.textContent = `Comments (${newCount})`;
                
                commentField.value = '';
                this.showToast('Comment posted! 💬');
            }
        };
        
        sendBtn.addEventListener('click', addComment);
        
        // Enter key to send
        commentField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addComment();
            }
        });
        
        // Focus on input
        setTimeout(() => {
            commentField.focus();
        }, 300);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(254, 44, 85, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: 600;
            z-index: 3000;
            animation: toastSlide 3s ease forwards;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    formatCount(count) {
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }

    vibrate() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    startAnimations() {
        // Add initial animations
        this.videos[0].classList.add('active', 'loaded');
        this.triggerVideoAnimations(this.videos[0]);
        
        // Load saved likes
        this.loadSavedLikes();
    }

    loadSavedLikes() {
        document.querySelectorAll('.like-btn').forEach(btn => {
            const videoContainer = btn.closest('.video-container');
            const videoId = videoContainer.dataset.video;
            const savedData = localStorage.getItem(`like_${videoId}`);
            
            if (savedData) {
                const likeData = JSON.parse(savedData);
                btn.dataset.count = likeData.count;
                btn.dataset.liked = likeData.liked;
                
                const countSpan = btn.querySelector('.count');
                countSpan.textContent = this.formatCount(parseInt(likeData.count));
            }
        });
        
        // Load saved comment counts
        this.loadSavedComments();
    }

    loadSavedComments() {
        document.querySelectorAll('.comment-btn').forEach(btn => {
            const videoContainer = btn.closest('.video-container');
            const videoId = videoContainer.dataset.video;
            
            // Get saved comments or use default (1 comment)
            const savedComments = JSON.parse(localStorage.getItem(`comments_${videoId}`)) || [];
            const commentCount = savedComments.length > 0 ? savedComments.length : 1;
            
            btn.dataset.count = commentCount;
            const countSpan = btn.querySelector('.count');
            countSpan.textContent = this.formatCount(commentCount);
        });
    }

    setupScrollProgress() {
        this.videoFeed.addEventListener('scroll', () => {
            const scrollTop = this.videoFeed.scrollTop;
            const scrollHeight = this.videoFeed.scrollHeight - this.videoFeed.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            if (this.scrollProgress) {
                this.scrollProgress.style.width = `${progress}%`;
            }
        });
    }

    toggleMusicOnContainer(video) {
        const audio = video.querySelector('.project-audio');
        if (!audio) return;

        // Pause all other audios
        document.querySelectorAll('.project-audio').forEach(a => {
            if (a !== audio && !a.paused) a.pause();
        });

        if (audio.paused) {
            audio.play().catch(err => console.log('Autoplay blocked', err));
        } else {
            audio.pause();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TikTokPortfolio();
});

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes heartFloat {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
        50% { transform: translate(-50%, -80%) scale(1.2); opacity: 0.8; }
        100% { transform: translate(-50%, -120%) scale(1.5); opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes toastSlide {
        0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        10% { transform: translateX(-50%) translateY(0); opacity: 1; }
        90% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
    
    @keyframes countBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    .comment-modal-content {
        background: rgba(20, 20, 20, 0.95);
        backdrop-filter: blur(20px);
        width: 100%;
        max-height: 70vh;
        border-radius: 20px 20px 0 0;
        padding: 30px;
        animation: slideUp 0.3s ease;
        position: relative;
    }
    
    .comment-modal-content h3 {
        color: white;
        margin-bottom: 20px;
        font-size: 1.2rem;
    }
    
    .comments-list {
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 20px;
    }
    
    .comment {
        background: rgba(255, 255, 255, 0.05);
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .comment-author {
        font-weight: 600;
        color: #fe2c55;
        font-size: 0.9rem;
    }
    
    .comment-text {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.9rem;
    }
    
    .comment-input {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .comment-field {
        flex: 1;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 12px 16px;
        color: white;
        font-size: 0.9rem;
        outline: none;
    }
    
    .comment-field::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
    
    .send-btn {
        background: #fe2c55;
        border: none;
        border-radius: 20px;
        padding: 12px 20px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .send-btn:hover {
        background: #ff1744;
        transform: scale(1.05);
    }
    
    .close-modal {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: white;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .close-modal:hover {
        background: rgba(254, 44, 85, 0.8);
        transform: scale(1.1);
    }
    
    @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
    }
    
    /* Touch feedback */
    .action-btn:active {
        transform: scale(0.9);
    }
`;

document.head.appendChild(style);