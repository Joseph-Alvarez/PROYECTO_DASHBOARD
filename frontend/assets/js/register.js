// ============================================================
//  frontend/assets/js/register.js
//  Conecta el formulario de registro con el backend (Node.js)
// ============================================================

const API_URL = 'http://localhost:3000';   // ← cambia si el backend está en otro host

// ── Elementos del DOM ────────────────────────────────────────
const form = document.getElementById('formRegistro');
const btnSubmit = document.getElementById('btnRegistro');
const msgError = document.getElementById('msgError');
const msgExito = document.getElementById('msgExito');

// ── Utilidades ───────────────────────────────────────────────
function mostrarError(texto) {
    msgError.textContent = texto;
    msgError.style.display = 'block';
    msgExito.style.display = 'none';
}

function mostrarExito(texto) {
    msgExito.textContent = texto;
    msgExito.style.display = 'block';
    msgError.style.display = 'none';
}

function limpiarMensajes() {
    msgError.style.display = 'none';
    msgExito.style.display = 'none';
}

function setLoading(loading) {
    btnSubmit.disabled = loading;
    btnSubmit.textContent = loading ? 'Guardando…' : 'Crear Cuenta';
}

// ── Validaciones del lado cliente ────────────────────────────
function validarFormulario(datos) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!datos.primerNombre.trim()) return 'El primer nombre es obligatorio.';
    if (!datos.primerApellido.trim()) return 'El primer apellido es obligatorio.';
    if (!emailRegex.test(datos.correo)) return 'Ingresa un correo electrónico válido.';
    if (datos.contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (datos.contrasena !== datos.confirmar)
        return 'Las contraseñas no coinciden.';

    return null;  // sin errores
}

// ── Envío del formulario ─────────────────────────────────────
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    limpiarMensajes();

    const datos = {
        primerNombre: document.getElementById('primerNombre').value.trim(),
        segundoNombre: document.getElementById('segundoNombre')?.value.trim() ?? '',
        primerApellido: document.getElementById('primerApellido').value.trim(),
        segundoApellido: document.getElementById('segundoApellido')?.value.trim() ?? '',
        correo: document.getElementById('correo').value.trim(),
        contrasena: document.getElementById('contrasena').value,
        confirmar: document.getElementById('confirmar')?.value ?? '',
    };

    // Validar antes de enviar
    const errorLocal = validarFormulario(datos);
    if (errorLocal) {
        mostrarError(errorLocal);
        return;
    }

    // Eliminar campo 'confirmar' antes de enviar a la API
    const { confirmar, ...payload } = datos;

    setLoading(true);

    try {
        const response = await fetch(`${API_URL}/api/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const resultado = await response.json();

        if (response.ok && resultado.ok) {
            mostrarExito('¡Cuenta creada exitosamente! Redirigiendo…');
            form.reset();
            // Redirigir al login después de 2 s
            setTimeout(() => {
                window.location.href = '/frontend/index.html';   // ajusta la ruta
            }, 2000);
        } else {
            mostrarError(resultado.mensaje || 'No se pudo crear la cuenta.');
        }

    } catch (err) {
        console.error(err);
        mostrarError('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
    } finally {
        setLoading(false);
    }
});