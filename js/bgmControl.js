// bgmControl.js
export function initializeBGM() {
    const audio = document.getElementById('bgm-audio');
    const toggleBtn = document.getElementById('bgm-toggle');
    const icon = toggleBtn.querySelector('i');
    
    // Set initial volume
    audio.volume = 0.3;
    
    // Load saved preference from localStorage
    const isMuted = localStorage.getItem('bgm-muted') === 'true';
    
    if (isMuted) {
        audio.muted = true;
        toggleBtn.classList.add('muted');
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
    } else {
        // Try to play immediately if not muted
        audio.play().catch(err => {
            console.log('Auto-play blocked, will play on first interaction');
            // Set up one-time listener for any user interaction
            const startAudio = () => {
                audio.play().catch(e => console.log('Play failed:', e));
                document.removeEventListener('click', startAudio);
                document.removeEventListener('touchstart', startAudio);
                document.removeEventListener('keydown', startAudio);
            };
            document.addEventListener('click', startAudio);
            document.addEventListener('touchstart', startAudio);
            document.addEventListener('keydown', startAudio);
        });
    }
    
    // Toggle button click handler
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        
        if (audio.muted) {
            audio.muted = false;
            toggleBtn.classList.remove('muted');
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            localStorage.setItem('bgm-muted', 'false');
            
            // If audio isn't playing, start it
            if (audio.paused) {
                audio.play().catch(err => console.log('Play error:', err));
            }
        } else {
            audio.muted = true;
            toggleBtn.classList.add('muted');
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            localStorage.setItem('bgm-muted', 'true');
        }
    });
}
