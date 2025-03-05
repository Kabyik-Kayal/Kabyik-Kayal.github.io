// networkAnimation.js
export function initializeNetworkAnimation() {
    const isMobile = window.innerWidth <= 480;
    const performanceConfig = {
        mobile: {
            particleCount: 50,
            connectionDistance: 100,
            frameRate: 30,
            particleSize: 3
        },
        desktop: {
            particleCount: 120,
            connectionDistance: 150,
            frameRate: 60,
            particleSize: 2.5
        }
    };

    const config = isMobile ? performanceConfig.mobile : performanceConfig.desktop;
    const frameInterval = 1000 / config.frameRate;
    let lastFrameTime = 0;

    const canvas = document.getElementById('network-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = config.particleCount;
    const connectionDistance = config.connectionDistance;
    const mouseRadius = 150;
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = config.particleSize;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x && mouse.y) {
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
        if (isMobile && currentTime - lastFrameTime < frameInterval) {
            requestAnimationFrame(animate);
            return;
        }
        
        lastFrameTime = currentTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();

            particles.forEach(otherParticle => {
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
                }
            });
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
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
    animate();
}