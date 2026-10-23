import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [productos] = await pool.query(
      `SELECT id_producto, id_categoria, nombre_producto, precio_unitario,
              costo_proveedor, ubicacion_pasillo
       FROM productos
       ORDER BY id_producto`
    );

    return res.status(200).json({
      status: 'success',
      total_registros: productos.length,
      data: productos
    });
  } catch (error) {
    console.error('Error en GET /productos:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al consultar productos en MySQL'
    });
  }
});

router.post('/', async (req, res) => {
  const {
    id_categoria,
    nombre_producto,
    precio_unitario,
    costo_proveedor,
    ubicacion_pasillo = null
  } = req.body ?? {};

  if (!Number.isSafeInteger(id_categoria) || id_categoria <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Debe enviar un id_categoria entero positivo'
    });
  }

  if (
    typeof nombre_producto !== 'string' ||
    nombre_producto.trim() === '' ||
    nombre_producto.trim().length > 100
  ) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Debe enviar un nombre_producto de 1 a 100 caracteres'
    });
  }

  if (!Number.isSafeInteger(precio_unitario) || precio_unitario < 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'precio_unitario debe ser un entero mayor o igual a cero'
    });
  }

  if (!Number.isSafeInteger(costo_proveedor) || costo_proveedor < 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'costo_proveedor debe ser un entero mayor o igual a cero'
    });
  }

  if (
    ubicacion_pasillo !== null &&
    (typeof ubicacion_pasillo !== 'string' || ubicacion_pasillo.length > 10)
  ) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'ubicacion_pasillo debe tener como máximo 10 caracteres'
    });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO productos
        (id_categoria, nombre_producto, precio_unitario, costo_proveedor, ubicacion_pasillo)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id_categoria,
        nombre_producto.trim(),
        precio_unitario,
        costo_proveedor,
        ubicacion_pasillo
      ]
    );

    return res.status(201).json({
      status: 'created',
      message: 'Producto registrado correctamente',
      data: {
        id_producto: result.insertId,
        id_categoria,
        nombre_producto: nombre_producto.trim(),
        precio_unitario,
        costo_proveedor,
        ubicacion_pasillo
      }
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'El id_categoria no corresponde a una categoría existente'
      });
    }

    console.error('Error en POST /productos:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al registrar producto en MySQL'
    });
  }
});

export default router;
