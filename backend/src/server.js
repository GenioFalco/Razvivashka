require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const profileRoutes = require('./routes/profile');
const levelsRoutes = require('./routes/levels');
const dailyRoutes = require('./routes/daily');

// Создаем папку для логов, если её нет
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Создаем поток для записи логов
const logStream = fs.createWriteStream(path.join(logsDir, 'server.log'), { flags: 'a' });

// Функция для логирования
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage);
    logStream.write(logMessage);
}

const app = express();
const port = process.env.PORT || 3000;

// Проверяем наличие необходимых переменных окружения
log('Starting server...');
log('Environment variables:');
log(`EMAIL_USER: ${process.env.EMAIL_USER || 'Not set'}`);
log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? 'Set' : 'Not set'}`);
log(`PORT: ${process.env.PORT || '3000 (default)'}`);

// Middleware для логирования запросов
app.use((req, res, next) => {
    log(`Incoming ${req.method} request to ${req.url}`);
    log(`Request body: ${JSON.stringify(req.body)}`);
    next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/daily', dailyRoutes);

// Error handling
app.use((err, req, res, next) => {
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body
    };
    
    log(`Error occurred: ${JSON.stringify(errorDetails, null, 2)}`);
    
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}\n${error.stack}`);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}\nReason: ${reason}`);
});

app.listen(port, () => {
    log(`Server is running on port ${port}`);
}); 