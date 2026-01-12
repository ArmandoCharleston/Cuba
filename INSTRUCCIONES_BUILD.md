# Instrucciones para Build Local de Docker

## ⚠️ Requisito Previo

**Docker Desktop debe estar completamente iniciado** antes de ejecutar el build.

## 🔍 Cómo Verificar que Docker Desktop está Listo

1. **Abre Docker Desktop** desde el menú de inicio
2. **Espera** a que aparezca el ícono de Docker en la bandeja del sistema (esquina inferior derecha)
3. **Verifica** que el ícono muestre "Docker Desktop is running"
4. **Prueba** ejecutando: `docker ps`

Si `docker ps` funciona sin errores, Docker Desktop está listo.

## 🚀 Opción 1: Usar el Script Automatizado (Recomendado)

```powershell
.\build-docker.ps1
```

Este script:
- ✅ Verifica que Docker esté corriendo
- ✅ Limpia imágenes anteriores
- ✅ Ejecuta el build
- ✅ Muestra el resultado

## 🚀 Opción 2: Comando Directo

```powershell
docker build --load -t cuba-connect .
```

**Nota:** El flag `--load` es importante para cargar la imagen en Docker Desktop.

## ⏱️ Tiempo Estimado

El build puede tardar **5-15 minutos** dependiendo de:
- Velocidad de tu conexión a internet (descarga de imágenes base)
- Velocidad de tu CPU (compilación de TypeScript)
- Velocidad de tu disco (I/O)

## 📋 Qué Hace el Build

1. **Descarga imagen base** (node:20-alpine) - ~50MB
2. **Instala dependencias del sistema** (libc6-compat, openssl)
3. **Instala dependencias de Node.js:**
   - Raíz del proyecto
   - `server/` (backend)
   - `cuba-connect-ui/` (frontend)
4. **Compila el backend** (TypeScript → JavaScript)
5. **Genera Prisma Client**
6. **Build del frontend** (Vite)
7. **Crea imagen de producción** optimizada

## ✅ Verificar que el Build Funcionó

Después del build exitoso, verifica:

```powershell
# Ver la imagen creada
docker images cuba-connect

# Deberías ver algo como:
# REPOSITORY      TAG       IMAGE ID       CREATED         SIZE
# cuba-connect    latest    abc123def456   2 minutes ago   500MB
```

## 🧪 Probar la Imagen Localmente (Opcional)

Para probar que la imagen funciona, necesitas configurar `DATABASE_URL`:

```powershell
docker run -p 3000:3000 `
  -e NODE_ENV=production `
  -e DATABASE_URL="mysql://usuario:password@host:3306/database" `
  -e JWT_SECRET="tu-secret-key" `
  cuba-connect
```

Luego visita: http://localhost:3000

## ❌ Solución de Problemas

### Error: "Docker Desktop no está corriendo"
- Abre Docker Desktop y espera a que se inicie completamente
- Verifica con `docker ps`

### Error: "failed to build: EOF"
- Docker Desktop aún no está completamente listo
- Espera 30-60 segundos más y vuelve a intentar

### Error: "No space left on device"
- Limpia imágenes y contenedores no usados:
  ```powershell
  docker system prune -a
  ```

### Error durante `npm ci`
- El Dockerfile tiene fallbacks, pero si persiste:
  - Verifica que los `package-lock.json` estén actualizados
  - Revisa los logs del build para el error específico

### Build muy lento
- Es normal en la primera ejecución (descarga de imágenes)
- Las siguientes ejecuciones serán más rápidas (cache de Docker)

## 📝 Notas

- La imagen final será de aproximadamente **400-600 MB**
- El build usa **multi-stage** para optimizar el tamaño
- Solo se incluyen dependencias de **producción** en la imagen final
- Las migraciones de Prisma se ejecutan **automáticamente** al iniciar el contenedor

