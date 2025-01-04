import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin.module.css";

const ReportesSectionDocente = () => {
  const [reportes, setReportes] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const userRFC = localStorage.getItem("userRFC");
    if (!userRFC) {
      console.error("No se encontró el RFC del usuario en localStorage");
      return;
    }

    axios
      .get(`${baseURL}/api/reportes-docente`, {
        params: { RFC_DOCENTE: userRFC },
      })
      .then((response) => {
        if (response.data.success) {
          const sortedReportes = response.data.reportes.sort(
            (a, b) => new Date(b.Fecha) - new Date(a.Fecha)
          );
          setReportes(sortedReportes);
        } else {
          console.error("No se encontraron reportes");
        }
      })
      .catch((error) => console.error("Error al obtener los reportes:", error));
  }, []);

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatEstado = (estado) => {
    switch (estado) {
      case "presente":
        return "Asistió";
      case "ausente":
        return "No asistió";
      case "tarde":
        return "Retardo";
      default:
        return estado;
    }
  };

  const handleEstadoFilterChange = (e) => {
    setFilterEstado(e.target.value);
    setCurrentPage(1); // Reiniciar a la primera página cuando se aplica un filtro
  };

  const filteredReportes = reportes.filter((reporte) => {
    const matchesSearch = reporte.Nombre_Completo.toLowerCase().includes(search.toLowerCase());
    const matchesEstado = filterEstado
      ? reporte.Estado.toLowerCase() === filterEstado.toLowerCase()
      : true;
    return matchesSearch && matchesEstado;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentReportes = filteredReportes.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredReportes.length / itemsPerPage);

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
      <div className={styles.filters}>
       
        <select value={filterEstado} onChange={handleEstadoFilterChange}>
          <option value="">Todos los estados</option>
          <option value="presente">Asistió</option>
          <option value="ausente">No asistió</option>
          <option value="tarde">Retardo</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Aula</th>
            <th>Hora de Entrada</th>
            <th>Estado</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
          {currentReportes.length > 0 ? (
            currentReportes.map((reporte, index) => (
              <tr key={index}>
                <td>{reporte.Nombre_Completo}</td>
                <td>{formatFecha(reporte.Fecha)}</td>
                <td>{reporte.Nombre_aula}</td>
                <td>{reporte.Hora_inicio}</td>
                <td>{formatEstado(reporte.Estado)}</td>
                <td>{reporte.Observacion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No se encontraron reportes con ese criterio.</td>
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

export default ReportesSectionDocente;
