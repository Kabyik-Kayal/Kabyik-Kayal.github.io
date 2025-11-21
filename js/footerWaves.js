// Canvas-based footer wave animation
class FooterWaves {
    constructor() {
        this.canvas = document.getElementById('footer-waves');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.animationId = null;
        this.lastTime = 0;
        this.pixelRatio = window.devicePixelRatio || 1;
        this.isMobile = window.innerWidth <= 768;
        
        // Wave configuration with variety in patterns
        this.waveConfig = [
            { 
                amplitude: 35, 
                frequency: 0.008, 
                speed: 0.005, 
                opacity: 0.25, 
                color: '#404040',
                secondaryFreq: 0.003,
                secondaryAmp: 20,
                phase: 0
            },
            { 
                amplitude: 32, 
                frequency: 0.006, 
                speed: 0.0035, 
                opacity: 0.35, 
                color: '#2d2d2d',
                secondaryFreq: 0.004,
                secondaryAmp: 18,
                phase: Math.PI / 3
            },
            { 
                amplitude: 28, 
                frequency: 0.005, 
                speed: 0.002, 
                opacity: 0.5, 
                color: '#1a1a1a',
                secondaryFreq: 0.002,
                secondaryAmp: 15,
                phase: Math.PI / 2
            },
            { 
                amplitude: 25, 
                frequency: 0.006, 
                speed: 0.001, 
                opacity: 1, 
                color: '#080808',
                secondaryFreq: 0.003,
                secondaryAmp: 12,
                phase: Math.PI
            }
        ];
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createWaves();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
        
        // Pause animation when tab is not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    resize() {
        const footer = this.canvas.parentElement;
        this.isMobile = window.innerWidth <= 768;
        
        // Use full viewport width + extra pixels to ensure coverage
        const fullWidth = window.innerWidth + 20;
        
        // Use device pixel ratio for sharper rendering
        this.canvas.width = fullWidth * this.pixelRatio;
        this.canvas.height = footer.offsetHeight * this.pixelRatio;
        this.canvas.style.width = fullWidth + 'px';
        this.canvas.style.height = footer.offsetHeight + 'px';
        this.ctx.scale(this.pixelRatio, this.pixelRatio);
        this.width = fullWidth;
        this.height = footer.offsetHeight;
        
        // Recreate waves with new dimensions
        if (this.waves.length > 0) {
            this.createWaves();
        }
    }
    
    createWaves() {
        // Adjust wave properties for mobile
        const mobileScale = this.isMobile ? 0.7 : 1;
        const mobileYOffset = this.isMobile ? 0.4 : 0.45;
        const spacing = this.isMobile ? 5 : 8;
        
        this.waves = this.waveConfig.map((config, index) => {
            const scaledAmplitude = config.amplitude * mobileScale;
            const scaledSecondaryAmp = config.secondaryAmp * mobileScale;
            const baseYPosition = this.height * mobileYOffset + (index * spacing);
            
            // Ensure waves don't overflow the top boundary
            const maxWaveHeight = scaledAmplitude + scaledSecondaryAmp;
            const minYPosition = maxWaveHeight + 10; // 10px buffer from top
            const safeYPosition = Math.max(baseYPosition, minYPosition);
            
            return {
                ...config,
                amplitude: scaledAmplitude,
                secondaryAmp: scaledSecondaryAmp,
                offset: config.phase,
                yPosition: safeYPosition
            };
        });
    }
    
    drawWave(wave) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        
        // Adjust step size for mobile performance
        const step = this.isMobile ? 3 : 2;
        
        // Draw wave curve with combined frequencies for variety
        for (let x = 0; x <= this.width; x += step) {
            // Primary wave
            const primaryWave = Math.sin((x * wave.frequency) + wave.offset + wave.phase) * wave.amplitude;
            // Secondary wave for complexity
            const secondaryWave = Math.sin((x * wave.secondaryFreq) - wave.offset * 0.5) * wave.secondaryAmp;
            // Combine waves
            const y = wave.yPosition + primaryWave + secondaryWave;
            
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        // Complete the shape
        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.closePath();
        
        // Fill with color and opacity
        this.ctx.fillStyle = wave.color;
        this.ctx.globalAlpha = wave.opacity;
        this.ctx.fill();
        
        // Add subtle gradient overlay on the top wave (skip on mobile for performance)
        if (wave.opacity === 1 && !this.isMobile) {
            const gradient = this.ctx.createLinearGradient(0, wave.yPosition - wave.amplitude - wave.secondaryAmp, 0, this.height);
            gradient.addColorStop(0, 'rgba(20, 20, 20, 0.3)');
            gradient.addColorStop(0.5, 'rgba(10, 10, 10, 0.5)');
            gradient.addColorStop(1, wave.color);
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = 1;
            this.ctx.fill();
        }
    }
    
    animate(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw each wave
        this.waves.forEach(wave => {
            wave.offset += wave.speed;
            this.drawWave(wave);
        });
        
        // Continue animation
        this.animationId = requestAnimationFrame((time) => this.animate(time));
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
        window.removeEventListener('resize', () => this.resize());
    }
}

// Initialize waves when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FooterWaves();
    });
} else {
    new FooterWaves();
}
