# 📊 Dashboard React + TypeScript

Este proyecto es un **Dashboard administrativo moderno**, construido con tecnologías actuales y pensado para escalar de forma segura y eficiente.

Incluye:
- Manejo de **roles y permisos dinámicos** basados en los datos provenientes del backend.
- Autenticación con JWT.
- Integración completa con Ant Design, TailwindCSS y Context API.
- Arquitectura limpia y optimizada con Vite + React 19.

---

## 🚀 Tecnologías Principales

### 🖥 Frontend
- ⚛️ **React 19**
- 🟦 **TypeScript**
- 🎨 **Ant Design (UI)**
- 🎨 **TailwindCSS**
- 🌐 **Axios** (HTTP Client)
- 🧠 **Context API** (Estado global)
- ⚡ **Vite** (Empaquetado rápido)

### 🔐 Características del Dashboard
- Sistema de **inicio de sesión** con JWT.
- **Roles de usuario** cargados dinámicamente desde la base de datos.
- **Acceso a rutas condicionado** según permisos del usuario.
- Componentes reutilizables y arquitectura modular.
- Integración con servicios API centralizados.

---

## 🖥️ Backend

Este dashboard está conectado a un backend en **Spring Boot**, el cual provee autenticación, autorización y CRUDs.

📦 **Repositorio del backend:**  
👉 https://github.com/Loza64/spring-app-template.git

El backend incluye:
- 🔐 Autenticación JWT
- 👥 Gestión de Roles y Permisos desde la base de datos
- 📚 Estructura escalable por módulos
- 🛠 CRUD base listo para extender
- 📄 Documentación en `README.md`

---

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:4000
