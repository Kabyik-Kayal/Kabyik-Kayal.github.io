let currentPage = 1;
const totalPages = 2;

function changePage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    
    // Hide all pages
    document.querySelectorAll('.blog-page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show selected page
    document.querySelector(`.blog-page[data-page="${pageNum}"]`).style.display = 'block';
    
    // Update active state of page numbers
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set active state
    document.querySelectorAll('.page-number')[pageNum - 1].classList.add('active');
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = pageNum === 1;
    document.getElementById('nextBtn').disabled = pageNum === totalPages;
    
    currentPage = pageNum;
}

function nextPage() {
    changePage(currentPage + 1);
}

function prevPage() {
    changePage(currentPage - 1);
}

// Initialize pagination on load - Use requestAnimationFrame to ensure DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        changePage(1);
        
        // Use event delegation for hover effects
        document.addEventListener('mouseover', function(e) {
            const target = e.target;
            if (target.classList.contains('page-number') || target.classList.contains('nav-btn')) {
                if (!target.disabled && !target.classList.contains('active')) {
                    target.style.background = 'rgba(100, 255, 218, 0.1)';
                    target.style.borderColor = '#64ffda';
                }
            }
        });

        document.addEventListener('mouseout', function(e) {
            const target = e.target;
            if (target.classList.contains('page-number') || target.classList.contains('nav-btn')) {
                if (!target.disabled && !target.classList.contains('active')) {
                    target.style.background = 'rgba(17, 34, 64, 0.9)';
                    target.style.borderColor = 'rgba(100, 255, 218, 0.3)';
                }
            }
        });
    });
    
    // Initialize main site features - use dynamic import for better performance
    if (typeof initializeNetworkAnimation === 'undefined') {
        import('../js/networkAnimation.js')
            .then(module => {
                module.initializeNetworkAnimation();
            })
            .catch(err => console.error('Could not load network animation:', err));
    } else {
        initializeNetworkAnimation();
    }
    
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Check for mobile optimizations
    const isMobile = window.innerWidth <= 480;
    if (isMobile) {
        document.body.classList.add('mobile');
        
        // Apply mobile-specific optimizations
        document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
});

// Mobile navigation handler
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

// Initialize mobile optimizations
function initializeMobileOptimizations() {
    if (window.innerWidth <= 480) {
        document.addEventListener('gesturestart', (e) => e.preventDefault());
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

// Add these functions to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    initializeMobileNav();
    initializeMobileOptimizations();
});
