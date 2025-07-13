const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Valida el formato del correo electrónico
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Configura el transportador SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true para puerto 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Función para enviar el correo con un diseño cool y contenido gracioso
const sendWelcomeEmail = async (toEmail) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Felicidades, Afortunado!</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                background-color: #f0f4f8;
            }
            
            .container {
                max-width: 580px;
                margin: 20px auto;
                background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
                padding: 40px 20px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
                animation: shimmer 6s ease-in-out infinite;
            }
            
            @keyframes shimmer {
                0%, 100% { transform: rotate(0deg); opacity: 0.3; }
                50% { transform: rotate(360deg); opacity: 0.5; }
            }
            
            .header h1 {
                font-size: 32px;
                font-weight: 700;
                color: #ffffff;
                position: relative;
                z-index: 1;
            }
            
            .header .emoji {
                font-size: 50px;
                margin-bottom: 10px;
                display: block;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px;
                background: #ffffff;
            }
            
            .welcome-message {
                font-size: 26px;
                font-weight: 600;
                color: #ff6b6b;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .description {
                font-size: 16px;
                color: #4a5568;
                margin-bottom: 30px;
                line-height: 1.8;
                text-align: center;
            }
            
            .highlight-box {
                background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .highlight-box p {
                font-size: 15px;
                color: #713f12;
                font-weight: 500;
            }
            
            .cta-button {
                text-align: center;
                margin: 30px 0;
            }
            
            .cta-button a {
                display: inline-block;
                background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
                color: #ffffff;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .cta-button a:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
            }
            
            .footer {
                background: #f0f4f8;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            
            .footer p {
                color: #4a5568;
                font-size: 14px;
                margin-bottom: 8px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 12px;
                color: #ff6b6b;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                transition: color 0.3s ease;
            }
            
            .social-links a:hover {
                color: #ef4444;
            }
            
            .unsubscribe {
                font-size: 12px;
                color: #6b7280;
                margin-top: 15px;
            }
            
            @media only screen and (max-width: 600px) {
                .container {
                    width: 100% !important;
                    margin: 10px auto;
                }
                
                .header, .content, .footer {
                    padding: 20px !important;
                }
                
                .header h1 {
                    font-size: 24px !important;
                }
                
                .welcome-message {
                    font-size: 20px !important;
                }
                
                .highlight-box {
                    padding: 15px !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <span class="emoji">🎉</span>
                <h1>¡Felicidades, Afortunado!</h1>
            </div>
            
            <div class="content">
                <h2 class="welcome-message">¡Has sido seleccionado!</h2>
                
                <p class="description">
                    ¡Enhorabuena! Eres uno de los afortunados en probar nuestro exclusivo sistema de envío de correos. 
                    Este mensaje es tu boleto dorado para experimentar la magia de la tecnología moderna, con un toque 
                    de diversión y estilo. ¡Prepárate para quedar impresionado!
                </p>
                
                <div class="highlight-box">
                    <p>¿Listo para más? Nuestro sistema te trae mensajes rápidos, seguros y con un estilo que hará 
                    que abras tu bandeja de entrada con una sonrisa. 😎</p>
                </div>
                
                <div class="cta-button">
                    <a href="#" target="_blank">¡Prueba Otra Vez!</a>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Equipo de Pruebas Estelares</strong></p>
                <p>Enviando correos con un toque de magia ✨</p>
                
                <div class="social-links">
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                </div>
                
                <p class="unsubscribe">
                    ¿Recibiste este correo por error? No te preocupes, ignóralo o contáctanos.<br>
                    <a href="#" style="color: #ff6b6b;">Escríbenos</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Equipo de Pruebas Estelares" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: '🎉 ¡Eres uno de los afortunados!',
    html: htmlContent
  });
};

// Endpoint para enviar el correo
app.post('/send-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Correo obligatorio' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Formato de correo inválido' });
  }

  try {
    await sendWelcomeEmail(email);
    res.status(200).json({ message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));