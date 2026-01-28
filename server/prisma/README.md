# Scripts de Base de Datos

## ¿Por qué se borran los datos cuando cambio el código?

Cuando ejecutas `prisma migrate dev`, Prisma **automáticamente ejecuta el seed** si está configurado en `package.json`. Esto es útil en desarrollo pero puede borrar datos si no tienes cuidado.

## Scripts disponibles

### 1. Limpiar base de datos (preservando admin)
```bash
npm run prisma:clean
```
Este script elimina **todos los datos** excepto el usuario admin. Úsalo cuando quieras empezar de cero pero mantener el admin.

### 2. Seed completo (limpia y recrea datos iniciales)
```bash
npm run prisma:seed
```
Este script limpia todo (excepto admin) y recrea:
- Categorías iniciales
- Provincias y municipios de Cuba

### 3. Migraciones SIN ejecutar seed automáticamente
```bash
npx prisma migrate dev --skip-seed
```
Usa este comando cuando hagas cambios en el schema pero **NO quieras** que se ejecute el seed automáticamente.

### 4. Migraciones normales (ejecuta seed automáticamente)
```bash
npm run prisma:migrate
# o
npx prisma migrate dev
```
⚠️ **CUIDADO**: Este comando ejecutará el seed automáticamente y borrará datos (excepto admin).

## Recomendaciones

1. **Para desarrollo diario**: Usa `npx prisma migrate dev --skip-seed` para evitar borrar datos accidentalmente.

2. **Para limpiar y empezar de cero**: Usa `npm run prisma:clean` primero, luego `npm run prisma:seed` si quieres datos iniciales.

3. **Para producción**: Usa `npm run prisma:migrate:deploy` que NO ejecuta seed automáticamente.

## Nota importante

El seed actual (`seed.ts`) ya preserva el admin automáticamente, pero si quieres tener más control, usa el script `clean-db.ts` que es más explícito sobre qué preserva.

