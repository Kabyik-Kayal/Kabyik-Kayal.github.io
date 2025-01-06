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
    initializeTheme();
    initializeRole();
    initializeProjectFilters();
    initializeSkillBars();
    initializeMobileNav();
    initializeProjectSlider();
    initializeNetworkAnimation();
});

// Dynamic year in footer
function initializeYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Enhanced theme toggle with localStorage persistence
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (themeToggle) {
        document.body.classList.toggle('light-mode', savedTheme === 'light');
        updateThemeButton(themeToggle, savedTheme === 'light');
        
        themeToggle.addEventListener('click', () => {
            const isLightMode = document.body.classList.toggle('light-mode');
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            updateThemeButton(themeToggle, isLightMode);
        });
    }
}

// Project filtering system
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            filterProjects(projects, filter);
        });
    });
}

// Helper functions
function updateThemeButton(button, isLight) {
    button.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    button.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
}

function filterProjects(projects, filter) {
    projects.forEach(project => {
        const shouldShow = filter === 'all' || project.dataset.category === filter;
        project.style.display = shouldShow ? 'block' : 'none';
    });
}

// Add skill progress visualization
function initializeSkillBars() {
    const skills = {
        'Python': 90,
        'Machine Learning': 85,
        'Data Analysis': 88,
        'Deep Learning': 80,
        'SQL': 85,
        'Data Visualization': 87
    };

    const skillsContainer = document.querySelector('.skills-grid');
    if (skillsContainer) {
        Object.entries(skills).forEach(([skill, level]) => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <i class="fas ${getSkillIcon(skill)}"></i>
                <span>${skill}</span>
                <div class="skill-level" style="width: ${level}%"></div>
            `;
            skillsContainer.appendChild(skillCard);
        });
    }
}

function getSkillIcon(skill) {
    const icons = {
        'Python': 'fa-python',
        'Machine Learning': 'fa-brain',
        'Data Analysis': 'fa-chart-line',
        'Deep Learning': 'fa-network-wired',
        'SQL': 'fa-database',
        'Data Visualization': 'fa-chart-bar'
    };
    return icons[skill] || 'fa-code';
}

// Add mobile navigation functionality
function initializeMobileNav() {
    const nav = document.querySelector('nav');
    const navList = nav.querySelector('ul');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.display = 'none';

    // Add mobile menu button to nav
    nav.insertBefore(mobileMenuBtn, navList);

    // Toggle menu on button click
    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('show');
        mobileMenuBtn.innerHTML = navList.classList.contains('show') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
            navList.classList.remove('show');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Show/hide mobile menu button based on screen width
    function toggleMobileMenu() {
        mobileMenuBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
        if (window.innerWidth > 768) {
            navList.classList.remove('show');
        }
    }

    window.addEventListener('resize', toggleMobileMenu);
    toggleMobileMenu();
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

        // Remove all classes
        cards.forEach(card => card.classList.remove('active', 'prev', 'next'));

        // Set active card
        cards[currentIndex].classList.add('active');

        // Set prev card
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        cards[prevIndex].classList.add('prev');

        // Set next card
        const nextIndex = (currentIndex + 1) % cards.length;
        cards[nextIndex].classList.add('next');

        setTimeout(() => {
            isAnimating = false;
        }, 500);
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
}

function initializeRole() {
    const roleElement = document.getElementById('role');
    if (roleElement) {
        new Typed(roleElement, CONFIG.roleOptions);
    }
}

function initializeNetworkAnimation() {
    const canvas = document.getElementById('network-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 100;
    const connectionDistance = 100;
    const mouseRadius = 120;
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
            this.radius = 2;
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

    function animate() {
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
                    ctx.strokeStyle = `rgba(100, 255, 218, ${(connectionDistance - distance) / connectionDistance * 0.15})`;
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
