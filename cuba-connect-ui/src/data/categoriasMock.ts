export interface Categoria {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
}

export const categoriasMock: Categoria[] = [
  {
    id: "1",
    nombre: "Peluquería",
    icono: "Scissors",
    descripcion: "Cortes, peinados y tratamientos capilares",
  },
  {
    id: "2",
    nombre: "Spa & Masajes",
    icono: "Sparkles",
    descripcion: "Relajación y tratamientos corporales",
  },
  {
    id: "3",
    nombre: "Belleza",
    icono: "Heart",
    descripcion: "Manicure, pedicure y estética facial",
  },
  {
    id: "4",
    nombre: "Fitness",
    icono: "Dumbbell",
    descripcion: "Gimnasios y entrenamiento personal",
  },
  {
    id: "5",
    nombre: "Restaurantes",
    icono: "UtensilsCrossed",
    descripcion: "Reservas en restaurantes",
  },
  {
    id: "6",
    nombre: "Médico",
    icono: "Stethoscope",
    descripcion: "Consultas y tratamientos médicos",
  },
];
