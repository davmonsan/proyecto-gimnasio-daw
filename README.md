# PowerGym

## Instalación
1. Importar `database/powergym_app.sql` en phpMyAdmin
2. Abrir la carpeta Backend
3. Ejecutar:
   npm install
   node app.js
4. Abrir Frontend/login.html con LiveServer




# Proyecto documental despliegue de aplicaciones Web

## Introducción

Este repositorio contiene el desarrollo del proyecto intermodular del ciclo Desarrollo de Aplicaciones Web (DAW).
El objetivo es crear una aplicación web de gestión de reservas de clases para un gimnasio, permitiendo a los usuarios consultar el calendario de actividades, registrarse y realizar reservas, mientras que el administrador podrá gestionar clases, horarios y usuarios.

## Documentación

El proyecto se desarrolla utilizando Node.js con Express para el backend, MySQL como base de datos, y una interfaz diseñada previamente en Figma y hecha con HTML5 y CSS3 + JavaScript para el frontend, siguiendo la planificación y alcance definidos en la propuesta inicial del proyecto.

## Flujo de despliegue

El flujo de despliegue del proyecto sigue una arquitectura cliente-servidor.  
El código fuente se desarrolla en local utilizando Visual Studio Code y se gestiona mediante Git para el control de versiones.

### Infraestructura necesaria

Para el correcto funcionamiento del proyecto es necesaria la siguiente infraestructura:

- Un servidor con sistema operativo Linux o Windows
- Node.js instalado para ejecutar la aplicación backend
- Un servidor web (Express.js)
- Servidor de base de datos MySQL
- Navegador web para el acceso de los usuarios
- Repositorio GitHub para el control de versiones

### Servicios dependientes

El proyecto depende de los siguientes servicios:

- Servicio de base de datos MySQL para el almacenamiento de usuarios, clases y reservas
- Servicio de autenticación de usuarios
- Servidor web Express para gestionar las peticiones HTTP
- Servicio de control de versiones GitHub

### Credenciales de servicios

Las credenciales necesarias para el funcionamiento del proyecto incluyen:

- Usuario y contraseña de acceso a la base de datos MySQL
- Credenciales de administrador para el panel de gestión
- Variables de entorno para la configuración del servidor

Por motivos de seguridad, estas credenciales no se incluyen en el repositorio y se gestionan mediante variables de entorno (.env).


| NOMBRE PROYECTO           | DESCRIPCIÓN |
|---------------------------|-------------|
| Proyecto Gestión Gimnasio | [Enlace al repositorio](https://github.com/davmonsan/proyecto-gimnasio-daw/blob/main/docs/Proyecto%20PowerGym-David%20Monz%C3%B3n%20S%C3%A1nchez.pdf) |
| Documentación Servidor FTP | [Enlace al repositorio](https://github.com/davmonsan/proyecto-gimnasio-daw/blob/main/Pr%C3%A1ctica%204.1%20Tarea%201-David%20Monz%C3%B3n%20S%C3%A1nchez.pdf) |