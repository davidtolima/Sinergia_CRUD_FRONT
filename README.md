# Sinergia_CRUD_FRONT

Interfaz web en HTML, CSS y JavaScript plano para la gestion de pacientes de la Clinica Tolima. Consume la API REST de [Sinergia_CRUD_BACK](https://github.com/davidtolima/Sinergia_CRUD_BACK) mediante `fetch`.

## Requisitos

- PHP 8.0 o superior (solo para levantar un servidor local, no ejecuta logica de backend)
- El backend [Sinergia_CRUD_BACK](https://github.com/davidtolima/Sinergia_CRUD_BACK) corriendo en `http://localhost:8000`

## Instalacion

### 1. Levantar el backend primero

Sigue las instrucciones del repositorio [Sinergia_CRUD_BACK](https://github.com/davidtolima/Sinergia_CRUD_BACK) (base de datos + `php -S localhost:8000`).

### 2. Levantar este frontend

```bash
php -S localhost:5500
```

Debe ser exactamente el puerto **5500**: el backend tiene configurado `Access-Control-Allow-Origin: http://localhost:5500` para permitir las peticiones desde aqui. Si usas otro puerto, tendras que ajustar esa cabecera en `Sinergia_CRUD_BACK/api/paciente.php`, `api/catalogos.php` y `api/usuario.php`.

### 3. Abrir en el navegador

```
http://localhost:5500
```

Como el sistema requiere inicio de sesion, se abre automaticamente en `login.html` si no hay una sesion activa.

## Inicio de sesion

Usa el usuario administrador de prueba del backend:

| Campo | Valor |
|---|---|
| Correo | admin@sihos.com |
| Contrasena | 1234567890 |

Al iniciar sesion, el token JWT se guarda en `localStorage` y se envia automaticamente en cada peticion al backend. El boton "Cerrar sesion" lo elimina y devuelve al login.

## Funcionalidades

- Login con JWT, con proteccion de la pagina principal (redirige a `login.html` si no hay sesion).
- Listado de pacientes en tabla, con datos de departamento/municipio/genero/tipo de documento ya resueltos.
- Formulario de registro con validacion de campos obligatorios y formato de correo.
- Combo de Municipio filtrado dinamicamente segun el Departamento seleccionado.
- Edicion de pacientes (el formulario se precarga con los datos existentes).
- Eliminacion de pacientes con confirmacion previa.
- Mensajes de exito/error mostrados en pantalla segun la respuesta de la API.
- Cierre de sesion automatico si el token expira o es invalido (respuesta 401 del backend).

## Estructura del proyecto

```
index.html            -> Formulario + tabla de pacientes (requiere sesion)
login.html             -> Formulario de inicio de sesion
css/style.css           -> Estilos
js/app.js                -> Logica del CRUD: consumo de la API y manipulacion del DOM
js/login.js               -> Logica de inicio de sesion
assets/icon/favicon.png    -> Icono de la pestana del navegador
```
