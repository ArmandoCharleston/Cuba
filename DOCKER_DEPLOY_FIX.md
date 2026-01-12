# Solución para Error de Build en Dockploy

## Problema
```
ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c npm ci" did not complete successfully: exit code: 1
Error: Docker build failed
❌ Nixpacks build failed
```

## Causa
Dockploy está usando **Nixpacks** automáticamente y `npm ci` está fallando porque:
1. El `package.json` raíz solo tiene `devDependencies` (concurrently)
2. `npm ci` requiere un `package-lock.json` válido y sincronizado
3. Nixpacks intenta hacer `npm ci` automáticamente antes de nuestros comandos

## Soluciones Aplicadas

### 1. Archivo `nixpacks.toml` ✅
Configuración personalizada para Nixpacks que:
- Usa `npm install` en la raíz (más tolerante que `npm ci`)
- Instala dependencias del servidor y frontend correctamente
- Ejecuta el build en el orden correcto

### 2. Archivo `.dockploy.yml` ✅
Intenta forzar el uso de Docker en lugar de Nixpacks (si Dockploy lo soporta)

### 3. Dockerfile Mejorado ✅
El Dockerfile ahora maneja mejor el caso cuando no hay `package-lock.json` válido

## Configuración en Dockploy

### Opción 1: Usar Nixpacks (Recomendado)
1. Asegúrate de que `nixpacks.toml` esté en la raíz del proyecto
2. En Dockploy, configura:
   - **Build Command:** (dejar vacío, Nixpacks lo maneja)
   - **Start Command:** (dejar vacío, se usa el del nixpacks.toml)
   - **Port:** `3000`

### Opción 2: Forzar Docker
1. En Dockploy, en la configuración del proyecto:
   - Selecciona "Use Dockerfile" o "Custom Dockerfile"
   - Asegúrate de que el Dockerfile esté en la raíz

### Opción 3: Variables de Entorno
Asegúrate de configurar estas variables en Dockploy:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://usuario:password@host:3306/nombre_base_datos
JWT_SECRET=tu-clave-secreta-super-segura
```

## Verificación

Después del deployment, verifica:
1. Los logs del build para ver si Nixpacks o Docker se está usando
2. Si hay errores de dependencias, revisa los logs completos
3. El endpoint `/health` debería responder

## Si el Error Persiste

1. **Verifica los logs completos** en Dockploy para ver el error exacto
2. **Asegúrate de que todos los package-lock.json estén actualizados:**
   ```bash
   npm install
   cd server && npm install
   cd ../cuba-connect-ui && npm install
   ```
3. **Commit y push** todos los cambios incluyendo los package-lock.json
4. **Intenta el deployment nuevamente**

## Archivos Creados/Modificados

- ✅ `nixpacks.toml` - Configuración para Nixpacks
- ✅ `.dockploy.yml` - Configuración para Dockploy (opcional)
- ✅ `Dockerfile` - Mejorado para manejar casos edge

