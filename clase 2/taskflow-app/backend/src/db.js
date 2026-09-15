const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'taskflow_db',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Función de consulta con logs para trazabilidad
const query = (text, params) => pool.query(text, params);

// Verificación y reintento de conexión al iniciar
async function testConnection(retries = 10, delay = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await pool.query('SELECT NOW() as now, current_database() as db');
      console.log(`✅ Conexión exitosa a PostgreSQL [${res.rows[0].db}] en ${res.rows[0].now}`);
      await ensureTables();
      return true;
    } catch (err) {
      console.warn(`⏳ [Intento ${i}/${retries}] Esperando a PostgreSQL (${err.message})...`);
      if (i < retries) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('❌ No se pudo conectar a la base de datos PostgreSQL después de múltiples intentos.');
        return false;
      }
    }
  }
}

// Asegurar que las tablas existan (por si no se montó init.sql en primera ejecución)
async function ensureTables() {
  const ddl = `
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE,
      color VARCHAR(20) DEFAULT '#6366f1',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      category_id INT REFERENCES categories(id) ON DELETE SET NULL,
      priority VARCHAR(20) DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta')),
      status VARCHAR(20) DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completada')),
      due_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(ddl);
    // Verificar si hay categorías para precargar si está vacío
    const catCheck = await pool.query('SELECT COUNT(*) FROM categories');
    if (parseInt(catCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Inicializando datos semilla en la base de datos...');
      await pool.query(`
        INSERT INTO categories (name, color) VALUES
        ('Desarrollo Web', '#6366f1'),
        ('Diseño UI/UX', '#ec4899'),
        ('DevOps & Docker', '#10b981'),
        ('Universidad', '#f59e0b');

        INSERT INTO tasks (title, description, category_id, priority, status, due_date) VALUES
        ('Configurar contenedor de PostgreSQL', 'Crear script de inicialización init.sql y docker-compose.yml con volúmenes persistentes.', 3, 'alta', 'completada', CURRENT_DATE),
        ('Diseñar interfaz gráfica moderna', 'Maquetar dashboard con CSS moderno, tarjetas interactivas y paleta elegante.', 2, 'alta', 'completada', CURRENT_DATE + INTERVAL '1 day'),
        ('Construir API REST con 8+ endpoints', 'Implementar endpoints de salud, métricas, CRUD de tareas y categorías en Express.', 1, 'alta', 'en_progreso', CURRENT_DATE + INTERVAL '2 days'),
        ('Preparar presentación de proyecto', 'Crear diapositivas y demo en vivo mostrando la integración con Docker.', 4, 'media', 'pendiente', CURRENT_DATE + INTERVAL '4 days'),
        ('Optimizar imágenes Docker con Alpine', 'Asegurar que los contenedores sean livianos y rápidos de levantar.', 3, 'baja', 'pendiente', CURRENT_DATE + INTERVAL '5 days');
      `);
      console.log('✅ Datos semilla creados.');
    }
  } catch (err) {
    console.error('Error al verificar tablas:', err.message);
  }
}

module.exports = {
  pool,
  query,
  testConnection,
};
