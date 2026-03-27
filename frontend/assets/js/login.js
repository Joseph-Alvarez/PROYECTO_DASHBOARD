// ============================================================
//  frontend/assets/js/login.js
//  Conecta el formulario de inicio de sesión con el backend
// ============================================================

const API_URL = 'http://localhost:3000';

const formLogin = document.getElementById('loginForm');
const btnLogin = document.getElementById('submitBtn');
const msgError = document.getElementById('msgError');   // asegúrate que exista en index.html

function setLoading(loading) {
    btnLogin.disabled = loading;
    btnLogin.textContent = loading ? 'Verificando…' : 'Ingresar';
}

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgError.style.display = 'none';

    // ✅ Leer valores DENTRO del evento, no fuera
    const correo = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('password').value;

    if (!correo || !contrasena) {
        msgError.textContent = 'Por favor completa todos los campos.';
        msgError.style.display = 'block';
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena }),
        });

        const resultado = await response.json();

        if (response.ok && resultado.ok) {
            sessionStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            window.location.href = '/frontend/assets/dashboard.html';
        } else {
            msgError.textContent = resultado.mensaje || 'Credenciales incorrectas.';
            msgError.style.display = 'block';
        }

    } catch (err) {
        console.error(err);
        msgError.textContent = 'No se pudo conectar con el servidor.';
        msgError.style.display = 'block';
    } finally {
        setLoading(false);
    }
});