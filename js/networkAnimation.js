// networkAnimation.js (simplified)
// Implements a lightweight network background animation on #network-bg
export function initializeNetworkAnimation() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Get theme colors
    const cs = getComputedStyle(document.documentElement);
    const meteorColor = cs.getPropertyValue('--network-node')?.trim() || 'rgba(0, 0, 0, 0.8)';
    
    let width, height;
    let meteors = [];

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    class Meteor {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.len = Math.random() * 200 + 100; 
            this.speed = Math.random() * 6 + 3; 
            this.size = Math.random() * 1 + 0.5; // Reduced size
            this.angle = Math.PI / 4; 
            this.opacity = Math.random() * 0.5 + 0.5; 
            
            // Increased delay for reduced occurrence
            this.delay = initial ? 0 : Math.random() * 400 + 200; 

            if (initial) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            } else {
                // Start from top-left corner area only
                if (Math.random() < 0.5) {
                    // Top edge (restricted to left half)
                    this.x = Math.random() * (width * 0.5);
                    this.y = -this.len;
                } else {
                    // Left edge (restricted to top half)
                    this.x = -this.len;
                    this.y = Math.random() * (height * 0.5);
                }
            }
        }

        update() {
            if (this.delay > 0) {
                this.delay--;
                return;
            }

            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);

            if (this.x > width + this.len || this.y > height + this.len) {
                this.reset();
            }
        }

        draw() {
            if (this.delay > 0) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            const gradient = ctx.createLinearGradient(0, 0, -this.len, 0);
            gradient.addColorStop(0, meteorColor);
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = gradient;
            
            // Draw tail
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-this.len, -this.size);
            ctx.lineTo(-this.len, this.size);
            ctx.closePath();
            ctx.fill();

            // Draw glowing head
            ctx.shadowBlur = 11;
            ctx.shadowColor = meteorColor;
            ctx.fillStyle = meteorColor;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        }
    }

    const initMeteors = () => {
        meteors = [];
        // Adjust density based on screen size
        const count = Math.floor((width * height) /40000); 
        for (let i = 0; i < count; i++) {
            meteors.push(new Meteor());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        meteors.forEach(m => {
            m.update();
            m.draw();
        });
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        resize();
        initMeteors();
    });

    resize();
    initMeteors();
    animate();
}