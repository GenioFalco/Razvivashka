const nodemailer = require('nodemailer');

// Создаем транспорт для отправки почты
const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Генерация случайного 6-значного кода
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Отправка кода подтверждения
async function sendVerificationCode(email, code) {
    try {
        const info = await transporter.sendMail({
            from: `"Razvivashka" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Код подтверждения",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4a90e2;">Подтверждение email в приложении Razvivashka</h2>
                    <p>Ваш код подтверждения:</p>
                    <h1 style="color: #003f7f; font-size: 32px; letter-spacing: 5px;">${code}</h1>
                    <p>Код действителен в течение 10 минут.</p>
                    <p>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
                </div>
            `
        });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

module.exports = {
    generateVerificationCode,
    sendVerificationCode
}; 