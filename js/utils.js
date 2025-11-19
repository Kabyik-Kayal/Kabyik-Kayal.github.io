// utils.js
export function initializeYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

export function getSkillIcon(skill) {
    const icons = {
        'Python': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32" fill="#000000" class="skill-icon">
            <path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.5 10.7-65.7 0-108.6zM286.2 404c11.1 0 20.1 9.1 20.1 20.3 0 11.3-9 20.4-20.1 20.4-11 0-20.1-9.2-20.1-20.4.1-11.3 9.1-20.3 20.1-20.3zM167.8 248.1h106.8c29.7 0 53.4-24.5 53.4-54.3V91.9c0-29-24.4-50.7-53.4-55.6-35.8-5.9-74.7-5.6-106.8.1-45.2 8-53.4 24.7-53.4 55.6v40.7h106.9v13.6h-147c-31.1 0-58.3 18.7-66.8 54.2-9.8 40.7-10.2 66.1 0 108.6 7.6 31.6 25.7 54.2 56.8 54.2H101v-48.8c0-35.3 30.5-66.4 66.8-66.4zm-6.7-142.6c-11.1 0-20.1-9.1-20.1-20.3.1-11.3 9-20.4 20.1-20.4 11 0 20.1 9.2 20.1 20.4s-9 20.3-20.1 20.3z"/>
        </svg>`,
        'HTML': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="32" height="32" fill="#000000" class="skill-icon">
            <path d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/>
        </svg>`,
        'CSS': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="32" height="32" fill="#000000" class="skill-icon">
            <path d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3.1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2.1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"/>
        </svg>`,
        'MLFlow': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="32" height="32" fill="#000000" class="skill-icon">
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

export function initializeRole(CONFIG) {
    const roleElement = document.getElementById('role');
    if (roleElement) {
        new Typed(roleElement, CONFIG.roleOptions);
    }
}