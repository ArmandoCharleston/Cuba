# Guía de Deployment en Dockploy (Hostinger)

## Configuración en Dockploy

### 1. Variables de Entorno

Configura las siguientes variables de entorno en Dockploy:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://usuario:password@host:3306/nombre_base_datos
JWT_SECRET=tu-clave-secreta-super-segura-aqui
CORS_ORIGIN=https://tu-dominio.com
```

**Importante:**
- `DATABASE_URL`: Obtén la URL de conexión desde el panel de Hostinger
- `JWT_SECRET`: Usa una cadena aleatoria larga y segura
- `CORS_ORIGIN`: URL de tu dominio en producción

### 2. Configuración del Build

En Dockploy, configura:

- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Port:** `3000` (o el que Dockploy asigne automáticamente)

### 3. Estructura del Proyecto

El proyecto está configurado para:
- ✅ Build del backend (TypeScript → dist)
- ✅ Build del frontend (Vite → dist)
- ✅ Servir frontend estático desde Express
- ✅ Un solo proceso Node.js en producción
- ✅ Migraciones de Prisma automáticas al iniciar

### 4. Verificación Post-Deployment

Después del deployment, verifica:

1. **Health Check:** `https://tu-dominio.com/health`
2. **API:** `https://tu-dominio.com/api/auth/register`
3. **Frontend:** `https://tu-dominio.com/`

## Troubleshooting

### Error: "No such container"
- Asegúrate de que el Dockerfile esté en la raíz del proyecto
- Verifica que el repositorio esté correctamente conectado en Dockploy

### Error: "Cannot find module"
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que `npm ci` se ejecute correctamente en el build

### Error: "Prisma Client not generated"
- El Dockerfile genera Prisma Client automáticamente
- Si persiste, verifica la variable `DATABASE_URL`

### Frontend no se muestra
- Verifica que `NODE_ENV=production` esté configurado
- Asegúrate de que el build del frontend se complete correctamente

## Comandos Locales (Testing)

```bash
# Build completo
npm run build

# Test local (requiere MySQL)
npm start
```


