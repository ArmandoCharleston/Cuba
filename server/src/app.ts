import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
app.use('/api/admin', adminRoutes);

// Servir archivos estáticos del frontend (SOLO en producción)
if (config.nodeEnv === 'production') {
  const frontendDistPath = path.join(__dirname, '../../cuba-connect-ui/dist');
  app.use(express.static(frontendDistPath));
  
  // SPA fallback: todas las rutas no-API redirigen a index.html
  // Express.static llama a next() si no encuentra el archivo, así que esto captura rutas no-API
  app.get('*', (req, res, next) => {
    // Solo manejar rutas que NO son API
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
        if (err) {
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







