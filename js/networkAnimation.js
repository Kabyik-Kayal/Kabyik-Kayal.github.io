// networkAnimation.js
export function initializeNetworkAnimation() {
    const isMobile = window.innerWidth <= 480;
    const performanceConfig = {
        mobile: {
            particleCount: 30,           // Reduced from 50
            connectionDistance: 80,       // Reduced from 100
            frameRate: 24,               // Reduced from 30
            particleSize: 2.5,           // Reduced from 3
            glow: false
        },
        desktop: {
            particleCount: 100,          // Reduced from 120
            connectionDistance: 150,
            frameRate: 50,               // Reduced from 60
            particleSize: 2.5,
            glow: true,
            glowSize: 5,
            glowAlpha: 0.6
        }
    };

    const config = isMobile ? performanceConfig.mobile : performanceConfig.desktop;
    const frameInterval = 1000 / config.frameRate;
    let lastFrameTime = 0;
    let rafId;
    let isInViewport = true;

    const canvas = document.getElementById('network-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = config.particleCount;
    const connectionDistance = config.connectionDistance;
    const mouseRadius = 150;
    let mouse = { x: null, y: null };

    // Optimize by checking if animation is in viewport
    function checkVisibility() {
        const rect = canvas.getBoundingClientRect();
        isInViewport = !(
            rect.bottom < 0 || 
            rect.top > window.innerHeight
        );
        
        if (isInViewport && !rafId) {
            rafId = requestAnimationFrame(animate);
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(); // Reinitialize particles on resize
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.2); // Reduced speed
            this.vy = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.2); // Reduced speed
            this.radius = config.particleSize;
        }

        update() {
            // Only update position if not mobile or throttled
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Only do mouse interaction if desktop for performance
            if (!isMobile && mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouseRadius - distance) / mouseRadius;
                    this.vx -= Math.cos(angle) * force * 0.5;
                    this.vy -= Math.sin(angle) * force * 0.5;
                }
            }
        }

        draw() {
            if (config.glow) {
                // Create glow effect with shadow
                ctx.shadowBlur = config.glowSize;
                ctx.shadowColor = '#64ffda';
                ctx.globalAlpha = config.glowAlpha;
                
                // Draw larger glowing circle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#64ffda';
                ctx.fill();
                
                // Reset shadow and alpha for main particle
                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            }
            
            // Draw the main particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#64ffda';
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate(currentTime) {
        if (!isInViewport) {
            rafId = null;
            return;
        }
        
        // Throttle frame rate, especially on mobile
        if (currentTime - lastFrameTime < frameInterval) {
            rafId = requestAnimationFrame(animate);
            return;
        }
        
        lastFrameTime = currentTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset shadow for performance when drawing connections
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        particles.forEach(particle => {
            particle.update();
            particle.draw();

            // On mobile, reduce the number of connections drawn
            const maxConnections = isMobile ? 2 : particles.length;
            let connectionsDrawn = 0;
            
            for (let i = 0; i < particles.length; i++) {
                if (connectionsDrawn >= maxConnections) break;
                
                const otherParticle = particles[i];
                if (particle === otherParticle) continue;
                
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 255, 218, ${(connectionDistance - distance) / connectionDistance * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                    connectionsDrawn++;
                }
            }
        });

        rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', checkVisibility);
    
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    resizeCanvas();
    init();
    checkVisibility();
    
    // Clean up on page unload to prevent memory leaks
    return () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('scroll', checkVisibility);
        canvas.removeEventListener('mousemove', null);
        canvas.removeEventListener('mouseleave', null);
    };
}