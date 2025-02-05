# 🧠 Consultorio de Psicología - Backend API

Este es el backend de una aplicación para la gestión de un consultorio de psicología. La API está desarrollada con **Node.js**, **Express** y **MongoDB Compass** como base de datos local. 

## 🚀 **Tecnologías Utilizadas**
- Node.js
- Express
- MongoDB Compass (local)
- Mongoose
- Express-Session (para autenticación con sesiones)
- Nodemailer (para enviar correos de confirmación)

---

## 📂 **Estructura del Proyecto**
```
/backend
│── controllers/      # Controladores para manejar la lógica de negocio
│── middleware/       # Middlewares de autenticación y permisos
│── models/           # Modelos de datos con Mongoose
│── routes/           # Rutas del backend
│── config/           # Configuraciones generales
│── server.js         # Archivo principal para levantar el servidor
│── .env.example      # Variables de entorno necesarias
│── package.json      # Dependencias y scripts
```

---

## ✅ **Funcionalidades Implementadas**
### **🔑 Autenticación y Gestión de Usuarios**
✔ Registro de usuarios (`POST /api/users/register`)
✔ Inicio de sesión con sesiones (`POST /api/users/login`)
✔ Cierre de sesión (`POST /api/users/logout`)
✔ Obtener usuario en sesión (`GET /api/users/session`)
✔ Obtener usuario por ID (solo admin) (`GET /api/users/:id`)
✔ Modificar datos del usuario (`PUT /api/users/:id`)
✔ Modificar cualquier usuario (solo admin) (`PUT /api/users/admin/:id`)
✔ Eliminar usuario (solo admin) (`DELETE /api/users/:id`)
✔ Middleware de autenticación (`authMiddleware.js`)
✔ Middleware de permisos de admin (`adminMiddleware.js`)

---

## 📌 **Pendientes por Implementar**
### **📅 Gestión de Turnos**
🔲 Crear turnos y asignarlos a usuarios
🔲 Listar turnos disponibles
🔲 Cancelar turnos
🔲 Enviar confirmaciones de turnos por email

### **📝 Gestión de Artículos de Psicología**
🔲 Crear artículos
🔲 Listar artículos
🔲 Modificar artículos
🔲 Eliminar artículos

---

## 🚀 **Cómo Ejecutar el Proyecto**
1️⃣ Clonar el repositorio:
```bash
git clone <repo-url>
```
2️⃣ Instalar dependencias:
```bash
cd backend
npm install
```
3️⃣ Configurar variables de entorno (`.env` basado en `.env.example`)
4️⃣ Iniciar el servidor:
```bash
npm start
```

El backend correrá en **http://localhost:5000**.

---

## 💡 **Próximos Pasos**
Después de completar la funcionalidad básica, se pueden agregar mejoras como:
- Implementación de JWT para autenticación más robusta
- Integración con frontend
- Implementación en la nube con MongoDB Atlas

📌 **Siguiente tarea:** **Gestión de turnos** 📅

---

**¡seguimos avanzando! 🚀**
