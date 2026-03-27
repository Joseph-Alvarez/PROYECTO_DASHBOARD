const ctx = document.getElementById('salesChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Ventas ($)',
      data: [1200, 1900, 3000, 2500, 3200, 4000, 3800],
      borderWidth: 2,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "white"
        }
      },
      y: {
        ticks: {
          color: "white"
        }
      }
    }
  }
});


/* Toggle visibilidad contraseña */
function togglePass(id, btn) {
  const input = document.getElementById(id);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.style.color = isText ? '' : 'var(--accent)';
}

/* Fuerza de contraseña */
document.getElementById('password').addEventListener('input', function () {
  const v = this.value;
  const bar = document.getElementById('strengthBar');
  const lbl = document.getElementById('strengthLabel');
  const spans = bar.querySelectorAll('span');
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const colors = ['#ef4444', '#f97316', '#eab308', '#2EE8A0'];
  const labels = ['Muy débil', 'Débil', 'Moderada', 'Fuerte'];
  spans.forEach((s, i) => {
    s.style.background = i < score ? colors[score - 1] : 'var(--border)';
  });
  lbl.textContent = v.length ? labels[score - 1] || '' : '';
  lbl.style.color = v.length ? colors[score - 1] : '';
});

/* Validación */
function validarRegistro() {
  const pass = document.getElementById('password').value;
  const conf = document.getElementById('confirmPassword').value;
  const err = document.getElementById('errorPass');
  if (pass !== conf) {
    err.classList.add('visible');
    document.getElementById('confirmPassword').closest('.input-wrap').classList.add('error');
  } else {
    err.classList.remove('visible');
    document.getElementById('confirmPassword').closest('.input-wrap').classList.remove('error');
    alert('¡Registro exitoso!');
  }
}

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