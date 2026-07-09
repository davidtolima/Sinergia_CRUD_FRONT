const API_BASE = "http://localhost:8000/api";

let municipiosTodos = [];
let idEnEdicion = null;

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
        return;
    }

    cargarCatalogos();
    cargarPacientes();

    document.getElementById("formPaciente").addEventListener("submit", guardarPaciente);
    document.getElementById("departamento").addEventListener("change", filtrarMunicipios);
    document.getElementById("btnCancelar").addEventListener("click", cancelarEdicion);
    document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion);
});

function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}

async function peticionAutenticada(url, opciones = {}) {
    const token = localStorage.getItem("token");

    const respuesta = await fetch(url, {
        ...opciones,
        headers: {
            ...(opciones.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });

    if (respuesta.status === 401) {
        cerrarSesion();
        throw new Error("Sesion expirada");
    }

    return respuesta;
}

async function cargarCatalogos() {
    try {
        const respuesta = await fetch(`${API_BASE}/catalogos.php`);
        const datos = await respuesta.json();

        municipiosTodos = datos.municipios;

        llenarSelect("tipoDocumento", datos.tipos_documento);
        llenarSelect("genero", datos.generos);
        llenarSelect("departamento", datos.departamentos);
    } catch (error) {
        mostrarMensaje("No se pudieron cargar los catalogos. Verifica que el backend este corriendo.", "error");
    }
}

function llenarSelect(idSelect, opciones) {
    const select = document.getElementById(idSelect);

    opciones.forEach((opcion) => {
        const elementoOption = document.createElement("option");
        elementoOption.value = opcion.id;
        elementoOption.textContent = opcion.nombre;
        select.appendChild(elementoOption);
    });
}

function filtrarMunicipios() {
    const departamentoId = document.getElementById("departamento").value;
    const selectMunicipio = document.getElementById("municipio");

    selectMunicipio.innerHTML = "";

    if (!departamentoId) {
        selectMunicipio.innerHTML = "<option value=''>Seleccione un departamento primero</option>";
        return;
    }

    const municipiosFiltrados = municipiosTodos.filter(
        (municipio) => String(municipio.departamento_id) === String(departamentoId)
    );

    selectMunicipio.innerHTML = "<option value=''>Seleccione...</option>";

    municipiosFiltrados.forEach((municipio) => {
        const elementoOption = document.createElement("option");
        elementoOption.value = municipio.id;
        elementoOption.textContent = municipio.nombre;
        selectMunicipio.appendChild(elementoOption);
    });
}

async function cargarPacientes() {
    const cuerpoTabla = document.getElementById("cuerpoTablaPacientes");

    try {
        const respuesta = await peticionAutenticada(`${API_BASE}/paciente.php`);
        const pacientes = await respuesta.json();

        if (!Array.isArray(pacientes) || pacientes.length === 0) {
            cuerpoTabla.innerHTML = "<tr><td colspan='7'>No hay pacientes registrados.</td></tr>";
            return;
        }

        cuerpoTabla.innerHTML = "";

        pacientes.forEach((paciente) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${paciente.numero_documento}</td>
                <td>${paciente.nombre1} ${paciente.nombre2 ?? ""} ${paciente.apellido1} ${paciente.apellido2 ?? ""}</td>
                <td>${paciente.genero}</td>
                <td>${paciente.departamento}</td>
                <td>${paciente.municipio}</td>
                <td>${paciente.correo}</td>
                <td>
                    <button class="editar" onclick="editarPaciente(${paciente.id})">Editar</button>
                    <button class="peligro" onclick="eliminarPaciente(${paciente.id})">Eliminar</button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    } catch (error) {
        cuerpoTabla.innerHTML = "<tr><td colspan='7'>Error al cargar los pacientes.</td></tr>";
    }
}

async function guardarPaciente(evento) {
    evento.preventDefault();

    const paciente = {
        tipo_documento_id: document.getElementById("tipoDocumento").value,
        numero_documento: document.getElementById("numeroDocumento").value.trim(),
        nombre1: document.getElementById("nombre1").value.trim(),
        nombre2: document.getElementById("nombre2").value.trim(),
        apellido1: document.getElementById("apellido1").value.trim(),
        apellido2: document.getElementById("apellido2").value.trim(),
        genero_id: document.getElementById("genero").value,
        departamento_id: document.getElementById("departamento").value,
        municipio_id: document.getElementById("municipio").value,
        correo: document.getElementById("correo").value.trim(),
    };

    const esEdicion = idEnEdicion !== null;

    if (esEdicion) {
        paciente.id = idEnEdicion;
    }

    try {
        const respuesta = await peticionAutenticada(`${API_BASE}/paciente.php`, {
            method: esEdicion ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paciente),
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            const textoError = resultado.errores ? resultado.errores.join(", ") : resultado.error;
            mostrarMensaje(textoError, "error");
            return;
        }

        mostrarMensaje(esEdicion ? "Paciente actualizado correctamente" : "Paciente creado correctamente", "exito");
        cancelarEdicion();
        cargarPacientes();
    } catch (error) {
        mostrarMensaje("Error de conexion con el servidor.", "error");
    }
}

async function editarPaciente(id) {
    try {
        const respuesta = await peticionAutenticada(`${API_BASE}/paciente.php?id=${id}`);
        const paciente = await respuesta.json();

        idEnEdicion = paciente.id;

        document.getElementById("tipoDocumento").value = paciente.tipo_documento_id;
        document.getElementById("numeroDocumento").value = paciente.numero_documento;
        document.getElementById("nombre1").value = paciente.nombre1;
        document.getElementById("nombre2").value = paciente.nombre2 ?? "";
        document.getElementById("apellido1").value = paciente.apellido1;
        document.getElementById("apellido2").value = paciente.apellido2 ?? "";
        document.getElementById("genero").value = paciente.genero_id;
        document.getElementById("departamento").value = paciente.departamento_id;

        filtrarMunicipios();
        document.getElementById("municipio").value = paciente.municipio_id;

        document.getElementById("correo").value = paciente.correo;

        document.getElementById("tituloFormulario").textContent = "Editar paciente";
        document.getElementById("btnGuardar").textContent = "Actualizar paciente";
        document.getElementById("btnCancelar").classList.remove("oculto");

        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        mostrarMensaje("No se pudo cargar el paciente para editar.", "error");
    }
}

async function eliminarPaciente(id) {
    const confirmado = confirm("¿Seguro que deseas eliminar este paciente?");

    if (!confirmado) {
        return;
    }

    try {
        const respuesta = await peticionAutenticada(`${API_BASE}/paciente.php?id=${id}`, {
            method: "DELETE",
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje(resultado.error, "error");
            return;
        }

        mostrarMensaje("Paciente eliminado correctamente", "exito");
        cargarPacientes();
    } catch (error) {
        mostrarMensaje("Error al eliminar paciente.", "error");
    }
}

function cancelarEdicion() {
    idEnEdicion = null;
    document.getElementById("formPaciente").reset();
    document.getElementById("municipio").innerHTML = "<option value=''>Seleccione un departamento primero</option>";
    document.getElementById("tituloFormulario").textContent = "Registrar paciente";
    document.getElementById("btnGuardar").textContent = "Guardar paciente";
    document.getElementById("btnCancelar").classList.add("oculto");
}

function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById("mensaje");
    contenedor.textContent = texto;
    contenedor.className = `mensaje ${tipo}`;

    setTimeout(() => {
        contenedor.classList.add("oculto");
    }, 4000);
}
