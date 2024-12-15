import React from "react";
import { Button, Card, Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

const JefeAcademico = () => {
  const teachers = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@institucion.edu",
      status: "ACTIVO",
      role: "DOCENTE",
      avatar: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "María López",
      email: "maria.lopez@institucion.edu",
      status: "INACTIVO",
      role: "DOCENTE",
      avatar: "https://via.placeholder.com/100",
    },
  ];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
        Gestión de Docentes
      </Typography>

      {/* Lista de docentes */}
      <List style={{ marginTop: "20px" }}>
        {teachers.map((teacher) => (
          <Card
            key={teacher.id}
            style={{
              marginBottom: "15px",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ListItemAvatar>
              <Avatar src={teacher.avatar} alt={teacher.name} style={{ width: "70px", height: "70px" }} />
            </ListItemAvatar>

            <ListItemText
              primary={teacher.name}
              secondary={
                <>
                  <div><strong>Correo:</strong> {teacher.email}</div>
                  <div>
                    <strong>Estado:</strong> 
                    <span
                      style={{
                        color: "#fff",
                        backgroundColor: teacher.status === "ACTIVO" ? "#4caf50" : "#f44336",
                        padding: "3px 8px",
                        borderRadius: "10px",
                        marginLeft: "5px",
                      }}
                    >
                      {teacher.status}
                    </span>
                  </div>
                </>
              }
            />

            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="outlined"
                style={{ marginRight: "10px" }}
                onClick={() => alert(`Detalles de ${teacher.name}`)}
              >
                Ver Detalles
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => alert(`Editar datos de ${teacher.name}`)}
              >
                Editar Datos
              </Button>
            </div>
          </Card>
        ))}
      </List>

      {/* Botón de Salir */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          variant="contained"
          color="error"
          style={{ borderRadius: "20px", fontWeight: "bold" }}
          onClick={() => alert("Sesión cerrada")}
        >
          Salir
        </Button>
      </div>
    </div>
  );
};

export default JefeAcademico;
