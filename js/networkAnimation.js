// networkAnimation.js
export function initializeNetworkAnimation() {
    const isMobile = window.innerWidth <= 480;
    
    // Enhanced mobile configuration with tiered performance levels
    const performanceConfig = {
        mobile: {
            particleCount: 80,           
            connectionDistance: 100,       
            frameRate: 60,              
            particleSize: 2.5,             
            glow: true,
            maxConnectionsPerParticle: 0, 
            movementSpeed: 0.5,
            skipFrames: 2,
            adaptiveFPS: true
        },
        desktop: {
            particleCount: 120,
            connectionDistance: 110,
            frameRate: 60,
            particleSize: 2.75,
            glow: true,
            glowSize: 4,
            glowAlpha: 0.6,
            maxConnectionsPerParticle: 0, // 0 means no limit
            movementSpeed: 0.35,
            skipFrames: 0,
            adaptiveFPS: true
        }
    };

    const config = isMobile ? performanceConfig.mobile : performanceConfig.desktop;
    const frameInterval = 1000 / config.frameRate;
    let lastFrameTime = 0;
    let rafId;
    let isInViewport = true;
    let skipFrameCount = 0;
    let devicePerformanceScore = 10; // Default score (1-10), will adjust based on FPS
    let batteryStatus = {
        charging: true,
        level: 1.0
    };

    const canvas = document.getElementById('network-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = isMobile ? 
        Math.min(config.particleCount, Math.floor(devicePerformanceScore * 2)) : 
        config.particleCount;
    const connectionDistance = config.connectionDistance;
    const mouseRadius = 150;
    let mouse = { x: null, y: null };
    
    // Battery awareness - adjust animation based on battery status
    if (isMobile && 'getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            batteryStatus.charging = battery.charging;
            batteryStatus.level = battery.level;
            
            // Update battery status on changes
            battery.addEventListener('chargingchange', () => {
                batteryStatus.charging = battery.charging;
                updateAnimationParameters();
            });
            
            battery.addEventListener('levelchange', () => {
                batteryStatus.level = battery.level;
                updateAnimationParameters();
            });
            
            updateAnimationParameters();
        });
    }
    
    // Update animation parameters based on device and battery
    function updateAnimationParameters() {
        if (!isMobile) return;
        
        // Reduce animation intensity when battery is low and not charging
        if (batteryStatus.level < 0.2 && !batteryStatus.charging) {
            config.skipFrames = 3;
            config.particleCount = Math.max(10, Math.floor(config.particleCount / 2));
            config.frameRate = 15;
        } else if (batteryStatus.level < 0.5 && !batteryStatus.charging) {
            config.skipFrames = 2;
            config.frameRate = 18;
        }
        
        // Apply the new settings
        if (particles.length > config.particleCount) {
            particles = particles.slice(0, config.particleCount);
        }
    }

    // Enhanced visibility detection with intersection observer for better performance
    function setupVisibilityDetection() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isInViewport = entry.isIntersecting;
                    
                    if (isInViewport && !rafId) {
                        rafId = requestAnimationFrame(animate);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            observer.observe(canvas);
        } else {
            // Fallback to previous method
            window.addEventListener('scroll', checkVisibility);
        }
    }

    // Legacy visibility check
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
        init();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.movementSpeed;
            this.vy = (Math.random() - 0.5) * config.movementSpeed;
            this.radius = config.particleSize;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction only on desktop
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
            // Simplified drawing for mobile
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#64ffda';
            ctx.fill();
            
            // Glow effect only for desktop
            if (!isMobile && config.glow) {
                ctx.shadowBlur = config.glowSize;
                ctx.shadowColor = '#64ffda';
            }
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Measure and adapt to device performance
    function measureDevicePerformance() {
        if (!isMobile || !config.adaptiveFPS) return;
        
        let lastTimestamp = performance.now();
        let frameCount = 0;
        let totalDelta = 0;
        
        function measureFrame(timestamp) {
            const delta = timestamp - lastTimestamp;
            totalDelta += delta;
            frameCount++;
            
            if (frameCount >= 10) {
                const avgFPS = 1000 / (totalDelta / frameCount);
                devicePerformanceScore = Math.min(10, Math.max(1, Math.floor(avgFPS / 6)));
                
                // Adjust particles based on device capability
                if (devicePerformanceScore < 5) {
                    config.particleCount = 10;
                    config.skipFrames = 3;
                } else if (devicePerformanceScore < 8) {
                    config.particleCount = 15;
                    config.skipFrames = 2;
                }
                
                // Reinitialized with new count if needed
                if (particles.length > config.particleCount) {
                    particles = particles.slice(0, config.particleCount);
                }
                
                return;
            }
            
            lastTimestamp = timestamp;
            requestAnimationFrame(measureFrame);
        }
        
        requestAnimationFrame(measureFrame);
    }

    function animate(currentTime) {
        if (!isInViewport) {
            rafId = null;
            return;
        }
        
        // Skip frames for mobile performance
        if (isMobile && config.skipFrames > 0) {
            skipFrameCount = (skipFrameCount + 1) % (config.skipFrames + 1);
            if (skipFrameCount !== 0) {
                rafId = requestAnimationFrame(animate);
                return;
            }
        }
        
        // Throttle frame rate
        if (currentTime - lastFrameTime < frameInterval) {
            rafId = requestAnimationFrame(animate);
            return;
        }
        
        lastFrameTime = currentTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
            
            // Draw connections with limits for mobile
            let connectionsDrawn = 0;
            const maxConnections = config.maxConnectionsPerParticle > 0 ? 
                config.maxConnectionsPerParticle : particles.length;
                
            for (let i = 0; i < particles.length && connectionsDrawn < maxConnections; i++) {
                const otherParticle = particles[i];
                if (particle === otherParticle) continue;
                
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    // Use optimized alpha calculation for performance
                    const alpha = 0.2 * (1 - distance / connectionDistance);
                    
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
                    ctx.lineWidth = isMobile ? 0.5 : 1; // Thinner lines on mobile
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
    
    if (!isMobile) {
        canvas.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });
        
        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    resizeCanvas();
    init();
    setupVisibilityDetection();
    
    // Measure device performance after a short delay
    if (isMobile) {
        setTimeout(measureDevicePerformance, 1000);
    }
    
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