// server/db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',     // Cambia según tu configuración
  user: 'root',
  password: 'Sanchez0103',
  database: 'controlasistencia',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = db;
