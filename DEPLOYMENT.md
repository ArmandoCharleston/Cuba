# Guía de Deployment

## 🚀 Deployment en Dockploy

### Configuración

1. **Variables de Entorno (OBLIGATORIAS):**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=mysql://usuario:password@host:3306/nombre_base_datos
   JWT_SECRET=tu-clave-secreta-minimo-32-caracteres
   CORS_ORIGIN=https://tu-dominio.com
   ```

2. **Configuración de Build en Dockploy:**
   - **Build Method:** `Dockerfile`
   - **Build Command:** (vacío)
   - **Start Command:** (vacío)
   - **Port:** `3000`
   - **Dockerfile Path:** `Dockerfile`

3. **Deploy:**
   - Haz clic en "Deploy" o "Redeploy"
   - Espera a que el build se complete (5-15 minutos)
   - Revisa los logs del build

### Verificación Post-Deployment

```bash
# Health check
curl https://tu-dominio.com/health

# Debería responder:
# {"status":"ok","timestamp":"..."}
```

## 🔧 Solución de Problemas

### Error: "No such container"
- El build falló antes de crear el contenedor
- Revisa los logs del BUILD (no del contenedor)
- Ve a "Build History" o "Deployments" en Dockploy

### Error: Build failed
- Revisa los logs del build para el error específico
- Verifica que Dockerfile esté en la raíz
- Verifica que las variables de entorno estén configuradas

### Error: Database connection
- Verifica que `DATABASE_URL` sea correcta y accesible
- Verifica que el host de MySQL permita conexiones externas
- Verifica que el firewall permita conexiones en el puerto 3306

## 📝 Notas Importantes

- El Dockerfile ejecuta automáticamente las migraciones de Prisma al iniciar
- El frontend se sirve desde `/` y las APIs desde `/api/*`
- Las migraciones se ejecutan con `npx prisma migrate deploy` al iniciar






