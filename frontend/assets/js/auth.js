

const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {

    // ── LOGIN ────────────────────────────────────────────────
    const formLogin = document.getElementById('loginForm');

    if (formLogin) {
        const btnLogin = document.getElementById('submitBtn');
        const msgError = document.getElementById('msgError');

        function setLoadingLogin(loading) {
            btnLogin.disabled = loading;
            btnLogin.textContent = loading ? 'Verificando…' : 'Ingresar';
        }

        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            msgError.style.display = 'none';

            const correo = document.getElementById('email').value.trim();
            const contrasena = document.getElementById('password').value;

            if (!correo || !contrasena) {
                msgError.textContent = 'Por favor completa todos los campos.';
                msgError.style.display = 'block';
                return;
            }

            setLoadingLogin(true);

            try {
                const response = await fetch(`${API_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, contrasena }),
                });

                const resultado = await response.json();

                if (response.ok && resultado.ok) {
                    console.log('Respuesta completa:', resultado);
                    console.log('Rol recibido:', resultado.usuario.rol);

                    localStorage.setItem('nombreUsuario', resultado.usuario.nombre);
                    localStorage.setItem('rolUsuario', resultado.usuario.rol);

                    console.log('rolUsuario en localStorage:', localStorage.getItem('rolUsuario'));

                    window.location.href = '/frontend/assets/Dashboard/dashboard.html';
                } else {
                    msgError.textContent = resultado.mensaje || 'Correo o contraseña incorrectos.';
                    msgError.style.display = 'block';
                }

            } catch (err) {
                console.error(err);
                msgError.textContent = 'No se pudo conectar con el servidor.';
                msgError.style.display = 'block';
            } finally {
                setLoadingLogin(false);
            }
        });
    }


    // ── REGISTRO ── //
    const formRegistro = document.getElementById('formRegistro');

    if (formRegistro) {
        const btnSubmit = document.getElementById('btnRegistro');
        const msgError = document.getElementById('msgError');
        const msgExito = document.getElementById('msgExito');

        // Utilidades
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

        function setLoadingRegistro(loading) {
            btnSubmit.disabled = loading;
            btnSubmit.textContent = loading ? 'Guardando…' : 'Crear Cuenta';
        }

        // Validaciones del lado cliente
        function validarFormulario(datos) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!datos.primerNombre.trim()) return 'El primer nombre es obligatorio.';
            if (!datos.primerApellido.trim()) return 'El primer apellido es obligatorio.';
            if (!emailRegex.test(datos.correo)) return 'Ingresa un correo electrónico válido.';
            if (datos.contrasena.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
            if (datos.contrasena !== datos.confirmar) return 'Las contraseñas no coinciden.';

            return null;
        }

        formRegistro.addEventListener('submit', async (e) => {
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

            const errorLocal = validarFormulario(datos);
            if (errorLocal) {
                mostrarError(errorLocal);
                return;
            }

            // Eliminar 'confirmar' antes de enviar a la API
            const { confirmar, ...payload } = datos;

            setLoadingRegistro(true);

            try {
                const response = await fetch(`${API_URL}/api/registro`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const resultado = await response.json();

                if (response.ok && resultado.ok) {
                    mostrarExito('¡Cuenta creada exitosamente! Redirigiendo…');
                    formRegistro.reset();
                    setTimeout(() => {
                        window.location.href = '/frontend/index.html';
                    }, 2000);
                } else {
                    mostrarError(resultado.mensaje || 'No se pudo crear la cuenta.');
                }

            } catch (err) {
                console.error(err);
                mostrarError('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
            } finally {
                setLoadingRegistro(false);
            }
        });
    }

});