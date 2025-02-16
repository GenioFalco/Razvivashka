const nodemailer = require('nodemailer');

// Проверяем наличие необходимых переменных окружения
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Missing required environment variables:');
    console.error('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
    console.error('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Missing');
    throw new Error('Missing required environment variables');
}

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

// Проверяем соединение при инициализации
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

// Генерация случайного 6-значного кода
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Отправка кода подтверждения
async function sendVerificationCode(email, code) {
    if (!email || !code) {
        console.error('Missing required parameters:', { email: !!email, code: !!code });
        return false;
    }

    try {
        console.log('Attempting to send email...');
        console.log('To:', email);
        console.log('Using email account:', process.env.EMAIL_USER);

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

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        console.log('Message ID:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        return true;
    } catch (error) {
        console.error('Error sending email:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error command:', error.command);
        console.error('Full error:', error);
        return false;
    }
}

module.exports = {
    generateVerificationCode,
    sendVerificationCode
};