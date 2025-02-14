const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Создаем подключение к базе данных
const db = new sqlite3.Database(
    path.join(__dirname, 'database.sqlite'),
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error('Error opening database:', err);
        } else {
            console.log('Connected to the SQLite database.');
            // Инициализируем базу данных
            initDatabase();
        }
    }
);

// Функция для инициализации базы данных
async function initDatabase() {
    try {
        // Читаем SQL файл со схемой
        const fs = require('fs');
        const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        
        // Выполняем SQL запросы
        db.exec(schemaSQL, (err) => {
            if (err) {
                console.error('Error initializing database:', err);
            } else {
                console.log('Database initialized successfully');
            }
        });
    } catch (err) {
        console.error('Error reading schema file:', err);
    }
}

// Промисифицированные версии методов базы данных
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    db,
    run,
    get,
    all
}; 