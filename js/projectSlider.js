// projectSlider.js
export function initializeProjectSlider() {
    const slider = document.querySelector('.project-grid');
    const cards = Array.from(slider.querySelectorAll('.project-card'));
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || cards.length < 3) return;

    let currentIndex = 0;
    let isAnimating = false;

    function updateCards() {
        if (isAnimating) return;
        isAnimating = true;

        const isMobile = window.innerWidth <= 480;
        cards.forEach(card => card.classList.remove('active', 'prev', 'next'));

        cards[currentIndex].classList.add('active');

        if (!isMobile) {
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            const nextIndex = (currentIndex + 1) % cards.length;
            cards[prevIndex].classList.add('prev');
            cards[nextIndex].classList.add('next');
        }

        setTimeout(() => {
            isAnimating = false;
        }, isMobile ? 300 : 500);
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

    updateCards();
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    if (window.innerWidth <= 480) {
        const transitionDuration = '0.3s';
        cards.forEach(card => {
            card.style.transition = `all ${transitionDuration} cubic-bezier(0.4, 0.0, 0.2, 1)`;
        });

        let touchStartX, touchStartY;
        
        slider.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
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
        }, { passive: true });
    }
}