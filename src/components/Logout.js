import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Borra el RFC del almacenamiento local
    localStorage.removeItem('userRFC');

    // Redirige a la página principal
    navigate('/');
  }, [navigate]);

  return null; // Componente no necesita renderizar nada visual
};

export default Logout;
