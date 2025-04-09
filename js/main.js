// main.js
import { CONFIG } from './config.js';
import { initializeNavigation, initializeMobileNav } from './navigation.js';
import { initializeProjectSlider } from './projectSlider.js';
import { initializeNetworkAnimation } from './networkAnimation.js';
import { initializeYear, initializeRole } from './utils.js';
import { initializeMobileOptimizations, applyMobileSkillCards } from './mobileOptimizations.js';
import { initializeScrollAnimations, addScrollAnimations, initializeSmoothScroll } from './scrollAnimations.js';

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    // Add preload class to prevent animations during page load
    document.documentElement.classList.add('preload');
    
    initializeYear();
    initializeRole(CONFIG);
    initializeProjectSlider();
    initializeNetworkAnimation();
    initializeNavigation();
    initializeMobileNav();
    initializeMobileOptimizations();
    applyMobileSkillCards();
    
    // Set up scroll animations
    addScrollAnimations();
    initializeScrollAnimations();
    initializeSmoothScroll();
    
    // Remove preload class after a short delay to enable animations
    setTimeout(() => {
        document.documentElement.classList.remove('preload');
    }, 100);
});

// Global event listeners
window.addEventListener('load', () => {
    if (window.innerWidth <= 480) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Add animated link class to nav items
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.classList.add('animated-link');
    });
});

window.addEventListener('resize', applyMobileSkillCards);