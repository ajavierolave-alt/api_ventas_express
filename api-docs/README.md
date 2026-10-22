# API Documentation

## Introducción

Este documento proporciona la información necesaria para consumir el API de ventas. El API está construido utilizando Express y permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las ventas.

## Punto de Entrada

El punto de entrada del API es el archivo `src/server.js`, donde se configura el servidor y se definen las rutas.

## Rutas Disponibles

Las rutas relacionadas con las ventas están definidas en el archivo `src/routes/ventas.js`. A continuación se detallan las rutas disponibles:

### 1. Crear Venta

- **Ruta:** `/ventas`
- **Método:** `POST`
- **Descripción:** Crea una nueva venta.
- **Parámetros:**
  - `producto` (string, requerido): Nombre del producto vendido.
  - `cantidad` (integer, requerido): Cantidad vendida.
  - `precio` (float, requerido): Precio del producto.
- **Ejemplo de Solicitud:**
  ```json
  {
    "producto": "Zapatos",
    "cantidad": 2,
    "precio": 50.00
  }
  ```
- **Ejemplo de Respuesta:**
  ```json
  {
    "mensaje": "Venta creada exitosamente",
    "venta": {
      "id": 1,
      "producto": "Zapatos",
      "cantidad": 2,
      "precio": 50.00
    }
  }
  ```

### 2. Obtener Ventas

- **Ruta:** `/ventas`
- **Método:** `GET`
- **Descripción:** Obtiene una lista de todas las ventas.
- **Ejemplo de Respuesta:**
  ```json
  [
    {
      "id": 1,
      "producto": "Zapatos",
      "cantidad": 2,
      "precio": 50.00
    },
    {
      "id": 2,
      "producto": "Camisa",
      "cantidad": 1,
      "precio": 20.00
    }
  ]
  ```

### 3. Actualizar Venta

- **Ruta:** `/ventas/:id`
- **Método:** `PUT`
- **Descripción:** Actualiza una venta existente.
- **Parámetros:**
  - `id` (integer, requerido): ID de la venta a actualizar.
  - `producto` (string, opcional): Nuevo nombre del producto.
  - `cantidad` (integer, opcional): Nueva cantidad vendida.
  - `precio` (float, opcional): Nuevo precio del producto.
- **Ejemplo de Solicitud:**
  ```json
  {
    "producto": "Zapatos Deportivos",
    "cantidad": 3,
    "precio": 60.00
  }
  ```
- **Ejemplo de Respuesta:**
  ```json
  {
    "mensaje": "Venta actualizada exitosamente",
    "venta": {
      "id": 1,
      "producto": "Zapatos Deportivos",
      "cantidad": 3,
      "precio": 60.00
    }
  }
  ```

### 4. Eliminar Venta

- **Ruta:** `/ventas/:id`
- **Método:** `DELETE`
- **Descripción:** Elimina una venta existente.
- **Parámetros:**
  - `id` (integer, requerido): ID de la venta a eliminar.
- **Ejemplo de Respuesta:**
  ```json
  {
    "mensaje": "Venta eliminada exitosamente"
  }
  ```

## Conclusión

Para más detalles sobre la implementación y el uso del API, consulte el archivo `src/docs/index.html`, donde se proporciona documentación adicional en formato HTML.