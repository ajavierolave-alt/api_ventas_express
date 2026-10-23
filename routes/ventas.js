import {Router} from 'express';
import { pool } from '../db.js';



const router = Router();

const isPositiveInteger = (value) =>
    Number.isSafeInteger(value) && value > 0;

const isValidDate = (value) => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split('-').map(Number);
    if (year < 1000) {
        return false;
    }

    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day;
};

//3. endpoint GET: Consultar consolidado de ventas con parametro
router.get('/consolidado', async (req, res) => {
    try {
        const { sucursal, anio } = req.query;

        if (
            typeof sucursal !== 'string' ||
            sucursal.trim() === '' ||
            typeof anio !== 'string' ||
            !/^\d{4}$/.test(anio)
        ) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Debe enviar una sucursal y un año válido'
            });
        }

        const [rows] = await pool.query('CALL db_ventas_tech(?, ?)', [sucursal.trim(), Number(anio)]);

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

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!isPositiveInteger(id)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Debe enviar un ID de venta válido'
    });
  }

  try {
    const [result] = await pool.query('CALL sp_venta_id(?)', [id]);

    const ventaEncontrada = result[0];

    if (!ventaEncontrada || ventaEncontrada.length === 0) {
      return res.status(404).json({
        status: 'Error',
        message: `No se encontró la venta con el ID ${id}`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: ventaEncontrada[0]
    });

  } catch (error) {
    console.log(`Error en GET /api/v1/ventas/${id}:`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error en MySQL'
    });
  }
});

//4. Consultar el detalle de una venta por su identificador
router.post('/detalle', async (req, res) => {
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
        console.log('Error en POST /ventas/detalle:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Error en MySQL' });
    }
});

//5. Endpoint POST: INGRESAR NUEVA VENTA
router.post('/', async (req, res) => {
  try {
    const { id_producto, id_cliente, cantidad, fecha_venta } = req.body ?? {};

    if (
      !isPositiveInteger(id_producto) ||
      !isPositiveInteger(id_cliente) ||
      !isPositiveInteger(cantidad) ||
      !isValidDate(fecha_venta)
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Debe enviar IDs y cantidad como enteros positivos, y una fecha válida (AAAA-MM-DD)"
      });
    }

    await pool.query('CALL db_registrar_venta(?, ?, ?, ?)', [
      id_producto, id_cliente, cantidad, fecha_venta
    ]);

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

export default router;