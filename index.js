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

// Función para enviar el correo con un diseño formal
const sendWelcomeEmail = async (toEmail) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Registro</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333333;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: #004080;
                padding: 30px;
                text-align: center;
                color: #ffffff;
            }
            .header h1 {
                font-size: 24px;
                font-weight: 600;
                margin: 0;
            }
            .content {
                padding: 30px;
            }
            .content p {
                font-size: 16px;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            .content .greeting {
                font-weight: 600;
                font-size: 18px;
            }
            .content .signature {
                margin-top: 30px;
                font-size: 14px;
                color: #555555;
            }
            .footer {
                background: #f5f5f5;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666666;
                border-top: 1px solid #e0e0e0;
            }
            .footer a {
                color: #004080;
                text-decoration: none;
            }
            .footer a:hover {
                text-decoration: underline;
            }
            @media only screen and (max-width: 600px) {
                .container {
                    width: 100%;
                    margin: 10px auto;
                }
                .header, .content, .footer {
                    padding: 20px;
                }
                .header h1 {
                    font-size: 20px;
                }
                .content .greeting {
                    font-size: 16px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Confirmación de Registro</h1>
            </div>
            <div class="content">
                <p class="greeting">Estimado/a usuario/a,</p>
                <p>
                    Nos complace informarle que su registro en nuestro sistema de mensajería ha sido exitoso. 
                    A partir de ahora, podrá disfrutar de un servicio de envío de correos eficiente, seguro y confiable.
                </p>
                <p>
                    Si tiene alguna pregunta o necesita asistencia, no dude en contactarnos a través de nuestro equipo de soporte.
                </p>
                <p class="signature">
                    Atentamente,<br>
                    Equipo de Mensajería<br>
                    Sistema de Correo Electrónico
                </p>
            </div>
            <div class="footer">
                <p>Sistema de Correo Electrónico &copy; 2025. Todos los derechos reservados.</p>
                <p>Si no solicitó este correo, por favor ignórelo o contáctenos en <a href="mailto:soporte@correo.com">soporte@correo.com</a>.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Equipo de Mensajería" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Confirmación de Registro',
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