const express = require('express');
const router = express.Router();
const { get, all } = require('../db/database');

// Получить все уровни
router.get('/', async (req, res) => {
  try {
    const levels = await all('SELECT * FROM levels ORDER BY level ASC');
    res.json(levels);
  } catch (err) {
    console.error('Error getting levels:', err);
    res.status(500).json({ error: 'Failed to get levels' });
  }
});

// Получить требования для конкретного уровня
router.get('/:level', async (req, res) => {
  try {
    const level = await get('SELECT * FROM levels WHERE level = ?', [req.params.level]);
    if (!level) {
      return res.status(404).json({ error: 'Level not found' });
    }
    res.json(level);
  } catch (err) {
    console.error('Error getting level:', err);
    res.status(500).json({ error: 'Failed to get level' });
  }
});

module.exports = router; 