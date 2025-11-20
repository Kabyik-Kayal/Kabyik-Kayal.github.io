// Custom Butterfly Cursor
class ButterflyMouse {
    constructor() {
        // Only initialize on desktop (non-touch devices)
        if (window.matchMedia("(pointer: coarse)").matches) {
            return;
        }
        
        this.cursor = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.isHovering = false;
        this.clickSprinkles = [];
        
        this.createCursor();
        this.addEventListeners();
        this.animate();
    }
    
    createCursor() {
        // Create cursor container
        this.cursor = document.createElement('div');
        this.cursor.id = 'custom-cursor';
        
        // Create butterfly structure
        const butterfly = document.createElement('div');
        butterfly.className = 'cursor-butterfly';
        
        // Create body
        const body = document.createElement('div');
        body.className = 'cursor-butterfly-body';
        
        // Create antennas
        const antennaLeft = document.createElement('div');
        antennaLeft.className = 'cursor-butterfly-antenna cursor-butterfly-antenna-left';
        const antennaRight = document.createElement('div');
        antennaRight.className = 'cursor-butterfly-antenna cursor-butterfly-antenna-right';
        
        body.appendChild(antennaLeft);
        body.appendChild(antennaRight);
        
        // Create wings
        const wings = document.createElement('div');
        wings.className = 'cursor-butterfly-wings';
        
        const wingLeft = document.createElement('div');
        wingLeft.className = 'cursor-butterfly-wing cursor-butterfly-wing-left';
        
        const wingRight = document.createElement('div');
        wingRight.className = 'cursor-butterfly-wing cursor-butterfly-wing-right';
        
        wings.appendChild(wingLeft);
        wings.appendChild(wingRight);
        
        // Assemble butterfly
        butterfly.appendChild(body);
        butterfly.appendChild(wings);
        this.cursor.appendChild(butterfly);
        
        // Add to document
        document.body.appendChild(this.cursor);
    }
    
    addEventListeners() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Check if hovering over dark element
            const element = document.elementFromPoint(e.clientX, e.clientY);
            this.checkDarkElement(element);
        });
        
        // Detect hoverable elements
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.classList.contains('project-card') ||
                target.classList.contains('skill-card') ||
                target.classList.contains('social-btn') ||
                target.closest('a') ||
                target.closest('button')) {
                this.isHovering = true;
                this.cursor.classList.add('hover');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.classList.contains('project-card') ||
                target.classList.contains('skill-card') ||
                target.classList.contains('social-btn') ||
                target.closest('a') ||
                target.closest('button')) {
                this.isHovering = false;
                this.cursor.classList.remove('hover');
            }
        });
        
        // Add click sprinkles
        document.addEventListener('click', (e) => {
            // Use the butterfly cursor position instead of click position
            this.createSprinkles(this.cursorX, this.cursorY);
        });
    }
    
    createSprinkles(x, y) {
        const sprinkleCount = 12 + Math.floor(Math.random() * 8); // 12-20 sprinkles
        const shapes = ['circle', 'star', 'square', 'heart'];
        const colors = [
            '#000000', '#1a1a1a', '#2a2a2a', // Dark grays and black
            '#3a3a3a', '#4a4a4a' // Medium grays
        ];
        
        for (let i = 0; i < sprinkleCount; i++) {
            const sprinkle = document.createElement('div');
            sprinkle.className = `click-sprinkle ${shapes[Math.floor(Math.random() * shapes.length)]}`;
            
            // Random color
            const color = colors[Math.floor(Math.random() * colors.length)];
            sprinkle.style.setProperty('--color', color);
            
            // Random direction and distance
            const angle = (Math.PI * 2 * i) / sprinkleCount + (Math.random() - 0.5) * 0.5;
            const distance = 30 + Math.random() * 70; // 30-100px
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            sprinkle.style.setProperty('--tx', `${tx}px`);
            sprinkle.style.setProperty('--ty', `${ty}px`);
            
            // Position at click location
            sprinkle.style.left = `${x}px`;
            sprinkle.style.top = `${y}px`;
            
            document.body.appendChild(sprinkle);
            this.clickSprinkles.push(sprinkle);
            
            // Remove after animation
            setTimeout(() => {
                sprinkle.remove();
                const index = this.clickSprinkles.indexOf(sprinkle);
                if (index > -1) {
                    this.clickSprinkles.splice(index, 1);
                }
            }, 800);
        }
    }
    
    checkDarkElement(element) {
        if (!element) return;
        
        // Get computed background color
        const bgColor = window.getComputedStyle(element).backgroundColor;
        
        // Check if element or its parents have dark background
        let isDark = this.isColorDark(bgColor);
        
        // Check parent elements if current is transparent
        if (!isDark && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
                const parentBg = window.getComputedStyle(parent).backgroundColor;
                if (parentBg !== 'rgba(0, 0, 0, 0)' && parentBg !== 'transparent') {
                    isDark = this.isColorDark(parentBg);
                    break;
                }
                parent = parent.parentElement;
            }
        }
        
        // Check for specific dark classes or elements
        const hasDarkClass = element.classList.contains('butterfly') ||
                            element.classList.contains('project-card') ||
                            element.classList.contains('skill-card') ||
                            element.closest('.butterfly') ||
                            element.closest('.project-card') ||
                            element.closest('.skill-card');
        
        if (isDark || hasDarkClass) {
            this.cursor.classList.add('dark-bg');
        } else {
            this.cursor.classList.remove('dark-bg');
        }
    }
    
    isColorDark(color) {
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
            return false;
        }
        
        // Extract RGB values
        const rgb = color.match(/\d+/g);
        if (!rgb || rgb.length < 3) return false;
        
        // Calculate relative luminance
        const [r, g, b] = rgb.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Consider dark if luminance is less than 0.5
        return luminance < 0.5;
    }
    
    animate() {
        // Smooth follow with easing - increased speed for less latency
        const speed = .90;
        this.cursorX += (this.mouseX - this.cursorX) * speed;
        this.cursorY += (this.mouseY - this.cursorY) * speed;
        
        // Update cursor position
        if (this.cursor) {
            this.cursor.style.left = `${this.cursorX}px`;
            this.cursor.style.top = `${this.cursorY}px`;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.butterflyMouse = new ButterflyMouse();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ButterflyMouse };
}
