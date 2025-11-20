// Enhanced Butterfly Animation System
class Butterfly {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        this.element = this.createButterfly();
        
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.rotation = 0;
        
        // Check if mobile once
        const isMobile = window.innerWidth <= 968;
        
        // Adjust scale range based on device - remove very small butterflies on desktop
        this.scale = isMobile ? (0.6 + Math.random() * 0.8) : (0.85 + Math.random() * 0.55); // Desktop: 0.85 to 1.4, Mobile: 0.6 to 1.4
        
        // Color palette: pure black and cool dark grays
        const colors = [
            '#000000', '#000000', '#000000', // 60% pure black
            '#0a0a0a', '#141414', // 20% very dark gray
            '#1a1a1a', '#1f1f1f', // 20% dark gray
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Reduce speed on mobile devices
        const speedMultiplier = isMobile ? 0.5 : 0.5; // Further reduced desktop speed to match mobile
        this.baseSpeed = (0.3 + Math.random() * 0.4) * speedMultiplier;
        this.speed = this.baseSpeed;
        
        // Randomize wave pattern parameters for unique paths
        this.waveAmplitude = 10 + Math.random() * 40; // 10 to 50 - wider range
        this.waveFrequency = 0.01 + Math.random() * 0.04; // 0.01 to 0.05 - wider range
        this.secondaryWaveAmplitude = 5 + Math.random() * 15; // Secondary wave for complexity
        this.secondaryWaveFrequency = 0.03 + Math.random() * 0.05; // Different frequency
        this.verticalOffset = Math.random() * 100; // Random vertical starting position
        this.horizontalOffset = Math.random() * 100; // Random horizontal starting position
        this.phase = Math.random() * Math.PI * 2; // Random phase for wave
        this.secondaryPhase = Math.random() * Math.PI * 2; // Secondary phase
        
        // Random speed variations during flight
        this.speedVariation = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
        this.speedChangeRate = 0.001 + Math.random() * 0.003; // How fast speed changes
        
        // Random pausing behavior
        this.isPaused = false;
        this.pauseDuration = 0;
        this.nextPauseTime = (1000 + Math.random() * 4000) + (id * 300); // Stagger initial pause times
        this.pauseCounter = Math.random() * 500; // Random starting counter to prevent sync
        this.flapSpeed = 150 + Math.random() * 100; // 150-250ms flap speed
        this.bobSpeed = 1500 + Math.random() * 1000; // 1.5-2.5s bob cycle
        this.trail = [];
        this.maxTrailLength = 8;
        
        this.setInitialPosition();
        this.applyColor();
        this.setupFlapAnimation();
        this.setupBobAnimation();
        this.container.appendChild(this.element);
        
        // Reduced initial delay for faster appearance
        setTimeout(() => this.animate(), Math.random() * 2000);
    }
    
    setInitialPosition() {
        // Only left-to-right and right-to-left
        const rand = Math.random();
        if (rand < 0.5) {
            this.direction = 0; // Left to right
        } else {
            this.direction = 1; // Right to left
        }
        
        switch(this.direction) {
            case 0: // Left to right
                this.position.x = -50;
                this.position.y = this.verticalOffset;
                break;
            case 1: // Right to left
                this.position.x = this.container.offsetWidth + 50;
                this.position.y = this.verticalOffset;
                this.speed = -this.speed;
                break;
        }
    }
    
    createButterfly() {
        const butterfly = document.createElement('div');
        butterfly.className = `butterfly butterfly-${this.id}`;
        butterfly.style.transform = `scale(${this.scale})`;
        
        // Create butterfly body
        const body = document.createElement('div');
        body.className = 'butterfly-body';
        
        // Create antennas
        const antennaLeft = document.createElement('div');
        antennaLeft.className = 'butterfly-antenna butterfly-antenna-left';
        const antennaRight = document.createElement('div');
        antennaRight.className = 'butterfly-antenna butterfly-antenna-right';
        
        body.appendChild(antennaLeft);
        body.appendChild(antennaRight);
        
        // Create wings container
        const wingsContainer = document.createElement('div');
        wingsContainer.className = 'butterfly-wings';
        
        // Create left wing
        const wingLeft = document.createElement('div');
        wingLeft.className = 'butterfly-wing butterfly-wing-left';
        const patternLeft = document.createElement('div');
        patternLeft.className = 'wing-pattern';
        wingLeft.appendChild(patternLeft);
        
        // Create right wing
        const wingRight = document.createElement('div');
        wingRight.className = 'butterfly-wing butterfly-wing-right';
        const patternRight = document.createElement('div');
        patternRight.className = 'wing-pattern';
        wingRight.appendChild(patternRight);
        
        wingsContainer.appendChild(wingLeft);
        wingsContainer.appendChild(wingRight);
        
        butterfly.appendChild(body);
        butterfly.appendChild(wingsContainer);
        
        return butterfly;
    }
    
    applyColor() {
        // Apply color to body
        const body = this.element.querySelector('.butterfly-body');
        if (body) {
            body.style.background = `linear-gradient(to bottom, ${this.color}, ${this.color})`;
        }
        
        // Apply color to antennas
        const antennas = this.element.querySelectorAll('.butterfly-antenna');
        antennas.forEach(antenna => {
            antenna.style.background = this.color;
        });
        
        // Apply color to wings and their ::before pseudo-elements
        const wings = this.element.querySelectorAll('.butterfly-wing');
        wings.forEach(wing => {
            wing.style.background = this.color;
        });
        
        // Apply color to body head
        if (body) {
            body.style.setProperty('--body-color', this.color);
        }
    }
    
    setupFlapAnimation() {
        const wings = this.element.querySelectorAll('.butterfly-wing');
        let flapState = 0;
        
        const flap = () => {
            flapState = 1 - flapState;
            wings.forEach((wing, index) => {
                const isLeft = index === 0;
                const baseRotate = isLeft ? -3 : 3;
                const flapRotate = isLeft ? -8 : 8;
                const rotateY = flapState ? (isLeft ? -60 : 60) : 0;
                
                wing.style.transform = `rotateY(${rotateY}deg) rotateZ(${baseRotate + (flapState ? flapRotate : 0)}deg)`;
            });
            
            setTimeout(flap, this.flapSpeed);
        };
        
        flap();
    }
    
    setupBobAnimation() {
        let bobOffset = 0;
        let bobDirection = 1;
        const bobAmount = 10;
        
        const bob = () => {
            bobOffset += bobDirection * 0.5;
            if (Math.abs(bobOffset) >= bobAmount) {
                bobDirection *= -1;
            }
            
            this.bobOffset = bobOffset;
            requestAnimationFrame(bob);
        };
        
        bob();
    }
    
    animate() {
        const headerHeight = this.container.offsetHeight;
        const headerWidth = this.container.offsetWidth;
        let timeCounter = 0;
        
        const update = () => {
            timeCounter += 1;
            this.pauseCounter += 1;
            
            // Check if it's time to pause
            if (!this.isPaused && this.pauseCounter >= this.nextPauseTime) {
                this.isPaused = true;
                this.pauseDuration = 500 + Math.random() * 2500; // Pause for 0.5-3 seconds
                this.pauseCounter = 0;
            }
            
            // Check if pause is over
            if (this.isPaused && this.pauseCounter >= this.pauseDuration) {
                this.isPaused = false;
                this.nextPauseTime = 2000 + Math.random() * 5000; // Next pause in 2-7 seconds, more varied
                this.pauseCounter = 0;
            }
            
            // Add random speed variations
            const speedMod = Math.sin(timeCounter * this.speedChangeRate) * this.speedVariation;
            const currentSpeed = this.isPaused ? 0 : this.speed * (1 + speedMod * 0.3);
            
            // Horizontal movement (left-right or right-left)
            this.position.x += currentSpeed;
            
            // Complex wave pattern with two overlapping sine waves
            const primaryWave = Math.sin(Math.abs(this.position.x) * this.waveFrequency + this.phase) * this.waveAmplitude;
            const secondaryWave = Math.sin(Math.abs(this.position.x) * this.secondaryWaveFrequency + this.secondaryPhase) * this.secondaryWaveAmplitude;
            this.position.y = this.verticalOffset + primaryWave + secondaryWave;
            
            // Calculate rotation based on direction
            const dx = Math.abs(currentSpeed);
            const dy = (Math.cos(Math.abs(this.position.x) * this.waveFrequency + this.phase) * this.waveAmplitude * this.waveFrequency) +
                      (Math.cos(Math.abs(this.position.x) * this.secondaryWaveFrequency + this.secondaryPhase) * this.secondaryWaveAmplitude * this.secondaryWaveFrequency);
            const baseRotation = Math.atan2(dy, dx) * (180 / Math.PI) * 0.3;
            
            // Add some rotation variation
            const rotationVariation = Math.sin(Math.abs(this.position.x) * 0.05) * 2;
            
            // Flip rotation for right-to-left movement
            this.rotation = this.speed < 0 ? -baseRotation - rotationVariation : baseRotation + rotationVariation;
            
            // Reset when off screen
            if ((this.speed > 0 && this.position.x > headerWidth + 50) || (this.speed < 0 && this.position.x < -50)) {
                this.position.x = this.speed > 0 ? -50 : headerWidth + 50;
                this.verticalOffset = Math.random() * 80 + 10; // 10% to 90%
                this.phase = Math.random() * Math.PI * 2;
                this.secondaryPhase = Math.random() * Math.PI * 2;
                this.waveAmplitude = 10 + Math.random() * 40;
                this.waveFrequency = 0.01 + Math.random() * 0.04;
                this.secondaryWaveAmplitude = 5 + Math.random() * 15;
                this.secondaryWaveFrequency = 0.03 + Math.random() * 0.05;
            }
            
            // Apply transformations
            const finalY = this.position.y + (this.bobOffset || 0);
            const scaleX = this.speed < 0 ? -this.scale : this.scale;
            this.element.style.left = `${this.position.x}px`;
            this.element.style.top = `${finalY}%`;
            this.element.style.transform = `scale(${scaleX}, ${this.scale}) rotate(${this.rotation}deg)`;
            this.element.style.opacity = 1;
            
            requestAnimationFrame(update);
        };
        
        update();
    }
}

// Butterfly Manager
class ButterflyManager {
    constructor(containerSelector, count = 8) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('Butterfly container not found');
            return;
        }
        
        this.butterflies = [];
        // Reduce count on mobile devices
        const isMobile = window.innerWidth <= 968;
        this.count = isMobile ? Math.ceil(count / 2) : count; // Half the butterflies on mobile
        this.init();
        this.setupInteraction();
    }
    
    init() {
        // Clear existing butterflies
        this.container.innerHTML = '';
        
        // Create new butterflies with reduced stagger time
        for (let i = 0; i < this.count; i++) {
            setTimeout(() => {
                this.butterflies.push(new Butterfly(this.container, i + 1));
            }, i * 400); // Reduced from 1200ms to 400ms
        }
    }
    
    setupInteraction() {
        let isHovering = false;
        
        // Pause/slow down on hover
        this.container.parentElement.addEventListener('mouseenter', () => {
            isHovering = true;
            this.butterflies.forEach(butterfly => {
                if (butterfly.element) {
                    butterfly.element.style.transition = 'filter 0.3s ease';
                    butterfly.element.style.filter = 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5)) brightness(1.1)';
                }
            });
        });
        
        this.container.parentElement.addEventListener('mouseleave', () => {
            isHovering = false;
            this.butterflies.forEach(butterfly => {
                if (butterfly.element) {
                    butterfly.element.style.filter = 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))';
                }
            });
        });
    }
    
    addButterfly() {
        const id = this.butterflies.length + 1;
        this.butterflies.push(new Butterfly(this.container, id));
    }
    
    removeButterfly(index) {
        if (this.butterflies[index]) {
            this.butterflies[index].element.remove();
            this.butterflies.splice(index, 1);
        }
    }
    
    clear() {
        this.butterflies.forEach(butterfly => butterfly.element.remove());
        this.butterflies = [];
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for header to be ready
    setTimeout(() => {
        window.butterflyManager = new ButterflyManager('.butterflies-container', 8);
    }, 100);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Butterfly, ButterflyManager };
}
