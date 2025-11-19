function initializeScrollbar() {
    const body = document.body;
    const html = document.documentElement;
    
    // Create style element for dynamic CSS
    const style = document.createElement('style');
    document.head.appendChild(style);
    
    // Create custom scrollbar element
    createCustomScrollbar();
    
    // Set base styles
    setScrollbarStyles(style);
    
    // Handle desktop scrollbar behavior
    function updateDesktopScroll() {
        const isDesktop = window.innerWidth >= 1024;
        if (isDesktop) {
            const scrollbarZone = 50; // Pixels from right edge
            
            // Mouse movement handler
            const handleMouseMove = (e) => {
                const viewportWidth = window.innerWidth;
                const mouseX = e.clientX;
                
                if (viewportWidth - mouseX <= scrollbarZone) {
                    html.classList.add('show-scrollbar');
                } else {
                    html.classList.remove('show-scrollbar');
                }
            };
            
            // Add/remove event listeners
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseleave', () => {
                html.classList.remove('show-scrollbar');
            });
            
            // Clean up previous listeners if they exist
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }
    
    // Mobile behavior - completely hide scrollbar
    function setupMobileScroll() {
        // For mobile devices, we don't need event listeners as the scrollbar will be completely hidden via CSS
    }
    
    function createCustomScrollbar() {
        // Create an overlay scrollbar element
        const customScrollbar = document.createElement('div');
        customScrollbar.classList.add('custom-scrollbar');
        
        // Create the scroll thumb element
        const scrollThumb = document.createElement('div');
        scrollThumb.classList.add('scroll-thumb');
        customScrollbar.appendChild(scrollThumb);
        
        // Append to body
        document.body.appendChild(customScrollbar);
        
        // Update scrollbar position and height on scroll
        window.addEventListener('scroll', updateScrollThumbPosition);
        window.addEventListener('resize', updateScrollThumbPosition);
        
        // Initial position setup
        setTimeout(updateScrollThumbPosition, 100);
        
        // Add drag functionality to the scrollbar
        let isDragging = false;
        let startY = 0;
        let startScrollY = 0;
        
        scrollThumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            startY = e.clientY;
            startScrollY = window.scrollY;
            document.body.style.userSelect = 'none'; // Prevent text selection during drag
            
            // Add event listeners for drag and release
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', stopDrag);
        });
        
        // Make the track clickable as well (clicking anywhere on the scrollbar jumps to that position)
        customScrollbar.addEventListener('click', (e) => {
            // Only process if we clicked on the track, not the thumb
            if (e.target === customScrollbar) {
                const clickRatio = e.clientY / window.innerHeight;
                const targetScrollY = clickRatio * (document.documentElement.scrollHeight - window.innerHeight);
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
            }
        });
        
        function handleDrag(e) {
            if (!isDragging) return;
            
            // Calculate how far the mouse has moved
            const delta = e.clientY - startY;
            
            // Calculate what percentage of the viewport height this represents
            const dragRatio = delta / window.innerHeight;
            
            // Calculate new scroll position
            const scrollRatio = dragRatio * (document.documentElement.scrollHeight - window.innerHeight);
            const newScrollY = startScrollY + scrollRatio * 1.5; // Multiplier for faster scroll
            
            // Apply the scroll
            window.scrollTo(0, newScrollY);
        }
        
        function stopDrag() {
            isDragging = false;
            document.body.style.userSelect = '';
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }
    
    function updateScrollThumbPosition() {
        const scrollThumb = document.querySelector('.scroll-thumb');
        if (!scrollThumb) return;
        
        // Calculate scroll percentage
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Calculate thumb height relative to viewport height ratio
        const viewportRatio = window.innerHeight / document.documentElement.scrollHeight;
        const thumbHeight = Math.max(viewportRatio * window.innerHeight, 30); // minimum 30px height
        
        // Set thumb height and position
        scrollThumb.style.height = `${thumbHeight}px`;
        
        // Calculate position (with a limit to prevent overflow)
        const maxTop = window.innerHeight - thumbHeight;
        const thumbPosition = Math.min(scrollPercent * window.innerHeight, maxTop);
        
        scrollThumb.style.top = `${thumbPosition}px`;
    }
    
    // Initial setup
    updateDesktopScroll();
    setupMobileScroll();
    
    // Update on resize
    let cleanup;
    window.addEventListener('resize', () => {
        if (cleanup) cleanup();
        html.classList.remove('show-scrollbar');
        setScrollbarStyles(style); // Update base styles
        cleanup = updateDesktopScroll();
        setupMobileScroll();
        updateScrollThumbPosition();
    });
}

function setScrollbarStyles(styleElement) {
    const isDesktop = window.innerWidth >= 1024;
    
    styleElement.textContent = `
        html {
            scroll-behavior: smooth;
            overflow-y: scroll; /* Always show native scrollbar space to prevent layout shift */
        }
        
        /* Hide default scrollbars */
        ::-webkit-scrollbar {
            width: 0;
            background: transparent;
        }
        
        * {
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        
        /* Custom overlay scrollbar styles */
        .custom-scrollbar {
            position: fixed;
            top: 0;
            right: 0;
            width: 10px;
            height: 100%;
            z-index: 9999;
            pointer-events: auto;
            opacity: 0;
            transition: opacity 0.3s ease;
            background: transparent;
            cursor: pointer;
        }
        
        .scroll-thumb {
            position: absolute;
            width: 6px;
            right: 2px;
            border-radius: 0;
            background-color: #000000;
            opacity: 0.7;
            transition: width 0.3s ease, opacity 0.3s ease, right 0.3s ease;
            cursor: grab;
        }
        
        .scroll-thumb:active {
            cursor: grabbing;
        }
        
        /* Show scrollbar when hovering near right edge */
        @media (min-width: 1024px) {
            .show-scrollbar .custom-scrollbar {
                opacity: 1;
                pointer-events: auto;
            }
            
            .show-scrollbar .scroll-thumb {
                width: 8px;
                opacity: 0.9;
                right: 1px;
            }
            
            .show-scrollbar .scroll-thumb:hover {
                width: 10px;
                opacity: 1;
                right: 0;
            }
        }
        
        /* Always hide scrollbar on mobile */
        @media (max-width: 1023px) {
            .custom-scrollbar {
                display: none;
            }
        }
    `;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeScrollbar);