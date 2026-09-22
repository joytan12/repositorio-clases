const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./db');
const tasksRouter = require('./routes/tasks');
const categoriesRouter = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Ruta raíz descriptiva
app.get('/', (req, res) => {
  res.json({
    name: 'TaskFlow REST API',
    version: '1.0.0',
    description: 'API REST para gestión de tareas y categorías con Docker y PostgreSQL',
    endpoints: [
      { method: 'GET', path: '/api/health', desc: 'Chequeo de salud del servicio y conexión a BD' },
      { method: 'GET', path: '/api/stats', desc: 'Resumen estadístico de tareas y métricas' },
      { method: 'GET', path: '/api/tasks', desc: 'Listar tareas (filtros: status, priority, category_id, search)' },
      { method: 'GET', path: '/api/tasks/:id', desc: 'Obtener detalle de tarea por ID' },
      { method: 'POST', path: '/api/tasks', desc: 'Crear nueva tarea' },
      { method: 'PUT', path: '/api/tasks/:id', desc: 'Actualizar tarea completa' },
      { method: 'PATCH', path: '/api/tasks/:id/status', desc: 'Actualizar sólo el estado de una tarea' },
      { method: 'DELETE', path: '/api/tasks/:id', desc: 'Eliminar una tarea' },
      { method: 'GET', path: '/api/categories', desc: 'Listar categorías y conteo de tareas' },
      { method: 'POST', path: '/api/categories', desc: 'Crear nueva categoría' },
      { method: 'DELETE', path: '/api/categories/:id', desc: 'Eliminar categoría' },
      { method: 'POST', path: '/api/seed', desc: 'Restaurar/reiniciar datos de prueba iniciales' },
    ],
  });
});

// 1. GET /api/health -> Estado del sistema y conectividad con PostgreSQL
app.get('/api/health', async (req, res) => {
  const start = Date.now();
  try {
    const dbRes = await db.query('SELECT NOW() as now, version() as version');
    const latencyMs = Date.now() - start;
    res.json({
      status: 'healthy',
      database: 'connected',
      latency: `${latencyMs}ms`,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      dbServer: dbRes.rows[0].version.split(' ')[0],
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// 2. GET /api/stats -> Métricas generales del dashboard
app.get('/api/stats', async (req, res) => {
  try {
    const totalsSql = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'pendiente')::int AS pendientes,
        COUNT(*) FILTER (WHERE status = 'en_progreso')::int AS en_progreso,
        COUNT(*) FILTER (WHERE status = 'completada')::int AS completadas,
        COUNT(*) FILTER (WHERE priority = 'alta')::int AS alta_prioridad
      FROM tasks;
    `;
    const totalsRes = await db.query(totalsSql);

    const categoriesSql = `
      SELECT c.id, c.name, c.color, COUNT(t.id)::int as count
      FROM categories c
      LEFT JOIN tasks t ON t.category_id = c.id
      GROUP BY c.id
      ORDER BY count DESC;
    `;
    const catRes = await db.query(categoriesSql);

    res.json({
      success: true,
      summary: totalsRes.rows[0],
      categoriesDistribution: catRes.rows,
    });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ success: false, error: 'Error al calcular estadísticas.' });
  }
});

// 3. POST /api/seed -> Reinicializar datos iniciales
app.post('/api/seed', async (req, res) => {
  try {
    await db.query(`
      DELETE FROM tasks;
      DELETE FROM categories;

      INSERT INTO categories (id, name, color) VALUES
      (1, 'Desarrollo Web', '#6366f1'),
      (2, 'Diseño UI/UX', '#ec4899'),
      (3, 'DevOps & Docker', '#10b981'),
      (4, 'Universidad', '#f59e0b')
      ON CONFLICT (id) DO NOTHING;

      SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

      INSERT INTO tasks (title, description, category_id, priority, status, due_date) VALUES
      ('Configurar contenedor de PostgreSQL', 'Crear script de inicialización init.sql y docker-compose.yml con volúmenes persistentes.', 3, 'alta', 'completada', CURRENT_DATE),
      ('Diseñar interfaz gráfica moderna', 'Maquetar dashboard con CSS moderno, tarjetas interactivas y paleta elegante.', 2, 'alta', 'completada', CURRENT_DATE + INTERVAL '1 day'),
      ('Construir API REST con 8+ endpoints', 'Implementar endpoints de salud, métricas, CRUD de tareas y categorías en Express.', 1, 'alta', 'en_progreso', CURRENT_DATE + INTERVAL '2 days'),
      ('Preparar presentación de proyecto', 'Crear diapositivas y demo en vivo mostrando la integración con Docker.', 4, 'media', 'pendiente', CURRENT_DATE + INTERVAL '4 days'),
      ('Optimizar imágenes Docker con Alpine', 'Asegurar que los contenedores sean livianos y rápidos de levantar.', 3, 'baja', 'pendiente', CURRENT_DATE + INTERVAL '5 days');
    `);

    res.json({ success: true, message: 'Base de datos reinicializada con datos de prueba.' });
  } catch (err) {
    console.error('Error al resembrar base de datos:', err);
    res.status(500).json({ success: false, error: 'Error al restaurar datos de prueba.' });
  }
});

// Montar enrutadores
app.use('/api/tasks', tasksRouter);
app.use('/api/categories', categoriesRouter);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    success: false,
    error: 'Ocurrió un error inesperado en el servidor.',
  });
});

// Inicializar servidor
app.listen(PORT, async () => {
  console.log(`🚀 TaskFlow Backend escuchando en http://localhost:${PORT}`);
  await db.testConnection();
});
