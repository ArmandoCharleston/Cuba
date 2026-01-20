# Multi-stage build para optimizar tamaño de imagen
FROM node:20-alpine AS base

# Instalar dependencias del sistema necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Stage 1: Build
FROM base AS build

# Copiar archivos de configuración
COPY package*.json ./
COPY server/package*.json ./server/
COPY cuba-connect-ui/package*.json ./cuba-connect-ui/

# Instalar dependencias de root (solo para concurrently en dev, no necesario en prod)
# Usar npm install en lugar de npm ci porque puede no haber package-lock.json válido
RUN if [ -f package-lock.json ]; then npm ci --ignore-scripts || npm install --ignore-scripts; else npm install --ignore-scripts || true; fi

# Build del backend
WORKDIR /app/server
COPY server/ .
RUN npm ci --ignore-scripts

# Generar Prisma Client antes de compilar
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Build del frontend
WORKDIR /app/cuba-connect-ui
COPY cuba-connect-ui/ .
RUN npm ci --ignore-scripts
# Build-time variable para la URL de la API
# Si no se proporciona, usa /api (ruta relativa, mismo servidor)
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Stage 2: Producción
FROM base AS production

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY server/package*.json ./server/

# Instalar solo dependencias de producción del servidor
WORKDIR /app/server
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --ignore-scripts; else npm install --omit=dev --ignore-scripts; fi

# Copiar schema de Prisma y migraciones antes de generar el cliente
# Crear el directorio prisma primero
RUN mkdir -p prisma

# Copiar todo el directorio prisma completo desde el build stage
COPY --from=build /app/server/prisma/ ./prisma/

# Verificar que el schema y las migraciones existen (para debugging)
RUN echo "=== Prisma directory ===" && ls -la prisma/ && \
    echo "=== Migrations directory ===" && ls -la prisma/migrations/ && \
    echo "=== Migration init directory ===" && ls -la prisma/migrations/20260120124313_init/ || echo "Some files not found"

# Generar Prisma Client en producción
RUN npx prisma generate

# Copiar código compilado del backend
COPY --from=build /app/server/dist ./dist

# Copiar frontend build (mantener estructura de directorios)
COPY --from=build /app/cuba-connect-ui/dist /app/cuba-connect-ui/dist

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Exponer puerto
EXPOSE 3000

# Comando de inicio
WORKDIR /app/server
# Ejecutar migraciones y luego iniciar servidor
# Usar --schema explícitamente para asegurar que encuentra el schema
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]

