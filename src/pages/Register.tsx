import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputField } from '../components/InputField';
import '../styles/auth.css';
import { login } from '../utils/auth';
import { authApi } from '../api/auth.api';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { triggerGoogleSignIn } = useGoogleAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  
  const [errors, setErrors] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    general: '' 
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', general: '' };

    // Validar nombre (prevención de inputs vacíos o muy cortos)
    if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
      isValid = false;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del correo es inválido.';
      isValid = false;
    }

    // Validar fuerza de la contraseña
    if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
      isValid = false;
    }

    // Validar que las contraseñas coincidan estrictamente
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
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
      const { access_token } = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      login(access_token);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ ...errors, general: 'Hubo un error al procesar tu registro. Intenta de nuevo.' });
    }
  };

  const handleGoogleSignup = () => {
    triggerGoogleSignIn();
  };

  return (
    <div className="auth-container">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md my-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Nombre Completo"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            error={errors.name}
          />

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

          <InputField
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="********"
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 mt-4"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">O regístrate con</span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="google-btn-hover w-full mt-4 flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition duration-200"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
          Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};