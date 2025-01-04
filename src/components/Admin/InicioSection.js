import React, { useState, useEffect, useRef } from "react";
import { Chart } from "chart.js";
import styles from "../../styles/Admin.module.css";

const InicioSection = () => {
  const [estadisticas, setEstadisticas] = useState({
    asistencias: 0,
    retardos: 0,
    faltas: 0,
  });
  const [graficaData, setGraficaData] = useState(null);
  const [filtro, setFiltro] = useState("dia");

  const asistenciaChartRef = useRef(null);
  const retardosChartRef = useRef(null);
  const faltasChartRef = useRef(null);
  const asistenciaChartInstance = useRef(null);
  const retardosChartInstance = useRef(null);
  const faltasChartInstance = useRef(null);
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  // Obtener estadísticas y datos de gráficas desde la API
  const fetchDatos = async () => {
    try {
      const [estadisticasResponse, graficasResponse] = await Promise.all([
        fetch(`${baseURL}/api/estadisticas?vista=${filtro}`),
        fetch(`${baseURL}/api/graficas?filtro=${filtro}`),
      ]);

      const estadisticasData = await estadisticasResponse.json();
      const graficasData = await graficasResponse.json();

      if (estadisticasData.success) {
        setEstadisticas(estadisticasData.estadisticas);
      } else {
        console.error(estadisticasData.message);
      }

      if (graficasData.success) {
        setGraficaData(graficasData.datosGraficas);
      } else {
        console.error(graficasData.message);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, [filtro]);

  // Crear o actualizar las gráficas
  useEffect(() => {
    if (!graficaData) return;

    // Función para destruir instancias previas
    const destroyCharts = () => {
      if (asistenciaChartInstance.current) asistenciaChartInstance.current.destroy();
      if (retardosChartInstance.current) retardosChartInstance.current.destroy();
      if (faltasChartInstance.current) faltasChartInstance.current.destroy();
    };

    destroyCharts();

    // Crear nuevas gráficas
    const ctxAsistencia = asistenciaChartRef.current.getContext("2d");
    asistenciaChartInstance.current = new Chart(ctxAsistencia, {
      type: "bar",
      data: {
        labels: graficaData.asistencias.map((item) => formatFecha(item.label)),
        datasets: [
          {
            label: "Asistencias",
            data: graficaData.asistencias.map((item) => item.count),
            backgroundColor: "#4CAF50",
            borderColor: "#388E3C",
            borderWidth: 1,
          },
        ],
      },
      options: { responsive: true },
    });

    const ctxRetardos = retardosChartRef.current.getContext("2d");
    retardosChartInstance.current = new Chart(ctxRetardos, {
      type: "bar",
      data: {
        labels: graficaData.asistencias.map((item) => formatFecha(item.label)),
        datasets: [
          {
            label: "Retardos",
            data: graficaData.retardos.map((item) => item.count),
            backgroundColor: "rgba(255, 193, 7, 0.5)",
            borderColor: "#FFC107",
            borderWidth: 1,
          },
        ],
      },
      options: { responsive: true },
    });

    const ctxFaltas = faltasChartRef.current.getContext("2d");
    faltasChartInstance.current = new Chart(ctxFaltas, {
      type: "bar",
      data: {
        labels: graficaData.asistencias.map((item) => formatFecha(item.label)),
        datasets: [
          {
            label: "Faltas",
            data: graficaData.faltas.map((item) => item.count),
            backgroundColor: "rgba(244, 67, 54, 0.5)",
            borderColor: "#F44336",
            borderWidth: 1,
          },
        ],
      },
      options: { responsive: true },
    });

    return destroyCharts;
  }, [graficaData]);

  return (
    <div id="inicio-section" className={styles["inicio-section"]}>
      <div className={styles.filters}>
        <label>
          Filtro:
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
          </select>
        </label>
      </div>
      <section className={styles.statistics}>
        <div className={`${styles.green} ${styles.stat}`}>
          <p>ASISTENCIAS</p>
          <h3>{estadisticas.asistencias}</h3>
        </div>
        <div className={`${styles.yellow} ${styles.stat}`}>
          <p>RETARDOS</p>
          <h3>{estadisticas.retardos}</h3>
        </div>
        <div className={`${styles.red} ${styles.stat}`}>
          <p>FALTAS</p>
          <h3>{estadisticas.faltas}</h3>
        </div>
      </section>
      <section className={styles.charts}>
        <div className={styles.chart}>
          <h4>Asistencias</h4>
          <canvas ref={asistenciaChartRef}></canvas>
        </div>
        <div className={styles.chart}>
          <h4>Retardos</h4>
          <canvas ref={retardosChartRef}></canvas>
        </div>
        <div className={styles.chart}>
          <h4>Faltas</h4>
          <canvas ref={faltasChartRef}></canvas>
        </div>
      </section>
    </div>
  );
};

export default InicioSection;
