import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import Profesor from '../assets/Profesor.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    document.body.classList.add(styles['login-body']);
    
    return () => {
      document.body.classList.remove(styles['login-body']);
    };
  }, []);

  const handleRedirect = () => {
    if (username === 'Administrador') {
      navigate('/admin');
    } else if (username === 'Docente') {
      navigate('/teacher');
    } else if (username === 'Prefecta') {
      navigate('/prefect');
    } else if (username === 'Ingles') {
      navigate('/ingles/inicio');
    } else if (username === 'Recursos Humanos') {
      navigate('/rh');
    } else if (username === 'Jefe Academico') {
      navigate('/jefe');
    } else {
      alert('Usuario no encontrado');
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
            <input type="password" placeholder="Contraseña" name="psw" required />
          </center>
          <button type="button" onClick={handleRedirect}>Iniciar Sesión</button>
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
