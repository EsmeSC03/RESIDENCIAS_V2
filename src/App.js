import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import AdminPage from './pages/AdminPage';
import TeacherPage from './pages/TeacherPage';
import PrefectPage from './pages/PrefectPage';
import HRPage from './pages/HRPage';
import InglesPage from './pages/InglesPage';
import JefeAcademico from './pages/JefeAcademico';

import AdminPage2 from './pages/TeacherPage2';


function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/teacher" element={<TeacherPage />} />
            <Route path="/prefect" element={<PrefectPage />} />
            <Route path="/rh" element={<HRPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/jefe" element={<JefeAcademico />} />


            <Route path="/practice" element={<AdminPage2 />} />
            
            {/* Ruta principal para InglesPage */}
            <Route path="/ingles/*" element={<InglesPage />} />
        </Routes>
    );
}

export default App;
