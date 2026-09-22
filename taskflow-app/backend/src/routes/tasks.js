const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. GET /api/tasks -> Obtener todas las tareas (soporta filtros: status, category_id, priority, search)
router.get('/', async (req, res) => {
  try {
    const { status, category_id, priority, search } = req.query;
    let sql = `
      SELECT t.id, t.title, t.description, t.priority, t.status, t.due_date, t.created_at, t.updated_at,
             c.id as category_id, c.name as category_name, c.color as category_color
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'todas') {
      params.push(status);
      sql += ` AND t.status = $${params.length}`;
    }
    if (category_id && category_id !== 'todas') {
      params.push(parseInt(category_id, 10));
      sql += ` AND t.category_id = $${params.length}`;
    }
    if (priority && priority !== 'todas') {
      params.push(priority);
      sql += ` AND t.priority = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (t.title ILIKE $${params.length} OR t.description ILIKE $${params.length})`;
    }

    sql += ' ORDER BY t.created_at DESC';

    const result = await db.query(sql, params);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor al consultar tareas.' });
  }
});

// 2. GET /api/tasks/:id -> Obtener una tarea por su ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT t.id, t.title, t.description, t.priority, t.status, t.due_date, t.created_at, t.updated_at,
             c.id as category_id, c.name as category_name, c.color as category_color
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1
    `;
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Tarea con ID ${id} no encontrada.` });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(`Error al obtener tarea ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Error al consultar la tarea.' });
  }
});

// 3. POST /api/tasks -> Crear una nueva tarea
router.post('/', async (req, res) => {
  try {
    const { title, description, category_id, priority, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'El campo "title" es obligatorio.' });
    }

    const validPriorities = ['baja', 'media', 'alta'];
    const assignedPriority = validPriorities.includes(priority) ? priority : 'media';

    const sql = `
      INSERT INTO tasks (title, description, category_id, priority, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      title.trim(),
      description ? description.trim() : '',
      category_id ? parseInt(category_id, 10) : null,
      assignedPriority,
      due_date || null,
    ];

    const result = await db.query(sql, values);
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ success: false, error: 'Error al registrar la tarea en base de datos.' });
  }
});

// 4. PUT /api/tasks/:id -> Actualizar completamente una tarea existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, priority, status, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'El título no puede estar vacío.' });
    }

    const validPriorities = ['baja', 'media', 'alta'];
    const validStatuses = ['pendiente', 'en_progreso', 'completada'];

    const currentTask = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (currentTask.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Tarea con ID ${id} no encontrada.` });
    }

    const assignedPriority = validPriorities.includes(priority) ? priority : currentTask.rows[0].priority;
    const assignedStatus = validStatuses.includes(status) ? status : currentTask.rows[0].status;

    const sql = `
      UPDATE tasks
      SET title = $1,
          description = $2,
          category_id = $3,
          priority = $4,
          status = $5,
          due_date = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [
      title.trim(),
      description !== undefined ? description.trim() : currentTask.rows[0].description,
      category_id ? parseInt(category_id, 10) : null,
      assignedPriority,
      assignedStatus,
      due_date || null,
      id,
    ];

    const result = await db.query(sql, values);
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(`Error al actualizar tarea ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Error al actualizar la tarea.' });
  }
});

// 5. PATCH /api/tasks/:id/status -> Modificación rápida de estado (pendiente, en_progreso, completada)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pendiente', 'en_progreso', 'completada'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`,
      });
    }

    const sql = `
      UPDATE tasks
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await db.query(sql, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Tarea con ID ${id} no encontrada.` });
    }

    res.json({
      success: true,
      message: `Estado de la tarea cambiado a '${status}'.`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(`Error al cambiar estado de tarea ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Error al modificar el estado de la tarea.' });
  }
});

// 6. DELETE /api/tasks/:id -> Eliminar una tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING id, title', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Tarea con ID ${id} no encontrada.` });
    }

    res.json({
      success: true,
      message: `Tarea "${result.rows[0].title}" (ID: ${id}) eliminada exitosamente.`,
      deletedId: id,
    });
  } catch (error) {
    console.error(`Error al eliminar tarea ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Error al eliminar la tarea.' });
  }
});

module.exports = router;
