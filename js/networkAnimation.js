// networkAnimation.js (simplified)
// Implements a lightweight network background animation on #network-bg
export function initializeNetworkAnimation() {
    const canvas = document.getElementById('network-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cs = getComputedStyle(document.documentElement);
    const nodeColor = cs.getPropertyValue('--network-node')?.trim() || 'rgba(100,255,218,0.35)';
    const linkColor = cs.getPropertyValue('--network-link')?.trim() || 'rgba(0,180,216,0.18)';

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w, h, pts; let N = 60;

    const resize = () => {
        w = canvas.width = Math.floor(window.innerWidth * dpr);
        h = canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        // Adjust number of points based on viewport area for better coverage
        const area = window.innerWidth * window.innerHeight;
        const scale = Math.sqrt(area / (1280 * 720));
        N = Math.max(50, Math.min(120, Math.round(60 * scale)));
        pts = new Array(N).fill(0).map(() => ({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25
        }));
    };

    window.addEventListener('resize', resize);
    resize();

    const tick = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = nodeColor;
        const radius = 2.2; // larger for visibility
        for (const p of pts) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            // subtle glow
            ctx.save();
            ctx.shadowBlur = 4;
            ctx.shadowColor = nodeColor;
            ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }
        ctx.strokeStyle = linkColor;
        ctx.lineWidth = Math.max(0.8, 0.8 * dpr);
        const threshold = 160 * dpr; // connect over slightly longer distances
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const a = pts[i], b = pts[j];
                const dx = a.x - b.x, dy = a.y - b.y; const d = Math.hypot(dx, dy);
                if (d < threshold) {
                    ctx.globalAlpha = 1 - d / threshold;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        requestAnimationFrame(tick);
    };

    tick();
}