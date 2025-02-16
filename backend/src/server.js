require('dotenv').config();
const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profile');
const levelsRoutes = require('./routes/levels');

const app = express();
const port = process.env.PORT || 3000;

// Проверяем наличие необходимых переменных окружения
console.log('Checking environment variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Missing');
console.log('PORT:', process.env.PORT || '3000 (default)');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/levels', levelsRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body
    });
    
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 