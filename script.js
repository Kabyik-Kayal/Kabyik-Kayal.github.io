/* scripts.js */

// Configuration object for site-wide settings
const CONFIG = {
    animationDuration: 800,
    scrollOffset: 50,
    roleOptions: {
        strings: [
            'Data Scientist ^1000',
            'ML Engineer ^1000',
            'Content Writer ^1000',
            'MLOps Engineer ^1000',
            'Data Analyst ^1000',
            'Web Developer ^1000',
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        cursorChar: '',
        autoInsertCss: false,
        showCursor: true
    }
};

// Enhanced smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
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

// Add active class to current section in navigation
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const currentId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Add scroll event listener
window.addEventListener('scroll', updateActiveSection);

// Initialize site functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeYear();
    initializeRole();
    initializeProjectSlider();
    initializeNetworkAnimation();
    initializeMobileOptimizations();
    initializeSkillBars();
    initializeMobileNav();
    applyMobileSkillCards();
});

// Dynamic year in footer
function initializeYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Add skill progress visualization
function initializeSkillBars() {
    const skills = {
        'Python': 90,
        'Machine Learning': 85,
        'MLOps': 83,
        'Data Analysis': 88,
        'Deep Learning': 80,
        'SQL': 85,
        'MLFlow': 82,        // Replaced 'Data Visualization' with 'MLFlow'
        'PowerBI': 85,
        'HTML': 88,       
        'CSS': 85         
    };

    const skillsContainer = document.querySelector('.skills-grid');
    if (skillsContainer) {
        Object.entries(skills).forEach(([skill, level]) => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                ${['Python', 'HTML', 'CSS', 'MLFlow'].includes(skill) ? getSkillIcon(skill) : `<i class="fas ${getSkillIcon(skill)}"></i>`}
                <span>${skill}</span>
            `;
            skillsContainer.appendChild(skillCard);
        });
    }
}

function getSkillIcon(skill) {
    const icons = {
        'Python': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32" fill="#64ffda" class="skill-icon">
            <path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.5 10.7-65.7 0-108.6zM286.2 404c11.1 0 20.1 9.1 20.1 20.3 0 11.3-9 20.4-20.1 20.4-11 0-20.1-9.2-20.1-20.4.1-11.3 9.1-20.3 20.1-20.3zM167.8 248.1h106.8c29.7 0 53.4-24.5 53.4-54.3V91.9c0-29-24.4-50.7-53.4-55.6-35.8-5.9-74.7-5.6-106.8.1-45.2 8-53.4 24.7-53.4 55.6v40.7h106.9v13.6h-147c-31.1 0-58.3 18.7-66.8 54.2-9.8 40.7-10.2 66.1 0 108.6 7.6 31.6 25.7 54.2 56.8 54.2H101v-48.8c0-35.3 30.5-66.4 66.8-66.4zm-6.7-142.6c-11.1 0-20.1-9.1-20.1-20.3.1-11.3 9-20.4 20.1-20.4 11 0 20.1 9.2 20.1 20.4s-9 20.3-20.1 20.3z"/>
        </svg>`,
        'HTML': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="32" height="32" fill="#64ffda" class="skill-icon">
            <path d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/>
        </svg>`,
        'CSS': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="32" height="32" fill="#64ffda" class="skill-icon">
            <path d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3.1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2.1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"/>
        </svg>`,
        'MLFlow': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="32" height="32" fill="#64ffda" class="skill-icon">
            <path d="M544 280.9c0-89.17-61.83-165.4-139.6-197.4L352 174.2V49.78C336.6 47.39 321.3 46 305.7 46c-28.11 0-55.11 4.238-80.72 11.88L176 174.2v106.6L123.8 303.7c-5.867 2.531-11.5 5.445-16.89 8.672L96 318.9v93.14C96 493.5 158.5 556 240 556s144-62.5 144-144V318.9l-10.89-6.555c-5.393-3.227-11.02-6.141-16.89-8.672L304 280.9V174.2l52.4-116.7C429.2 89.88 480 178.3 480 280.9v1.568c-3.01-.3145-6.197-.5703-9.316-.5703c-35.2 0-63.1 28.8-63.1 64s28.8 63.1 63.1 63.1s63.1-28.8 63.1-63.1c0-1.26-.3867-2.434-.5006-3.674C541.1 325.6 544 303.5 544 280.9z"/>
        </svg>`,
        'Machine Learning': 'fa-brain',
        'MLOps': 'fa-gears',
        'Data Analysis': 'fa-chart-line',
        'Deep Learning': 'fa-network-wired',
        'SQL': 'fa-database',
        'PowerBI': 'fa-chart-pie'
    };
    return icons[skill] || 'fa-code';
}

// Add mobile navigation functionality
function initializeMobileNav() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('nav ul');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            navList.classList.toggle('show');
            mobileMenuBtn.innerHTML = navList.classList.contains('show') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                navList.classList.remove('show');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu when clicking on a nav link
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('show');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Project slider functionality
function initializeProjectSlider() {
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

        // Set active card
        cards[currentIndex].classList.add('active');

        if (!isMobile) {
            // Set prev/next cards only on desktop
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
        currentIndex = (currentIndex - 1 + cards.length) % cards.length; // Changed from + 1 to - 1
        updateCards();
    }

    function prevSlide() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % cards.length; // Changed from - 1 to + 1
        updateCards();
    }

    // Initialize
    updateCards();

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    if (window.innerWidth <= 480) {
        // Reduce animation duration for mobile
        const transitionDuration = '0.3s';
        cards.forEach(card => {
            card.style.transition = `all ${transitionDuration} cubic-bezier(0.4, 0.0, 0.2, 1)`;
        });

        // Optimize touch handling
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
            
            // Only handle horizontal swipes
            if (Math.abs(deltaX) > 50 && deltaY < 50) {
                if (deltaX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }, { passive: true });
    }
}

function initializeRole() {
    const roleElement = document.getElementById('role');
    if (roleElement) {
        new Typed(roleElement, CONFIG.roleOptions);
    }
}

function initializeNetworkAnimation() {
    const isMobile = window.innerWidth <= 480;
    const performanceConfig = {
        mobile: {
            particleCount: 50,          // Increased from 35
            connectionDistance: 100,    // Increased from 80
            frameRate: 30,
            particleSize: 3             // Increased from 2
        },
        desktop: {
            particleCount: 120,         // Increased from 100
            connectionDistance: 150,     // Increased from 100
            frameRate: 60,
            particleSize: 2.5           // Increased from 2
        }
    };

    const config = isMobile ? performanceConfig.mobile : performanceConfig.desktop;
    const frameInterval = 1000 / config.frameRate;
    let lastFrameTime = 0;

    const canvas = document.getElementById('network-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = config.particleCount;
    const connectionDistance = config.connectionDistance;
    const mouseRadius = 150;            // Increased from 120
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = config.particleSize;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouseRadius - distance) / mouseRadius;
                    this.vx -= Math.cos(angle) * force * 0.5;
                    this.vy -= Math.sin(angle) * force * 0.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#64ffda';
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate(currentTime) {
        if (isMobile && currentTime - lastFrameTime < frameInterval) {
            requestAnimationFrame(animate);
            return;
        }
        
        lastFrameTime = currentTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();

            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 255, 218, ${(connectionDistance - distance) / connectionDistance * 0.2})`; // Increased from 0.15
                    ctx.lineWidth = 1;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    resizeCanvas();
    init();
    animate();
}

// Consolidate mobile optimizations
function initializeMobileOptimizations() {
    if (window.innerWidth <= 480) {
        document.addEventListener('gesturestart', (e) => e.preventDefault());
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.body.style.overscrollBehaviorY = 'none';
    }
}

// Remove unused event listeners and keep only essential ones
window.addEventListener('resize', () => {
    if (window.innerWidth <= 480) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
});

function applyMobileSkillCards() {
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

window.addEventListener('resize', applyMobileSkillCards);
