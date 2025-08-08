/**
 * Lazy Image Loader
 * This script enhances performance by lazy loading images only when they enter the viewport
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    
                    // Once the image is loaded, stop observing it
                    observer.unobserve(img);
                }
            });
        }, {
            // Start loading when the image is 10% in view
            threshold: 0.1,
            // Start loading when the image is 200px from entering the viewport
            rootMargin: '200px 0px'
        });
        
        // Find all images with data-src attribute and observe them
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        // For background images
        document.querySelectorAll('[data-background]').forEach(element => {
            imageObserver.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
        
        document.querySelectorAll('[data-background]').forEach(element => {
            const src = element.getAttribute('data-background');
            element.style.backgroundImage = `url(${src})`;
            element.removeAttribute('data-background');
        });
    }
    
    // Add lazy loading attribute to all images that don't have it
    document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
});

// Helper function to convert regular images to lazy loaded images
export function convertToLazyImages() {
    document.querySelectorAll('img:not([data-src]):not(.loaded)').forEach(img => {
        // Skip images that are already processed or don't have a src
        if (!img.src || img.classList.contains('loaded')) return;
        // Skip critical/above-the-fold images to preserve LCP
        if (
            img.hasAttribute('data-skip-lazy') ||
            img.classList.contains('profile-image') ||
            img.closest('#hero') ||
            img.closest('header')
        ) {
            // Ensure native lazy attribute isn't forced on critical ones
            if (img.getAttribute('loading') === 'lazy') img.removeAttribute('loading');
            return;
        }
        
        // Store the original src in data-src attribute
        img.setAttribute('data-src', img.src);
        
        // Set a placeholder or very small version of the image
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        
        // Add lazy loading attribute for browsers that support it
        img.setAttribute('loading', 'lazy');
    });
}
