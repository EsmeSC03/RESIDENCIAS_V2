// src/components/Sidebar.js
import React from "react";
import styles from "../../styles/Admin.module.css";

const Sidebar = ({ userName, setActiveSection }) => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles["sidebar-header"]}>
        <h2>{userName || "Cargando..."}</h2>
      </div>
      <ul className={styles.menu}>
        <li>
          <a href="#" onClick={() => setActiveSection("inicio")}>Inicio</a>
        </li>
        <li>
          <a href="#" onClick={() => setActiveSection("docentes")}>Docentes</a>
        </li>
        <li>
          <a href="#" onClick={() => setActiveSection("reportes")}>Reportes</a>
        </li>
        <li>
          <a href="#" onClick={() => setActiveSection("ajustes")}>Ajustes</a>
        </li>
        <li>
          <a href="/logout">Salir</a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
