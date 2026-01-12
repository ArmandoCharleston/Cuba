# Solución para Error de Contenedor con Nixpacks

## 🔴 Problema

Error: "No such container" o "No encuentra el contenedor" al usar Nixpacks en Dockploy.

## 🔍 Causas Identificadas

1. **Conflicto de configuración:** `.dockploy.yml` estaba forzando el uso de Dockerfile
2. **Orden incorrecto en nixpacks.toml:** Se intentaba compilar TypeScript antes de generar Prisma Client
3. **Nixpacks falla silenciosamente:** Si el build falla, no se crea el contenedor

## ✅ Soluciones Aplicadas

### 1. Corregido `nixpacks.toml`

**Antes (incorrecto):**
```toml
[phases.build]
cmds = [
  "cd server && npm run build",  # ❌ Falla porque Prisma Client no existe
  "cd server && npx prisma generate",
]
```

**Ahora (correcto):**
```toml
[phases.build]
cmds = [
  "cd server && npx prisma generate",  # ✅ Primero generar Prisma
  "cd server && npm run build",         # ✅ Luego compilar
]
```

### 2. Modificado `.dockploy.yml`

**Antes:** Forzaba el uso de Dockerfile
**Ahora:** Permite que Dockploy use Nixpacks automáticamente

## 📋 Configuración en Dockploy

### Opción A: Usar Nixpacks (Recomendado ahora)

1. **Elimina o renombra `.dockploy.yml`** (o déjalo como está - ya no fuerza Dockerfile)
2. **Asegúrate de que `nixpacks.toml` esté en la raíz**
3. **En Dockploy:**
   - **Build Method:** Selecciona "Nixpacks" o déjalo en "Auto-detect"
   - **Build Command:** (vacío - Nixpacks lo maneja)
   - **Start Command:** (vacío - se usa el de nixpacks.toml)
   - **Port:** `3000`

### Opción B: Forzar Dockerfile

Si prefieres usar Dockerfile:
1. **Renombra `.dockploy.yml`** a `.dockploy.yml.backup`
2. **Crea nuevo `.dockploy.yml`:**
   ```yaml
   build:
     dockerfile: Dockerfile
     context: .
   deploy:
     port: 3000
   ```

## 🔧 Verificación

### 1. Verificar que nixpacks.toml esté correcto

```bash
# El orden debe ser:
# 1. Generar Prisma Client
# 2. Compilar backend
# 3. Build frontend
```

### 2. Verificar configuración en Dockploy

- Build Method: "Nixpacks" o "Auto-detect"
- Build Command: (vacío)
- Start Command: (vacío)
- Port: 3000

### 3. Variables de Entorno

Asegúrate de configurar:
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://usuario:password@host:3306/nombre_base_datos
JWT_SECRET=tu-clave-secreta-minimo-32-caracteres
```

## 🚨 Si el Error Persiste

### 1. Revisar Logs del Build

En Dockploy, ve a la sección de "Logs" o "Build Logs" y busca:
- Errores de Prisma
- Errores de compilación de TypeScript
- Errores de npm ci

### 2. Verificar package-lock.json

Asegúrate de que los `package-lock.json` estén actualizados:
```bash
cd server && npm install
cd ../cuba-connect-ui && npm install
git add server/package-lock.json cuba-connect-ui/package-lock.json
git commit -m "Update package-lock.json"
git push
```

### 3. Probar Build Local con Nixpacks

Si tienes Nixpacks instalado localmente:
```bash
nixpacks build .
```

### 4. Alternativa: Usar Dockerfile

Si Nixpacks sigue dando problemas, el Dockerfile está funcionando correctamente:
- Renombra `nixpacks.toml` a `nixpacks.toml.backup`
- Restaura `.dockploy.yml` para usar Dockerfile
- El Dockerfile ya está corregido y funcionando

## ✅ Estado Actual

- ✅ `nixpacks.toml` corregido (orden correcto)
- ✅ `.dockploy.yml` modificado (permite Nixpacks)
- ✅ Comando de start correcto en nixpacks.toml

## 📝 Próximos Pasos

1. **Commit y push los cambios:**
   ```bash
   git add nixpacks.toml .dockploy.yml
   git commit -m "Fix: Corregir nixpacks.toml - Orden correcto de Prisma"
   git push
   ```

2. **En Dockploy:**
   - Selecciona "Nixpacks" como Build Method
   - Deja Build Command y Start Command vacíos
   - Configura las variables de entorno
   - Haz Deploy

3. **Verifica los logs** del build para asegurar que todo funcione

## 💡 Nota Importante

El Dockerfile también está funcionando correctamente. Si Nixpacks sigue dando problemas, puedes cambiar a Dockerfile simplemente modificando `.dockploy.yml`.

