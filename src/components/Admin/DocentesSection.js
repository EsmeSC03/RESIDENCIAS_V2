import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin.module.css";

const DocentesSection = () => {
  const [horarios, setHorarios] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    fetch(`${baseURL}/api/horario`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setHorarios(data.horarios);
        } else {
          console.error("No se encontraron horarios");
        }
      })
      .catch((error) => console.error("Error al obtener los horarios:", error));
  }, []);

  const filteredHorarios = horarios.filter((horario) =>
    `${horario.NombreProfesor}`.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentHorarios = filteredHorarios.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredHorarios.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles["docentes-section"]}>
      <input
        type="text"
        placeholder="Buscar Docente"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
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
          {currentHorarios.length > 0 ? (
            currentHorarios.map((horario, index) => (
              <tr key={index}>
                <td>{horario.NombreProfesor}</td>
                <td>{horario.HoraEntrada}</td>
                <td>{horario.HoraSalida}</td>
                <td>{horario.Area || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No se encontraron docentes con ese nombre.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default DocentesSection;
