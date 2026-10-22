import express from "express";
import ventasRoutes from './routes/ventas.js';
import 'dotenv/config';

const app = express();

const docsHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>API de Ventas - Documentación</title>
    <style>
      :root {
        --bg: #0f172a;
        --panel: #111827;
        --panel-alt: #1f2937;
        --text: #e5e7eb;
        --muted: #9ca3af;
        --accent: #38bdf8;
        --accent-strong: #0ea5e9;
        --success: #22c55e;
        --warning: #fbbf24;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background: linear-gradient(135deg, #020817, var(--bg));
        color: var(--text);
      }
      .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 40px 20px 80px;
      }
      .header {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 16px;
        padding: 28px;
        box-shadow: 0 10px 30px rgba(14, 165, 233, 0.15);
      }
      h1, h2, h3 { margin-top: 0; }
      .badge {
        display: inline-block;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(56, 189, 248, 0.15);
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 700;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        gap: 20px;
        margin-top: 30px;
      }
      .card {
        background: rgba(17, 24, 39, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 14px;
        padding: 20px;
      }
      .method {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.05em;
        margin-right: 8px;
      }
      .get { background: rgba(34, 197, 94, 0.15); color: var(--success); }
      .post { background: rgba(251, 191, 36, 0.18); color: var(--warning); }
      code, pre {
        font-family: Consolas, Monaco, monospace;
      }
      pre {
        background: var(--panel-alt);
        border-radius: 10px;
        padding: 14px;
        overflow-x: auto;
        color: #dbeafe;
      }
      .muted { color: var(--muted); }
      ul { padding-left: 18px; }
      a { color: var(--accent); }
    </style>
  </head>
  <body>
    <div class="container">
      <header class="header">
        <span class="badge">API REST</span>
        <h1>Documentación de la API de Ventas</h1>
        <p class="muted">Base URL: <strong>http://localhost:3000</strong></p>
        <p>Esta API permite consultar ventas, consultar consolidado por sucursal y año, y registrar nuevas ventas en la base de datos.</p>
      </header>

      <section class="grid">
        <article class="card">
          <h2>1. Consultar consolidado</h2>
          <p><span class="method get">GET</span> /api/v1/ventas/consolidado</p>
          <p>Obtiene un resumen de ventas por sucursal y año.</p>
          <p><strong>Parámetros obligatorios:</strong></p>
          <ul>
            <li><code>suscursal</code>: identificador de sucursal</li>
            <li><code>anio</code>: año a consultar</li>
          </ul>
          <pre>GET /api/v1/ventas/consolidado?suscursal=001&anio=2024</pre>
        </article>

        <article class="card">
          <h2>2. Consultar venta por ID</h2>
          <p><span class="method get">GET</span> /api/v1/ventas/:id</p>
          <p>Devuelve la información de una venta específica.</p>
          <pre>GET /api/v1/ventas/10</pre>
        </article>

        <article class="card">
          <h2>3. Registrar nueva venta</h2>
          <p><span class="method post">POST</span> /api/v1/ventas</p>
          <p>Registra una venta con los datos del producto, cliente, cantidad y fecha.</p>
          <pre>
{
  "id_producto": 2,
  "id_cliente": 5,
  "cantidad": 3,
  "fecha_venta": "2024-06-15"
}</pre>
        </article>

        <article class="card">
          <h2>4. Consultar detalle de venta</h2>
          <p><span class="method post">POST</span> /api/v1/ventas/detalle</p>
          <p>Obtiene el detalle de una venta por su identificador.</p>
          <pre>POST /api/v1/ventas/detalle?id_venta=10</pre>
        </article>
      </section>

      <section class="card" style="margin-top: 30px;">
        <h2>Formato de respuestas</h2>
        <p>Las respuestas exitosas generalmente tienen este formato:</p>
        <pre>
{
  "status": "success",
  "data": {}
}</pre>
        <p>En caso de error, el API responde con un objeto como:</p>
        <pre>
{
  "error": "Bad Request",
  "message": "Debe enviar ambos parametros"
}</pre>
      </section>
    </div>
  </body>
</html>`;

//1. Middlewares para procesar req.body
app.use(express.json());

app.get('/', (req, res) => {
  res.type('html').send(docsHtml);
});

app.get('/docs', (req, res) => {
  res.type('html').send(docsHtml);
});

//2. Montamos las rutas con el prefijo /api/v1/ventas
app.use('/api/v1/ventas', ventasRoutes);

//3. Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor Express en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/`);
});
