import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Login.module.css';
import Profesor from '../assets/Profesor.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rfc, setRfc] = useState(''); // Nuevo estado para el RFC
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    document.body.classList.add(styles['login-body']);
    return () => {
      document.body.classList.remove(styles['login-body']);
    };
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/login`, {
        username,
        password,
      });
  
      if (response.data.success) {
        const { Tipo_Usuario, RFC } = response.data.user;
  
        // Guarda el RFC y el rol en el almacenamiento local
        localStorage.setItem('userRFC', RFC);
        localStorage.setItem('userRole', Tipo_Usuario); // Guarda el rol del usuario
  
        // Redirige según el tipo de usuario
        switch (Tipo_Usuario) {
          case 'SUBDIRECTOR':
            navigate('/admin');
            break;
          case 'DOCENTE':
            navigate('/teacher');
            break;
          case 'PREFECTA':
            navigate('/prefect');
            break;
          case 'INGLES':
            navigate('/ingles/inicio');
            break;
          case 'Recursos Humanos':
            navigate('/rh');
            break;
          case 'Jefe Academico':
            navigate('/jefe');
            break;
          default:
            alert('Tipo de usuario no reconocido');
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un problema al iniciar sesión.');
    }
  };
  

  return (
    <div className={styles['container-wrapper']}>
      <div className={styles['image-container']}>
        <img src={Profesor} alt="Login Image" />
      </div>

      <div className={styles['form-container']}>
        <form id="loginForm" onSubmit={(e) => e.preventDefault()}>
          <h2>Bienvenido</h2>
          <center>
            <label htmlFor="uname"><b>Usuario</b></label>
            <input 
              type="text" 
              placeholder="Nombre de usuario" 
              name="role" 
              id="usr" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <label htmlFor="psw"><b>Contraseña</b></label>
            <input 
              type="password" 
              placeholder="Contraseña" 
              name="psw" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </center>
          <button type="button" onClick={handleLogin}>Iniciar Sesión</button>
          <label>
            <input type="checkbox" checked="checked" name="remember" /> Recuérdame
          </label>
          <span className={styles.psw}>¿Olvidaste tu <a href="#">contraseña?</a></span>
        </form>
      </div>
    </div>
  );
};

export default Login;
