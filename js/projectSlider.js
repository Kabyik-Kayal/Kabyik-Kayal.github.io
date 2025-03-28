// projectSlider.js
export function initializeProjectSlider() {
    const slider = document.querySelector('.project-grid');
    const cards = Array.from(slider.querySelectorAll('.project-card'));
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || cards.length < 3) return;

    const isMobile = window.innerWidth <= 768;
    let currentIndex = 0;
    let isAnimating = false;
    let autoRotateInterval;
    const autoRotateDelay = 5000; // 5 seconds between slides
    const transitionDuration = isMobile ? 300 : 600;

    // Add the desktop-specific class for enhanced animations if not mobile
    if (!isMobile) {
        slider.classList.add('desktop-slider');
        // Ensure the container has correct height for desktop
        const projectsContainer = document.querySelector('.projects-container');
        if (projectsContainer) {
            projectsContainer.style.height = '550px';
        }
    }

    function updateCards() {
        if (isAnimating) return;
        isAnimating = true;

        if (isMobile) {
            // Original mobile implementation
            // Apply animation class to container during transition
            slider.classList.add('animating');
            
            // Add transition class to each card
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.style.transition = `opacity ${transitionDuration/2}ms ease-out, transform ${transitionDuration/2}ms ease-out`;
            });

            // Wait for opacity transition to complete before changing positions
            setTimeout(() => {
                // Remove all classes and hide cards
                cards.forEach(card => {
                    card.classList.remove('active', 'prev', 'next');
                    card.style.visibility = 'hidden';
                });
                
                // Set up the new positions
                cards[currentIndex].classList.add('active');
                
                // Additional classes for continuous effect
                cards[currentIndex].classList.add('slide-to-center');

                // Slight delay before making cards visible again
                setTimeout(() => {
                    // Make the positioned cards visible
                    cards.forEach(card => {
                        if (card.classList.contains('active')) {
                            card.style.visibility = 'visible';
                            // Fade in the visible cards with transform
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 20);
                        }
                    });

                    // Reset animation flag after full transition completes
                    setTimeout(() => {
                        isAnimating = false;
                        slider.classList.remove('animating');
                        // Remove the temporary animation classes
                        cards.forEach(card => {
                            card.classList.remove('slide-from-center', 'slide-to-center');
                        });
                    }, transitionDuration);
                }, 50);
            }, transitionDuration / 2);
        } else {
            // Fixed desktop implementation for proper card alignment
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
                
                // Ensure proper positioning
                const perspective = 1500;
                const cardWidth = 340; // Standard card width
                const baseZIndex = 100;
                
                // Reset all style properties first for clean application
                card.style.position = 'absolute';
                card.style.visibility = 'visible';
                card.style.zIndex = baseZIndex - Math.abs(diff) * 10;
                card.style.width = '340px'; 
                card.style.height = '420px';
                card.style.top = '50%';
                card.style.left = '50%';
                
                // Apply different transforms based on position
                if (diff === 0) {
                    // Center (active) card
                    card.style.transform = `translate(-50%, -50%) scale(1) perspective(${perspective}px)`;
                    card.style.opacity = '1';
                    card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
                    card.style.filter = 'brightness(1)';
                } else if (Math.abs(diff) === 1) {
                    // Adjacent cards (prev/next)
                    const direction = diff < 0 ? 1 : -1;
                    // Position cards to the sides with less overlap
                    const offset = direction * 55; // Percentage offset
                    card.style.transform = `translate(calc(-50% + ${offset}%), -50%) 
                                           scale(0.85) 
                                           perspective(${perspective}px) 
                                           rotateY(${-direction * 15}deg)`;
                    card.style.opacity = '0.8';
                    card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                    card.style.filter = 'brightness(0.9) blur(0.5px)';
                } else if (Math.abs(diff) === 2) {
                    // Far side cards
                    const direction = diff < 0 ? 1 : -1;
                    const offset = direction * 95; // Farther offset
                    card.style.transform = `translate(calc(-50% + ${offset}%), -50%) 
                                           scale(0.7) 
                                           perspective(${perspective}px) 
                                           rotateY(${-direction * 25}deg)`;
                    card.style.opacity = '0.5';
                    card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
                    card.style.filter = 'brightness(0.8) blur(1px)';
                } else {
                    // Hidden cards
                    const direction = diff < 0 ? 1 : -1;
                    const offset = direction * 130;
                    card.style.transform = `translate(calc(-50% + ${offset}%), -50%) 
                                           scale(0.5) 
                                           perspective(${perspective}px) 
                                           rotateY(${-direction * 35}deg)`;
                    card.style.opacity = '0';
                }
                
                // Apply smooth transition with slight delay based on position
                card.style.transition = `
                    transform ${transitionDuration}ms cubic-bezier(0.19, 1, 0.22, 1) ${Math.abs(diff) * 10}ms, 
                    opacity ${transitionDuration}ms ease-in-out,
                    box-shadow ${transitionDuration}ms ease,
                    filter ${transitionDuration}ms ease
                `;
                
                // Make sure pointer events are only enabled on visible cards
                if (Math.abs(diff) <= 2) {
                    card.style.pointerEvents = 'auto';
                } else {
                    card.style.pointerEvents = 'none';
                }
            });
            
            // Position the slider buttons properly
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');
            if (prevBtn && nextBtn) {
                prevBtn.style.left = '10%';
                nextBtn.style.right = '10%';
            }
            
            // Reset animation state after transition completes
            setTimeout(() => {
                isAnimating = false;
                slider.classList.remove('sliding');
            }, transitionDuration + 100);
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
    
    // For touch devices
    if (isMobile) {
        cards.forEach(card => {
            card.style.transition = `all ${transitionDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`;
        });

        let touchStartX, touchStartY;
        
        slider.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            stopAutoRotate();
        }, { passive: true });

        slider.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            
            if (Math.abs(deltaX) > 50 && deltaY < 50) {
                if (deltaX > 0) prevSlide();
                else nextSlide();
            }
            
            // Resume auto-rotation after touch interaction
            setTimeout(startAutoRotate, autoRotateDelay * 2);
        }, { passive: true });
    }

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