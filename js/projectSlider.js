// projectSlider.js
export function initializeProjectSlider() {
    const slider = document.querySelector('.project-grid');
    if (!slider) return;
    const cards = Array.from(slider.querySelectorAll('.project-card'));
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (cards.length < 3) return;

    const isMobile = window.innerWidth <= 768;
    let currentIndex = 0;
    let isAnimating = false;
    let autoRotateInterval;
    const autoRotateDelay = 5000; // 5 seconds between slides
    const transitionDuration = isMobile ? 400 : 800;

    // Add the desktop-specific class for enhanced animations if not mobile
    const projectsContainer = document.querySelector('.projects-container');
    if (!isMobile) {
        slider.classList.add('desktop-slider');
        // Ensure the container has correct height for desktop
        if (projectsContainer) {
            projectsContainer.style.height = '650px';
        }

        // Initialize all cards with visibility for continuous slider
        cards.forEach((card) => {
            card.style.visibility = 'visible';
            card.style.opacity = '1';
        });
    } else {
        // Mobile: set appropriate container height
        if (projectsContainer) {
            projectsContainer.style.height = '450px';
            projectsContainer.style.overflow = 'hidden';
        }
    }

    function updateCards() {
        if (isAnimating) return;
        isAnimating = true;

        if (isMobile) {
            // Mobile implementation - show one card at a time
            slider.classList.add('animating');

            // Hide all cards first
            cards.forEach(card => {
                card.classList.remove('active');
                card.style.opacity = '0';
                card.style.transform = 'translate(-50%, -50%) scale(0.9)';
                card.style.visibility = 'hidden';
                card.style.position = 'absolute';
                card.style.pointerEvents = 'none';
                card.style.transition = `all ${transitionDuration}ms ease-out`;
                card.style.zIndex = '1';
            });

            // Show only the current card
            setTimeout(() => {
                const activeCard = cards[currentIndex];
                activeCard.classList.add('active');
                activeCard.style.visibility = 'visible';
                activeCard.style.zIndex = '10';
                activeCard.style.left = '50%';
                activeCard.style.top = '50%';
                activeCard.style.width = '90%';
                activeCard.style.maxWidth = '320px';
                activeCard.style.height = 'auto';
                activeCard.style.transform = 'translate(-50%, -50%) scale(1)';
                activeCard.style.pointerEvents = 'auto';
                activeCard.style.opacity = '0';

                // Fade in the active card
                setTimeout(() => {
                    activeCard.style.opacity = '1';

                    setTimeout(() => {
                        isAnimating = false;
                        slider.classList.remove('animating');
                    }, transitionDuration);
                }, 50);
            }, transitionDuration / 2);
        } else {
            // Improved desktop implementation for continuous slider
            slider.classList.add('sliding');

            // Calculate positions for each card
            cards.forEach((card, index) => {
                // Reset all cards first
                card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

                // Calculate the relative position
                let diff = ((index - currentIndex) + cards.length) % cards.length;
                if (diff > Math.floor(cards.length / 2)) {
                    diff -= cards.length;
                }

                // Apply appropriate classes based on position
                if (diff === 0) {
                    card.classList.add('active');
                } else if (diff === 1 || diff === -1 * (cards.length - 1)) {
                    card.classList.add('prev');
                } else if (diff === -1 || diff === (cards.length - 1)) {
                    card.classList.add('next');
                } else if (diff < -1) {
                    card.classList.add('far-next');
                } else if (diff > 1) {
                    card.classList.add('far-prev');
                }

                // Consistent style application for continuous slider
                const baseZIndex = 100;

                // Reset all style properties first for clean application
                card.style.position = 'absolute';
                card.style.visibility = 'visible'; // Always visible for continuous effect
                card.style.zIndex = baseZIndex - Math.abs(diff) * 10;
                card.style.width = '340px';
                card.style.height = '500px'; // Increased height to show full card content
                card.style.top = '50%';
                card.style.left = '50%';

                // Apply transforms without any sudden changes in position
                if (diff === 0) {
                    // Center (active) card
                    card.style.transform = `translate(-50%, -50%) scale(0.95)`;
                    card.style.opacity = '1';
                    card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                } else if (Math.abs(diff) === 1) {
                    // Adjacent cards (prev/next)
                    // Fix direction: diff < 0 is Left (Prev), diff > 0 is Right (Next)
                    const direction = diff < 0 ? -1 : 1;
                    const offset = direction * 60; // Reduced offset from 65
                    card.style.transform = `translate(calc(-50% + ${offset}%), -50%) scale(0.88)`; // Increased scale from 0.85
                    card.style.opacity = '0.85';
                    card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                } else if (Math.abs(diff) === 2) {
                    // Far side cards (visible)
                    const direction = diff < 0 ? -1 : 1; // Determine direction based on diff sign
                    const offset = direction * 110; // Adjust offset as needed
                    card.style.transform = `translate(calc(-50% + ${offset}%), -50%) scale(0.75)`;
                    card.style.opacity = '0.6';
                    card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                    card.style.visibility = 'visible'; // Ensure visibility
                } else {
                    // More distant cards (invisible)
                    const direction = diff < 0 ? -1 : 1; // Determine direction based on diff sign
                    const offset = direction * 145; // Keep them positioned off-screen
                    card.style.transform = `translate(calc(-50% + ${offset}%), -50%) scale(0.65)`;
                    card.style.opacity = '0'; // Make completely transparent (transition handles hiding)
                    // card.style.visibility = 'hidden'; // Removed: Rely on opacity transition
                }

                // Apply smooth transition easing for continuous slider using ease-out
                card.style.transition = `
                transform ${transitionDuration}ms ease-out,
                opacity ${transitionDuration}ms ease-out,
                box-shadow ${transitionDuration}ms ease-out
            `;

                // Make sure pointer events are only enabled on visible cards
                card.style.pointerEvents = Math.abs(diff) <= 2 ? 'auto' : 'none'; // Allow interaction with the 5 visible cards
            });

            // Reset animation state after transition completes
            setTimeout(() => {
                isAnimating = false;
                slider.classList.remove('sliding');
            }, transitionDuration);
        }
    }

    function nextSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCards();
    }

    function prevSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % cards.length;
        updateCards();
    }

    // Rest of the code remains unchanged
    function startAutoRotate() {
        stopAutoRotate();
        autoRotateInterval = setInterval(() => {
            prevSlide();
        }, autoRotateDelay);
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Initialize the slider
    updateCards();

    // Set up event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoRotate(); // Pause auto-rotation when user interacts
        setTimeout(startAutoRotate, autoRotateDelay * 2); // Resume after a pause
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoRotate(); // Pause auto-rotation when user interacts
        setTimeout(startAutoRotate, autoRotateDelay * 2); // Resume after a pause
    });

    // Rest of the event handlers remain unchanged
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoRotate();
            setTimeout(startAutoRotate, autoRotateDelay * 2);
        }
        if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoRotate();
            setTimeout(startAutoRotate, autoRotateDelay * 2);
        }
    });

    // Pause auto-rotation when hovering over slider
    slider.addEventListener('mouseenter', stopAutoRotate);
    slider.addEventListener('mouseleave', startAutoRotate);

    // Handle window resize to update desktop/mobile mode
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            // Refresh the page to reinitialize with new layout
            location.reload();
        } else if (!newIsMobile) {
            // Update card positioning on desktop resize without full reload
            updateCards();
        }
    });

    // Start auto-rotation on page load
    startAutoRotate();
}