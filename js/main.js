// main.js
import { CONFIG } from './config.js';
import { initializeNavigation, initializeMobileNav, initializeScrollAnimations } from './navigation.js';
import { initializeProjectSlider } from './projectSlider.js';
import { initializeNetworkAnimation } from './networkAnimation.js';
import { initializeYear, initializeRole } from './utils.js';
import { initializeMobileOptimizations, applyMobileSkillCards } from './mobileOptimizations.js';

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initializeYear();
    initializeRole(CONFIG);
    initializeProjectSlider();
    initializeNetworkAnimation();
    initializeNavigation();
    initializeMobileNav();
    initializeMobileOptimizations();
    applyMobileSkillCards();
    initializeScrollAnimations();
});

// Global event listeners
window.addEventListener('resize', () => {
    if (window.innerWidth <= 480) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
});

window.addEventListener('resize', applyMobileSkillCards);