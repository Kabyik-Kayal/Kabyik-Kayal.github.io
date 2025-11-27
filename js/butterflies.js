// Enhanced Butterfly Animation System
class Butterfly {
    constructor(container, id) {
        this.container = container;
        this.id = id;
        this.element = this.createButterfly();
        
        this.position = { x: 0, y: 0 };
        this.targetPosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.rotation = 0;
        this.targetRotation = 0;
        
        // Check if mobile once
        const isMobile = window.innerWidth <= 968;
        
        // Adjust scale range based on device
        this.scale = isMobile ? (0.6 + Math.random() * 0.8) : (0.85 + Math.random() * 0.55);
        
        // Color palette: pure black and cool dark grays
        const colors = [
            '#000000', '#000000', '#000000',
            '#0a0a0a', '#141414',
            '#1a1a1a', '#1f1f1f',
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        // Smoother, slower movement
        const speedMultiplier = isMobile ? 0.4 : 0.35;
        this.baseSpeed = (0.2 + Math.random() * 0.3) * speedMultiplier;
        this.speed = this.baseSpeed;
        
        // Gentler wave pattern parameters for smoother paths
        this.waveAmplitude = 8 + Math.random() * 25; // Reduced amplitude for smoother waves
        this.waveFrequency = 0.008 + Math.random() * 0.015; // Lower frequency for longer, smoother waves
        this.secondaryWaveAmplitude = 3 + Math.random() * 10;
        this.secondaryWaveFrequency = 0.015 + Math.random() * 0.02;
        this.tertiaryWaveAmplitude = 2 + Math.random() * 5; // Third wave for extra organic feel
        this.tertiaryWaveFrequency = 0.025 + Math.random() * 0.03;
        // Distribute butterflies across different vertical zones to prevent cluttering
        const verticalZones = [15, 25, 35, 45, 55, 65, 75, 85];
        const zoneIndex = id % verticalZones.length;
        this.verticalOffset = verticalZones[zoneIndex] + (Math.random() * 8 - 4); // Small variation within zone
        this.horizontalOffset = Math.random() * 100;
        this.phase = Math.random() * Math.PI * 2;
        this.secondaryPhase = Math.random() * Math.PI * 2;
        this.tertiaryPhase = Math.random() * Math.PI * 2;
        
        // Smoother speed variations
        this.speedVariation = 0.3 + Math.random() * 0.4;
        this.speedChangeRate = 0.0005 + Math.random() * 0.001; // Slower speed changes
        
        // Interpolation factors for smoothness
        this.positionLerp = 0.08 + Math.random() * 0.04; // How smoothly position follows target
        this.rotationLerp = 0.06 + Math.random() * 0.03; // How smoothly rotation follows target
        
        // Random pausing behavior - longer, more graceful pauses
        this.isPaused = false;
        this.pauseDuration = 0;
        this.nextPauseTime = (3000 + Math.random() * 6000) + (id * 500);
        this.pauseCounter = Math.random() * 1000;
        this.pauseTransition = 0; // For smooth pause/resume transitions
        this.flapSpeed = 120 + Math.random() * 80; // Slightly faster flapping for more life
        this.bobSpeed = 2000 + Math.random() * 1500;
        this.trail = [];
        this.maxTrailLength = 8;
        
        // Wing animation state
        this.wingAngle = 0;
        this.targetWingAngle = 0;
        
        this.setInitialPosition();
        this.applyColor();
        this.setupSmoothFlapAnimation();
        this.setupSmoothBobAnimation();
        this.container.appendChild(this.element);
        
        // Staggered appearance with fade-in
        this.element.style.opacity = 0;
        setTimeout(() => {
            this.element.style.transition = 'opacity 0.8s ease-out';
            this.element.style.opacity = 1;
            this.animate();
        }, 300 + Math.random() * 1500);
    }
    
    setInitialPosition() {
        // Alternate directions based on butterfly ID to spread them out
        const isEvenId = this.id % 2 === 0;
        
        // Calculate horizontal offset to spread butterflies across the screen
        // This prevents them from all starting at the edge
        const containerWidth = this.container.offsetWidth || window.innerWidth;
        const horizontalSpread = (this.id / 8) * containerWidth; // Spread across width based on ID
        const randomOffset = Math.random() * (containerWidth * 0.3); // Add some randomness
        
        if (isEvenId) {
            this.direction = 0; // Left to right
            // Start at different points along the left portion or even mid-screen
            this.position.x = -50 + (horizontalSpread * 0.5) + randomOffset;
            // Keep within bounds
            if (this.position.x > containerWidth * 0.4) {
                this.position.x = -50 - (Math.random() * 100);
            }
        } else {
            this.direction = 1; // Right to left
            // Start at different points along the right portion
            this.position.x = containerWidth + 50 - (horizontalSpread * 0.5) - randomOffset;
            // Keep within bounds
            if (this.position.x < containerWidth * 0.6) {
                this.position.x = containerWidth + 50 + (Math.random() * 100);
            }
            this.speed = -this.speed;
        }
        
        this.position.y = this.verticalOffset;
        this.targetPosition.x = this.position.x;
        this.targetPosition.y = this.position.y;
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
    
    setupSmoothFlapAnimation() {
        const wings = this.element.querySelectorAll('.butterfly-wing');
        let flapPhase = Math.random() * Math.PI * 2; // Random starting phase
        
        const flap = () => {
            // Smooth sinusoidal flapping instead of binary states
            flapPhase += 0.10; // Controls flap speed
            const flapAmount = Math.sin(flapPhase);
            
            // Slower flapping when paused (gentle hovering)
            const flapIntensity = this.isPaused ? 0.4 : 1.0;
            const smoothFlapAmount = flapAmount * flapIntensity;
            
            wings.forEach((wing, index) => {
                const isLeft = index === 0;
                const baseRotateZ = isLeft ? -2 : 2;
                
                // Smooth rotation values
                const rotateY = smoothFlapAmount * (isLeft ? -55 : 55);
                const rotateZ = baseRotateZ + smoothFlapAmount * (isLeft ? -6 : 6);
                
                wing.style.transform = `rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
            
            requestAnimationFrame(flap);
        };
        
        flap();
    }
    
    setupSmoothBobAnimation() {
        let bobPhase = Math.random() * Math.PI * 2;
        const bobAmount = 6 + Math.random() * 4; // Gentler bobbing
        
        const bob = () => {
            bobPhase += 0.03; // Slower, smoother bob
            // Combine two sine waves for more organic movement
            const primaryBob = Math.sin(bobPhase) * bobAmount;
            const secondaryBob = Math.sin(bobPhase * 1.7) * (bobAmount * 0.3);
            
            this.bobOffset = primaryBob + secondaryBob;
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
            this.pauseCounter += 16; // Approximate ms per frame
            
            // Smooth pause transition
            if (!this.isPaused && this.pauseCounter >= this.nextPauseTime) {
                this.isPaused = true;
                this.pauseDuration = 1000 + Math.random() * 3000; // Longer, more graceful pauses
                this.pauseCounter = 0;
            }
            
            if (this.isPaused && this.pauseCounter >= this.pauseDuration) {
                this.isPaused = false;
                this.nextPauseTime = 4000 + Math.random() * 8000; // Longer intervals between pauses
                this.pauseCounter = 0;
            }
            
            // Smooth pause transition (0 = moving, 1 = paused)
            const targetPauseTransition = this.isPaused ? 1 : 0;
            this.pauseTransition += (targetPauseTransition - this.pauseTransition) * 0.02;
            
            // Gentle speed variations using multiple sine waves
            const speedMod1 = Math.sin(timeCounter * this.speedChangeRate) * this.speedVariation;
            const speedMod2 = Math.sin(timeCounter * this.speedChangeRate * 0.7 + 1.5) * this.speedVariation * 0.5;
            const combinedSpeedMod = (speedMod1 + speedMod2) * 0.5;
            
            // Smoothly reduce speed when pausing
            const pauseMultiplier = 1 - this.pauseTransition;
            const currentSpeed = this.speed * (1 + combinedSpeedMod * 0.2) * pauseMultiplier;
            
            // Calculate target position with complex wave pattern
            const targetX = this.targetPosition.x + currentSpeed;
            this.targetPosition.x = targetX;
            
            // Three overlapping sine waves for organic vertical movement
            const primaryWave = Math.sin(Math.abs(targetX) * this.waveFrequency + this.phase) * this.waveAmplitude;
            const secondaryWave = Math.sin(Math.abs(targetX) * this.secondaryWaveFrequency + this.secondaryPhase) * this.secondaryWaveAmplitude;
            const tertiaryWave = Math.sin(Math.abs(targetX) * this.tertiaryWaveFrequency + this.tertiaryPhase) * this.tertiaryWaveAmplitude;
            this.targetPosition.y = this.verticalOffset + primaryWave + secondaryWave + tertiaryWave;
            
            // Smoothly interpolate actual position towards target (creates fluid motion)
            this.position.x += (this.targetPosition.x - this.position.x) * this.positionLerp;
            this.position.y += (this.targetPosition.y - this.position.y) * this.positionLerp;
            
            // Calculate smooth rotation based on movement direction
            const dx = currentSpeed;
            const dy = (Math.cos(Math.abs(targetX) * this.waveFrequency + this.phase) * this.waveAmplitude * this.waveFrequency) +
                      (Math.cos(Math.abs(targetX) * this.secondaryWaveFrequency + this.secondaryPhase) * this.secondaryWaveAmplitude * this.secondaryWaveFrequency);
            
            // Gentler rotation that follows the path
            this.targetRotation = Math.atan2(dy, Math.abs(dx) + 0.1) * (180 / Math.PI) * 0.4;
            
            // Add subtle rotation variation
            const rotationVariation = Math.sin(Math.abs(targetX) * 0.02) * 3;
            this.targetRotation += rotationVariation;
            
            // Flip rotation for right-to-left movement
            if (this.speed < 0) {
                this.targetRotation = -this.targetRotation;
            }
            
            // Smoothly interpolate rotation
            this.rotation += (this.targetRotation - this.rotation) * this.rotationLerp;
            
            // Reset when off screen with smooth new parameters
            if ((this.speed > 0 && this.position.x > headerWidth + 60) || (this.speed < 0 && this.position.x < -60)) {
                this.targetPosition.x = this.speed > 0 ? -60 : headerWidth + 60;
                this.position.x = this.targetPosition.x;
                
                // Pick a new vertical zone different from current to spread out
                const verticalZones = [15, 25, 35, 45, 55, 65, 75, 85];
                const newZoneIndex = Math.floor(Math.random() * verticalZones.length);
                this.verticalOffset = verticalZones[newZoneIndex] + (Math.random() * 8 - 4);
                
                // Randomize wave parameters for variety on next pass
                this.phase = Math.random() * Math.PI * 2;
                this.secondaryPhase = Math.random() * Math.PI * 2;
                this.tertiaryPhase = Math.random() * Math.PI * 2;
                this.waveAmplitude = 8 + Math.random() * 25;
                this.waveFrequency = 0.008 + Math.random() * 0.015;
                this.secondaryWaveAmplitude = 3 + Math.random() * 10;
                this.secondaryWaveFrequency = 0.015 + Math.random() * 0.02;
                this.tertiaryWaveAmplitude = 2 + Math.random() * 5;
                this.tertiaryWaveFrequency = 0.025 + Math.random() * 0.03;
            }
            
            // Apply transformations with smooth bob offset
            const finalY = this.position.y + (this.bobOffset || 0);
            const scaleX = this.speed < 0 ? -this.scale : this.scale;
            
            // Use transform3d for GPU acceleration and smoother rendering
            this.element.style.left = `${this.position.x}px`;
            this.element.style.top = `${finalY}%`;
            this.element.style.transform = `scale3d(${scaleX}, ${this.scale}, 1) rotate(${this.rotation}deg)`;
            
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
        
        // Create new butterflies with staggered timing to spread them out
        for (let i = 0; i < this.count; i++) {
            setTimeout(() => {
                this.butterflies.push(new Butterfly(this.container, i + 1));
            }, i * 800); // Increased stagger time for better distribution
        }
    }
    
    setupInteraction() {
        // Smooth hover effects
        this.container.parentElement.addEventListener('mouseenter', () => {
            this.butterflies.forEach(butterfly => {
                if (butterfly.element) {
                    butterfly.element.style.filter = 'drop-shadow(0 3px 10px rgba(0, 0, 0, 0.5)) brightness(1.1)';
                }
            });
        });
        
        this.container.parentElement.addEventListener('mouseleave', () => {
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
