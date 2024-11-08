require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Configurar conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// Middleware para parsear texto plano
app.use(bodyParser.text());

// Endpoint para recibir texto plano y guardarlo en la base de datos
app.post('/api/email', async (req, res) => {
  const text = req.body;

  // Supongamos que el texto tiene este formato:
  // "sender@example.com;Subject of the email;This is the body of the email"

  if (!sender || !subject || !body) {
    return res.status(400).json({ error: 'Formato incorrecto. Use "sender;subject;body".' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO emails (sender, subject, body) VALUES ($1, $2, $3) RETURNING *',
      ["sender", "subject", text]
    );
    res.status(201).json({ message: 'Correo guardado correctamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error al guardar el correo:', error);
    res.status(500).json({ error: 'Error al guardar el correo en la base de datos' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
