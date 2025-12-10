export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ciudad: string;
  rol: "cliente" | "empresa" | "admin";
  avatar?: string;
  fechaRegistro: string;
}

export const usuariosMock: Usuario[] = [
  {
    id: "1",
    nombre: "María",
    apellido: "González",
    email: "maria@example.com",
    telefono: "+53 5 234 5678",
    ciudad: "La Habana",
    rol: "cliente",
    fechaRegistro: "2024-01-15",
  },
  {
    id: "2",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos@example.com",
    telefono: "+53 5 345 6789",
    ciudad: "Varadero",
    rol: "cliente",
    fechaRegistro: "2024-02-20",
  },
  {
    id: "3",
    nombre: "Ana",
    apellido: "Martínez",
    email: "ana@salonbella.cu",
    telefono: "+53 7 890 1234",
    ciudad: "La Habana",
    rol: "empresa",
    fechaRegistro: "2023-11-10",
  },
  {
    id: "4",
    nombre: "Admin",
    apellido: "Sistema",
    email: "admin@reservatecuba.com",
    telefono: "+53 7 000 0000",
    ciudad: "La Habana",
    rol: "admin",
    fechaRegistro: "2023-01-01",
  },
];
