# Solución para Error de Build en Dockploy

## ❌ Error Original
```
ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c npm ci" did not complete successfully: exit code: 1
Error: Docker build failed
❌ Nixpacks build failed
```

## 🔍 Causa del Problema

Dockploy está usando **Nixpacks** automáticamente y está intentando ejecutar `npm ci` en la raíz del proyecto **antes** de nuestros comandos personalizados. Esto falla porque:

1. El `package.json` raíz solo tiene `devDependencies` (concurrently)
2. `npm ci` requiere un `package-lock.json` válido y sincronizado
3. Nixpacks detecta automáticamente Node.js y ejecuta `npm ci` por defecto

## ✅ Solución Aplicada

### 1. Archivo `nixpacks.toml` Creado

Este archivo sobrescribe el comportamiento por defecto de Nixpacks:

```toml
[providers]
node = "20"

[phases.setup]
nixPkgs = ["nodejs_20", "openssl"]

[phases.install]
dependsOn = []
cmds = [
  "cd server && npm ci --ignore-scripts",
  "cd ../cuba-connect-ui && npm ci --ignore-scripts"
]

[phases.build]
dependsOn = ["install"]
cmds = [
  "cd server && npm run build",
  "cd server && npx prisma generate",
  "cd ../cuba-connect-ui && npm run build"
]

[start]
cmd = "cd server && npx prisma migrate deploy && node dist/server.js"
```

**Cambios clave:**
- ✅ `dependsOn = []` en install evita la instalación automática
- ✅ Solo instala dependencias de `server/` y `cuba-connect-ui/`
- ✅ No intenta instalar dependencias de la raíz (que solo tiene devDependencies)

### 2. Dockerfile Mejorado

El Dockerfile ahora maneja mejor el caso cuando no hay `package-lock.json` válido en la raíz.

### 3. package.json Actualizado

Agregado `engines` para especificar versiones de Node.js y npm.

## 📋 Pasos para Deployment

### 1. Commit y Push los Cambios

```bash
git add .
git commit -m "Fix: Configuración para Dockploy con Nixpacks"
git push
```

### 2. Configuración en Dockploy

1. **Variables de Entorno:**
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=mysql://usuario:password@host:3306/nombre_base_datos
   JWT_SECRET=tu-clave-secreta-super-segura
   ```

2. **Build Settings:**
   - **Build Command:** (dejar vacío - Nixpacks usa nixpacks.toml)
   - **Start Command:** (dejar vacío - se usa el del nixpacks.toml)
   - **Port:** `3000`

3. **Deploy:**
   - Dockploy detectará automáticamente `nixpacks.toml`
   - Usará nuestros comandos personalizados en lugar de los por defecto

## 🔍 Verificación Post-Deployment

1. **Revisa los logs del build** en Dockploy
2. **Verifica que el build se complete** sin errores
3. **Prueba el endpoint:**
   ```bash
   curl https://tu-dominio.com/health
   ```

## 🚨 Si el Error Persiste

### Opción A: Verificar package-lock.json

Asegúrate de que los `package-lock.json` estén actualizados:

```bash
cd server
npm install
cd ../cuba-connect-ui
npm install
cd ..
git add server/package-lock.json cuba-connect-ui/package-lock.json
git commit -m "Update package-lock.json files"
git push
```

### Opción B: Forzar Docker

Si Nixpacks sigue dando problemas, puedes intentar forzar el uso de Docker:

1. En Dockploy, busca la opción "Use Dockerfile" o "Custom Build"
2. Asegúrate de que el `Dockerfile` esté en la raíz
3. Configura:
   - **Build Command:** `docker build -t app .`
   - **Start Command:** (dejar vacío, el Dockerfile tiene CMD)

### Opción C: Revisar Logs Completos

Los logs completos en Dockploy mostrarán exactamente dónde falla. Busca:
- Errores de dependencias faltantes
- Problemas con Prisma
- Errores de compilación de TypeScript

## 📝 Archivos Modificados/Creados

- ✅ `nixpacks.toml` - Configuración personalizada para Nixpacks
- ✅ `Dockerfile` - Mejorado para manejar casos edge
- ✅ `package.json` - Agregado `engines`
- ✅ `.dockploy.yml` - Configuración alternativa (opcional)

## ✅ Estado

**El sistema está configurado para usar Nixpacks con comandos personalizados que evitan el error de `npm ci` en la raíz.**

