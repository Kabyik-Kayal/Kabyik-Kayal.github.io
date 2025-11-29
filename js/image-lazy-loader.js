/**
 * Lazy Image Loader
 * This script enhances performance by lazy loading images only when they enter the viewport
 * with smooth fade-in animations
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
                        // Create a new image to preload
                        const preloadImg = new Image();
                        
                        preloadImg.onload = () => {
                            // Once preloaded, update the actual image
                            img.src = src;
                            img.removeAttribute('data-src');
                            
                            // Use requestAnimationFrame for smooth animation
                            requestAnimationFrame(() => {
                                // Small delay to ensure CSS transition triggers
                                setTimeout(() => {
                                    img.classList.add('loaded');
                                    img.classList.add('lazy-loaded');
                                    
                                    // Mark parent container as loaded if exists
                                    const container = img.closest('.lazy-image-container, .project-image-container, .blog-image-container');
                                    if (container) {
                                        container.classList.add('image-loaded');
                                    }
                                }, 50);
                            });
                        };
                        
                        preloadImg.onerror = () => {
                            // On error, still show the image (with broken state)
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            img.classList.add('load-error');
                        };
                        
                        // Start preloading
                        preloadImg.src = src;
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
        
        // Create separate observer for background images
        const bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const src = element.getAttribute('data-background');
                    
                    if (src) {
                        // Preload the background image
                        const preloadImg = new Image();
                        
                        preloadImg.onload = () => {
                            element.style.backgroundImage = `url(${src})`;
                            element.removeAttribute('data-background');
                            
                            requestAnimationFrame(() => {
                                setTimeout(() => {
                                    element.classList.add('loaded');
                                }, 50);
                            });
                        };
                        
                        preloadImg.src = src;
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '200px 0px'
        });
        
        // For background images
        document.querySelectorAll('[data-background]').forEach(element => {
            bgObserver.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        });
        
        document.querySelectorAll('[data-background]').forEach(element => {
            const src = element.getAttribute('data-background');
            element.style.backgroundImage = `url(${src})`;
            element.removeAttribute('data-background');
            element.classList.add('loaded');
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
            img.closest('header') ||
            img.closest('.skill-icon')
        ) {
            // Ensure native lazy attribute isn't forced on critical ones
            if (img.getAttribute('loading') === 'lazy') img.removeAttribute('loading');
            return;
        }
        
        // Add lazy-image class for CSS styling
        img.classList.add('lazy-image');
        
        // Store the original src in data-src attribute
        img.setAttribute('data-src', img.src);
        
        // Set a placeholder or very small version of the image
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        
        // Add lazy loading attribute for browsers that support it
        img.setAttribute('loading', 'lazy');
        
        // Add placeholder class to parent container if applicable
        const container = img.closest('.project-image-container, .blog-image-container');
        if (container) {
            container.classList.add('lazy-image-container');
        }
    });
}

// Initialize smooth lazy loading for dynamically added images
export function observeNewImages(container = document) {
    if (!('IntersectionObserver' in window)) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    const preloadImg = new Image();
                    
                    preloadImg.onload = () => {
                        img.src = src;
                        img.removeAttribute('data-src');
                        
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                img.classList.add('loaded');
                                img.classList.add('lazy-loaded');
                                
                                const parentContainer = img.closest('.lazy-image-container, .project-image-container, .blog-image-container');
                                if (parentContainer) {
                                    parentContainer.classList.add('image-loaded');
                                }
                            }, 50);
                        });
                    };
                    
                    preloadImg.src = src;
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '200px 0px'
    });
    
    container.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
