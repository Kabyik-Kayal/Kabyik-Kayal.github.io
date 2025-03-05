// navigation.js
export function initializeNavigation() {
    // Smooth scrolling
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

    // Active section highlighting
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

    window.addEventListener('scroll', updateActiveSection);
}

export function initializeMobileNav() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('nav ul');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            navList.classList.toggle('show');
            mobileMenuBtn.innerHTML = navList.classList.contains('show') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                navList.classList.remove('show');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('show');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

export function initializeScrollAnimations() {
    const options = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, options);

    // Observe all sections and elements with fade-in class
    document.querySelectorAll('section, .fade-in').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}