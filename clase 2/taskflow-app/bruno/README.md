# 🐾 Colección de Bruno para TaskFlow API

Esta carpeta contiene la colección completa de **Bruno** para realizar pruebas de todos los endpoints de la API de **TaskFlow**.

---

## 🚀 Cómo Abrir la Colección en Bruno

1. Abre la aplicación **Bruno**.
2. En la pantalla principal, haz clic en **"Open Collection"** (Abrir Colección).
3. Selecciona la carpeta **`bruno`** ubicada dentro de `taskflow-app`:
   ```text
   ...\taskflow-app\bruno
   ```
4. Bruno cargará automáticamente todas las peticiones organizadas por carpetas.

---

## 🌍 Selección del Entorno (Environment)

En la esquina superior derecha de Bruno, selecciona el entorno según tu preferencia:

- **`Local`**: Apunta directamente al puerto del Backend Node.js (`http://localhost:5000`).
- **`Frontend-Proxy`**: Apunta al puerto del Frontend / Nginx (`http://localhost:3000`), el cual redirige peticiones `/api` por proxy inverso.

---

## 📑 Lista de Peticiones Incluidas

### 📂 `01 - Monitoreo y Metricas`
- **01 - Health Check**: `GET {{baseUrl}}/api/health`
- **02 - Dashboard Stats**: `GET {{baseUrl}}/api/stats`

### 📂 `02 - Tareas (CRUD)`
- **03 - Listar Todas las Tareas**: `GET {{baseUrl}}/api/tasks`
- **04 - Filtrar Tareas (Query Params)**: `GET {{baseUrl}}/api/tasks?status=pendiente&priority=alta`
- **05 - Obtener Tarea por ID**: `GET {{baseUrl}}/api/tasks/1`
- **06 - Crear Tarea (POST)**: `POST {{baseUrl}}/api/tasks`
- **07 - Actualizar Tarea Completa (PUT)**: `PUT {{baseUrl}}/api/tasks/1`
- **08 - Cambiar Estado de Tarea (PATCH)**: `PATCH {{baseUrl}}/api/tasks/1/status`
- **09 - Eliminar Tarea (DELETE)**: `DELETE {{baseUrl}}/api/tasks/5`

### 📂 `03 - Categorias`
- **10 - Listar Categorias**: `GET {{baseUrl}}/api/categories`
- **11 - Crear Categoria (POST)**: `POST {{baseUrl}}/api/categories`
- **12 - Eliminar Categoria (DELETE)**: `DELETE {{baseUrl}}/api/categories/4`

### 📂 `04 - Utilidades`
- **13 - Reiniciar y Sembrar Datos (POST)**: `POST {{baseUrl}}/api/seed`

Todas las peticiones incluyen **aserciones (`assert`) automáticas** para validar el código de respuesta HTTP (200, 201) y la estructura de datos.
