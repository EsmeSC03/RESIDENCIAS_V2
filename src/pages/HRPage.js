import React, { useEffect, useRef, useState } from 'react'; 
import Chart from 'chart.js/auto';

const HRPage = () => {
    const [activeSection, setActiveSection] = useState('inicio');
    const weeklyChartRef = useRef(null);
    const monthlyChartRef = useRef(null);
    const weeklyChartInstance = useRef(null);
    const monthlyChartInstance = useRef(null);

    useEffect(() => {
        // Configuración y creación de los gráficos
        if (weeklyChartRef.current && !weeklyChartInstance.current) {
            weeklyChartInstance.current = new Chart(weeklyChartRef.current, {
                type: 'bar',
                data: {
                    labels: ['Asistencias', 'Retardos', 'Faltas'],
                    datasets: [{
                        label: 'Estadísticas Semanales',
                        data: [30, 20, 20],
                        backgroundColor: ['green', 'yellow', 'red']
                    }]
                }
            });
        }

        if (monthlyChartRef.current && !monthlyChartInstance.current) {
            monthlyChartInstance.current = new Chart(monthlyChartRef.current, {
                type: 'bar',
                data: {
                    labels: ['Asistencias', 'Retardos', 'Faltas'],
                    datasets: [{
                        label: 'Estadísticas Mensuales',
                        data: [15, 10, 5],
                        backgroundColor: ['orange', 'yellow', 'purple']
                    }]
                }
            });
        }

        // Limpieza de los gráficos al desmontar el componente
        return () => {
            if (weeklyChartInstance.current) {
                weeklyChartInstance.current.destroy();
                weeklyChartInstance.current = null;
            }
            if (monthlyChartInstance.current) {
                monthlyChartInstance.current.destroy();
                monthlyChartInstance.current = null;
            }
        };
    }, []);

    const renderSection = () => {
        switch (activeSection) {
            case 'inicio':
                return (
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header text-white bg-success">ASISTENCIAS</div>
                                <div className="card-body">
                                    <h1>30</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header text-white bg-warning">RETARDOS</div>
                                <div className="card-body">
                                    <h1>20</h1>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header text-white bg-danger">FALTAS</div>
                                <div className="card-body">
                                    <h1>20</h1>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">Estadísticas Semanales</div>
                                    <div className="card-body">
                                        <canvas ref={weeklyChartRef} id="weeklyChart"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">Estadísticas Mensuales</div>
                                    <div className="card-body">
                                        <canvas ref={monthlyChartRef} id="monthlyChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'docentes':
                return (
                    <div>
                        <h2>Lista de Docentes</h2>
                        {/* Aquí deberás reemplazar el siguiente array por datos reales de la base de datos */}
                        <ul>
                            {['Docente 1', 'Docente 2', 'Docente 3'].map((docente, index) => (
                                <li key={index}>{docente}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'reportes':
                return (
                    <div>
                        <h2>Reportes Recibidos</h2>
                        {/* Muestra mensajes que provienen de otra página */}
                        <ul>
                            <li>Reporte 1: Información de ejemplo</li>
                            <li>Reporte 2: Otro mensaje recibido</li>
                        </ul>
                    </div>
                );
            case 'ajustes':
                return (
                    <div>
                        <h2>Ajustes Personales</h2>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Nombre:</label>
                                <input type="text" className="form-control" placeholder="Escribe tu nombre" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Correo Electrónico:</label>
                                <input type="email" className="form-control" placeholder="correo@ejemplo.com" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Teléfono:</label>
                                <input type="text" className="form-control" placeholder="Escribe tu teléfono" />
                            </div>
                            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                        </form>
                    </div>
                );
            default:
                return <div>Sección no encontrada</div>;
        }
    };

    return (
        <div className="container mt-5">
            <ul className="nav nav-pills mt-3 d-flex justify-content-end">
                <li className="nav-item">
                    <a className={`nav-link ${activeSection === 'inicio' ? 'active' : ''}`} href="#" onClick={() => setActiveSection('inicio')}>Inicio</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeSection === 'docentes' ? 'active' : ''}`} href="#" onClick={() => setActiveSection('docentes')}>Docentes</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeSection === 'reportes' ? 'active' : ''}`} href="#" onClick={() => setActiveSection('reportes')}>Reportes</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeSection === 'ajustes' ? 'active' : ''}`} href="#" onClick={() => setActiveSection('ajustes')}>Ajustes</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/" onClick={() => setActiveSection('salir')}>Salir</a>
                </li>
            </ul>
            {renderSection()}
        </div>
    );
};

export default HRPage;
