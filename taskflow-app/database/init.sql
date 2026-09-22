-- Inicialización de Base de Datos para TaskFlow
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

-- Inserción de Categorías Iniciales
INSERT INTO categories (name, color) VALUES
('Desarrollo Web', '#6366f1'),
('Diseño UI/UX', '#ec4899'),
('DevOps & Docker', '#10b981'),
('Universidad', '#f59e0b')
ON CONFLICT (name) DO NOTHING;

-- Inserción de Tareas de Prueba
INSERT INTO tasks (title, description, category_id, priority, status, due_date) VALUES
('Configurar contenedor de PostgreSQL', 'Crear script de inicialización init.sql y docker-compose.yml con volúmenes persistentes.', 3, 'alta', 'completada', CURRENT_DATE),
('Diseñar interfaz gráfica moderna', 'Maquetar dashboard con CSS moderno, tarjetas interactivas y paleta elegante.', 2, 'alta', 'completada', CURRENT_DATE + INTERVAL '1 day'),
('Construir API REST con 8+ endpoints', 'Implementar endpoints de salud, métricas, CRUD de tareas y categorías en Express.', 1, 'alta', 'en_progreso', CURRENT_DATE + INTERVAL '2 days'),
('Preparar presentación de proyecto', 'Crear diapositivas y demo en vivo mostrando la integración con Docker.', 4, 'media', 'pendiente', CURRENT_DATE + INTERVAL '4 days'),
('Optimizar imágenes Docker con Alpine', 'Asegurar que los contenedores sean livianos y rápidos de levantar.', 3, 'baja', 'pendiente', CURRENT_DATE + INTERVAL '5 days')
ON CONFLICT DO NOTHING;
