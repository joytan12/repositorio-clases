# 🚀 TaskFlow - Fullstack App con API REST y Docker

**TaskFlow** es una aplicación fullstack moderna, visualmente atractiva y contenerizada con **Docker**, que implementa una arquitectura desacoplada con **Frontend**, **Backend API REST** y **Base de Datos PostgreSQL**.

---

## 🏛️ Arquitectura del Sistema

```text
┌─────────────────────────────────────────────────────────────┐
│                       DOCKER COMPOSE                        │
│                                                             │
│   ┌──────────────────┐               ┌──────────────────┐   │
│   │     Frontend     │               │     Backend      │   │
│   │   Nginx Alpine   │  HTTP /api/   │ Node.js Express  │   │
│   │  (Puerto :3000)  ├──────────────►│  (Puerto :5000)  │   │
│   └──────────────────┘               └────────┬─────────┘   │
│                                               │             │
│                                               │ SQL (pg)    │
│                                               ▼             │
│                                      ┌──────────────────┐   │
│                                      │    PostgreSQL    │   │
│                                      │  (Puerto :5432)  │   │
│                                      │ init.sql & seed  │   │
│                                      └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend (`:3000`)**: Single Page Application moderna con diseño glassmorphism, métricas en tiempo real, filtros dinámicos, modales interactivos y un **Explorador de API interactivo** incorporado.
- **Backend (`:5000`)**: API REST construida con Express.js, conectada a PostgreSQL mediante pool de conexiones con reintento automático y validaciones.
- **Base de Datos (`:5432`)**: PostgreSQL 16 con volumen persistente y script de inicio automático `init.sql`.

---

## 📋 Catálogo de Endpoints de la API REST (11 Endpoints)

| # | Método | Endpoint | Descripción | Parámetros / Body |
|---|---|---|---|---|
| **1** | `GET` | `/api/health` | Estado de salud del servicio y latencia de conexión con PostgreSQL | Ninguno |
| **2** | `GET` | `/api/stats` | Resumen de métricas del dashboard (totales, pendientes, completadas, categorías) | Ninguno |
| **3** | `GET` | `/api/tasks` | Listar todas las tareas registradas con datos de su categoría | `?status=...&priority=...&category_id=...&search=...` |
| **4** | `GET` | `/api/tasks/:id` | Obtener el detalle completo de una tarea específica | `:id` (en URL) |
| **5** | `POST` | `/api/tasks` | Crear una nueva tarea en la base de datos | JSON: `{ "title", "description", "category_id", "priority", "due_date" }` |
| **6** | `PUT` | `/api/tasks/:id` | Actualizar todos los campos de una tarea existente | `:id` (URL) + JSON con datos actualizados |
| **7** | `PATCH` | `/api/tasks/:id/status` | Actualización rápida del estado de una tarea | `:id` (URL) + JSON: `{ "status": "pendiente" \| "en_progreso" \| "completada" }` |
| **8** | `DELETE` | `/api/tasks/:id` | Eliminar una tarea de la base de datos | `:id` (en URL) |
| **9** | `GET` | `/api/categories` | Listar categorías junto con la cantidad de tareas asociadas | Ninguno |
| **10** | `POST` | `/api/categories` | Crear una nueva categoría con su color distintivo | JSON: `{ "name", "color" }` |
| **11** | `POST` | `/api/seed` | Restaurar/resembrar los datos demo iniciales en la base de datos | Ninguno |

---

## ⚡ Inicio Rápido con Docker

### Prerrequisitos:
- Tener **Docker Desktop** abierto y funcionando en tu equipo.

### Ejecución:

1. **Opción 1: Con el script automático (Windows)**
   Haz doble clic en el archivo `run.bat` o ejecútalo desde la consola:
   ```powershell
   .\run.bat
   ```

2. **Opción 2: Con comandos directos de Docker Compose**
   Dentro de la carpeta `taskflow-app`:
   ```bash
   docker compose up --build -d
   ```

3. **Verificación de servicios en ejecución:**
   ```bash
   docker compose ps
   ```

### 🌐 Acceso a la Aplicación:
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API REST:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Explorador Interactivo:** Dentro del Frontend, haz clic en el botón superior **"API Explorer (8+ Endpoints)"** para probar cada endpoint con un solo clic y ver la respuesta JSON formateada.

---

## 🛑 Detener los Contenedores

Para apagar los servicios:
```bash
docker compose down
```

Si deseas reiniciar la base de datos eliminando volúmenes persistentes:
```bash
docker compose down -v
```

---

## 📁 Estructura del Proyecto

```text
taskflow-app/
├── docker-compose.yml          # Orquestador multi-contenedor
├── .env                        # Variables de entorno
├── .env.example                # Plantilla de variables
├── run.bat                     # Lanzador en un clic para Windows
├── README.md                   # Documentación técnica
├── database/
│   └── init.sql                # DDL y datos semilla de PostgreSQL
├── backend/
│   ├── Dockerfile              # Imagen ligera Node.js Alpine
│   ├── package.json            # Dependencias (Express, pg, cors, morgan)
│   └── src/
│       ├── server.js           # Servidor Express y rutas principales
│       ├── db.js               # Conexión a PostgreSQL con auto-retry
│       └── routes/
│           ├── tasks.js        # Endpoints de tareas (CRUD + status)
│           └── categories.js   # Endpoints de categorías
└── frontend/
    ├── Dockerfile              # Imagen ligera Nginx Alpine
    ├── nginx.conf              # Reverse proxy hacia el backend
    └── public/
        ├── index.html          # Vista HTML5 semántica y responsiva
        ├── style.css           # Estilos modernos con glassmorphism
        └── app.js              # Lógica de cliente, fetch y explorador API
```
