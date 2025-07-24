// ======================================
// Enhanced Smooth Scrolling System
// Premium animations and scroll effects
// ======================================

class SmoothScrollEffects {
    constructor(options = {}) {
        this.config = {
            scrollBehavior: options.scrollBehavior || 'smooth',
            animationDuration: options.animationDuration || 800,
            easing: options.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            enableScrollspy: options.enableScrollspy !== false,
            enableParallax: options.enableParallax !== false,
            parallaxSpeed: options.parallaxSpeed || 0.5,
            enableScrollAnimations: options.enableScrollAnimations !== false
        };

        this.scrollElements = [];
        this.parallaxElements = [];
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupScrollspy();
        this.bindEvents();
    }

    setupSmoothScrolling() {
        // Apply smooth scrolling to the document
        document.documentElement.style.scrollBehavior = this.config.scrollBehavior;
        
        // Enhanced smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            const href = target.getAttribute('href');
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (!targetElement) return;

            e.preventDefault();
            this.smoothScrollTo(targetElement);
        });
    }

    smoothScrollTo(element, offset = 80) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    setupScrollAnimations() {
        if (!this.config.enableScrollAnimations) return;

        // Find all elements with scroll animation attributes
        const animatedElements = document.querySelectorAll('[data-scroll-animation]');
        
        animatedElements.forEach(element => {
            this.scrollElements.push({
                element,
                animation: element.dataset.scrollAnimation || 'fadeInUp',
                delay: parseInt(element.dataset.scrollDelay) || 0,
                duration: parseInt(element.dataset.scrollDuration) || 600,
                triggered: false
            });
        });

        // Setup Intersection Observer for scroll animations
        if (this.scrollElements.length > 0) {
            this.setupIntersectionObserver();
        }
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.1
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scrollElement = this.scrollElements.find(
                        item => item.element === entry.target
                    );
                    
                    if (scrollElement && !scrollElement.triggered) {
                        this.triggerScrollAnimation(scrollElement);
                        scrollElement.triggered = true;
                    }
                }
            });
        }, observerOptions);

        this.scrollElements.forEach(item => {
            this.scrollObserver.observe(item.element);
        });
    }

    triggerScrollAnimation(scrollElement) {
        const { element, animation, delay, duration } = scrollElement;
        
        setTimeout(() => {
            element.style.transition = `all ${duration}ms ${this.config.easing}`;
            element.classList.add('scroll-animated', `animate-${animation}`);
        }, delay);
    }

    setupParallaxEffects() {
        if (!this.config.enableParallax) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            this.parallaxElements.push({
                element,
                speed: parseFloat(element.dataset.parallax) || this.config.parallaxSpeed,
                offset: 0
            });
        });
    }

    updateParallax() {
        if (!this.config.enableParallax || this.parallaxElements.length === 0) return;

        const scrollTop = window.pageYOffset;

        this.parallaxElements.forEach(item => {
            const { element, speed } = item;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    setupScrollspy() {
        if (!this.config.enableScrollspy) return;

        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        const sections = Array.from(navLinks).map(link => {
            const href = link.getAttribute('href');
            const section = document.querySelector(href);
            return section ? { link, section, href } : null;
        }).filter(Boolean);

        if (sections.length === 0) return;

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionData = sections.find(s => s.section === entry.target);
                if (!sectionData) return;

                if (entry.isIntersecting) {
                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));
                    // Add active class to current section's nav link
                    sectionData.link.classList.add('active');
                }
            });
        }, {
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0.1
        });

        sections.forEach(item => {
            spyObserver.observe(item.section);
        });
    }

    bindEvents() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.updateParallax();
        });
    }

    // Public methods
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    scrollToElement(selector, offset = 80) {
        const element = document.querySelector(selector);
        if (element) {
            this.smoothScrollTo(element, offset);
        }
    }
}

// Add CSS animations for scroll effects
const addScrollAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Scroll Animation Base Styles */
        [data-scroll-animation] {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        [data-scroll-animation].scroll-animated {
            opacity: 1;
            transform: translateY(0);
        }

        /* Animation Variants */
        .animate-fadeInUp {
            transform: translateY(0) !important;
        }

        .animate-fadeInLeft {
            transform: translateX(0) !important;
        }

        .animate-fadeInRight {
            transform: translateX(0) !important;
        }

        .animate-scaleIn {
            transform: scale(1) !important;
        }

        /* Parallax Elements */
        [data-parallax] {
            will-change: transform;
        }

        /* Active Navigation Links */
        nav a.active {
            color: var(--color-primary, #2190b0) !important;
            font-weight: 600;
        }

        /* Smooth scrolling for the entire page */
        html {
            scroll-behavior: smooth;
        }

        /* Scroll padding for fixed headers */
        html {
            scroll-padding-top: 80px;
        }
    `;
    document.head.appendChild(style);
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    addScrollAnimationStyles();
    new SmoothScrollEffects();
});

// Export for manual initialization
window.SmoothScrollEffects = SmoothScrollEffects;