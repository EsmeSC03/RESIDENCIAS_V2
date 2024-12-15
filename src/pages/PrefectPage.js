import React, { useState } from 'react';
import styles from '../styles/Prefecta.module.css';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import { jsPDF } from 'jspdf'; // Importar jsPDF para generar el PDF
import emailjs from 'emailjs-com'; // Importar EmailJS para enviar correos

const RegistroAsistencias = () => {
  const [asistencias, setAsistencias] = useState([
    { nombre: 'Juan Pérez', hora: '08:00 AM', aula: 'Aula 101', observaciones: 'Observaciones', estado: null },
    { nombre: 'Ana López', hora: '09:00 AM', aula: 'Aula 202', observaciones: 'Observaciones', estado: null },
    { nombre: 'Pedro Sánchez', hora: '10:00 AM', aula: 'Aula 303', observaciones: 'Observaciones', estado: null },
  ]);

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

  const generarReporteYEnviarCorreo = () => {
    // Filtrar los registros que tienen retardos o faltas
    const registrosFiltrados = asistencias.filter(
      (asistente) => asistente.estado === 'tarde' || asistente.estado === 'ausente'
    );

    if (registrosFiltrados.length === 0) {
      alert('No hay docentes con retardos o ausencias para generar un reporte.');
      return;
    }

    // Generar el PDF usando jsPDF
    const doc = new jsPDF();
    doc.text("Reporte de Retardos y Faltas", 10, 10);
    doc.text("Fecha: " + new Date().toLocaleString(), 10, 20);
    doc.text("---------------------------------------------------", 10, 30);

    // Agregar datos al PDF
    registrosFiltrados.forEach((registro, index) => {
      doc.text(
        `${registro.nombre} | Hora: ${registro.hora} | Aula: ${registro.aula} | Estado: ${registro.estado} | Observaciones: ${registro.observaciones}`,
        10,
        40 + index * 10
      );
    });

    // Convertir el PDF a un blob para enviarlo como archivo adjunto
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);2

    // Configurar los parámetros de EmailJS
    const templateParams = {
      to_email: 'pedro.mc@matehuala.tecnm.mx', // Correo destino
      subject: 'Reporte de Retardos y Faltas',
      message: 'Se adjunta el reporte de retardos y faltas de los docentes.',
      attachment: pdfBlob, // Adjuntar el archivo PDF generado
    };

    // Enviar el correo con EmailJS
    emailjs
      .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID') // Reemplazar con tus credenciales de EmailJS
      .then((response) => {
        console.log('Correo enviado con éxito:', response);
        alert('El reporte se ha enviado por correo.');
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        alert('Hubo un error al enviar el reporte.');
      });
  };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <header className={`header ${styles.header}`}>
        <h1>Registro de Asistencias</h1>
        <a href="/" className={`btn btn-logout ${styles.btnLogout}`}>
          <i className="material-icons">logout</i>
          Salir
        </a>
      </header>

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
            {asistencias.map((asistente, index) => (
              <tr key={index}>
                <td>{asistente.nombre}</td>
                <td>{asistente.hora}</td>
                <td>{asistente.aula}</td>
                <td
                  className={`${styles.estadoCelda} ${styles[asistente.estado]}`}
                  onClick={() => resetEstado(index)}
                >
                  {asistente.estado ? (
                    <i className="material-icons">
                      {asistente.estado === 'presente' ? 'check_circle' : 
                      asistente.estado === 'ausente' ? 'cancel' : 'access_time'}
                    </i>
                  ) : (
                    <div className={`${styles.btnGroup} d-flex justify-content-center`}>
                      <button
                        className={`btn btn-success btn-sm ${styles.btnCircle}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEstadoChange(index, 'presente');
                        }}
                      >
                        <i className="material-icons">check_circle</i>
                      </button>
                      <button
                        className={`btn btn-danger btn-sm ${styles.btnCircle}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEstadoChange(index, 'ausente');
                        }}
                      >
                        <i className="material-icons">cancel</i>
                      </button>
                      <button
                        className={`btn btn-warning btn-sm ${styles.btnCircle}`}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={generarReporteYEnviarCorreo}>
          Generar y Enviar Reporte (Retardos y Faltas)
        </button>
      </div>
    </div>
  );
};

export default RegistroAsistencias;
