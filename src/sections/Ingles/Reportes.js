import React, { useState } from 'react';
import styles from '../../styles/Ingles.module.css';

const Reportes = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const reportesData = [
        { nombre: 'Juan Pérez', dia: 'Lunes', aula: 'Aula 1', horaEntrada: '08:00 AM', estado: 'Presente' },
        { nombre: 'María García', dia: 'Martes', aula: 'Aula 2', horaEntrada: '09:00 AM', estado: 'Presente' },
    ];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredReportes = reportesData.filter((reporte) =>
        reporte.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div id="reportes-section" className={styles.reportesSection}>
            <input
                type="text"
                placeholder="Buscar Reporte"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Día</th>
                        <th>Aula</th>
                        <th>Hora de Entrada</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReportes.map((reporte, index) => (
                        <tr key={index}>
                            <td>{reporte.nombre}</td>
                            <td>{reporte.dia}</td>
                            <td>{reporte.aula}</td>
                            <td>{reporte.horaEntrada}</td>
                            <td>{reporte.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reportes;
