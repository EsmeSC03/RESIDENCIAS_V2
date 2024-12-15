import React, { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Inicio from '../sections/Ingles/Inicio';
import Docentes from '../sections/Ingles/Docentes';
import Reportes from '../sections/Ingles/Reportes';
import Ajustes from '../sections/Ingles/Ajustes';
import styles from '../styles/Ingles.module.css';

const InglesPage = () => {
    const [isSidebarActive, setIsSidebarActive] = useState(false);

    useEffect(() => {
        document.body.classList.add(styles['ingles-body']);
        
        return () => {
            document.body.classList.remove(styles['ingles-body']);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarActive(!isSidebarActive);
    };

    return (
        <>
            <header className={styles.header}></header>
            <div className={styles.container}>
                <div 
                    className={styles.sidebarToggle} 
                    onClick={toggleSidebar}
                ></div>

                <nav className={`${styles.sidebar} ${isSidebarActive ? styles.active : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h2>Roman Cruz Arriaga</h2>
                    </div>
                    <ul className={styles.menu}>
                        <li><Link to="inicio"><i className="fas fa-home"></i> Inicio</Link></li>
                        <li><Link to="docentes"><i className="fas fa-chalkboard-teacher"></i> Docentes</Link></li>
                        <li><Link to="reportes"><i className="fas fa-warehouse"></i> Reportes</Link></li>
                        <li><Link to="ajustes"><i className="fas fa-cogs"></i> Ajustes</Link></li>
                        <li><Link to="/"><i className="fas fa-sign-out-alt"></i> Salir</Link></li>
                    </ul>
                </nav>

                <div className={styles.mainContent}>
                    <Routes>
                        <Route path="inicio" element={<Inicio />} />
                        <Route path="docentes" element={<Docentes />} />
                        <Route path="reportes" element={<Reportes />} />
                        <Route path="ajustes" element={<Ajustes />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default InglesPage;
