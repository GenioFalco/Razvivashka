const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Создаем папку для логов, если её нет
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Создаем поток для записи логов
const logStream = fs.createWriteStream(path.join(logsDir, 'email.log'), { flags: 'a' });

// Функция для логирования
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage);
    logStream.write(logMessage);
}

// Создаем транспорт для отправки почты
log('Creating SMTP transport with settings:');
log(`Host: smtp.mail.ru`);
log(`Port: 465`);
log(`Secure: true`);
log(`User: ${process.env.EMAIL_USER}`);

const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: true, // Включаем отладку
    logger: true  // Включаем логирование
});

// Проверяем соединение при запуске
transporter.verify(function(error, success) {
    if (error) {
        log('SMTP connection error:');
        log(JSON.stringify(error, null, 2));
        log('SMTP settings:');
        log(JSON.stringify({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            user: process.env.EMAIL_USER
        }, null, 2));
    } else {
        log('SMTP server is ready to take our messages');
    }
});

// Генерация случайного 6-значного кода
function generateVerificationCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    log(`Generated verification code: ${code}`);
    return code;
}

// Отправка кода подтверждения
async function sendVerificationCode(email, code) {
    try {
        log(`Preparing to send email to: ${email}`);
        log(`Using verification code: ${code}`);

        const mailOptions = {
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
        };

        log('Sending email with options:');
        log(JSON.stringify(mailOptions, null, 2));

        const info = await transporter.sendMail(mailOptions);
        log('Email sent successfully:');
        log(JSON.stringify(info, null, 2));
        return true;
    } catch (error) {
        log('Error sending email:');
        log(JSON.stringify({
            name: error.name,
            message: error.message,
            code: error.code,
            command: error.command,
            stack: error.stack
        }, null, 2));
        throw error;
    }
}

module.exports = {
    generateVerificationCode,
    sendVerificationCode
}; 