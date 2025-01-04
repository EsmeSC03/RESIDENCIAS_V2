const express = require('express');
const cors = require('cors');
const db = require('./bd'); 

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    const query = 'SELECT * FROM usuario WHERE Correo = ? AND Contraseña = ?';
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      
      if (results.length > 0) {
        const user = results[0]; 
        res.json({
          success: true,
          user: {
            Tipo_Usuario: user.Tipo_Usuario,
            RFC: user.RFC, // Incluye el RFC
          },
        });
      } else {
        res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
      }
    });
  });
  

  app.get('/api/user/:rfc', (req, res) => {
    const rfc = req.params.rfc;
  
    const query = 'SELECT Nombre, Apellido_p, Apellido_m FROM usuario WHERE RFC = ?';
    db.query(query, [rfc], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
  
      if (results.length > 0) {
        const user = results[0];
        res.json({
          success: true,
          user: {
            Nombre: user.Nombre,
            Apellido_p: user.Apellido_p,
            Apellido_m: user.Apellido_m,
          },
        });
      } else {
        res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    });
  });



  
  app.get('/api/reportes', (req, res) => {
    const query = `
      SELECT 
        CONCAT(usuario.Nombre, ' ', usuario.Apellido_p, ' ', usuario.Apellido_m) AS Nombre_Completo, 
        asistencia.Fecha, 
        horario.Nombre_aula, 
        horario.Hora_inicio, 
        asistencia.Estado,
        asistencia.Observacion
      FROM asistencia 
      INNER JOIN usuario ON asistencia.RFC_DOCENTE = usuario.RFC 
      INNER JOIN horario ON asistencia.Id_HorAsis = horario.Id_Horario;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
  
      if (results.length > 0) {
        res.json({ success: true, reportes: results });
      } else {
        res.status(404).json({ success: false, message: 'No hay reportes disponibles' });
      }
    });
  });

  app.get('/api/reportes-docente', (req, res) => {
    const { RFC_DOCENTE } = req.query;
  
    if (!RFC_DOCENTE) {
      return res.status(400).json({ error: 'Falta el parámetro RFC_DOCENTE' });
    }
  
    const query = `
      SELECT 
        CONCAT(usuario.Nombre, ' ', usuario.Apellido_p, ' ', usuario.Apellido_m) AS Nombre_Completo, 
        asistencia.Fecha, 
        horario.Nombre_aula, 
        horario.Hora_inicio, 
        asistencia.Estado,
        asistencia.Observacion
      FROM asistencia 
      INNER JOIN usuario ON asistencia.RFC_DOCENTE = usuario.RFC 
      INNER JOIN horario ON asistencia.Id_HorAsis = horario.Id_Horario
      WHERE asistencia.RFC_DOCENTE = ?;
    `;
  
    db.query(query, [RFC_DOCENTE], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
  
      if (results.length > 0) {
        res.json({ success: true, reportes: results });
      } else {
        res.status(404).json({ success: false, message: 'No hay reportes disponibles' });
      }
    });
  });
  

  
  app.get('/api/horario', (req, res) => {
    const query = `
        SELECT CONCAT(Nombre, ' ', Apellido_p, ' ', Apellido_m) AS NombreProfesor, 
               MIN(Hora_inicio) AS HoraEntrada, 
               MAX(Hora_fin) AS HoraSalida 
        FROM horario 
        INNER JOIN usuario ON RFC_H = RFC 
        GROUP BY RFC_H 
        ORDER BY NombreProfesor ASC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            res.json({
                success: true,
                horarios: results,  // Aquí devolvemos el arreglo de resultados
            });
        } else {
            res.status(404).json({ success: false, message: 'No hay horarios disponiblesfsafsafs' });
        }
    });
});

app.get('/api/prefectas', (req, res) => {
    const query = `
        SELECT RFC, CONCAT(Nombre, ' ', Apellido_p, ' ', Apellido_m) AS NombrePrefecta 
        FROM usuario 
        WHERE Tipo_Usuario = 'PREFECTA';
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            res.json({
                success: true,
                prefectas: results,  // Devolvemos la lista de prefectas
            });
        } else {
            res.status(404).json({ success: false, message: 'No hay prefectas disponibles' });
        }
    });
});

app.get('/api/areas', (req, res) => {
    const query = `
        SELECT Id_Modulo, Nombre_Modulo 
        FROM modulo;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            res.json({
                success: true,
                areas: results,  // Devolvemos la lista de áreas (módulos)
            });
        } else {
            res.status(404).json({ success: false, message: 'No hay áreas disponibles' });
        }
    });
});

app.get('/api/estadisticas', (req, res) => {
    const vista = req.query.vista || "dia"; // Día, semana, mes
    let rango;
  
    switch (vista) {
      case "dia":
        rango = `DATE(Fecha) = CURRENT_DATE`;
        break;
      case "semana":
        rango = `YEARWEEK(Fecha, 1) = YEARWEEK(CURRENT_DATE, 1)`;
        break;
      case "mes":
        rango = `MONTH(Fecha) = MONTH(CURRENT_DATE) AND YEAR(Fecha) = YEAR(CURRENT_DATE)`;
        break;
      default:
        rango = `DATE(Fecha) = CURRENT_DATE`;
    }
  
    const query = `
      SELECT Estado, COUNT(*) as count 
      FROM asistencia 
      WHERE ${rango} 
      GROUP BY Estado;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }
  
      const estadisticas = { asistencias: 0, retardos: 0, faltas: 0 };
      results.forEach((row) => {
        if (row.Estado === "presente") estadisticas.asistencias = row.count;
        else if (row.Estado === "tarde") estadisticas.retardos = row.count;
        else if (row.Estado === "ausente") estadisticas.faltas = row.count;
      });
  
      res.json({ success: true, estadisticas });
    });
  });
  

  app.get('/api/graficas', (req, res) => {
    const filtro = req.query.filtro || "dia";
    let condicion;

    switch (filtro) {
        case "dia":
            condicion = `DATE(Fecha) = CURRENT_DATE`;
            break;
        case "semana":
            condicion = `YEARWEEK(Fecha, 1) = YEARWEEK(CURRENT_DATE, 1)`;
            break;
        case "mes":
            condicion = `MONTH(Fecha) = MONTH(CURRENT_DATE) AND YEAR(Fecha) = YEAR(CURRENT_DATE)`;
            break;
        default:
            condicion = `DATE(Fecha) = CURRENT_DATE`;
    }

    const queryAsistencias = `
    SELECT DATE_FORMAT(Fecha, '%d/%m/%Y') AS label, COUNT(*) AS count
    FROM asistencia
    WHERE Estado = 'presente' AND ${condicion}
    GROUP BY label;
`;
const queryRetardos = `
    SELECT DATE_FORMAT(Fecha, '%d/%m/%Y') AS label, COUNT(*) AS count
    FROM asistencia
    WHERE Estado = 'tarde' AND ${condicion}
    GROUP BY label;
`;
const queryFaltas = `
    SELECT DATE_FORMAT(Fecha, '%d/%m/%Y') AS label, COUNT(*) AS count
    FROM asistencia
    WHERE Estado = 'ausente' AND ${condicion}
    GROUP BY label;
`;

    db.query(queryAsistencias, (err, resultsAsistencias) => {
        if (err) return res.status(500).json({ error: 'Error en la base de datos' });

        db.query(queryRetardos, (err, resultsRetardos) => {
            if (err) return res.status(500).json({ error: 'Error en la base de datos' });

            db.query(queryFaltas, (err, resultsFaltas) => {
                if (err) return res.status(500).json({ error: 'Error en la base de datos' });

                res.json({
                    success: true,
                    datosGraficas: {
                        asistencias: resultsAsistencias,
                        retardos: resultsRetardos,
                        faltas: resultsFaltas,
                    },
                });
            });
        });
    });
});

  

app.get('/api/obtener-usuario', (req, res) => {
    const rfc = req.query.RFC;  // Obtener el RFC desde los parámetros de la URL

    if (!rfc) {
        return res.status(400).json({ error: 'RFC es requerido' });
    }

    // Consultar en la base de datos para obtener el usuario con el RFC
    const queryUsuario = `SELECT Correo, Nombre, RFC FROM usuario WHERE RFC = ?`;
    db.query(queryUsuario, [rfc], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Enviar los datos del usuario
        res.json({ success: true, usuario: results[0] });
    });
});






app.post('/api/actualizar-usuario', (req, res) => {
    const { RFC, contrasenaActual, nuevoCorreo, nuevaContrasena } = req.body;  // Corregido aquí

    if (!RFC || !contrasenaActual) {
        return res.status(400).json({ error: 'RFC y contraseña actual son requeridos' });
    }

    const queryUsuario = `SELECT * FROM usuario WHERE RFC = ?`;
    db.query(queryUsuario, [RFC], (err, results) => {
        if (err) {
            console.error("Error al consultar la base de datos:", err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];

        if (usuario.Contraseña !== contrasenaActual) {
            console.log("Contraseña incorrecta.");
            return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
        } else {
            console.log("Contraseña actual correcta.");
        }

        let updateQuery = 'UPDATE usuario SET ';
        let queryParams = [];

        if (nuevaContrasena) {
            console.log("Nueva contraseña proporcionada:", nuevaContrasena);
            updateQuery += 'Contraseña = ?';
            queryParams.push(nuevaContrasena);
        }

        if (nuevoCorreo) {
            console.log("Nuevo correo proporcionado:", nuevoCorreo);
            if (nuevaContrasena) {
                updateQuery += ', ';  
            }
            updateQuery += 'Correo = ?';
            queryParams.push(nuevoCorreo);
        }

        updateQuery += ' WHERE RFC = ?';
        queryParams.push(RFC);

        db.query(updateQuery, queryParams, (err, results) => {
            if (err) {
                console.error("Error al ejecutar la actualización:", err);
                return res.status(500).json({ error: 'Error al actualizar los datos' });
            }

            console.log("Datos actualizados correctamente.");
            res.json({ success: true, message: 'Datos actualizados correctamente' });
        });
    });
});


app.get('/api/recorridos', (req, res) => {
    const { rfc } = req.query;

    if (!rfc) {
        return res.status(400).json({ success: false, message: 'El RFC del usuario es requerido.' });
    }

    const query = `
        SELECT Fecha_Inicio, Fecha_Termino, Turno, Nombre_Modulo 
        FROM asigna_aula 
        INNER JOIN modulo ON asigna_aula.Id_ModuloAsig = modulo.Id_Modulo 
        WHERE RFC_Pref = ? 
        AND WEEK(Fecha_Inicio, 1) = WEEK(CURDATE(), 1) AND 
        YEAR(Fecha_Inicio) = YEAR(CURDATE());
    `;

    db.query(query, [rfc], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            res.json({ success: true, recorridos: results });
        } else {
            res.status(404).json({ success: false, message: 'No hay recorridos asignados para esta semana.' });
        }
    });
});

app.get('/api/modulos-ocupados', (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ success: false, message: 'Las fechas de inicio y fin son requeridas.' });
    }

    const query = `
        SELECT Nombre_Modulo, Fecha_Inicio, Fecha_Termino, Turno, RFC_Pref
        FROM asigna_aula 
        INNER JOIN modulo ON asigna_aula.Id_ModuloAsig = modulo.Id_Modulo
        WHERE Fecha_Inicio <= ? AND Fecha_Termino >= ?;
    `;

    db.query(query, [fechaFin, fechaInicio], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Error en la base de datos' });
        }

        res.json({ success: true, modulosOcupados: results });
    });
});


app.post('/api/asigna-aula', (req, res) => {
    const { RFC_Sub, RFC_Pref, Id_ModuloAsig, Fecha_Inicio, Fecha_Termino, Turno } = req.body;

    // Validar que se hayan enviado todos los datos necesarios
    if (!RFC_Sub || !RFC_Pref || !Id_ModuloAsig || !Fecha_Inicio || !Fecha_Termino || !Turno) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Query para insertar los datos en la tabla asigna_aula
    const query = `
        INSERT INTO asigna_aula (RFC_Sub, RFC_Pref, Id_ModuloAsig, Fecha_Inicio, Fecha_Termino, Turno)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [RFC_Sub, RFC_Pref, Id_ModuloAsig, Fecha_Inicio, Fecha_Termino, Turno], (err, result) => {
        if (err) {
            console.error('Error al insertar en la tabla asigna_aula:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        res.status(201).json({
            success: true,
            message: 'Asignación registrada exitosamente',
            asignacionId: result.insertId, // ID del registro recién creado
        });
    });
});

app.put('/api/asigna-aula', (req, res) => {
    const { RFC_Sub, RFC_Pref, Id_ModuloAsig, Fecha_Inicio, Fecha_Termino, Turno } = req.body;

    if (!RFC_Sub || !RFC_Pref || !Id_ModuloAsig || !Fecha_Inicio || !Fecha_Termino || !Turno) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios para actualizar.' });
    }

    const query = `
        UPDATE asigna_aula
        SET Fecha_Inicio = ?, Fecha_Termino = ?, Turno = ?
        WHERE RFC_Sub = ? AND RFC_Pref = ? AND Id_ModuloAsig = ?
    `;

    db.query(query, [Fecha_Inicio, Fecha_Termino, Turno, RFC_Sub, RFC_Pref, Id_ModuloAsig], (err, result) => {
        if (err) {
            console.error('Error al actualizar el registro:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        res.json({ success: true, message: 'Registro actualizado exitosamente.' });
    });
});

app.delete('/api/asigna-aula', (req, res) => {
    const { RFC_Sub, RFC_Pref, Id_ModuloAsig } = req.body;

    if (!RFC_Sub || !RFC_Pref || !Id_ModuloAsig) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios para eliminar.' });
    }

    const query = `
        DELETE FROM asigna_aula
        WHERE RFC_Sub = ? AND RFC_Pref = ? AND Id_ModuloAsig = ?
    `;

    db.query(query, [RFC_Sub, RFC_Pref, Id_ModuloAsig], (err, result) => {
        if (err) {
            console.error('Error al eliminar el registro:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        res.json({ success: true, message: 'Registro eliminado exitosamente.' });
    });
});

















app.get('/api/obtener-asistencias', (req, res) => {
    const { horario, modulo } = req.query;

    if (!horario || !modulo) {
        return res.status(400).json({ error: 'Se requieren los parámetros horario y modulo' });
    }

    const diaActual = new Date().getDay() + 1;

    const query = `
        SELECT 
            CONCAT(usuario.Nombre, ' ', usuario.Apellido_p, ' ', usuario.Apellido_m) AS NombreCompleto,
            usuario.RFC AS RFC_DOCENTE,
            modulo.Id_Modulo,
            horario.Id_horario AS Id_HorAsis,
            horario.Hora_inicio,
            horario.Nombre_aula
        FROM usuario
        INNER JOIN horario ON usuario.RFC = horario.RFC_H
        INNER JOIN aula ON horario.Nombre_aula = aula.Nombre_aula
        INNER JOIN modulo ON aula.Id_ModuloAula = modulo.Id_Modulo
        WHERE horario.Hora_inicio = ? 
          AND modulo.Id_Modulo = ? 
          AND horario.Dia_semana = ?;
    `;

    const params = [horario, modulo, diaActual];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        res.json({
            success: true,
            asistencias: results,
        });
    });
});




// Endpoint para obtener los horarios
app.get('/api/obtener-horarios', (req, res) => {
    const query = `
        SELECT DISTINCT Hora_inicio
        FROM horario;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            res.json({
                success: true,
                horarios: results,  // Devolvemos la lista de horarios
            });
        } else {
            res.status(404).json({ success: false, message: 'No hay horarios disponibles' });
        }
    });
});

// Endpoint para obtener los módulos
app.get('/api/obtener-modulos/:RFC_Pref', (req, res) => {
    const { RFC_Pref } = req.params; // Obtenemos el RFC desde los parámetros de la ruta

    if (!RFC_Pref) {
        return res.status(400).json({ error: 'RFC_Pref es requerido' });
    }

    const query = `
        SELECT Id_Modulo, Nombre_Modulo
        FROM asigna_aula 
        INNER JOIN modulo on asigna_aula.Id_ModuloAsig = modulo.Id_Modulo
        WHERE asigna_aula.RFC_Pref = ?
        AND WEEK(Fecha_Inicio, 1) = WEEK(CURDATE(), 1) AND 
        YEAR(Fecha_Inicio) = YEAR(CURDATE());
    `;

    db.query(query, [RFC_Pref], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        if (results.length > 0) {
            res.json({
                success: true,
                modulos: results, // Devolvemos la lista de módulos
            });
        } else {
            res.status(404).json({ success: false, message: 'No hay módulos disponibles' });
        }
    });
});





app.post('/api/registrar-asistencia', (req, res) => {
    const { asistencias } = req.body;

    if (!asistencias || asistencias.length === 0) {
        return res.status(400).json({ error: 'No se enviaron asistencias para registrar' });
    }

    // Construir consulta con múltiples valores
    const placeholders = asistencias.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
    const insertQuery = `
        INSERT INTO asistencia (Id_HorAsis, RFC_DOCENTE, Estado, Observacion, RFC_PrefAsist, Fecha)
        VALUES ${placeholders}
    `;

    // Crear un array con todos los valores
    const values = asistencias.flatMap(asistencia => [
        asistencia.idHorAsis,         // Id_HorAsis
        asistencia.rfcDocente,       // RFC_DOCENTE
        asistencia.estado,           // Estado
        asistencia.observacion || '',// Observacion
        asistencia.rfcPrefAsist,     // RFC_PREF_ASIST
        asistencia.fecha             // Fecha
    ]);

    // Ejecutar la consulta
    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error('Error al insertar asistencias:', err);
            return res.status(500).json({ error: 'Error al registrar las asistencias en la base de datos' });
        }

        res.json({ success: true, message: 'Asistencias registradas exitosamente' });
    });
});







app.get('/api/obtener-asistenciasRegistradas', (req, res) => {

    const { horario, modulo } = req.query;

    if (!horario || !modulo) {
        return res.status(400).json({ error: 'Se requieren los parámetros horario y modulo' });
    }

    const diaActual = new Date().getDay() + 1;
    const fechaActual = new Date().toISOString().split('T')[0];

    const query = `
        SELECT 
            CONCAT(usuario.Nombre, ' ', usuario.Apellido_p, ' ', usuario.Apellido_m) AS NombreCompleto,
            usuario.RFC AS RFC_DOCENTE,
            modulo.Id_Modulo,
            horario.Id_horario AS Id_HorAsis,
            horario.Hora_inicio,
            horario.Nombre_aula,
            COALESCE(asistencia.Estado, NULL) AS Estado,
            COALESCE(asistencia.Observacion, '') AS Observacion
        FROM usuario
        INNER JOIN horario ON usuario.RFC = horario.RFC_H
        INNER JOIN aula ON horario.Nombre_aula = aula.Nombre_aula
        INNER JOIN modulo ON aula.Id_ModuloAula = modulo.Id_Modulo
        LEFT JOIN asistencia ON horario.Id_horario = asistencia.Id_HorAsis
            AND asistencia.Fecha = ?
        WHERE horario.Hora_inicio = ? 
          AND modulo.Id_Modulo = ? 
          AND horario.Dia_semana = ?;
    `;

    const params = [fechaActual, horario, modulo, diaActual];


    // Realiza la consulta a la base de datos
    db.query(query, [fechaActual, horario, modulo, diaActual], (err, results) => {
        if (err) {
            console.error('Error en la consulta a la base de datos:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }


        res.json({
            success: true,
            asistencias: results,
        });
    });
});






// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
