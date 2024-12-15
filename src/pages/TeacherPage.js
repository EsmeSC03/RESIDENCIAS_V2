import React, { useState } from "react";
import { FaBell } from "react-icons/fa";

const TeacherPage = () => {
  const [profile, setProfile] = useState({
    firstName: "Pedro",
    lastName: "Carmona",
    position: "Subdirector ",
    department: "Subdirección académica ",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", profile);
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    console.log("Usuario ha cerrado sesión");
    alert("Has cerrado sesión correctamente.");
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      {/* Sidebar */}
      <aside style={{ width: "25%", borderRight: "1px solid #ccc", padding: "20px" }}>
        <h2>Configuraciones</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px", fontWeight: "bold" }}>
            <a href="#" style={{ textDecoration: "none", color: "#000" }}>Perfil</a>
          </li>
          <li style={{ display: "flex", alignItems: "center" }}>
            <FaBell style={{ marginRight: "8px" }} />
            <a href="#" style={{ textDecoration: "none", color: "#000" }}>Notificaciones</a>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Salir
        </button>
      </aside>

      {/* Profile Form */}
      <main style={{ width: "75%", padding: "20px" }}>
        <h2>Perfil</h2>
        <p>Cambia tu foto de perfil y edita tu información personal.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="photo" style={{ display: "block", marginBottom: "8px" }}>Foto de Perfil</label>
            {profile.photo && (
              <img
                src={profile.photo}
                alt="Profile Preview"
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            )}
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "block", marginBottom: "10px" }}
            />
            <small>JPG o PNG. Tu foto se recortará automáticamente.</small>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                backgroundColor: "#f7f7f7",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                backgroundColor: "#f7f7f7",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={profile.position}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                backgroundColor: "#f7f7f7",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={profile.department}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                margin: "5px 0",
                backgroundColor: "#f7f7f7",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Actualizar perfil
          </button>
        </form>
      </main>
    </div>
  );
};

export default TeacherPage;
