# Cuba Connect Backend API

Backend API för Cuba Connect plattformen byggd med Express, TypeScript, Prisma och MySQL.

## Installation

1. Installera dependencies:
```bash
npm install
```

2. Skapa `.env` fil:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="mysql://user:password@localhost:3306/cuba_connect"
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

3. Generera Prisma Client:
```bash
npm run prisma:generate
```

4. Kör migrations:
```bash
npm run prisma:migrate
```

## Utveckling

Starta development server:
```bash
npm run dev
```

Server körs på `http://localhost:4000`

## API Endpoints

### Autentisering
- `POST /api/auth/register` - Registrera ny användare
- `POST /api/auth/login` - Logga in
- `GET /api/auth/me` - Hämta aktuell användare

### Negocios
- `GET /api/negocios` - Lista alla negocios
- `GET /api/negocios/:id` - Hämta specifik negocio
- `POST /api/negocios` - Skapa negocio (empresa/admin)
- `PUT /api/negocios/:id` - Uppdatera negocio
- `DELETE /api/negocios/:id` - Ta bort negocio

### Reservas
- `GET /api/reservas` - Lista reservas
- `GET /api/reservas/:id` - Hämta specifik reserva
- `POST /api/reservas` - Skapa reserva (cliente)
- `PATCH /api/reservas/:id/estado` - Uppdatera reserva status

### Chats
- `GET /api/chats` - Lista alla chats
- `GET /api/chats/:id` - Hämta specifik chat
- `POST /api/chats` - Skapa ny chat
- `POST /api/chats/:id/mensajes` - Skicka meddelande

### Andra endpoints
- `GET /api/categorias` - Lista kategorier
- `GET /api/servicios/negocio/:negocioId` - Lista tjänster
- `GET /api/resenas/negocio/:negocioId` - Lista recensioner
- `GET /api/favoritos` - Lista favoriter
- `GET /api/ciudades` - Lista städer
- `GET /api/admin/dashboard` - Admin dashboard

## Autentisering

De flesta endpoints kräver autentisering. Skicka JWT token i Authorization header:
```
Authorization: Bearer <token>
```

