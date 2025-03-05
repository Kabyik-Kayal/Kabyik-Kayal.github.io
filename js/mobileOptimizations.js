// mobileOptimizations.js
export function initializeMobileOptimizations() {
    if (window.innerWidth <= 480) {
        document.addEventListener('gesturestart', (e) => e.preventDefault());
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.body.style.overscrollBehaviorY = 'none';
    }
}

export function applyMobileSkillCards() {
    const isMobile = window.innerWidth <= 480;
    document.querySelectorAll('.skill-card').forEach(card => {
        if (isMobile) {
            card.style.width = '70px';
            card.style.height = '70px';
            card.style.borderRadius = '50%';
        } else {
            card.style.removeProperty('width');
            card.style.removeProperty('height');
            card.style.removeProperty('border-radius');
        }
    });
}