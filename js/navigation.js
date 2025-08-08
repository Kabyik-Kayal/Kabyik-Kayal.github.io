// navigation.js
export function initializeNavigation() {
    // Scrolling with smooth animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Compute dynamic header offset (varies across breakpoints)
                const header = document.querySelector('header');
                const headerOffset = header ? header.getBoundingClientRect().height : 80;
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
        const openMenu = () => {
            navList.classList.add('show');
            document.body.classList.add('nav-open');
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        };
        const closeMenu = () => {
            navList.classList.remove('show');
            document.body.classList.remove('nav-open');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        };
        const toggleMenu = (e) => {
            e.stopPropagation();
            if (navList.classList.contains('show')) closeMenu(); else openMenu();
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navList.classList.contains('show') && !e.target.closest('nav')) {
                closeMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('show')) {
                closeMenu();
            }
        });

        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }
}