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
RUN npm run build

# Generar Prisma Client
RUN npx prisma generate

# Build del frontend
WORKDIR /app/cuba-connect-ui
COPY cuba-connect-ui/ .
RUN npm ci --ignore-scripts
RUN npm run build

# Stage 2: Producción
FROM base AS production

# Copiar package.json
COPY package*.json ./
COPY server/package*.json ./server/

# Instalar solo dependencias de producción del servidor
WORKDIR /app/server
RUN npm ci --only=production --ignore-scripts

# Generar Prisma Client en producción
RUN npx prisma generate

# Copiar código compilado del backend
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/server/prisma ./prisma

# Copiar frontend build (mantener estructura de directorios)
COPY --from=build /app/cuba-connect-ui/dist /app/cuba-connect-ui/dist

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Comando de inicio
WORKDIR /app/server
# Ejecutar migraciones y luego iniciar servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

