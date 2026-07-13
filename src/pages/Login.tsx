import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import '../styles/auth.css';
import { Link,useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import { authApi } from '../api/auth.api';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { triggerGoogleSignIn } = useGoogleAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', general: '' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del correo es inválido.';
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { access_token } = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      login(access_token);    // Guarda el token real del backend
      navigate('/dashboard'); // Redirige al dashboard tras un login exitoso

    } catch (error) {
      setErrors({ ...errors, general: 'Credenciales incorrectas o error en el servidor.' });
    }
  };

  const handleGoogleLogin = () => {
    triggerGoogleSignIn();
  };

  return (
    <div className="auth-container">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            error={errors.email}
          />
          
          <InputField
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            error={errors.password}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 mt-4"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">O continúa con</span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="google-btn-hover w-full mt-4 flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition duration-200"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
          Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};