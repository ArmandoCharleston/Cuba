import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import prisma from './config/database';

// Routes
import authRoutes from './routes/auth.routes';
import usuariosRoutes from './routes/usuarios.routes';
import negociosRoutes from './routes/negocios.routes';
import categoriasRoutes from './routes/categorias.routes';
import serviciosRoutes from './routes/servicios.routes';
import reservasRoutes from './routes/reservas.routes';
import chatsRoutes from './routes/chats.routes';
import resenasRoutes from './routes/resenas.routes';
import favoritosRoutes from './routes/favoritos.routes';
import ciudadesRoutes from './routes/ciudades.routes';
import provinciasRoutes from './routes/provincias.routes';
import municipiosRoutes from './routes/municipios.routes';
import adminRoutes from './routes/admin.routes';

const app: Express = express();

app.use(helmet({
  contentSecurityPolicy: false, // Necesario para servir SPA
}));

// CORS solo en desarrollo
if (config.nodeEnv === 'development') {
  app.use(cors({
    origin: config.cors.origin,
    credentials: true,
  }));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging para todas las peticiones
app.use((req, res, next) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'app.ts:request-logger',
      message: 'Incoming request',
      data: { method: req.method, path: req.path, query: req.query },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'D',
    }),
  }).catch(() => {});
  // #endregion
  next();
});

app.get('/health', async (req, res) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'app.ts:health',
      message: 'Health check requested',
      data: { path: req.path },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'B',
    }),
  }).catch(() => {});
  // #endregion

  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'app.ts:health-error',
        message: 'Database connection failed',
        data: { error: error?.message || String(error) },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'B',
      }),
    }).catch(() => {});
    // #endregion
    res.status(503).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error?.message || 'Database connection failed'
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/negocios', negociosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/ciudades', ciudadesRoutes);
app.use('/api/provincias', provinciasRoutes);
app.use('/api/municipios', municipiosRoutes);
app.use('/api/admin', adminRoutes);

// Servir archivos estáticos del frontend (SOLO en producción)
if (config.nodeEnv === 'production') {
  // Path relativo desde dist/app.js a cuba-connect-ui/dist
  const frontendDistPath = path.join(__dirname, '../../cuba-connect-ui/dist');
  console.log(`📁 Serving frontend from: ${frontendDistPath}`);
  
  // Servir archivos estáticos
  app.use(express.static(frontendDistPath, {
    maxAge: '1y', // Cache estático por 1 año
    etag: true,
    lastModified: true,
  }));
  
  // SPA fallback: todas las rutas no-API redirigen a index.html
  app.get('*', (req, res, next) => {
    // Solo manejar rutas que NO son API
    if (!req.path.startsWith('/api')) {
      const indexPath = path.join(frontendDistPath, 'index.html');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'app.ts:SPA-fallback',
          message: 'Serving SPA route',
          data: { path: req.path, indexPath },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'E',
        }),
      }).catch(() => {});
      // #endregion
      res.sendFile(indexPath, (err) => {
        if (err) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'app.ts:SPA-error',
              message: 'Error serving index.html',
              data: { error: err.message, path: req.path, indexPath },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'E',
            }),
          }).catch(() => {});
          // #endregion
          console.error(`❌ Error serving index.html: ${err.message}`);
          next(err);
        }
      });
    } else {
      // Si es una ruta API, pasar al siguiente middleware (notFoundHandler)
      next();
    }
  });
}

// Error handlers (después de todas las rutas)
// notFoundHandler maneja rutas API que no existen
app.use(notFoundHandler);
app.use(errorHandler);

export default app;







