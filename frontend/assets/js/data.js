// frontend/assets/js/data.js

var API_URL = "http://localhost:3000/api/productos";
let todosLosProductos = [];

// ─── Estado de paginación ────────────────────────────────────────────────────
let paginaActual = 1;
let productosPorPagina = 6;
let productosVisibles = [];


// ─── Carga inicial ───────────────────────────────────────────────────────────
async function mostrarProductos() {
    const res = await fetch(API_URL);
    todosLosProductos = await res.json();
    actualizarStats(todosLosProductos);
    renderizarTabla(todosLosProductos);
}

function actualizarStats(productos) {
    const total = productos.length;
    const stock = productos.reduce((s, p) => s + Number(p.Stock), 0);
    const bajo = productos.filter(p => Number(p.Stock) < 8).length;

    document.getElementById("statTotal").textContent = total;
    document.getElementById("statStock").textContent = stock;
    document.getElementById("statBajo").textContent = bajo;
    document.getElementById("subtitulo").textContent =
        `Inventario · ${total} producto${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}`;
}

// ─── Tabla ───────────────────────────────────────────────────────────────────
function badgeCategoria(cat) {
    const claves = { tecnologia: 'tecnologia', deportes: 'deportes', ropa: 'ropa', hogar: 'hogar', escolar: 'escolar' };
    const clave = claves[cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")] || 'default';
    return `<span class="badge-cat ${clave}">${cat}</span>`;
}

// Recibe la lista completa (o filtrada) y reinicia a página 1
function renderizarTabla(productos) {
    productosVisibles = productos;
    paginaActual = 1;
    renderizarPagina();
}

function renderizarPagina() {
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const slice = productosVisibles.slice(inicio, fin);

    const tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";

    if (slice.length === 0) {
        tabla.innerHTML = `
            <tr><td colspan="6" class="text-center text-muted py-4">
                <i class="bi bi-inbox" style="font-size:24px;display:block;margin-bottom:6px"></i>
                No se encontraron productos.
            </td></tr>`;
    } else {
        slice.forEach(p => {
            const stockClass = Number(p.Stock) < 8 ? 'stock-low' : 'stock-ok';
            const precio = Number(p.Precio).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' });

            tabla.innerHTML += `
                <tr>
                    <td class="td-id">${p.Id}</td>
                    <td class="td-nombre">${p.NombreProducto}</td>
                    <td class="td-precio">${precio}</td>
                    <td>${badgeCategoria(p.Categoria)}</td>
                    <td class="${stockClass}">${p.Stock}</td>
                    <td>
                        <div class="d-flex gap-2">
                            <button class="btn-edit-sm" onclick="abrirModal(${p.Id})" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn-del-sm" onclick="eliminarProducto(${p.Id})" title="Eliminar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        });
    }

    renderizarControles();
}

// ─── Controles de paginación ─────────────────────────────────────────────────
function renderizarControles() {
    const total = productosVisibles.length;
    const totalPaginas = Math.ceil(total / productosPorPagina);
    const inicio = total === 0 ? 0 : (paginaActual - 1) * productosPorPagina + 1;
    const fin = Math.min(paginaActual * productosPorPagina, total);

    // Eliminar controles anteriores
    const viejo = document.getElementById("paginacionWrapper");
    if (viejo) viejo.remove();

    const wrapper = document.createElement("div");
    wrapper.id = "paginacionWrapper";
    wrapper.className = "pagination-wrapper";

    wrapper.innerHTML = `
        <div class="pagination-left">
            <span class="pagination-info">Mostrando ${inicio}–${fin} de ${total} productos</span>
            <select class="page-size-select" onchange="cambiarTamanoPagina(this.value)">
                <option value="6"  ${productosPorPagina === 6 ? 'selected' : ''}>6 por página</option>
                <option value="10" ${productosPorPagina === 10 ? 'selected' : ''}>10 por página</option>
                <option value="25" ${productosPorPagina === 25 ? 'selected' : ''}>25 por página</option>
                <option value="50" ${productosPorPagina === 50 ? 'selected' : ''}>50 por página</option>
            </select>
        </div>
        <div class="pagination-controls" id="botonesPage"></div>
    `;

    document.querySelector(".table-card").appendChild(wrapper);

    // Botones numéricos
    const contenedor = document.getElementById("botonesPage");
    generarBotones(paginaActual, totalPaginas).forEach(b => {
        const btn = document.createElement("button");
        btn.className = "btn-page" + (b === paginaActual ? " active" : "");
        btn.disabled = b === "...";

        if (b === "prev") {
            btn.textContent = "‹";
            btn.disabled = paginaActual === 1;
            btn.onclick = () => irAPagina(paginaActual - 1);
        } else if (b === "next") {
            btn.textContent = "›";
            btn.disabled = paginaActual === totalPaginas || totalPaginas === 0;
            btn.onclick = () => irAPagina(paginaActual + 1);
        } else if (b === "...") {
            btn.textContent = "…";
        } else {
            btn.textContent = b;
            btn.onclick = () => irAPagina(b);
        }

        contenedor.appendChild(btn);
    });
}

// Genera el array de botones con "..." cuando hay muchas páginas
function generarBotones(actual, total) {
    const arr = ["prev"];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) arr.push(i);
    } else {
        arr.push(1);
        if (actual > 3) arr.push("...");
        const desde = Math.max(2, actual - 1);
        const hasta = Math.min(total - 1, actual + 1);
        for (let i = desde; i <= hasta; i++) arr.push(i);
        if (actual < total - 2) arr.push("...");
        arr.push(total);
    }
    arr.push("next");
    return arr;
}

function irAPagina(n) {
    const totalPaginas = Math.ceil(productosVisibles.length / productosPorPagina);
    if (n < 1 || n > totalPaginas) return;
    paginaActual = n;
    renderizarPagina();
}

function cambiarTamanoPagina(valor) {
    productosPorPagina = parseInt(valor);
    paginaActual = 1;
    renderizarPagina();
}

// ─── Búsqueda ────────────────────────────────────────────────────────────────
function filtrarProductos() {
    const texto = document.getElementById("buscador").value.toLowerCase().trim();
    const filtrados = todosLosProductos.filter(p =>
        p.NombreProducto.toLowerCase().includes(texto) ||
        p.Categoria.toLowerCase().includes(texto)
    );
    renderizarTabla(filtrados);
}

function limpiarBusqueda() {
    document.getElementById("buscador").value = "";
    renderizarTabla(todosLosProductos);
}

// ─── Modal / CRUD ─────────────────────────────────────────────────────────────
async function abrirModal(id = null) {
    const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
    document.getElementById("formProducto").reset();
    document.getElementById("productoId").value = id || "";

    if (id) {
        const res = await fetch(`${API_URL}/${id}`);
        const p = await res.json();
        document.getElementById("nombre").value = p.NombreProducto;
        document.getElementById("precio").value = p.Precio;
        document.getElementById("categoria").value = p.Categoria;
        document.getElementById("stock").value = p.Stock;
    }
    modal.show();
}

// En data.js, busca esta función y reemplázala:
async function guardarProducto() {
    const id = document.getElementById("productoId").value;
    const data = {
        NombreProducto: document.getElementById("nombre").value,
        Precio: document.getElementById("precio").value,
        Categoria: document.getElementById("categoria").value,
        Stock: document.getElementById("stock").value,
    };

    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const resultado = await res.json();

    if (!resultado.ok) {
        alert(resultado.mensaje);
        return;
    }

    document.getElementById("buscador").value = "";
    await mostrarProductos();
    bootstrap.Modal.getInstance(document.getElementById("modalProducto")).hide();
}

async function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "authorization": "mi-token-secreto" }
    });
    await mostrarProductos();
}

document.addEventListener("DOMContentLoaded", mostrarProductos);