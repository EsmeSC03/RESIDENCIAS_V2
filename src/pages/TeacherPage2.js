import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const TeacherPage = () => {
  const [section, setSection] = useState("Perfil"); // Estado inicial: Perfil
  const [selectedDate, setSelectedDate] = useState(new Date()); // Fecha seleccionada
  const [currentView, setCurrentView] = useState("Faltas"); // Estado para Notificaciones

  // Datos simulados (reemplázalos con datos reales de tu base de datos)
  const data = {
    "2024-06-15": { Faltas: 2, Asistencias: 4, Retardos: 1 },
    "2024-06-16": { Faltas: 1, Asistencias: 5, Retardos: 0 },
    "2024-06-17": { Faltas: 0, Asistencias: 6, Retardos: 2 },
  };

  // Formatear la fecha seleccionada para buscarla en los datos
  const formattedDate = selectedDate.toISOString().split("T")[0];
  const selectedData = data[formattedDate] || { Faltas: 0, Asistencias: 0, Retardos: 0 };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Barra de Navegación */}
      <div style={styles.navbar}>
        <span
          style={section === "Perfil" ? styles.activeTab : styles.tab}
          onClick={() => setSection("Perfil")}
        >
          Perfil
        </span>
        <span
          style={section === "Notificaciones" ? styles.activeTab : styles.tab}
          onClick={() => setSection("Notificaciones")}
        >
          Notificaciones
        </span>
        <button style={styles.exitButton}>Salir</button>
      </div>

      {/* Contenido de la Página */}
      {section === "Perfil" ? (
        <div style={{ padding: "20px" }}>
          <h2>Perfil</h2>
          <p>Cambia tu foto de perfil y edita tu información personal.</p>
          <form style={styles.profileForm}>
            <label>Foto de Perfil:</label>
            <input type="file" />

            <label>Nombre:</label>
            <input type="text" placeholder="Roman" />

            <label> Apellido:</label>
            <input type="text" placeholder="Cruz " />

            <label>Puesto:</label>
            <input type="text" placeholder="Subdirector" />

            <label>Departmento:</label>
            <input type="text" placeholder="Subdirección académica" />

            <button style={styles.updateButton}>Actualizar perfil</button>
          </form>
        </div>
      ) : (
        // Contenido de Notificaciones
        <div style={{ padding: "20px" }}>
          <h2>Notificaciones</h2>
          <div>
            <h3>Selecciona una fecha:</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              inline
            />
          </div>

          {/* Botones de Opciones */}
          <div style={styles.notificationsMenu}>
            <button
              style={currentView === "Faltas" ? styles.activeButton : styles.button}
              onClick={() => setCurrentView("Faltas")}
            >
              Faltas
            </button>
            <button
              style={currentView === "Asistencias" ? styles.activeButton : styles.button}
              onClick={() => setCurrentView("Asistencias")}
            >
              Asistencias
            </button>
            <button
              style={currentView === "Retardos" ? styles.activeButton : styles.button}
              onClick={() => setCurrentView("Retardos")}
            >
              Retardos
            </button>
          </div>

          {/* Resultado de la Selección */}
          <div style={styles.results}>
            {currentView === "Faltas" && (
              <p>
                <b>Faltas del {formattedDate}:</b> {selectedData.Faltas}
              </p>
            )}
            {currentView === "Asistencias" && (
              <p>
                <b>Asistencias del {formattedDate}:</b> {selectedData.Asistencias}
              </p>
            )}
            {currentView === "Retardos" && (
              <p>
                <b>Retardos del {formattedDate}:</b> {selectedData.Retardos}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos CSS en JS
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0047AB",
    color: "white",
    padding: "10px 20px",
  },
  tab: {
    cursor: "pointer",
    marginRight: "20px",
    color: "white",
    fontSize: "18px",
  },
  activeTab: {
    cursor: "pointer",
    marginRight: "20px",
    fontWeight: "bold",
    textDecoration: "underline",
    color: "white",
    fontSize: "18px",
  },
  exitButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "1px 4px",
    borderRadius: "100px",
    with: "100px",
    cursor: "pointer",
  },
  profileForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
  },
  updateButton: {
    backgroundColor: "#0047AB",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  notificationsMenu: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    gap: "10px",
  },
  button: {
    backgroundColor: "gray",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  activeButton: {
    backgroundColor: "#0047AB",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  results: {
    marginTop: "20px",
    fontSize: "18px",
    textAlign: "center",
  },
};

export default TeacherPage;
