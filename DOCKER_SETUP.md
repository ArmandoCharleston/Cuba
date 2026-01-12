# Configuración Completa para Dockploy

## ✅ Archivos Creados/Modificados

1. **Dockerfile** - Multi-stage build optimizado
2. **.dockerignore** - Excluye archivos innecesarios del build
3. **.gitignore** - Ignora archivos locales
4. **package.json** - Scripts actualizados para producción
5. **DOCKER_DEPLOY.md** - Guía de deployment

## 📋 Checklist Pre-Deployment

### 1. Variables de Entorno en Dockploy

Configura estas variables en el panel de Dockploy:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://usuario:password@host:3306/nombre_base_datos
JWT_SECRET=tu-clave-secreta-super-segura-minimo-32-caracteres
CORS_ORIGIN=https://tu-dominio.com
```

**Cómo obtener DATABASE_URL:**
1. Ve al panel de Hostinger
2. Accede a "Bases de datos MySQL"
3. Copia la información de conexión
4. Formato: `mysql://usuario:password@host:3306/nombre_base_datos`

### 2. Configuración en Dockploy

- **Repository:** Conecta tu repositorio Git
- **Build Command:** `npm run build`
- **Start Command:** `npm start` (o deja vacío, el Dockerfile tiene el CMD)
- **Port:** `3000` (o deja que Dockploy lo asigne automáticamente)

### 3. Estructura del Build

El Dockerfile hace lo siguiente:

1. **Stage Build:**
   - Instala dependencias
   - Compila TypeScript del backend
   - Genera Prisma Client
   - Build del frontend con Vite

2. **Stage Production:**
   - Copia solo dependencias de producción
   - Copia código compilado
   - Genera Prisma Client
   - Ejecuta migraciones al iniciar
   - Inicia el servidor

### 4. Verificación Post-Deployment

Después del deployment, prueba estos endpoints:

```bash
# Health check
curl https://tu-dominio.com/health

# Debería responder:
# {"status":"ok","timestamp":"2024-..."}
```

## 🔧 Troubleshooting

### Error: "No such container: select-a-container"

**Solución:**
1. Verifica que el Dockerfile esté en la raíz del proyecto
2. Asegúrate de que el repositorio esté correctamente conectado
3. Verifica que el build command sea correcto

### Error: "Cannot find module '@prisma/client'"

**Solución:**
- El Dockerfile genera Prisma Client automáticamente
- Si persiste, verifica que `DATABASE_URL` esté configurado

### Frontend no se muestra

**Solución:**
1. Verifica que `NODE_ENV=production` esté configurado
2. Revisa los logs del contenedor en Dockploy
3. Asegúrate de que el build del frontend se complete

### Error de conexión a base de datos

**Solución:**
1. Verifica que `DATABASE_URL` sea correcta
2. Asegúrate de que el host de MySQL permita conexiones externas
3. Verifica credenciales en el panel de Hostinger

## 📝 Notas Importantes

- El servidor sirve el frontend estático desde `/`
- Las rutas API están en `/api/*`
- Las rutas del frontend (SPA) redirigen a `index.html`
- Solo hay UN proceso Node.js en producción
- Las migraciones de Prisma se ejecutan automáticamente al iniciar

## 🚀 Comandos Locales (Testing)

```bash
# Build completo
npm run build

# Test local (requiere MySQL configurado)
npm start
```

