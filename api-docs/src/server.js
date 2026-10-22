const express = require('express');
const ventasRoutes = require('./routes/ventas');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas de ventas
app.use('/api/ventas', ventasRoutes);

// Ruta de salud para verificar que el servidor está funcionando
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'API is running' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});