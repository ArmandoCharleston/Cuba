# Nästa Steg - Cuba Connect Projekt

## ✅ Klart
- ✅ Backend API med Express + Node.js + TypeScript
- ✅ Prisma schema med MySQL
- ✅ API klient i frontend (`src/lib/api.ts`)
- ✅ Auth Context för autentisering (`src/contexts/AuthContext.tsx`)
- ✅ ProtectedRoute komponent för route protection

## 📋 Nästa Steg

### 1. Konfigurera Miljövariabler

**Frontend** (`cuba-connect-ui/.env`):
```env
VITE_API_URL=http://localhost:4000/api
```

**Backend** (`server/.env`):
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="mysql://user:password@host:3306/cuba_connect"
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=http://localhost:5173
```

### 2. Sätt upp Databasen

1. Skapa MySQL databas i Hostinger
2. Uppdatera `DATABASE_URL` i `server/.env`
3. Kör migrations:
   ```bash
   cd server
   npm run prisma:generate
   npm run prisma:migrate
   ```

### 3. Koppla Frontend till Backend

**Uppdatera Login-sidor** för att använda API:
- `src/pages/auth/LoginCliente.tsx` → använd `useAuth().login()`
- `src/pages/auth/LoginEmpresa.tsx` → använd `useAuth().login()`
- `src/pages/auth/RegistroCliente.tsx` → använd `useAuth().register()`
- `src/pages/auth/RegistroEmpresa.tsx` → använd `useAuth().register()`

**Uppdatera sidor för att använda API istället för mock-data**:
- `src/pages/Negocios.tsx` → använd `api.negocios.getAll()`
- `src/pages/NegocioDetalle.tsx` → använd `api.negocios.getById()`
- `src/pages/cliente/Reservas.tsx` → använd `api.reservas.getAll()`
- `src/pages/cliente/Chat.tsx` → använd `api.chats.getAll()`
- etc.

### 4. Skydda Routes

Uppdatera `src/App.tsx` för att använda `ProtectedRoute`:

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Exempel:
<Route path="/cliente" element={
  <ProtectedRoute requiredRole="cliente">
    <ClienteLayout />
  </ProtectedRoute>
}>
  ...
</Route>
```

### 5. Testa Lokalt

1. Starta backend:
   ```bash
   cd server
   npm run dev
   ```

2. Starta frontend:
   ```bash
   cd cuba-connect-ui
   npm run dev
   ```

3. Testa:
   - Registrera ny användare
   - Logga in
   - Skapa reserva
   - Testa chat
   - etc.

### 6. Förbered för Deployment

**Backend (Hostinger VPS)**:
- Bygg projektet: `npm run build`
- Starta med PM2: `pm2 start dist/server.js --name cuba-api`
- Konfigurera nginx som reverse proxy

**Frontend**:
- Bygg projektet: `npm run build`
- Deploya `dist/` mappen till Hostinger
- Uppdatera `VITE_API_URL` till produktion URL

## 📚 Användning

### Använda API klienten:
```typescript
import { api } from '@/lib/api';

// Hämta negocios
const negocios = await api.negocios.getAll({ categoriaId: '1' });

// Skapa reserva
await api.reservas.create({
  negocioId: '1',
  servicioId: '1',
  fecha: '2024-12-20',
  hora: '10:00',
});
```

### Använda Auth Context:
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, login, logout, updateUser } = useAuth();

// Logga in
await login('email@example.com', 'password');

// Uppdatera profil
await updateUser({ nombre: 'Nytt Namn' });
```

## 🔧 Felsökning

- **CORS errors**: Kontrollera `CORS_ORIGIN` i backend `.env`
- **401 Unauthorized**: Kontrollera att token finns i localStorage
- **Database connection**: Kontrollera `DATABASE_URL` format
- **API not found**: Kontrollera att backend körs på rätt port


