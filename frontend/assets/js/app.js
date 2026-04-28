document.addEventListener("DOMContentLoaded", () => {

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


  /* ── Saludo según hora ── */
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


/* ──CARGA DE COMPONENTES ── */

// Navbar
if (document.getElementById('navbar')) {
  fetch("/frontend/components/navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;

      const nombre = localStorage.getItem("nombreUsuario") || "Usuario";

      // Botón cerrar sesión
      const btnCerrar = document.getElementById("btnCerrar");
      if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/frontend/index.html";
        });
      }

      // Nombre en el navbar
      document.querySelectorAll("#navbar .nombreUsuario").forEach(el => {
        el.textContent = nombre;
      });

      //Nombre en el saludo
      document.querySelectorAll(".nombreUsuario").forEach(el => {
        el.textContent = nombre;
      });
    });
}

// Sidebar
if (document.getElementById('sidebar')) {
  fetch("/frontend/components/sidebar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("sidebar").innerHTML = data;

      const nombre = localStorage.getItem("nombreUsuario") || "Usuario";
      const rol = localStorage.getItem("rolUsuario") || "Sin rol";

      console.log("Rol en localStorage:", rol);

      // Nombre
      document.querySelectorAll("#sidebar .nombreUsuario").forEach(el => {
        el.textContent = nombre;
      });

      // Rol
      const userRole = document.querySelector("#sidebar .user-role");
      console.log("Elemento .user-role encontrado:", userRole);
      if (userRole) userRole.textContent = rol;

      // Iniciales en el avatar
      const avatar = document.querySelector("#sidebar .avatar");
      if (avatar) {
        const partes = nombre.trim().split(" ");
        const iniciales = partes.length >= 2
          ? partes[0][0] + partes[1][0]
          : partes[0][0];
        avatar.textContent = iniciales.toUpperCase();
      }

      // Mueve el .main dentro del .layout
      const layout = document.querySelector('.layout');
      const main = document.querySelector('.main') || document.querySelector('#main2') || document.querySelector('main');
      if (layout && main) layout.appendChild(main);
    });
}

