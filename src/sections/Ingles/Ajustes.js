import React, { useState } from 'react';
import styles from '../../styles/Ingles.module.css';
import inicioImage from '../../assets/inicio.png';

const Ajustes = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUpdate = () => {
        alert('Información actualizada');
    };

    return (
        <div className={styles.mainContent}>
            <div id="ajustes-section" className={styles.asignacionRecorrido}>
               <center> <img src={inicioImage} alt="Photo Load" width="150" height="150" align="center" /> </center>
               <center> <h2>Roman Cruz Arriaga</h2></center>
                <div style={{ textAlign: 'center' }}>
                    <label htmlFor="usr"><b>Usuario</b></label>
                    <input
                        type="text"
                        placeholder="Cambiar usuario"
                        name="role"
                        id="usr"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="psw"><b>Contraseña</b></label>
                    <input
                        type="password"
                        placeholder="Cambiar contraseña"
                        name="psw"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button name="button" onClick={handleUpdate}>Actualizar</button>
            </div>
        </div>
    );
};

export default Ajustes;
