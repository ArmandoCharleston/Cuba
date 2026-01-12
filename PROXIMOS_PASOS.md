# Próximos Pasos - Deployment en Dockploy

## ✅ Estado Actual

- ✅ Build de Docker completado exitosamente
- ✅ Imagen creada: `cuba-connect:latest` (409 MB)
- ✅ Dockerfile corregido y funcionando
- ✅ Todos los archivos de configuración listos

## 🚀 Pasos para Deployment

### Paso 1: Commit y Push de los Cambios

Los archivos corregidos necesitan ser subidos al repositorio:

```powershell
# Verificar cambios
git status

# Agregar archivos modificados
git add Dockerfile .dockerignore

# Commit
git commit -m "Fix: Corregir Dockerfile para build exitoso - Incluir package-lock.json y orden correcto de Prisma"

# Push al repositorio
git push
```

### Paso 2: Configurar Variables de Entorno en Dockploy

En el panel de Dockploy, configura estas variables de entorno:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://usuario:password@host:3306/nombre_base_datos
JWT_SECRET=tu-clave-secreta-super-segura-minimo-32-caracteres
CORS_ORIGIN=https://tu-dominio.com
```

**Cómo obtener DATABASE_URL:**
1. Ve al panel de Hostinger (o tu proveedor de base de datos)
2. Accede a "Bases de datos MySQL"
3. Copia la información de conexión
4. Formato: `mysql://usuario:password@host:3306/nombre_base_datos`

### Paso 3: Configurar Build en Dockploy

En la configuración del proyecto en Dockploy:

1. **Build Method:** Selecciona "Dockerfile" o "Custom Dockerfile"
2. **Build Command:** Déjalo **VACÍO** (Dockploy usará el Dockerfile automáticamente)
3. **Start Command:** Déjalo **VACÍO** (el Dockerfile tiene el CMD)
4. **Port:** `3000`
5. **Dockerfile Path:** `Dockerfile` (o déjalo por defecto si está en la raíz)

### Paso 4: Iniciar el Deployment

1. En Dockploy, haz clic en "Deploy" o "Redeploy"
2. Espera a que el build se complete (puede tardar 5-15 minutos)
3. Revisa los logs del build para verificar que todo esté bien

### Paso 5: Verificar el Deployment

Después del deployment exitoso:

1. **Prueba el endpoint de health:**
   ```bash
   curl https://tu-dominio.com/health
   ```
   Debería responder: `{"status":"ok","timestamp":"..."}`

2. **Accede a la aplicación:**
   - Abre tu navegador en `https://tu-dominio.com`
   - Verifica que el frontend se carga correctamente

## 🧪 Opcional: Probar la Imagen Localmente

Si quieres probar la imagen antes de desplegar:

```powershell
# Ejecutar el contenedor (requiere DATABASE_URL)
docker run -p 3000:3000 `
  -e NODE_ENV=production `
  -e DATABASE_URL="mysql://usuario:password@host:3306/database" `
  -e JWT_SECRET="tu-secret-key-minimo-32-caracteres" `
  cuba-connect
```

Luego visita: http://localhost:3000

## 📋 Checklist Pre-Deployment

Antes de desplegar, verifica:

- [ ] Todos los cambios están commiteados y pusheados
- [ ] Variables de entorno configuradas en Dockploy
- [ ] DATABASE_URL es correcta y accesible
- [ ] JWT_SECRET tiene al menos 32 caracteres
- [ ] Build Method configurado como "Dockerfile"
- [ ] Port configurado como 3000

## 🔍 Solución de Problemas

### Si el build falla en Dockploy:

1. **Revisa los logs del build** en Dockploy
2. **Verifica que el Dockerfile esté en la raíz** del repositorio
3. **Asegúrate de que `.dockploy.yml` esté presente** (opcional pero recomendado)
4. **Verifica que las variables de entorno estén configuradas**

### Si el contenedor no inicia:

1. **Revisa los logs del contenedor** en Dockploy
2. **Verifica DATABASE_URL** - debe ser accesible desde el servidor
3. **Verifica que las migraciones de Prisma se ejecuten** (se ejecutan automáticamente al iniciar)

### Si hay errores de conexión a la base de datos:

1. **Verifica que el host de MySQL permita conexiones externas**
2. **Verifica las credenciales** en DATABASE_URL
3. **Asegúrate de que el firewall permita conexiones** en el puerto 3306

## 📝 Archivos Importantes

- ✅ `Dockerfile` - Configurado y funcionando
- ✅ `.dockerignore` - Corregido
- ✅ `.dockploy.yml` - Configuración para Dockploy
- ✅ `nixpacks.toml` - Alternativa (si Dockploy usa Nixpacks)

## ✅ Resumen

1. **Commit y push** los cambios
2. **Configura variables de entorno** en Dockploy
3. **Selecciona Dockerfile** como método de build
4. **Inicia el deployment**
5. **Verifica** que todo funcione

¡Tu aplicación está lista para desplegarse! 🚀

