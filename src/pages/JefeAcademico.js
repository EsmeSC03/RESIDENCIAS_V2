// src/components/HRPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Ingles.module.css";
import Sidebar from "../components/JefeArea/Sidebar";
import InicioSection from "../components/JefeArea/InicioSection";
import AsignacionSection from "../components/JefeArea/AsignacionSection";
import DocentesSection from "../components/JefeArea/DocentesSection";
import ReportesSection from "../components/JefeArea/ReportesSection";
import AjustesSection from "../components/JefeArea/AjustesSection";

const HRPage = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [activeSection, setActiveSection] = useState("inicio"); // Estado para la sección activa
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  
  useEffect(() => {
    const userRFC = localStorage.getItem("userRFC");
    if (!userRFC) {
      alert("Debes iniciar sesión para acceder a esta página.");
      navigate("/");
      return;
    }

    axios
      .get(`${baseURL}/api/user/${userRFC}`)
      .then((response) => {
        if (response.data.success) {
          const { Nombre, Apellido_p, Apellido_m } = response.data.user;
          const Tipo_Usuario = localStorage.getItem("userRole");
          setUserName(`${Nombre} ${Apellido_p} ${Apellido_m}`);
          setUserRole(Tipo_Usuario);

          if (Tipo_Usuario !== "Recursos Humanos") {
            alert("No tienes permiso para acceder a esta página.");
            navigate("/");
          }
        } else {
          alert(`${userRFC}`)
            alert("Usuario no encontrado. Inicia sesión nuevamente12.");
          //navigate("/logout");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos del usuario:", error);
        navigate("/logout");
      });
  }, [navigate]);

  // Renderizar la sección activa
  const renderActiveSection = () => {
    switch (activeSection) {
      case "inicio":
        return <InicioSection />;
      case "asignacion":
        return <AsignacionSection />;
      case "docentes":
        return <DocentesSection />;
      case "reportes":
        return <ReportesSection />;
      case "ajustes":
        return <AjustesSection />;
      default:
        return <div>Sección no encontrada</div>; // Agrega un mensaje por defecto
    }
  };
  

  return (
    <div className={styles.JefeAreaBody}>
      <div className={styles.container}>
        <Sidebar userName={userName} setActiveSection={setActiveSection} />
        <div className={styles["main-content"]}>{renderActiveSection()}</div>
      </div>
    </div>
  );
};

export default HRPage;
