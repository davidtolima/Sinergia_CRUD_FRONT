const API_BASE = "http://localhost:8000/api";

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("token")) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("formLogin").addEventListener("submit", iniciarSesion);
});

async function iniciarSesion(evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const respuesta = await fetch(`${API_BASE}/usuario.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensaje(resultado.error || "No se pudo iniciar sesion", "error");
            return;
        }

        localStorage.setItem("token", resultado.token);
        localStorage.setItem("usuario", JSON.stringify(resultado.usuario));

        window.location.href = "index.html";
    } catch (error) {
        mostrarMensaje("Error de conexion con el servidor.", "error");
    }
}

function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById("mensaje");
    contenedor.textContent = texto;
    contenedor.className = `mensaje ${tipo}`;
}
