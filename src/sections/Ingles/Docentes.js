import React, { useState } from 'react';
import styles from '../../styles/Ingles.module.css';

const Docentes = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const docentesData = [
        { nombre: 'Juan Pérez', horaEntrada: '08:00 AM', horaSalida: '02:00 PM', area: 'Matemáticas' },
        { nombre: 'María García', horaEntrada: '09:00 AM', horaSalida: '03:00 PM', area: 'Ciencias' },
    ];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredDocentes = docentesData.filter((docente) =>
        docente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div id="docentes-section" className={styles.docentesSection}>
            <input
                type="text"
                placeholder="Buscar Docente"
                value={searchTerm}
                onChange={handleSearchChange}
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
                    {filteredDocentes.map((docente, index) => (
                        <tr key={index}>
                            <td>{docente.nombre}</td>
                            <td>{docente.horaEntrada}</td>
                            <td>{docente.horaSalida}</td>
                            <td>{docente.area}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Docentes;
