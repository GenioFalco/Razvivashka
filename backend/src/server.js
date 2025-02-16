require('dotenv').config();
const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profile');
const levelsRoutes = require('./routes/levels');

// Добавляем проверку переменных окружения
console.log('Environment variables check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', '[hidden]');
console.log('BASE_URL:', process.env.BASE_URL);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/levels', levelsRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 