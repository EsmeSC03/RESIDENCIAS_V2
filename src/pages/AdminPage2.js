import React, { useState } from 'react';
import styles from '../styles/Prefecta.module.css';
import { jsPDF } from 'jspdf';
import emailjs from 'emailjs-com';

const AdminPage2 = () => {
  const [asistencias, setAsistencias] = useState([
    { nombre: 'Juan Pérez', hora: '08:00 AM', aula: 'Aula 101', area: 'Docentes', estado: null, observacion: '' },
    { nombre: 'Ana López', hora: '09:00 AM', aula: 'Aula 202', area: 'Administrativos', estado: null, observacion: '' },
    { nombre: 'Pedro Sánchez', hora: '10:00 AM', aula: 'Aula 303', area: 'Docentes', estado: null, observacion: '' },
  ]);

  const [filtroArea, setFiltroArea] = useState('');
  const [filtroHorario, setFiltroHorario] = useState('');

  const [editandoObservacion, setEditandoObservacion] = useState(null);
  const [observacionTemporal, setObservacionTemporal] = useState('');

  // Obtener fecha actual
  const fechaActual = new Date().toLocaleDateString();

  const handleEstadoChange = (index, estado) => {
    const nuevasAsistencias = [...asistencias];
    nuevasAsistencias[index].estado = estado;
    setAsistencias(nuevasAsistencias);
  };

  const resetEstado = (index) => {
    const nuevasAsistencias = [...asistencias];
    nuevasAsistencias[index].estado = null;
    setAsistencias(nuevasAsistencias);
  };

  const guardarObservacion = (index) => {
    const nuevasAsistencias = [...asistencias];
    nuevasAsistencias[index].observacion = observacionTemporal;
    setAsistencias(nuevasAsistencias);
    setEditandoObservacion(null);
    setObservacionTemporal('');
  };

  // Filtrar asistencias por área y horario
  const asistenciasFiltradas = asistencias.filter((asistente) => {
    return (
      (filtroArea ? asistente.area === filtroArea : true) &&
      (filtroHorario ? asistente.hora === filtroHorario : true)
    );
  });

  return (
    <div className={`container-fluid ${styles.container}`}>
      <header className={`header ${styles.header}`}>
        <h1>Registro de Asistencias</h1>
        <a href="/" className={`btn btn-logout ${styles.btnLogout}`}>
          <i className="material-icons">logout</i> Salir
        </a>
      </header>

      {/* Botones de Filtros */}
      <div className="d-flex justify-content-around mb-3">
        {/* Área */}
        <div>
          <button
            className="btn btn-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Área
          </button>
          <ul className="dropdown-menu">
            <li><a onClick={() => setFiltroArea('Docentes')}>Docentes</a></li>
            <li><a onClick={() => setFiltroArea('Administrativos')}>Administrativos</a></li>
            <li><a onClick={() => setFiltroArea('Personal')}>Personal</a></li>
            <li><a onClick={() => setFiltroArea('')}>Todos</a></li>
          </ul>
        </div>

        {/* Horario */}
        <div>
          <button
            className="btn btn-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            Horario
          </button>
          <ul className="dropdown-menu">
            <li><a onClick={() => setFiltroHorario('08:00 AM')}>08:00 AM</a></li>
            <li><a onClick={() => setFiltroHorario('09:00 AM')}>09:00 AM</a></li>
            <li><a onClick={() => setFiltroHorario('10:00 AM')}>10:00 AM</a></li>
            <li><a onClick={() => setFiltroHorario('')}>Todos</a></li>
          </ul>
        </div>

        {/* Calendario */}
        <div>
          <button className="btn btn-info" disabled>
            Calendario: {fechaActual}
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className={`table-container ${styles.tableContainer}`}>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Hora</th>
              <th>Aula</th>
              <th>Estado de Asistencia</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {asistenciasFiltradas.map((asistente, index) => (
              <tr key={index}>
                <td>{asistente.nombre}</td>
                <td>{asistente.hora}</td>
                <td>{asistente.aula}</td>



                <td onClick={() => resetEstado(index)}>
                  {asistente.estado ? (
                    <i className="material-icons">
                      {asistente.estado === 'presente'
                        ? 'check_circle'
                        : asistente.estado === 'ausente'
                        ? 'cancel'
                        : 'access_time'}
                    </i>
                  ) : (
                    <div className="btn-group">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEstadoChange(index, 'presente');
                        }}
                      >
                        <i className="material-icons">check_circle</i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEstadoChange(index, 'ausente');
                        }}
                      >
                        <i className="material-icons">cancel</i>
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEstadoChange(index, 'tarde');
                        }}
                      >
                        <i className="material-icons">access_time</i>
                      </button>
                    </div>
                  )}
                </td>



                <td>
                  {editandoObservacion === index ? (
                    <div>
                      <input
                        type="text"
                        value={observacionTemporal}
                        onChange={(e) => setObservacionTemporal(e.target.value)}
                        className="form-control"
                      />
                      <button
                        className="btn btn-primary btn-sm mt-1"
                        onClick={() => guardarObservacion(index)}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <span>{asistente.observacion || 'Comentario'}</span>
                      <button
                        className="btn btn-light btn-sm ms-2"
                        onClick={() => {
                          setEditandoObservacion(index);
                          setObservacionTemporal(asistente.observacion || '');
                        }}
                      >
                        <i className="material-icons">edit</i>
                      </button>
                    </div>
                  )}
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary">Generar y Enviar Reporte</button>
      </div>
    </div>
  );
};

export default AdminPage2;