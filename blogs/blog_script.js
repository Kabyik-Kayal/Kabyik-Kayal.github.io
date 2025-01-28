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

// Initialize pagination on load
document.addEventListener('DOMContentLoaded', () => {
    changePage(1);
    
    // Add hover effects for pagination buttons
    document.querySelectorAll('.page-number, .nav-btn').forEach(button => {
        button.addEventListener('mouseover', function() {
            if (!this.disabled && !this.classList.contains('active')) {
                this.style.background = 'rgba(100, 255, 218, 0.1)';
                this.style.borderColor = '#64ffda';
            }
        });

        button.addEventListener('mouseout', function() {
            if (!this.disabled && !this.classList.contains('active')) {
                this.style.background = 'rgba(17, 34, 64, 0.9)';
                this.style.borderColor = 'rgba(100, 255, 218, 0.3)';
            }
        });
    });
});

// Initialize everything when document loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main site features
    initializeNetworkAnimation();
    initializeYear();
    initializeMobileOptimizations();
    initializeMobileNav();
    
    // Initialize blog pagination
    changePage(1);
    
    // Add hover effects for pagination buttons
    document.querySelectorAll('.page-number, .nav-btn').forEach(button => {
        button.addEventListener('mouseover', function() {
            if (!this.disabled && !this.classList.contains('active')) {
                this.style.background = 'rgba(100, 255, 218, 0.1)';
                this.style.borderColor = '#64ffda';
                this.style.transform = 'translateY(-2px)';
            }
        });

        button.addEventListener('mouseout', function() {
            if (!this.disabled && !this.classList.contains('active')) {
                this.style.background = 'rgba(17, 34, 64, 0.9)';
                this.style.borderColor = 'rgba(100, 255, 218, 0.3)';
                this.style.transform = 'translateY(0)';
            }
        });
    });
});
