const express = require('express');
const router = express.Router();
const db = require('../db');

// 7. GET /api/categories -> Listar categorías con conteo de tareas asociadas
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT c.id, c.name, c.color, c.created_at,
             COUNT(t.id)::int as total_tasks
      FROM categories c
      LEFT JOIN tasks t ON t.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const result = await db.query(sql);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({ success: false, error: 'Error al consultar categorías.' });
  }
});

// 8. POST /api/categories -> Crear una nueva categoría
router.post('/', async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, error: 'El nombre de la categoría es obligatorio.' });
    }

    const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    const categoryColor = (color && hexColorRegex.test(color)) ? color : '#6366f1';

    const sql = `
      INSERT INTO categories (name, color)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(sql, [name.trim(), categoryColor]);

    res.status(201).json({
      success: true,
      message: 'Categoría creada con éxito.',
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') { // Error de clave única en Postgres
      return res.status(409).json({ success: false, error: 'Ya existe una categoría con este nombre.' });
    }
    console.error('Error al crear categoría:', error);
    res.status(500).json({ success: false, error: 'Error al guardar la categoría.' });
  }
});

// 9. DELETE /api/categories/:id -> Eliminar una categoría
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: `Categoría con ID ${id} no encontrada.` });
    }

    res.json({
      success: true,
      message: `Categoría "${result.rows[0].name}" eliminada correctamente.`,
      deletedId: id,
    });
  } catch (error) {
    console.error(`Error al eliminar categoría ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Error al eliminar categoría.' });
  }
});

module.exports = router;
