// src/components/AdminPage.js
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import styles from "../styles/Admin.module.css";
import Inicio from "../assets/inicio.png";

const AdminPage = () => {
  const asistenciaChartRef = useRef(null);
  const retardosChartRef = useRef(null);

  // Estados necesarios para la asignación de recorridos
  const [selectedUser, setSelectedUser] = useState(""); // Usuario seleccionado
  const [users, setUsers] = useState(["Juan Pérez", "María García", "Pedro López"]); // Lista de usuarios
  const [areas, setAreas] = useState(["Aula 1", "Aula 2", "Laboratorio"]); // Lista de áreas
  const [selectedAreas, setSelectedAreas] = useState([]); // Áreas seleccionadas

  // Maneja el cambio de selección en las áreas
  const handleAreaChange = (area) => {
    if (selectedAreas.includes(area)) {
      // Si el área ya está seleccionada, la eliminamos
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      // Si no está seleccionada, la agregamos
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  // Maneja el envío del formulario de asignación
  const handleSubmit = () => {
    if (selectedUser === "") {
      alert("Por favor, selecciona un usuario.");
      return;
    }

    alert(`Usuario: ${selectedUser}\nÁreas seleccionadas: ${selectedAreas.join(", ")}`);
  };

  // Configuración de las gráficas con Chart.js
  useEffect(() => {
    // Configuración de la gráfica de Asistencias Semanales
    const ctxAsistencia = document.getElementById("asistenciaChart").getContext("2d");

    if (asistenciaChartRef.current) {
      asistenciaChartRef.current.destroy();
    }

    asistenciaChartRef.current = new Chart(ctxAsistencia, {
      type: "bar",
      data: {
        labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
        datasets: [
          {
            label: "Asistencia Semanales",
            data: [40, 35, 38, 42, 37],
            backgroundColor: "#4CAF50",
            borderColor: "#388E3C",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Número de Asistencias",
            },
          },
          x: {
            title: {
              display: true,
              text: "Días de la Semana",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Gráfica de Asistencias Semanales",
          },
        },
      },
    });

    // Configuración de la gráfica de Retardos Mensuales
    const ctxRetardos = document.getElementById("retardosChart").getContext("2d");

    if (retardosChartRef.current) {
      retardosChartRef.current.destroy();
    }

    retardosChartRef.current = new Chart(ctxRetardos, {
      type: "line",
      data: {
        labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5"],
        datasets: [
          {
            label: "Retardos Mensuales",
            data: [5, 7, 6, 4, 8],
            backgroundColor: "rgba(255, 193, 7, 0.5)",
            borderColor: "#FFC107",
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Número de Retardos",
            },
          },
          x: {
            title: {
              display: true,
              text: "Semanas del Mes",
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Gráfica de Retardos Mensuales",
          },
        },
      },
    });

    // Cleanup al desmontar el componente
    return () => {
      if (asistenciaChartRef.current) {
        asistenciaChartRef.current.destroy();
      }
      if (retardosChartRef.current) {
        retardosChartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={styles.AdminBody}>
      <div className={styles.container}>
        <nav className={styles.sidebar}>
          <div className={styles["sidebar-header"]}>
            <h2>Pedro Pablo Martinez Carmona</h2>
          </div>
          <ul className={styles.menu}>
            <li>
              <a href="#" onClick={() => mostrarSeccion("inicio-section")}>Inicio</a>
            </li>
            <li>
              <a href="#" onClick={() => mostrarSeccion("asignacion-recorrido")}>Asignación</a>
            </li>
            <li>
              <a href="#" onClick={() => mostrarSeccion("docentes-section")}>Docentes</a>
            </li>
            <li>
              <a href="#" onClick={() => mostrarSeccion("reportes-section")}>Reportes</a>
            </li>
            <li>
              <a href="#" onClick={() => mostrarSeccion("ajustes-section")}>Ajustes</a>
            </li>
            <li>
              <a href="/">Salir</a>
            </li>
          </ul>
        </nav>

        <div className={styles["main-content"]}>
          {/* Sección de Inicio */}
          <div id="inicio-section" className={styles["inicio-section"]} style={{ display: "block" }}>
            <section className={styles.statistics}>
              <div className={`${styles.green} ${styles.stat}`}>
                <p>ASISTENCIAS</p>
                <h3>192</h3>
              </div>
              <div className={`${styles.yellow} ${styles.stat}`}>
                <p>RETARDOS</p>
                <h3>30</h3>
              </div>
              <div className={`${styles.red} ${styles.stat}`}>
                <p>FALTAS</p>
                <h3>25</h3>
              </div>
            </section>
            <section className={styles.charts}>
              <div className={styles.chart}>
                <h4>Estadísticas Semanales</h4>
                <canvas id="asistenciaChart"></canvas>
              </div>
              <div className={styles.chart}>
                <h4>Estadísticas Mensuales</h4>
                <canvas id="retardosChart"></canvas>
              </div>
            </section>
          </div>

          {/* Sección de Asignación */}
          <div id="asignacion-recorrido" className={styles["asignacion-recorrido"]} style={{ display: "none" }}>
            <h2>Asignación de Recorrido</h2>
            <div className={styles["form-group"]}>
              <label htmlFor="user-select">Nombre:</label>
              <select id="user-select" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="" disabled>Selecciona un usuario</option>
                {users.map((user, index) => (
                  <option key={index} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className={styles["form-group"]}>
              <label>Áreas:</label>
              <ul>
                {areas.map((area, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      id={`area-${index}`}
                      checked={selectedAreas.includes(area)}
                      onChange={() => handleAreaChange(area)}
                    />
                    <label htmlFor={`area-${index}`}>{area}</label>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={handleSubmit} className={styles.button}>
              Enviar
            </button>
          </div>

          {/* Sección de Docentes */}
          <div
            id="docentes-section"
            className={styles["docentes-section"]}
            style={{ display: "none" }}
          >
            <input type="text" placeholder="Buscar Docente" />
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Hora Entrada</th>
                  <th>Hora Salida</th>
                  <th>Área</th>
                </tr>
              </thead>
              <tbody>
                <tr>

                <td>Juan Pérez</td>
                  <td>08:00 AM</td>
                  <td>02:00 PM</td>
                  <td>02:00 PM</td>
                </tr>
                <tr>
                  <td>María García</td>
                  <td>09:00 AM</td>
                  <td>03:00 PM</td>
                  <td>02:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sección de Reportes */}
          <div
            id="reportes-section"
            className={styles["docentes-section"]}
            style={{ display: "none" }}
          >
            <input type="text" placeholder="Buscar Docente" />
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Dia</th>
                  <th>Aula</th>
                  <th>Hora de Entrada</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Juan Pérez</td>
                  <td>08:00 AM</td>
                  <td>02:00 PM</td>
                  <td>02:00 PM</td>
                  <td>02:00 PM</td>
                </tr>
                <tr>
                  <td>María García</td>
                  <td>09:00 AM</td>
                  <td>03:00 PM</td>
                  <td>02:00 PM</td>
                  <td>02:00 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sección de Ajustes */}
          <div
            id="ajustes-section"
            className={styles["asignacion-recorrido"]}
            style={{ display: "none" }}
          >
           <center> <img src={Inicio} alt="Photo Load" width="150" height="150" /> </center>
            <h2>PEDRO PABLO MARTINEZ CARMONA</h2>
            <center>
              <label htmlFor="usr">
                <b>Usuario</b>
              </label>
              <input
                type="text"
                placeholder="Cambiar usuario"
                name="role"
                id="usr"
                required
              />
              <label htmlFor="psw">
                <b>Contraseña</b>
              </label>
              <input
                type="password"
                placeholder="Cambiar contraseña"
                name="psw"
                required
              />
            </center>
            <button name="button">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

 

function mostrarSeccion(seccionId) {
  const secciones = [
    "inicio-section",
    "asignacion-recorrido",
    "docentes-section",
    "reportes-section",
    "ajustes-section",
  ];
  secciones.forEach((id) => {
    document.getElementById(id).style.display =
      id === seccionId ? "block" : "none";
  });
}

export default AdminPage;
