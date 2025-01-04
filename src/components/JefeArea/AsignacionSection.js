import React, { useState, useEffect } from "react";
import styles from "../../styles/Admin.module.css";
import { FaUser, FaClipboardList, FaCheckSquare } from "react-icons/fa";

const AsignacionSection = () => {
  const [selectedUser, setSelectedUser] = useState(""); // Usuario seleccionado
  const [selectedAreas, setSelectedAreas] = useState([]); // Áreas seleccionadas
  const [selectedShift, setSelectedShift] = useState("Matutino"); // Turno seleccionado
  const [users, setUsers] = useState([]); // Lista de prefectas
  const [areas, setAreas] = useState([]); // Lista de áreas (módulos)
  const [startDate, setStartDate] = useState(""); // Fecha de inicio
  const [endDate, setEndDate] = useState(""); // Fecha de fin
  const [recorridos, setRecorridos] = useState([]); // Recorridos asignados al usuario
  const [occupiedModules, setOccupiedModules] = useState([]); // Módulos ocupados
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  // Obtener los usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseURL}/api/prefectas`);
        const data = await response.json();
        if (data.success) {
          setUsers(data.prefectas);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  // Obtener las áreas desde la API
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(`${baseURL}/api/areas`);
        const data = await response.json();
        if (data.success) {
          setAreas(data.areas);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
      }
    };
    fetchAreas();
  }, []);

  // Obtener módulos ocupados según fechas seleccionadas
  useEffect(() => {
    const fetchOccupiedModules = async () => {
      if (!startDate || !endDate) {
        setOccupiedModules([]);
        return;
      }

      try {
        const response = await fetch(
          `${baseURL}/api/modulos-ocupados?fechaInicio=${startDate}&fechaFin=${endDate}`
        );
        const data = await response.json();
        if (data.success) {
          const filteredModules = data.modulosOcupados.filter((mod) => {
            const moduloStart = new Date(mod.Fecha_Inicio);
            const moduloEnd = new Date(mod.Fecha_Termino);
            const selectedStart = new Date(startDate);
            const selectedEnd = new Date(endDate);

            // Verificar solapamiento entre las fechas seleccionadas y los registros
            return (
              (selectedStart <= moduloEnd && selectedEnd >= moduloStart) &&
              mod.RFC_Pref !== selectedUser // Excluir registros del usuario actual
            );
          });

          setOccupiedModules(filteredModules.map((mod) => mod.Nombre_Modulo));
        } else {
          console.error(data.message);
          setOccupiedModules([]);
        }
      } catch (error) {
        console.error("Error al obtener los módulos ocupados:", error);
        setOccupiedModules([]);
      }
    };
    fetchOccupiedModules();
  }, [startDate, endDate, selectedUser]);

  // Obtener los recorridos del usuario seleccionado
  useEffect(() => {
    if (selectedUser) {
      const fetchRecorridos = async () => {
        try {
          const response = await fetch(
            `${baseURL}/api/recorridos?rfc=${selectedUser}`
          );
          const data = await response.json();
          if (data.success) {
            setRecorridos(data.recorridos);

            // Actualizar valores seleccionados
            const areasAsignadas = data.recorridos.map((recorrido) => recorrido.Nombre_Modulo);
            setSelectedAreas(areasAsignadas);
            setStartDate(data.recorridos[0]?.Fecha_Inicio?.split("T")[0] || "");
            setEndDate(data.recorridos[0]?.Fecha_Termino?.split("T")[0] || "");
            setSelectedShift(data.recorridos[0]?.Turno || "Matutino");
          } else {
            setRecorridos([]);
            setSelectedAreas([]);
            setStartDate("");
            setEndDate("");
            setSelectedShift("Matutino");
            console.warn(data.message);
          }
        } catch (error) {
          console.error("Error al obtener los recorridos:", error);
        }
      };
      fetchRecorridos();
    } else {
      setRecorridos([]);
      setSelectedAreas([]);
      setStartDate("");
      setEndDate("");
      setSelectedShift("Matutino");
    }
  }, [selectedUser, startDate, endDate]);
 // Módulos ocupados

  



  const handleAreaChange = (area) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleSubmit = async () => {
    if (selectedUser === "") {
      alert("Por favor, selecciona un usuario.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Por favor, selecciona las fechas de inicio y fin.");
      return;
    }

    if (selectedAreas.length === 0) {
      alert("Por favor, selecciona al menos un área.");
      return;
    }

    const userRFC = localStorage.getItem("userRFC");

    try {
      const requests = selectedAreas.map((area) => {
        const moduleId = areas.find((a) => a.Nombre_Modulo === area).Id_Modulo;
        return fetch(`${baseURL}/api/asigna-aula`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            RFC_Sub: userRFC,
            RFC_Pref: selectedUser,
            Id_ModuloAsig: moduleId,
            Fecha_Inicio: startDate,
            Fecha_Termino: endDate,
            Turno: selectedShift,
          }),
        });
      });

      await Promise.all(requests);
      alert("Asignaciones actualizadas exitosamente.");
    } catch (error) {
      console.error("Error al registrar las asignaciones:", error);
      alert("Hubo un error al registrar las asignaciones.");
    }
  };

  return (
    <div id="asignacion-recorrido" className={styles["asignacion-container"]}>
      <h2 style={{ color: "#1E3A8A" }}>Asignación de Recorrido</h2>

      <div className={styles["asignacion-row"]}>
        <div className={styles["asignacion-column"]}>
          <label htmlFor="user-select"><FaUser /> Nombre del Usuario:</label>
          <select
            id="user-select"
            className={styles["asignacion-select"]}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ borderColor: "#1E3A8A", color: "#1E3A8A" }}
          >
            <option value="" disabled>Selecciona un usuario</option>
            {users.map((user) => (
              <option key={user.RFC} value={user.RFC}>
                {user.NombrePrefecta}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles["asignacion-row"]}>
        <div className={styles["asignacion-column"]}>
          <label htmlFor="start-date">Fecha de inicio:</label>
          <input
            type="date"
            id="start-date"
            className={styles["asignacion-input"]}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className={styles["asignacion-column"]}>
          <label htmlFor="end-date">Fecha de fin:</label>
          <input
            type="date"
            id="end-date"
            className={styles["asignacion-input"]}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className={styles["asignacion-column"]}>
          <label htmlFor="shift-select">Turno:</label>
          <select
            id="shift-select"
            className={styles["asignacion-select"]}
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            style={{ borderColor: "#1E3A8A", color: "#1E3A8A" }}
          >
            <option value="Matutino">Matutino</option>
            <option value="Vespertino">Vespertino</option>
          </select>
        </div>
      </div>

      <div className={styles["asignacion-areas"]}>
        <label><FaClipboardList /> Áreas Disponibles:</label>
        
        
        <div className={styles["asignacion-areas-container"]}>
    {areas.map((area) => (
        <div key={area.Id_Modulo} className={styles["asignacion-area-card"]}>
            <input
                type="checkbox"
                id={`area-${area.Id_Modulo}`}
                checked={selectedAreas.includes(area.Nombre_Modulo)}
                onChange={() => {
                    if (!occupiedModules.includes(area.Nombre_Modulo)) {
                        handleAreaChange(area.Nombre_Modulo);
                    }
                }}
                disabled={occupiedModules.includes(area.Nombre_Modulo)} // Deshabilitar si el módulo está ocupado
            />
            <label
                htmlFor={`area-${area.Id_Modulo}`}
                className={styles["asignacion-area-label"]}
                style={{
                    color: occupiedModules.includes(area.Nombre_Modulo) ? 'orange' : 'inherit',
                }}
            >
                {area.Nombre_Modulo}
                {occupiedModules.includes(area.Nombre_Modulo) && 
                 !selectedAreas.includes(area.Nombre_Modulo) && 
                 " (Asignado)"}
            </label>
        </div>
    ))}
</div>


      </div>

      <button onClick={handleSubmit} className={styles["asignacion-button"]}>
        <FaCheckSquare /> Confirmar Asignación
      </button>
    </div>
  );
};

export default AsignacionSection;
