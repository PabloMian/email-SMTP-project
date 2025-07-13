import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EmailSender.css';

const EmailSender = () => {
  const [email, setEmail] = useState('');

  // Valida email con regex
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('El correo es obligatorio');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Formato de correo inválido');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/send-email`,
        { email }
      );
      toast.success('¡Correo enviado con éxito! 🎉');
      setEmail('');
    } catch (error) {
      const msg = error.response?.data?.error || 'Error al enviar el correo';
      toast.error(msg);
    }
  };

  return (
    <div className="email-sender-container">
      <div className="luxury-accent">✉️</div>
      <h2 className="email-sender-title">Envía un Mensaje</h2>
      <p className="email-sender-subtitle">
        Ingresa tu correo para recibir un mensaje de prueba exclusivo
      </p>
      
      <form onSubmit={handleSubmit} className="email-form">
        <div className="input-group">
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
        </div>
        
        <button type="submit" className="subscribe-button">
          Enviar
        </button>
      </form>

      <ul className="features-list">
        <li>Mensajes personalizados y exclusivos</li>
        <li>Contenido seguro y sin spam</li>
        <li>Prueba nuestro sistema de correo</li>
      </ul>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default EmailSender;