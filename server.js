import express from "express";
import mysql from "mysql2/promise";
import 'dotenv/config';

const app = express();

//1. Middlewares para prosesae req.body
app.use(express.json());

//2. Pool de conexion mysql
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,

});

//3. endpoint GET: Consultar consolidado de ventas con parametro 
app.get('/api/v1/ventas/consolidado', async (req, res) => {
    try {

        const { suscursal, anio } = req.query;

        // Validacion de parámetros obligatorios

        if (!suscursal || !anio) {

            return res.status(400).json({
                error: 'Bad Request',
                message: 'Debe enviar ambos parametros'
            });
        }
        //Se ejecuta el SP en BD
        const [rows] = await pool.query('CALL db_ventas_tech(?, ?)', [suscursal, anio]);

        res.status(200).json({
            status: 'success',
            total_registros: rows[0] ? rows[0].length : 0,
            data: rows[0]
        });

    } catch (error) {
        console.log('Error en GET /ventas/consolidado', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });


    }

});

//4. Consultar el detalle de una venta por su identificador
app.get('/api/v1/ventas/detalle', async (req, res) => {
    try {
        const { id_venta } = req.query;
        const ventaId = Number(id_venta);

        if (!id_venta || !Number.isInteger(ventaId) || ventaId <= 0) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Debe enviar un id_venta válido'
            });
        }

        const [rows] = await pool.query(
            `SELECT v.fecha_venta,
                    c.nombre AS nombre_cliente,
                    c.ciudad AS ciudad_cliente,
                    p.nombre AS producto,
                    v.cantidad,
                    (v.cantidad * p.precio) AS monto_venta
             FROM ventas v
             INNER JOIN clientes c ON c.id_cliente = v.id_cliente
             INNER JOIN productos p ON p.id_producto = v.id_producto
             WHERE v.id_venta = ?`,
            [ventaId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'No se encontró una venta con ese id_venta'
            });
        }

        return res.status(200).json({ status: 'success', data: rows[0] });
    } catch (error) {
        console.log('Error en GET /ventas/detalle:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
    }
});


//5. Endpoint POST: INGRESAR NUEVA VENTA
app.post('/api/v1/ventas', async (req, res) => {
  try {
    const { id_producto, id_cliente, cantidad, fecha_venta } = req.body;

    // Validacion de Datos
    if (!id_producto || !id_cliente || !cantidad || !fecha_venta) {
      return res.status(400).json({
        error: "Bad Request",
        message: "todos los parámetros obligatorios"
      });
    }

    //inserta datos en la bd
    await pool.query('CALL db_registrar_venta(?, ?, ?, ?)', [
      id_producto, id_cliente, cantidad, fecha_venta
    ]);

    //Respuesta 201 Created
    res.status(201).json({
      status: 'created',
      message: 'Venta registrada correctamente',
      datos_registrados: { id_producto, id_cliente, cantidad, fecha_venta }
    });

  } catch (error) {
    console.log('Error en POST /ventas:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Error al Insertar' });
  }
});

//6. Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor Express  en http://localhost:${PORT}`);
});
