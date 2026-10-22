import express from "express";
import ventasRoutes from './routes/ventas.js';
import 'dotenv/config';

const app = express();

//1. Middlewares para prosesae req.body
app.use(express.json());

//2. Montamos las rutas con el prefijo /api/v1/ventas
app.use('/api/v1/ventas', ventasRoutes);


//3. Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor Express  en http://localhost:${PORT}`);
});
