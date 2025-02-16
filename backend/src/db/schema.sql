-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id TEXT UNIQUE NOT NULL,  -- ID после # (например, 423)
    username TEXT NOT NULL DEFAULT 'Гость',  -- Имя пользователя (по умолчанию "Гость")
    email TEXT,  -- Email пользователя (необязательное поле)
    email_verified BOOLEAN DEFAULT 0,  -- Флаг подтверждения email
    level INTEGER NOT NULL DEFAULT 0,  -- Уровень пользователя (начинаем с 0)
    xp INTEGER NOT NULL DEFAULT 0,     -- Опыт пользователя
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица токенов пользователя
CREATE TABLE IF NOT EXISTS user_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    coins INTEGER NOT NULL DEFAULT 0,           -- Монеты
    trophy_tokens INTEGER NOT NULL DEFAULT 0,   -- Трофеи (конвертики)
    creativity_tokens INTEGER NOT NULL DEFAULT 0,  -- Жетоны творчества (для прокачки креативности)
    intelligence_tokens INTEGER NOT NULL DEFAULT 0, -- Жетоны интеллекта
    wit_tokens INTEGER NOT NULL DEFAULT 0,         -- Жетоны остроумия
    energy_tokens INTEGER NOT NULL DEFAULT 0,      -- Жетоны энергичности
    focus_tokens INTEGER NOT NULL DEFAULT 0,       -- Жетоны фокусировки
    articulation_tokens INTEGER NOT NULL DEFAULT 0, -- Жетоны артикуляции
    activity_tokens INTEGER NOT NULL DEFAULT 0,    -- Жетоны ежедневных заданий
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Таблица персонажей
CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image_data BLOB NOT NULL,  -- Бинарные данные изображения
    image_type TEXT NOT NULL,  -- Тип изображения (например, 'image/png')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица связи пользователей и персонажей
CREATE TABLE IF NOT EXISTS user_characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    character_id INTEGER,
    level INTEGER NOT NULL DEFAULT 0,  -- Общий уровень персонажа
    is_active INTEGER DEFAULT 0,  -- Текущий выбранный персонаж (0 или 1)
    creativity_level INTEGER NOT NULL DEFAULT 0,    -- Уровень креативности
    intelligence_level INTEGER NOT NULL DEFAULT 0,   -- Уровень интеллекта
    wit_level INTEGER NOT NULL DEFAULT 0,           -- Уровень остроумия
    energy_level INTEGER NOT NULL DEFAULT 0,        -- Уровень энергичности
    focus_level INTEGER NOT NULL DEFAULT 0,         -- Уровень фокусировки
    articulation_level INTEGER NOT NULL DEFAULT 0,  -- Уровень артикуляции
    activity_level INTEGER NOT NULL DEFAULT 0,      -- Уровень активности
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (character_id) REFERENCES characters(id),
    UNIQUE(user_id, character_id)
);

-- Таблица параметров персонажа
CREATE TABLE IF NOT EXISTS character_parameters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_character_id INTEGER,
    parameter_name TEXT NOT NULL,  -- Название параметра (креативность, интеллект и т.д.)
    level INTEGER NOT NULL DEFAULT 1,  -- Уровень параметра
    progress INTEGER NOT NULL DEFAULT 0,  -- Текущий прогресс
    max_progress INTEGER NOT NULL DEFAULT 5,  -- Максимальный прогресс для уровня
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_character_id) REFERENCES user_characters(id)
);

-- Таблица уровней
CREATE TABLE IF NOT EXISTS levels (
    level INTEGER PRIMARY KEY,
    exp_required INTEGER NOT NULL,  -- Требуемый опыт для перехода на следующий уровень
    coins INTEGER NOT NULL,         -- Награда монетами за достижение уровня
    trophy_tokens INTEGER NOT NULL, -- Награда конвертиками за достижение уровня
    id_character INTEGER,          -- ID персонажа, который разблокируется на этом уровне (может быть NULL)
    FOREIGN KEY (id_character) REFERENCES characters(id)
);

-- Добавляем начальные уровни
INSERT OR IGNORE INTO levels (level, exp_required, coins, trophy_tokens, id_character) VALUES
    (0, 0, 0, 0, NULL),      -- Стартовый уровень
    (1, 100, 50, 2, NULL),   -- Первый уровень
    (2, 250, 75, 3, NULL),   -- Второй уровень
    (3, 500, 100, 5, NULL),  -- Третий уровень
    (4, 1000, 150, 7, NULL), -- Четвертый уровень
    (5, 2000, 200, 10, NULL); -- Пятый уровень

-- Таблица уровней персонажа
CREATE TABLE IF NOT EXISTS character_levels (
    level INTEGER PRIMARY KEY,
    max_parameter_value INTEGER NOT NULL  -- Максимальное значение параметров для этого уровня
);

-- Добавляем начальные уровни персонажа
INSERT OR IGNORE INTO character_levels (level, max_parameter_value) VALUES
    (1, 5),    -- Первый уровень
    (2, 8),    -- Второй уровень
    (3, 11),   -- Третий уровень
    (4, 14),   -- Четвертый уровень
    (5, 17),   -- Пятый уровень
    (6, 20),   -- Шестой уровень
    (7, 23),   -- Седьмой уровень
    (8, 26),   -- Восьмой уровень
    (9, 30),   -- Девятый уровень
    (10, 35);  -- Десятый уровень

-- Вставка базового персонажа с изображением по умолчанию
INSERT OR IGNORE INTO characters (id, name, image_data, image_type) 
VALUES (1, 'Default Character', 
'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', 
'image/png'); 