/**
 * Scroll Animations
 * Modern, performant scroll animations using Intersection Observer API
 */

export function initializeScrollAnimations() {
    // Check if browser supports Intersection Observer
    if (!('IntersectionObserver' in window)) {
        // For browsers that don't support IntersectionObserver, make all elements visible
        document.querySelectorAll('.fade-in, .slide-up, .slide-right, .slide-left, .scale-in')
            .forEach(el => el.classList.add('animate'));
        return;
    }

    // Create a single reusable observer for all scroll animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Once the animation is triggered, we can stop observing this element
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        // Start animation when element is 15% in viewport
        threshold: 0.1,
        // Start animation before element enters viewport
        rootMargin: '0px 0px -50px 0px'
    });

    // Find all elements with animation classes and observe them
    document.querySelectorAll('.fade-in, .slide-up, .slide-right, .slide-left, .scale-in')
        .forEach(el => {
            scrollObserver.observe(el);
        });
    
    // Add staggered animations for lists and grids
    document.querySelectorAll('.staggered-container').forEach(container => {
        const children = Array.from(container.children);
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            scrollObserver.observe(child);
        });
    });
    
    // Parallax scrolling effect for supported elements
    initParallax();
    
    // Special animation for hero section
    animateHero();
}

// Parallax scrolling effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    // Skip on mobile devices for better performance
    if (window.innerWidth <= 768 || !('IntersectionObserver' in window)) {
        parallaxElements.forEach(el => {
            el.style.transform = 'translateY(0)';
        });
        return;
    }

    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener('scroll', () => parallaxEffect(entry.target));
            } else {
                window.removeEventListener('scroll', () => parallaxEffect(entry.target));
            }
        });
    }, { threshold: 0 });

    parallaxElements.forEach(el => {
        parallaxObserver.observe(el);
    });
}

function parallaxEffect(element) {
    const scrollPosition = window.pageYOffset;
    const elementPosition = element.getBoundingClientRect().top + scrollPosition;
    const distance = scrollPosition - elementPosition;
    const parallaxSpeed = element.dataset.speed || 0.2;
    
    // Only apply parallax if the element is in or near viewport
    if (Math.abs(distance) < window.innerHeight) {
        element.style.transform = `translateY(${distance * parallaxSpeed}px)`;
    }
}

// Special animation for hero section
function animateHero() {
    const hero = document.querySelector('#hero');
    if (!hero) return;
    
    // Add animation classes to hero elements for initial load
    const profileContainer = hero.querySelector('.profile-container');
    const heroText = hero.querySelector('.hero-text');
    const heroCta = hero.querySelector('.hero-cta');
    
    if (profileContainer) {
        profileContainer.classList.add('fade-in');
        profileContainer.classList.add('animate');
    }
    
    if (heroText) {
        heroText.classList.add('slide-up');
        heroText.classList.add('animate');
    }
    
    if (heroCta) {
        heroCta.classList.add('fade-in');
        heroCta.classList.add('animate');
        heroCta.style.transitionDelay = '0.8s';
    }
}

// Add scroll-triggered animation to page
export function addScrollAnimations() {
    // Add animation classes to elements
    
    // Section headers
    document.querySelectorAll('.card-section h2').forEach(el => {
        el.classList.add('fade-in');
    });
    
    // About section
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        const aboutText = aboutContent.querySelector('.about-text');
        const resumeContainer = aboutContent.querySelector('.resume-container');
        
        if (aboutText) aboutText.classList.add('slide-right');
        if (resumeContainer) resumeContainer.classList.add('slide-left');
    }
    
    // Skills section
    const skillsCategories = document.querySelectorAll('.skill-category');
    skillsCategories.forEach(category => {
        category.classList.add('fade-in');
        const skillGrid = category.querySelector('.skills-grid');
        if (skillGrid) {
            skillGrid.classList.add('staggered-container');
            skillGrid.querySelectorAll('.skill-card').forEach(card => {
                card.classList.add('scale-in');
            });
        }
    });
    
    // Projects 
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.classList.add('fade-in');
    });
    
    // Blog content
    const blogContents = document.querySelectorAll('.blog-content');
    blogContents.forEach((blog, index) => {
        blog.classList.add('slide-up');
    });
    
    // View all button in blogs section
    const viewAllBtn = document.querySelector('.blogs-container .view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.classList.add('slide-up');
    }
    
    // Contact section
    const socialRows = document.querySelectorAll('.social-row');
    socialRows.forEach(row => {
        row.classList.add('staggered-container');
        row.querySelectorAll('.social-btn').forEach(btn => {
            btn.classList.add('slide-up');
        });
    });
}

// Add smooth scroll effect for anchor links
export function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const navList = document.querySelector('nav ul');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (navList && navList.classList.contains('show')) {
                    navList.classList.remove('show');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Smooth scroll to target
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
