// src/sections/Ingles/Inicio.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from '../../styles/Ingles.module.css';

const Inicio = () => {
    const asistenciaChartRef = useRef(null);
    const retardosChartRef = useRef(null);
    const asistenciaChartInstance = useRef(null);
    const retardosChartInstance = useRef(null);

    useEffect(() => {
        // Función para destruir un gráfico si existe
        const destroyChart = (chartInstance) => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };

        // Destruye cualquier instancia de gráfico antes de crear una nueva
        destroyChart(asistenciaChartInstance);
        destroyChart(retardosChartInstance);

        // Configuración del gráfico de Asistencias
        const asistenciaData = {
            labels: ['Asistencias', 'Retardos', 'Faltas'],
            datasets: [{
                label: 'Estadísticas Semanales',
                data: [30, 20, 20],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
                borderColor: ['#388E3C', '#FFA000', '#D32F2F'],
                borderWidth: 1
            }]
        };

        const asistenciaConfig = {
            type: 'bar',
            data: asistenciaData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Crea una nueva instancia de Chart para Asistencias
        asistenciaChartInstance.current = new Chart(asistenciaChartRef.current, asistenciaConfig);

        // Configuración del gráfico de Retardos
        const retardosData = {
            labels: ['Asistencias', 'Retardos', 'Faltas'],
            datasets: [{
                label: 'Estadísticas Mensuales',
                data: [5, 10, 8],
                backgroundColor: ['#FFC107', '#FF5722', '#9C27B0'],
                borderColor: ['#FFA000', '#E64A19', '#7B1FA2'],
                borderWidth: 1
            }]
        };

        const retardosConfig = {
            type: 'bar',
            data: retardosData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Crea una nueva instancia de Chart para Retardos
        retardosChartInstance.current = new Chart(retardosChartRef.current, retardosConfig);

        // Limpiar los gráficos al desmontar el componente
        return () => {
            destroyChart(asistenciaChartInstance);
            destroyChart(retardosChartInstance);
        };
    }, []);

    return (
        <div id="inicio-section" className={styles.inicioSection}>
            <section className={styles.statistics}>
                <div className={`${styles.stat} ${styles.green}`}>
                    <p>ASISTENCIAS</p>
                    <h3>30</h3>
                </div>
                <div className={`${styles.stat} ${styles.yellow}`}>
                    <p>RETARDOS</p>
                    <h3>20</h3>
                </div>
                <div className={`${styles.stat} ${styles.red}`}>
                    <p>FALTAS</p>
                    <h3>20</h3>
                </div>
            </section>

            <section className={styles.charts}>
                <div className={styles.chart}>
                    <h4>Estadísticas Semanales</h4>
                    <canvas ref={asistenciaChartRef}></canvas>
                </div>
                <div className={styles.chart}>
                    <h4>Estadísticas Mensuales</h4>
                    <canvas ref={retardosChartRef}></canvas>
                </div>
            </section>
        </div>
    );
};

export default Inicio;
