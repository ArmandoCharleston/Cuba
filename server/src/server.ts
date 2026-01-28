import app from './app';
import { config } from './config/env';
import prisma from './config/database';

// #region agent log
const logError = (error: any, type: string) => {
  const logData = {
    location: 'server.ts:logError',
    message: `Unhandled ${type}`,
    data: {
      error: error?.message || String(error),
      stack: error?.stack,
      type,
      timestamp: new Date().toISOString(),
    },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'A',
  };
  fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData),
  }).catch(() => {});
  console.error(`❌ [${type}]`, error);
};
// #endregion

// Manejo de errores globales para prevenir crashes
process.on('uncaughtException', (error: Error) => {
  // #region agent log
  logError(error, 'uncaughtException');
  // #endregion
  console.error('❌ Uncaught Exception:', error);
  // No cerrar el proceso inmediatamente, permitir que el servidor siga funcionando
  // pero registrar el error para debugging
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  // #region agent log
  logError(reason, 'unhandledRejection');
  // #endregion
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // No cerrar el proceso, solo registrar
});

// Use process.env.PORT with fallback to 4000 (required by Dockploy)
const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0'; // 0.0.0.0 required for Docker

// #region agent log
fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'server.ts:startup',
    message: 'Server starting',
    data: { PORT, HOST, nodeEnv: config.nodeEnv },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'B',
  }),
}).catch(() => {});
// #endregion

const server = app.listen(PORT, HOST, () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'server.ts:listen',
      message: 'Server started successfully',
      data: { PORT, HOST },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'B',
    }),
  }).catch(() => {});
  // #endregion
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`✅ Server started successfully`);
});

// Manejo de errores del servidor
server.on('error', (error: NodeJS.ErrnoException) => {
  // #region agent log
  logError(error, 'serverError');
  // #endregion
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'server.ts:SIGTERM',
      message: 'SIGTERM received',
      data: {},
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'C',
    }),
  }).catch(() => {});
  // #endregion
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'server.ts:SIGINT',
      message: 'SIGINT received',
      data: {},
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'C',
    }),
  }).catch(() => {});
  // #endregion
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default server;







