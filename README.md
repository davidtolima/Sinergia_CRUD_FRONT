# Sinergia_CRUD_FRONT

Interfaz web en HTML, CSS y JavaScript plano para la gestion de pacientes del sistema SIHOS. Consume la API REST de [Sinergia_CRUD_BACK](https://github.com/davidtolima/Sinergia_CRUD_BACK) mediante `fetch`.

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

Debe ser exactamente el puerto **5500**: el backend tiene configurado `Access-Control-Allow-Origin: http://localhost:5500` para permitir las peticiones desde aqui. Si usas otro puerto, tendras que ajustar esa cabecera en `Sinergia_CRUD_BACK/api/paciente.php` y `api/catalogos.php`.

### 3. Abrir en el navegador

```
http://localhost:5500
```

## Funcionalidades

- Listado de pacientes en tabla, con datos de departamento/municipio/genero/tipo de documento ya resueltos.
- Formulario de registro con validacion de campos obligatorios y formato de correo.
- Combo de Municipio filtrado dinamicamente segun el Departamento seleccionado.
- Edicion de pacientes (el formulario se precarga con los datos existentes).
- Eliminacion de pacientes con confirmacion previa.
- Mensajes de exito/error mostrados en pantalla segun la respuesta de la API.

## Estructura del proyecto

```
index.html      -> Formulario + tabla de pacientes
css/style.css    -> Estilos
js/app.js        -> Logica de consumo de la API (fetch) y manipulacion del DOM
```
