export interface Reserva {
  id: string;
  clienteId: string;
  negocioId: string;
  servicioId: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  precioTotal: number;
  notas?: string;
  fechaCreacion: string;
}

export const reservasMock: Reserva[] = [
  {
    id: "1",
    clienteId: "1",
    negocioId: "1",
    servicioId: "1",
    fecha: "2024-12-15",
    hora: "10:00",
    estado: "confirmada",
    precioTotal: 15,
    notas: "Primera vez en el salón",
    fechaCreacion: "2024-12-01",
  },
  {
    id: "2",
    clienteId: "1",
    negocioId: "2",
    servicioId: "6",
    fecha: "2024-12-20",
    hora: "14:00",
    estado: "pendiente",
    precioTotal: 40,
    fechaCreacion: "2024-12-05",
  },
  {
    id: "3",
    clienteId: "2",
    negocioId: "3",
    servicioId: "10",
    fecha: "2024-12-10",
    hora: "11:00",
    estado: "completada",
    precioTotal: 18,
    fechaCreacion: "2024-11-28",
  },
  {
    id: "4",
    clienteId: "1",
    negocioId: "5",
    servicioId: "16",
    fecha: "2024-11-25",
    hora: "20:00",
    estado: "completada",
    precioTotal: 0,
    notas: "Mesa para 2 personas",
    fechaCreacion: "2024-11-20",
  },
  {
    id: "5",
    clienteId: "2",
    negocioId: "1",
    servicioId: "3",
    fecha: "2024-12-18",
    hora: "15:00",
    estado: "confirmada",
    precioTotal: 35,
    fechaCreacion: "2024-12-03",
  },
  {
    id: "6",
    clienteId: "1",
    negocioId: "4",
    servicioId: "14",
    fecha: "2024-12-12",
    hora: "09:00",
    estado: "pendiente",
    precioTotal: 25,
    notas: "Preferencia entrenador masculino",
    fechaCreacion: "2024-12-08",
  },
];
