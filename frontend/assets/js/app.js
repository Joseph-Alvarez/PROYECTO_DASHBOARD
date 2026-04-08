document.addEventListener("DOMContentLoaded", () => {

  /* ── Sidebar accordion ── */
  function toggleSub(btn, id) {
    const sub = document.getElementById(id);
    const isOpen = sub.classList.contains('open');

    document.querySelectorAll('.nav-sub.open').forEach(s => s.classList.remove('open'));
    document.querySelectorAll('.nav-item.open').forEach(b => b.classList.remove('open'));

    if (!isOpen) {
      sub.classList.add('open');
      btn.classList.add('open');
    }
  }
  window.toggleSub = toggleSub;

  /* ── Chart.js ── */
  const ctx = document.getElementById('salesChart');

  if (ctx) {
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(56,189,248,0.25)');
    gradient.addColorStop(1, 'rgba(56,189,248,0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Ventas ($)',
          data: [12000, 19000, 15000, 22000, 18000, 24870],
          borderColor: '#38bdf8',
          backgroundColor: gradient,
          tension: 0.45,
          fill: true,
          pointRadius: 4,
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#0d1117',
          pointBorderWidth: 2,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1c2330',
            borderColor: '#21303f',
            borderWidth: 1,
            titleColor: '#a8bfd0',
            bodyColor: '#e2e8f0',
            padding: 10,
            callbacks: {
              label: ctx => ' $' + ctx.parsed.y.toLocaleString()
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#475569', font: { size: 11 } },
            grid: { color: 'rgba(33,48,63,0.6)' }
          },
          y: {
            ticks: {
              color: '#475569',
              font: { size: 11 },
              callback: v => '$' + (v / 1000).toFixed(0) + 'k'
            },
            grid: { color: 'rgba(33,48,63,0.6)' }
          }
        }
      }
    });
  }

  /* ── Pills ── */
  document.querySelectorAll('.pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
    });
  });

  /* ── Botón Cerrar Sesión ── */
  const btnCerrar = document.getElementById("btnCerrar");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "index.html";
    });
  }

  /* ── Nombre de usuario y saludo automático ── */
  const nombre = localStorage.getItem("nombreUsuario") || "Usuario";

  // Mostrar nombre en nav (ID) y en saludo (clase)
  const spanNav = document.getElementById("nombreUsuario");
  if (spanNav) spanNav.textContent = nombre;

  document.querySelectorAll(".nombreUsuario").forEach(el => {
    el.textContent = nombre;
  });

  // Saludo según hora
  const hora = new Date().getHours();
  let saludo, icono;

  if (hora >= 5 && hora < 12) {
    saludo = "Buenos días,";
    icono = "🌅";
  } else if (hora >= 12 && hora < 19) {
    saludo = "Buenas tardes,";
    icono = "☀️";
  } else {
    saludo = "Buenas noches,";
    icono = "🌙";
  }

  const textoSaludo = document.getElementById("textoSaludo");
  const iconoSaludo = document.getElementById("iconoSaludo");

  if (textoSaludo) textoSaludo.textContent = saludo;
  if (iconoSaludo) iconoSaludo.textContent = icono;

});


/////parte para Utilizarel menu-Principal/////
fetch("/frontend/components/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar").innerHTML = data;
  });