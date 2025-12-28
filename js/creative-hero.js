// js/creative-hero.js

(function() {
    // Add waiting class immediately to hide elements
    document.body.classList.add('hero-waiting');

    const animateCounter = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const text = stat.innerText;
            // Target statistics that end with "+"
            if (text.includes('+')) {
                const target = parseInt(text);
                if (isNaN(target)) return;

                const duration = 2000; // 2 seconds for the count
                const startTime = performance.now();
                
                // Start from 0
                stat.innerText = '0+';
                
                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function for smooth deceleration (easeOutCubic)
                    const ease = 1 - Math.pow(1 - progress, 3);
                    
                    const current = Math.floor(ease * target);
                    stat.innerText = current + '+';
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.innerText = target + '+';
                    }
                };
                
                requestAnimationFrame(updateCount);
            }
        });
    };

    const initHeroAnimation = () => {
        const profileImg = document.querySelector('.profile-image');
        
        const startAnimation = () => {
            // Small delay to ensure layout is settled
            requestAnimationFrame(() => {
                // Ensure preload class is removed before starting our animation
                // This prevents the 'transition: none' from killing our reveal
                if (document.documentElement.classList.contains('preload')) {
                    document.documentElement.classList.remove('preload');
                }

                document.body.classList.remove('hero-waiting');
                document.body.classList.add('hero-animate');
                
                // Start counter animation after the stats container starts revealing
                // The stats container has a 1.4s delay in CSS
                setTimeout(animateCounter, 1500);
            });
        };

        // Force animation start if image takes too long or if there's an issue
        const safetyTimer = setTimeout(startAnimation, 2000);

        if (profileImg) {
            if (profileImg.complete && profileImg.naturalHeight !== 0) {
                clearTimeout(safetyTimer);
                startAnimation();
            } else {
                profileImg.onload = () => {
                    clearTimeout(safetyTimer);
                    startAnimation();
                };
                profileImg.onerror = () => {
                    clearTimeout(safetyTimer);
                    startAnimation();
                };
            }
        } else {
            clearTimeout(safetyTimer);
            startAnimation();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroAnimation);
    } else {
        initHeroAnimation();
    }
})();
