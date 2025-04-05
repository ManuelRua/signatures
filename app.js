// servidor.js
const express = require('express');
const cors = require('cors'); // 👈 importar cors
const { generarImagen } = require('./modeloFirma');

const app = express();
const PORT = 3000;

app.use(cors()); // 👈 habilita CORS para todas las rutas y orígenes

app.get('/firma', (req, res) => {
    const nombre = req.query.nombre;
    const apellido = req.query.apellido;

    if (!nombre || !apellido) {
        return res.status(400).send('Faltan parámetros: nombre y apellido');
    }

    try {
        const buffer = generarImagen(nombre, apellido);

        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        console.error('Error al generar imagen:', error);
        res.status(500).send('Error al generar imagen');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
