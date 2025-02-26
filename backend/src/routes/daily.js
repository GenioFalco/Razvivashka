const express = require('express');
const router = express.Router();
const { get, all, run } = require('../db/database');

// Получить список доступных заданий на сегодня
router.get('/:userId/tasks', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Получаем ID пользователя из базы данных по guest_id
        const user = await get('SELECT id FROM users WHERE guest_id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Получаем все задания
        const allTasks = await all('SELECT * FROM daily_tasks');
        
        // Получаем выполненные сегодня задания
        const today = new Date().toISOString().split('T')[0];
        const completedTasks = await all(
            `SELECT task_id FROM completed_daily_tasks 
             WHERE user_id = ? AND date(completed_at) = ?`,
            [user.id, today]
        );

        const completedTaskIds = completedTasks.map(task => task.task_id);
        
        // Фильтруем задания, оставляя только невыполненные
        const availableTasks = allTasks
            .filter(task => !completedTaskIds.includes(task.id))
            .slice(0, 5); // Берем только 5 заданий

        res.json(availableTasks);
    } catch (error) {
        console.error('Error getting daily tasks:', error);
        res.status(500).json({ error: 'Failed to get daily tasks' });
    }
});

// Отметить задание как выполненное и получить награду
router.post('/:userId/complete/:taskId', async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        
        // Получаем пользователя
        const user = await get('SELECT id FROM users WHERE guest_id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Проверяем, не было ли задание уже выполнено сегодня
        const today = new Date().toISOString().split('T')[0];
        const alreadyCompleted = await get(
            `SELECT id FROM completed_daily_tasks 
             WHERE user_id = ? AND task_id = ? AND date(completed_at) = ?`,
            [user.id, taskId, today]
        );

        if (alreadyCompleted) {
            return res.status(400).json({ error: 'Task already completed today' });
        }

        // Получаем информацию о задании
        const task = await get('SELECT * FROM daily_tasks WHERE id = ?', [taskId]);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Начинаем транзакцию
        await run('BEGIN TRANSACTION');

        try {
            // Отмечаем задание как выполненное
            await run(
                'INSERT INTO completed_daily_tasks (user_id, task_id) VALUES (?, ?)',
                [user.id, taskId]
            );

            // Обновляем токены пользователя
            await run(
                `UPDATE user_tokens 
                 SET coins = coins + ?,
                     activity_tokens = activity_tokens + ?
                 WHERE user_id = ?`,
                [task.coins_reward, task.activity_tokens_reward, user.id]
            );

            // Обновляем XP пользователя
            await run(
                'UPDATE users SET xp = xp + ? WHERE id = ?',
                [task.xp_reward, user.id]
            );

            // Подтверждаем транзакцию
            await run('COMMIT');

            // Получаем обновленные данные пользователя
            const updatedUser = await get(
                `SELECT u.*, ut.coins, ut.activity_tokens
                 FROM users u
                 LEFT JOIN user_tokens ut ON u.id = ut.user_id
                 WHERE u.id = ?`,
                [user.id]
            );

            res.json({
                message: 'Task completed successfully',
                rewards: {
                    coins: task.coins_reward,
                    xp: task.xp_reward,
                    activity_tokens: task.activity_tokens_reward
                },
                user: updatedUser
            });
        } catch (error) {
            await run('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error completing daily task:', error);
        res.status(500).json({ error: 'Failed to complete daily task' });
    }
});

module.exports = router; 