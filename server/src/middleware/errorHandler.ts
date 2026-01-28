import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config/env';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Wrapper para manejar errores async en rutas
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  err: AppError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // #region agent log
  const logData = {
    location: 'errorHandler.ts:errorHandler',
    message: 'Error caught by error handler',
    data: {
      error: err?.message || String(err),
      stack: err?.stack,
      path: req.path,
      method: req.method,
      statusCode: err instanceof AppError ? err.statusCode : err instanceof ZodError ? 400 : 500,
    },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    runId: 'run1',
    hypothesisId: 'D',
  };
  fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData),
  }).catch(() => {});
  // #endregion

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal server error';

  // Siempre loguear errores en producción para debugging
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};


