import React, { useState, useEffect } from 'react';
import styles from '../../styles/Ingles.module.css';

const Docentes = () => {
    const [docentesData, setDocentesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simula una llamada a una API para cargar datos de la base de datos
        const fetchDocentes = async () => {
            try {
                const response = await fetch('/api/docentes'); // Asegúrate de cambiar el endpoint según tu configuración
                const data = await response.json();
                setDocentesData(data);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocentes();
    }, []);

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
            {loading ? (
                <p>Cargando datos...</p>
            ) : (
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
            )}
        </div>
    );
};

export default Docentes;
