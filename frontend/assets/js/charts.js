/* ── ANIMATED PARTICLE BACKGROUND ── */
(function () {
    const c = document.getElementById('bg');
    const ctx = c.getContext('2d');
    let W, H, pts;

    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }

    function init() {
        resize();
        pts = Array.from({ length: 65 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - .8) * .45, vy: (Math.random() - .7) * .45,
            r: Math.random() * 1.9 + .7, a: Math.random()
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                const d = Math.hypot(dx, dy);
                if (d < 140) {
                    ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = `rgba(64,140,170,${(1 - d / 170) * .07})`; ctx.lineWidth = .8; ctx.stroke();
                }
            }
        }
        pts.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(64,140,170,${p.a * .35})`; ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init(); draw();
})();

/* ── TOGGLE PASSWORD ── */
(function () {
    const btn = document.getElementById('togglePw');
    const inp = document.getElementById('password');
    const icon = document.getElementById('eyeIcon');
    const eyeOpen = `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" />`;
    const eyeClosed = `<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />`;
    let vis = false;
    if (btn) btn.addEventListener('click', () => { vis = !vis; inp.type = vis ? 'text' : 'password'; icon.innerHTML = vis ? eyeClosed : eyeOpen; });
})();

/* ── RIPPLE ── */
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
    submitBtn.addEventListener('click', function (e) {
        const r = document.createElement('span');
        const d = Math.max(this.offsetWidth, this.offsetHeight);
        const rect = this.getBoundingClientRect();
        r.className = 'ripple';
        r.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px`;
        this.appendChild(r);
        setTimeout(() => r.remove(), 500);
    });
}

/* ── VALIDATION ── */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        let valid = true;
        const email = document.getElementById('email');
        const pw = document.getElementById('password');
        const emailErr = document.getElementById('emailErr');
        const pwErr = document.getElementById('pwErr');
        emailErr.classList.remove('show'); email.classList.remove('is-error');
        pwErr.classList.remove('show'); pw.classList.remove('is-error');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            email.classList.add('is-error'); emailErr.classList.add('show'); valid = false;
        }
        if (!pw.value.trim()) { pw.classList.add('is-error'); pwErr.classList.add('show'); valid = false; }
        if (!valid) e.preventDefault();
    });
}


document.addEventListener("DOMContentLoaded", function () {
    var animation = lottie.loadAnimation({
        container: document.getElementById("animation"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: '/frontend/assets/icons/login2.json',
    });
});


document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // evita que el navegador recargue la página

    const correo = document.getElementById("email").value;
    const contrasena = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contrasena })
        });

        const data = await response.json();

        if (data.ok) {
            // ✅ Redirigir si login es correcto
            window.location.href = "/frontend/indexHome.html";
        } else {
            alert(data.mensaje);
        }
    } catch (err) {
        console.error("Error en login:", err);
        alert("Error de conexión con el servidor.");
    }
});
