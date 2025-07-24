// ======================================
// Premium Particle Animation System
// Brand-matched for tools.dhruvupadhyay.com
// ======================================

class PremiumParticles {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        if (!this.canvas) return;

        // Default configuration matching your brand
        this.config = {
            particleCount: options.particleCount || 50,
            particleSpeed: options.particleSpeed || 0.5,
            particleSize: options.particleSize || 2,
            connectionDistance: options.connectionDistance || 100,
            primaryColor: options.primaryColor || '#2190b0',
            accentColor: options.accentColor || '#1a8bc || 'transparent',
            opacity: options.opacity || 0.8,
            enableConnections: options.enableConnections !== false,
            enableMouseInteraction: options.enableMouseInteraction !== false,
            responsiveBreakpoint: options.responsiveBreakpoint || 768
        };

        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.isTouch = 'ontouchstart' in window;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    setupCanvas() {
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Set canvas style
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = this.config.opacity;
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        this.width = rect.width;
        this.height = rect.height;
    }

    createParticles() {
        this.particles = [];
        const isMobile = window.innerWidth < this.config.responsiveBreakpoint;
        const count = isMobile ? Math.floor(this.config.particleCount * 0.6) : this.config.particleCount;

        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: (Math.random() - 0.5) * this.config.particleSpeed,
            vy: (Math.random() - 0.5) * this.config.particleSpeed,
            size: Math.random() * this.config.particleSize + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            color: Math.random() > 0.5 ? this.config.primaryColor : this.config.accentColor,
            life: Math.random() * 100 + 100,
            maxLife: 200
        };
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.width, particle.x));
            particle.y = Math.max(0, Math.min(this.height, particle.y));

            // Mouse interaction (if enabled and not on touch devices)
            if (this.config.enableMouseInteraction && !this.isTouch) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += (dx / distance) * force * 0.01;
                    particle.vy += (dy / distance) * force * 0.01;
                }
            }

            // Update life cycle
            particle.life--;
            if (particle.life <= 0) {
                this.particles[index] = this.createParticle();
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawConnections() {
        if (!this.config.enableConnections) return;

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * 0.2;
                    
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = this.config.primaryColor;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
        // Mouse tracking for interaction
        const updateMouse = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        };

        document.addEventListener('mousemove', updateMouse);
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        // Pause animation when tab is not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }

    destroy() {
        this.pause();
        this.canvas.remove();
    }
}

// Auto-initialize particles on any element with data-particles attribute
document.addEventListener('DOMContentLoaded', () => {
    const particleContainers = document.querySelectorAll('[data-particles]');
    
    particleContainers.forEach(container => {
        const canvas = document.createElement('canvas');
        canvas.classList.add('particles-canvas');
        container.appendChild(canvas);
        
        // Get configuration from data attributes
        const config = {
            particleCount: parseInt(container.dataset.particleCount) || 50,
            particleSpeed: parseFloat(container.dataset.particleSpeed) || 0.5,
            enableConnections: container.dataset.particleConnections !== 'false',
            enableMouseInteraction: container.dataset.particleInteraction !== 'false'
        };
        
        new PremiumParticles(canvas, config);
    });
});

// Export for manual initialization
window.PremiumParticles = PremiumParticles;