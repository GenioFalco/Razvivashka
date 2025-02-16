const express = require('express');
const router = express.Router();
const { get, run, all } = require('../db/database');
const { generateVerificationCode, sendVerificationCode } = require('../services/emailService');

// Конфигурация для URL
const BASE_URL = process.env.BASE_URL || 'https://your-domain.com';

// Хранилище кодов подтверждения (в реальном приложении лучше использовать Redis)
const verificationCodes = new Map();

// Получение профиля пользователя
router.get('/:guestId', async (req, res) => {
    try {
        const { guestId } = req.params;

        // Получаем данные пользователя
        const user = await get(`
            SELECT id, guest_id, username, level, xp
            FROM users 
            WHERE guest_id = ?`,
            [guestId]
        );

        if (!user) {
            // Создаем нового пользователя
            const { id: userId } = await run(`
                INSERT INTO users (guest_id, username, level, xp)
                VALUES (?, ?, 0, 0)`,
                [guestId, `User#${guestId}`]
            );

            // Создаем запись токенов для нового пользователя
            await run(`
                INSERT INTO user_tokens (
                    user_id, coins, trophy_tokens,
                    creativity_tokens, intelligence_tokens, wit_tokens,
                    energy_tokens, focus_tokens, articulation_tokens,
                    activity_tokens
                ) VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0, 0)`,
                [userId]
            );

            // Получаем созданного пользователя
            const newUser = await get(`
                SELECT u.id, u.guest_id, u.username, u.level, u.xp,
                       t.coins, t.trophy_tokens,
                       t.creativity_tokens, t.intelligence_tokens, t.wit_tokens,
                       t.energy_tokens, t.focus_tokens, t.articulation_tokens,
                       t.activity_tokens
                FROM users u
                JOIN user_tokens t ON u.id = t.user_id
                WHERE u.guest_id = ?`,
                [guestId]
            );

            // Добавляем базового персонажа для нового пользователя
            await run(`
                INSERT INTO user_characters (
                    user_id, character_id, is_active, level,
                    creativity_level, intelligence_level, wit_level,
                    energy_level, focus_level, articulation_level,
                    activity_level
                ) VALUES (?, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0)`,
                [newUser.id]
            );

            // Получаем данные базового персонажа
            const defaultCharacter = await get(`
                SELECT c.id, c.name,
                       uc.level, uc.creativity_level, uc.intelligence_level,
                       uc.wit_level, uc.energy_level, uc.focus_level,
                       uc.articulation_level, uc.activity_level
                FROM characters c
                JOIN user_characters uc ON c.id = uc.character_id
                WHERE c.id = 1 AND uc.user_id = ?`,
                [newUser.id]
            );

            return res.json({
                user: {
                    ...newUser,
                    tokens: {
                        coins: newUser.coins,
                        trophy: newUser.trophy_tokens,
                        daily: newUser.activity_tokens,
                        creativity: newUser.creativity_tokens,
                        intelligence: newUser.intelligence_tokens,
                        wit: newUser.wit_tokens,
                        energy: newUser.energy_tokens,
                        focus: newUser.focus_tokens,
                        articulation: newUser.articulation_tokens
                    }
                },
                character: defaultCharacter ? {
                    ...defaultCharacter,
                    image_url: `${BASE_URL}/api/profile/character/${defaultCharacter.id}/image`
                } : null
            });
        }

        // Получаем токены пользователя
        const tokens = await get(`
            SELECT coins, trophy_tokens,
                   creativity_tokens, intelligence_tokens, wit_tokens,
                   energy_tokens, focus_tokens, articulation_tokens,
                   activity_tokens
            FROM user_tokens
            WHERE user_id = ?`,
            [user.id]
        );

        // Получаем активного персонажа пользователя
        const activeCharacter = await get(`
            SELECT c.id, c.name,
                   uc.level, uc.creativity_level, uc.intelligence_level,
                   uc.wit_level, uc.energy_level, uc.focus_level,
                   uc.articulation_level, uc.activity_level
            FROM characters c
            JOIN user_characters uc ON c.id = uc.character_id
            WHERE uc.user_id = ? AND uc.is_active = 1`,
            [user.id]
        );

        const characterData = activeCharacter ? {
            ...activeCharacter,
            image_url: `${BASE_URL}/api/profile/character/${activeCharacter.id}/image`
        } : null;

        res.json({
            user: {
                ...user,
                tokens: {
                    coins: tokens.coins,
                    trophy: tokens.trophy_tokens,
                    daily: tokens.activity_tokens,
                    creativity: tokens.creativity_tokens,
                    intelligence: tokens.intelligence_tokens,
                    wit: tokens.wit_tokens,
                    energy: tokens.energy_tokens,
                    focus: tokens.focus_tokens,
                    articulation: tokens.articulation_tokens
                }
            },
            character: characterData
        });
    } catch (error) {
        console.error('Error in profile route:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Обновление имени пользователя
router.put('/:guestId/username', async (req, res) => {
    try {
        const { guestId } = req.params;
        const { username } = req.body;

        // Проверяем формат имени
        if (!username || username.length < 2 || username.length > 50) {
            return res.status(400).json({ error: 'Invalid username' });
        }

        await run(
            'UPDATE users SET username = ? WHERE guest_id = ?',
            [`${username}#${guestId}`, guestId]
        );

        // Получаем обновленного пользователя с токенами
        const updatedUser = await get(`
            SELECT u.id, u.guest_id, u.username, u.level, u.xp,
                   t.coins, t.trophy_tokens,
                   t.creativity_tokens, t.intelligence_tokens, t.wit_tokens,
                   t.energy_tokens, t.focus_tokens, t.articulation_tokens,
                   t.activity_tokens
            FROM users u
            JOIN user_tokens t ON u.id = t.user_id
            WHERE u.guest_id = ?`,
            [guestId]
        );

        res.json({
            ...updatedUser,
            tokens: {
                coins: updatedUser.coins,
                trophy: updatedUser.trophy_tokens,
                daily: updatedUser.activity_tokens,
                creativity: updatedUser.creativity_tokens,
                intelligence: updatedUser.intelligence_tokens,
                wit: updatedUser.wit_tokens,
                energy: updatedUser.energy_tokens,
                focus: updatedUser.focus_tokens,
                articulation: updatedUser.articulation_tokens
            }
        });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Получение списка персонажей пользователя
router.get('/:guestId/characters', async (req, res) => {
    try {
        const { guestId } = req.params;
        console.log('Getting characters for guestId:', guestId);
        
        const user = await get(
            'SELECT id FROM users WHERE guest_id = ?',
            [guestId]
        );
        console.log('Found user:', user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Получаем персонажей без бинарных данных
        const characters = await all(`
            SELECT c.id, c.name, uc.is_active, uc.level as character_level 
            FROM characters c
            JOIN user_characters uc ON c.id = uc.character_id
            WHERE uc.user_id = ?`,
            [user.id]
        );
        console.log('Found characters:', characters);

        res.json({ characters });
    } catch (error) {
        console.error('Error in characters route:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Обновление активного персонажа
router.put('/:guestId/character', async (req, res) => {
    try {
        const { guestId } = req.params;
        const { characterId } = req.body;

        // Получаем id пользователя
        const user = await get(
            'SELECT id FROM users WHERE guest_id = ?',
            [guestId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Проверяем существование персонажа
        const character = await get(
            'SELECT id FROM characters WHERE id = ?',
            [characterId]
        );

        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }

        // Сначала деактивируем всех персонажей пользователя
        await run(
            'UPDATE user_characters SET is_active = 0 WHERE user_id = ?',
            [user.id]
        );

        // Активируем выбранного персонажа
        await run(
            'UPDATE user_characters SET is_active = 1 WHERE user_id = ? AND character_id = ?',
            [user.id, character.id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating character:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Получение изображения персонажа
router.get('/character/:characterId/image', async (req, res) => {
    try {
        const { characterId } = req.params;
        console.log('Getting image for character:', characterId);
        
        const character = await get(
            'SELECT image_data, image_type FROM characters WHERE id = ?',
            [characterId]
        );
        console.log('Found character:', character ? 'yes' : 'no', 'Image type:', character?.image_type);

        if (!character) {
            console.log('Character not found');
            return res.status(404).json({ error: 'Character not found' });
        }

        if (!character.image_data) {
            console.log('No image data found');
            return res.status(404).json({ error: 'No image data found' });
        }

        console.log('Sending image with type:', character.image_type);
        res.setHeader('Content-Type', character.image_type);
        res.send(character.image_data);
    } catch (error) {
        console.error('Error getting character image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Добавление опыта и обработка повышения уровня
router.post('/:guestId/xp', async (req, res) => {
    try {
        const { guestId } = req.params;
        const { amount } = req.body;

        // Получаем текущего пользователя
        const user = await get(`
            SELECT u.id, u.guest_id, u.username, u.level, u.xp,
                   t.coins, t.trophy_tokens
            FROM users u
            JOIN user_tokens t ON u.id = t.user_id
            WHERE u.guest_id = ?`,
            [guestId]
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Добавляем опыт
        const newXP = user.xp + amount;
        
        // Проверяем, достиг ли пользователь нового уровня
        const nextLevel = await get(`
            SELECT level, exp_required, coins, trophy_tokens, id_character
            FROM levels
            WHERE exp_required <= ?
            ORDER BY level DESC
            LIMIT 1`,
            [newXP]
        );

        let rewards = null;
        
        // Если достигнут новый уровень
        if (nextLevel && nextLevel.level > user.level) {
            // Обновляем уровень и награды пользователя
            await run(`
                UPDATE users 
                SET level = ?, xp = ?
                WHERE id = ?`,
                [nextLevel.level, newXP, user.id]
            );

            // Добавляем награды за уровень
            await run(`
                UPDATE user_tokens
                SET coins = coins + ?,
                    trophy_tokens = trophy_tokens + ?
                WHERE user_id = ?`,
                [nextLevel.coins, nextLevel.trophy_tokens, user.id]
            );

            // Если есть персонаж для разблокировки
            if (nextLevel.id_character) {
                await run(`
                    INSERT OR IGNORE INTO user_characters (
                        user_id, character_id, is_active,
                        creativity_level, intelligence_level, wit_level,
                        energy_level, focus_level, articulation_level,
                        activity_level
                    ) VALUES (?, ?, 0, 1, 1, 1, 1, 1, 1, 1)`,
                    [user.id, nextLevel.id_character]
                );
            }

            rewards = {
                coins: nextLevel.coins,
                trophy_tokens: nextLevel.trophy_tokens,
                character: nextLevel.id_character ? true : false
            };
        } else {
            // Просто обновляем XP
            await run(`
                UPDATE users 
                SET xp = ?
                WHERE id = ?`,
                [newXP, user.id]
            );
        }

        // Получаем обновленные данные пользователя
        const updatedUser = await get(`
            SELECT u.id, u.guest_id, u.username, u.level, u.xp,
                   t.coins, t.trophy_tokens,
                   t.creativity_tokens, t.intelligence_tokens, t.wit_tokens,
                   t.energy_tokens, t.focus_tokens, t.articulation_tokens,
                   t.activity_tokens
            FROM users u
            JOIN user_tokens t ON u.id = t.user_id
            WHERE u.guest_id = ?`,
            [guestId]
        );

        res.json({
            user: {
                ...updatedUser,
                tokens: {
                    coins: updatedUser.coins,
                    trophy: updatedUser.trophy_tokens,
                    daily: updatedUser.activity_tokens,
                    creativity: updatedUser.creativity_tokens,
                    intelligence: updatedUser.intelligence_tokens,
                    wit: updatedUser.wit_tokens,
                    energy: updatedUser.energy_tokens,
                    focus: updatedUser.focus_tokens,
                    articulation: updatedUser.articulation_tokens
                }
            },
            rewards
        });
    } catch (error) {
        console.error('Error adding XP:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Повышение уровня персонажа
router.post('/:guestId/character/:characterId/level-up', async (req, res) => {
    try {
        const { guestId, characterId } = req.params;

        // Получаем пользователя
        const user = await get('SELECT id FROM users WHERE guest_id = ?', [guestId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Получаем персонажа и его текущий уровень
        const userCharacter = await get(`
            SELECT uc.*, COALESCE(cl.max_parameter_value, 5) as max_parameter_value
            FROM user_characters uc
            LEFT JOIN character_levels cl ON uc.level = cl.level
            WHERE uc.user_id = ? AND uc.character_id = ? AND uc.is_active = 1`,
            [user.id, characterId]
        );

        if (!userCharacter) {
            return res.status(404).json({ error: 'Character not found' });
        }

        // Проверяем, что все параметры достигли максимума
        const parameters = [
            'creativity', 'intelligence', 'wit', 'energy',
            'focus', 'articulation', 'activity'
        ];

        for (const param of parameters) {
            if (userCharacter[`${param}_level`] < userCharacter.max_parameter_value) {
                return res.status(400).json({ 
                    error: 'Not all parameters have reached maximum level' 
                });
            }
        }

        // Проверяем, что персонаж не достиг максимального уровня (10)
        if (userCharacter.level >= 10) {
            return res.status(400).json({ error: 'Character already at maximum level' });
        }

        // Повышаем уровень и сбрасываем параметры
        await run(`
            UPDATE user_characters 
            SET level = level + 1,
                creativity_level = 1,
                intelligence_level = 1,
                wit_level = 1,
                energy_level = 1,
                focus_level = 1,
                articulation_level = 1,
                activity_level = 1
            WHERE user_id = ? AND character_id = ?`,
            [user.id, characterId]
        );

        // Получаем обновленные данные
        const updatedCharacter = await get(`
            SELECT c.id, c.name,
                   uc.level, uc.creativity_level, uc.intelligence_level,
                   uc.wit_level, uc.energy_level, uc.focus_level,
                   uc.articulation_level, uc.activity_level,
                   cl.max_parameter_value
            FROM characters c
            JOIN user_characters uc ON c.id = uc.character_id
            JOIN character_levels cl ON uc.level = cl.level
            WHERE c.id = ? AND uc.user_id = ? AND uc.is_active = 1`,
            [characterId, user.id]
        );

        res.json({ character: updatedCharacter });

    } catch (error) {
        console.error('Error leveling up character:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Прокачка параметра персонажа
router.post('/:guestId/character/:characterId/upgrade', async (req, res) => {
    try {
        const { guestId, characterId } = req.params;
        const { parameter } = req.body;
        
        console.log('Upgrade request:', { guestId, characterId, parameter });

        // Получаем пользователя
        const user = await get('SELECT id FROM users WHERE guest_id = ?', [guestId]);
        console.log('Found user:', user);
        
        if (!user) {
            console.log('User not found for guestId:', guestId);
            return res.status(404).json({ error: 'User not found' });
        }

        // Получаем персонажа и его текущий уровень
        const userCharacter = await get(`
            SELECT uc.*, COALESCE(cl.max_parameter_value, 5) as max_parameter_value
            FROM user_characters uc
            LEFT JOIN character_levels cl ON (uc.level + 1) = cl.level
            WHERE uc.user_id = ? AND uc.character_id = ? AND uc.is_active = 1`,
            [user.id, characterId]
        );
        console.log('Found character:', userCharacter);

        // Если персонаж не найден, проверяем существует ли он вообще
        if (!userCharacter) {
            const anyCharacter = await get(`
                SELECT * FROM user_characters 
                WHERE user_id = ? AND character_id = ?`,
                [user.id, characterId]
            );
            console.log('Found any character:', anyCharacter);

            if (!anyCharacter) {
                console.log('No character found at all');
                // Создаем базового персонажа
                await run(`
                    INSERT INTO user_characters (
                        user_id, character_id, is_active, level,
                        creativity_level, intelligence_level, wit_level,
                        energy_level, focus_level, articulation_level,
                        activity_level
                    ) VALUES (?, ?, 1, 0, 0, 0, 0, 0, 0, 0, 0)`,
                    [user.id, characterId]
                );
                
                // Получаем созданного персонажа
                const newCharacter = await get(`
                    SELECT uc.*, COALESCE(cl.max_parameter_value, 5) as max_parameter_value
                    FROM user_characters uc
                    LEFT JOIN character_levels cl ON (uc.level + 1) = cl.level
                    WHERE uc.user_id = ? AND uc.character_id = ? AND uc.is_active = 1`,
                    [user.id, characterId]
                );
                console.log('Created new character:', newCharacter);
                return res.status(201).json({ message: 'Character created, please try upgrading again' });
            } else {
                console.log('Character exists but not active');
                // Активируем существующего персонажа
                await run(`
                    UPDATE user_characters 
                    SET is_active = 1 
                    WHERE user_id = ? AND character_id = ?`,
                    [user.id, characterId]
                );
                return res.status(200).json({ message: 'Character activated, please try upgrading again' });
            }
        }

        // Проверяем, что параметр не достиг максимума для следующего уровня
        const currentValue = userCharacter[`${parameter}_level`];
        if (currentValue >= userCharacter.max_parameter_value) {
            return res.status(400).json({ error: 'Parameter already at maximum level' });
        }

        // Проверяем наличие токенов
        const tokens = await get('SELECT * FROM user_tokens WHERE user_id = ?', [user.id]);
        const tokenField = parameter === 'activity' ? 'activity_tokens' : `${parameter}_tokens`;
        
        if (tokens[tokenField] < 1) {
            return res.status(400).json({ error: 'Not enough tokens' });
        }

        // Повышаем уровень параметра и списываем токен
        await run(`
            UPDATE user_characters 
            SET ${parameter}_level = ${parameter}_level + 1
            WHERE user_id = ? AND character_id = ? AND is_active = 1`,
            [user.id, characterId]
        );

        await run(`
            UPDATE user_tokens
            SET ${tokenField} = ${tokenField} - 1
            WHERE user_id = ?`,
            [user.id]
        );

        // Получаем обновленные данные
        const updatedCharacter = await get(`
            SELECT c.id, c.name,
                   uc.level, uc.creativity_level, uc.intelligence_level,
                   uc.wit_level, uc.energy_level, uc.focus_level,
                   uc.articulation_level, uc.activity_level,
                   COALESCE(cl.max_parameter_value, 5) as max_parameter_value
            FROM characters c
            JOIN user_characters uc ON c.id = uc.character_id
            LEFT JOIN character_levels cl ON (uc.level + 1) = cl.level
            WHERE c.id = ? AND uc.user_id = ? AND uc.is_active = 1`,
            [characterId, user.id]
        );

        const updatedTokens = await get('SELECT * FROM user_tokens WHERE user_id = ?', [user.id]);

        res.json({
            character: updatedCharacter,
            tokens: {
                creativity: updatedTokens.creativity_tokens,
                intelligence: updatedTokens.intelligence_tokens,
                wit: updatedTokens.wit_tokens,
                energy: updatedTokens.energy_tokens,
                focus: updatedTokens.focus_tokens,
                articulation: updatedTokens.articulation_tokens,
                daily: updatedTokens.activity_tokens
            }
        });

    } catch (error) {
        console.error('Error upgrading character parameter:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Создание персонажа для пользователя
router.post('/:guestId/character', async (req, res) => {
    try {
        const { guestId } = req.params;
        const { characterId } = req.body;

        // Получаем пользователя
        const user = await get('SELECT id FROM users WHERE guest_id = ?', [guestId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Создаем персонажа для пользователя
        await run(`
            INSERT INTO user_characters (
                user_id, character_id, is_active,
                creativity_level, intelligence_level, wit_level,
                energy_level, focus_level, articulation_level,
                activity_level
            ) VALUES (?, ?, 1, 1, 1, 1, 1, 1, 1, 1)`,
            [user.id, characterId]
        );

        // Получаем созданного персонажа
        const character = await get(`
            SELECT c.id, c.name,
                   uc.level, uc.creativity_level, uc.intelligence_level,
                   uc.wit_level, uc.energy_level, uc.focus_level,
                   uc.articulation_level, uc.activity_level,
                   cl.max_parameter_value
            FROM characters c
            JOIN user_characters uc ON c.id = uc.character_id
            JOIN character_levels cl ON uc.level = cl.level
            WHERE c.id = ? AND uc.user_id = ?`,
            [characterId, user.id]
        );

        res.json({ character });
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Отправка кода подтверждения email
router.post('/verify-email', async (req, res) => {
    try {
        const { email } = req.body;
        const code = generateVerificationCode();
        
        // Сохраняем код в Map с временем жизни 10 минут
        verificationCodes.set(email, {
            code,
            expires: Date.now() + 600000 // 10 минут
        });
        
        // Отправляем код на email
        const sent = await sendVerificationCode(email, code);
        
        if (sent) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Failed to send verification code' });
        }
    } catch (err) {
        console.error('Error sending verification code:', err);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
});

// Подтверждение email
router.post('/confirm-email', async (req, res) => {
    try {
        const { email, code, guestId } = req.body;
        
        // Проверяем код
        const storedData = verificationCodes.get(email);
        if (!storedData || storedData.code !== code || Date.now() > storedData.expires) {
            return res.json({ success: false, error: 'Invalid or expired code' });
        }
        
        // Обновляем email в базе данных
        await run(
            'UPDATE users SET email = ?, email_verified = 1 WHERE guest_id = ?',
            [email, guestId]
        );
        
        // Удаляем использованный код
        verificationCodes.delete(email);
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error confirming email:', err);
        res.status(500).json({ error: 'Failed to confirm email' });
    }
});

module.exports = router; 