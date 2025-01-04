import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Prefecta.module.css';

const RegistroAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [modulos, setModulos] = useState([]);

  const [filtroArea, setFiltroArea] = useState('');
  const [filtroHorario, setFiltroHorario] = useState('');

  const [editandoObservacion, setEditandoObservacion] = useState(null);
  const [observacionTemporal, setObservacionTemporal] = useState('');

  const fechaActual = new Date().toLocaleDateString();
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  
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

  const enviarAsistencias = async () => {
    try {
      const datosAsistencias = asistencias.map((asistencia) => ({
        estado: asistencia.estado,
        observacion: asistencia.observacion || '',
        rfcPrefAsist: localStorage.getItem('userRFC'),
        fecha: new Date().toISOString().split('T')[0],
        idHorAsis: asistencia.Id_HorAsis,
        rfcDocente: asistencia.RFC_DOCENTE,
      }));

      const response = await axios.post(
        `${baseURL}/api/registrar-asistencia`,
        { asistencias: datosAsistencias }
      );

      if (response.data.success) {
        alert('Asistencias registradas correctamente.');
      } else {
        alert(`Error al registrar asistencias: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error al enviar las asistencias:', error);
      alert('Ocurrió un error al registrar las asistencias.');
    }
  };

  useEffect(() => {
    axios
      .get(`${baseURL}/api/obtener-horarios`)
      .then((response) => setHorarios(response.data.horarios))
      .catch((error) => console.error('Error al cargar horarios:', error));
      
      const userRFC = localStorage.getItem('userRFC');

      axios
      .get(`${baseURL}/api/obtener-modulos/${userRFC}`) // RFC como parte de la ruta
      .then((response) => {
          if (response.data.success) {
              setModulos(response.data.modulos); // Configura los módulos en el estado
          } else {
              console.warn(response.data.message); // Mensaje si no hay módulos disponibles
          }
      })
      .catch((error) => console.error('Error al cargar módulos:', error));
  }, []);
  

  useEffect(() => {
    if (filtroHorario && filtroArea) {
        console.log('Enviando solicitud con parámetros:', { horario: filtroHorario, modulo: filtroArea });  // Depuración
        axios
            .get(`${baseURL}/api/obtener-asistenciasRegistradas`, {
                params: { horario: filtroHorario, modulo: filtroArea },
            })
            .then((response) => {
                console.log('Datos recibidos:', response.data);
                if (response.data.success) {
                    const registros = response.data.asistencias.map((asistencia) => ({
                        ...asistencia,
                        estado: asistencia.Estado || null,
                        observacion: asistencia.Observacion || '',
                    }));
                    setAsistencias(registros);
                } else {
                    setAsistencias([]);
                }
            })
            .catch((error) => console.error('Error al obtener las asistencias:', error));
    }
}, [filtroHorario, filtroArea]);

  

  return (
    <div className={`container-fluid ${styles.container}`}>
      <header className={`header ${styles.header}`}>
        <h1>Registro de Asistencias</h1>
        <a href="/" className={`btn btn-logout ${styles.btnLogout}`}>
          <i className="material-icons">logout</i> Salir
        </a>
      </header>

      <div className="d-flex justify-content-around mb-3">
        <div className="form-group">
          <label htmlFor="selectArea">Área</label>
          <select
            id="selectArea"
            className="form-control"
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
          >
            <option value="">Selecciona un área</option>
            {modulos.map((modulo) => (
              <option key={modulo.Id_Modulo} value={modulo.Id_Modulo}>
                {modulo.Nombre_Modulo}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="selectHorario">Horario</label>
          <select
            id="selectHorario"
            className="form-control"
            value={filtroHorario}
            onChange={(e) => setFiltroHorario(e.target.value)}
          >
            <option value="">Selecciona un horario</option>
            {horarios.map((horario, index) => (
              <option key={index} value={horario.Hora_inicio}>
                {horario.Hora_inicio}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button className="btn btn-info" disabled>
          Calendario: {fechaActual}
        </button>
      </div>

      <div className={`table-container ${styles.tableContainer}`}>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Horario</th>
              <th>Aula</th>
              <th>Estado de Asistencia</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.length > 0 ? (
              asistencias.map((asistencia, index) => (
                <tr key={index}>
                  <td>{asistencia.NombreCompleto}</td>
                  <td>{asistencia.Hora_inicio}</td>
                  <td>{asistencia.Nombre_aula}</td>
                  <td onClick={() => resetEstado(index)}>
                    {asistencia.estado ? (
                      <i
                        className={`material-icons ${
                          asistencia.estado === 'presente'
                            ? styles.iconPresente
                            : asistencia.estado === 'ausente'
                            ? styles.iconAusente
                            : styles.iconTarde
                        }`}
                      >
                        {asistencia.estado === 'presente'
                          ? 'check_circle'
                          : asistencia.estado === 'ausente'
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
                        <span>{asistencia.observacion || 'Comentario'}</span>
                        <button
                          className="btn btn-light btn-sm ms-2"
                          onClick={() => {
                            setEditandoObservacion(index);
                            setObservacionTemporal(asistencia.observacion || '');
                          }}
                        >
                          <i className="material-icons">edit</i>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay asistencias para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={enviarAsistencias}>
          Generar y Enviar Reporte
        </button>
      </div>
    </div>
  );
};

export default RegistroAsistencias;
