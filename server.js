const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

// Validate required environment variables
const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = requiredEnvVars.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error('\n❌ Missing required environment variables:\n  ' + missing.join('\n  '));
  console.error('\nSet them in .env.local or your deployment platform.\n');
  process.exit(1);
}
console.log('✅ All required environment variables are set.');

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { initializeWebSockets } = require('./server/websocket');

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

// Inicializa Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Crea el servidor HTTP
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Inicializa el servidor de WebSockets adjuntándolo al servidor HTTP
  initializeWebSockets(server);

  // Escucha en el puerto y host configurados
  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Servidor listo en http://${hostname}:${port}`);
    console.log(`> WebSockets funcionando en el mismo puerto.`);
  });
}).catch((err) => {
  console.error('Error iniciando Next.js', err);
  process.exit(1);
});
