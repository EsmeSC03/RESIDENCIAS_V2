import React, { useState, useEffect } from "react";
import styles from "../../styles/Admin.module.css";
import Inicio from "../../assets/inicio.png";

const AjustesSection = ({ userName }) => {
  const [correo, setCorreo] = useState("");
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [error, setError] = useState("");
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const userRFC = localStorage.getItem("userRFC");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/obtener-usuario?RFC=${userRFC}`);
        const data = await response.json();
        if (data.success) {
          setCorreo(data.usuario.Correo);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    if (userRFC) {
      fetchUserData();
    } else {
      setError("No se encontró el RFC del usuario.");
    }
  }, [userRFC]);

  const handleSubmit = async () => {
    if (!contraseñaActual || !nuevaContraseña) {
      setError("Debe ingresar la contraseña actual y la nueva contraseña.");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/api/actualizar-usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RFC: userRFC,
          contrasenaActual: contraseñaActual,
          nuevaContrasena: nuevaContraseña,
          nuevoCorreo: correo,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Datos actualizados correctamente.");
        setContraseñaActual("");
        setNuevaContraseña("");
      } else {
        setError(data.error || "Hubo un error al actualizar los datos.");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      setError("Hubo un error al actualizar los datos.");
    }
  };

  return (
    <div id="ajustes-section" className={styles["asignacion-recorrido"]}>
      <center>
        <img src={Inicio} alt="Photo Load" width="150" height="150" />
      </center>
      <h2>{userName || "Cargando..."}</h2>
      <center>
        <label htmlFor="usr">
          <b>Correo</b>
        </label>
        <input
          type="text"
          placeholder="Correo"
          name="correo"
          id="usr"
          value={correo}
          readOnly
        />
        <label htmlFor="psw">
          <b>Contraseña actual</b>
        </label>
        <input
          type="password"
          placeholder="Contraseña actual"
          name="psw"
          required
          value={contraseñaActual}
          onChange={(e) => setContraseñaActual(e.target.value)}
        />
        <label htmlFor="newPsw">
          <b>Nueva contraseña</b>
        </label>
        <input
          type="password"
          placeholder="Nueva contraseña"
          name="newPsw"
          required
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
        />
      </center>
      {error && <p className={styles.error}>{error}</p>}
      <button onClick={handleSubmit} className={styles.button}>
        Actualizar
      </button>
    </div>
  );
};

export default AjustesSection;
