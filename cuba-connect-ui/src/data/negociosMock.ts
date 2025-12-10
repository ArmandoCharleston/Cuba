export interface Negocio {
  id: string;
  nombre: string;
  categoriaId: string;
  ciudadId: string;
  direccion: string;
  telefono: string;
  email: string;
  descripcion: string;
  foto: string;
  fotos: string[];
  propietarioId: string;
  calificacion: number;
  totalResenas: number;
  precioPromedio: number;
  horarios: {
    [key: string]: { abierto: boolean; inicio: string; fin: string };
  };
}

export const negociosMock: Negocio[] = [
  {
    id: "1",
    nombre: "Salón Bella Cuba",
    categoriaId: "1",
    ciudadId: "1",
    direccion: "Calle 23 #456, Vedado",
    telefono: "+53 7 832 1234",
    email: "info@salonbella.cu",
    descripcion:
      "El mejor salón de belleza de La Habana. Especialistas en cortes modernos, coloración y tratamientos capilares.",
    foto: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    fotos: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
    ],
    propietarioId: "3",
    calificacion: 4.8,
    totalResenas: 127,
    precioPromedio: 25,
    horarios: {
      lunes: { abierto: true, inicio: "09:00", fin: "18:00" },
      martes: { abierto: true, inicio: "09:00", fin: "18:00" },
      miercoles: { abierto: true, inicio: "09:00", fin: "18:00" },
      jueves: { abierto: true, inicio: "09:00", fin: "18:00" },
      viernes: { abierto: true, inicio: "09:00", fin: "20:00" },
      sabado: { abierto: true, inicio: "10:00", fin: "20:00" },
      domingo: { abierto: false, inicio: "", fin: "" },
    },
  },
  {
    id: "2",
    nombre: "Spa Varadero Relax",
    categoriaId: "2",
    ciudadId: "2",
    direccion: "Av. 1ra y Calle 58, Varadero",
    telefono: "+53 45 667 890",
    email: "reservas@spavaradero.cu",
    descripcion:
      "Spa de lujo frente al mar. Masajes, tratamientos faciales y corporales en un ambiente paradisíaco.",
    foto: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
    fotos: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800",
    ],
    propietarioId: "3",
    calificacion: 4.9,
    totalResenas: 203,
    precioPromedio: 45,
    horarios: {
      lunes: { abierto: true, inicio: "10:00", fin: "20:00" },
      martes: { abierto: true, inicio: "10:00", fin: "20:00" },
      miercoles: { abierto: true, inicio: "10:00", fin: "20:00" },
      jueves: { abierto: true, inicio: "10:00", fin: "20:00" },
      viernes: { abierto: true, inicio: "10:00", fin: "22:00" },
      sabado: { abierto: true, inicio: "10:00", fin: "22:00" },
      domingo: { abierto: true, inicio: "10:00", fin: "20:00" },
    },
  },
  {
    id: "3",
    nombre: "Estudio Belleza Natural",
    categoriaId: "3",
    ciudadId: "1",
    direccion: "Calle O #123, Vedado",
    telefono: "+53 7 832 5678",
    email: "contacto@bellezanatural.cu",
    descripcion:
      "Centro especializado en manicure, pedicure y tratamientos faciales con productos naturales.",
    foto: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
    fotos: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800",
      "https://images.unsplash.com/photo-1610992015762-45dca7c2c2f7?w=800",
    ],
    propietarioId: "3",
    calificacion: 4.7,
    totalResenas: 89,
    precioPromedio: 20,
    horarios: {
      lunes: { abierto: true, inicio: "09:00", fin: "18:00" },
      martes: { abierto: true, inicio: "09:00", fin: "18:00" },
      miercoles: { abierto: true, inicio: "09:00", fin: "18:00" },
      jueves: { abierto: true, inicio: "09:00", fin: "18:00" },
      viernes: { abierto: true, inicio: "09:00", fin: "19:00" },
      sabado: { abierto: true, inicio: "10:00", fin: "19:00" },
      domingo: { abierto: false, inicio: "", fin: "" },
    },
  },
  {
    id: "4",
    nombre: "Gym Cuba Fitness",
    categoriaId: "4",
    ciudadId: "3",
    direccion: "Av. Victoriano Garzón #789",
    telefono: "+53 22 625 123",
    email: "info@gymcuba.cu",
    descripcion:
      "Gimnasio completo con las mejores máquinas y entrenadores profesionales. Clases grupales incluidas.",
    foto: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    fotos: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
    ],
    propietarioId: "3",
    calificacion: 4.6,
    totalResenas: 156,
    precioPromedio: 30,
    horarios: {
      lunes: { abierto: true, inicio: "06:00", fin: "22:00" },
      martes: { abierto: true, inicio: "06:00", fin: "22:00" },
      miercoles: { abierto: true, inicio: "06:00", fin: "22:00" },
      jueves: { abierto: true, inicio: "06:00", fin: "22:00" },
      viernes: { abierto: true, inicio: "06:00", fin: "22:00" },
      sabado: { abierto: true, inicio: "08:00", fin: "20:00" },
      domingo: { abierto: true, inicio: "08:00", fin: "14:00" },
    },
  },
  {
    id: "5",
    nombre: "Restaurante La Bodeguita",
    categoriaId: "5",
    ciudadId: "1",
    direccion: "Empedrado #207, La Habana Vieja",
    telefono: "+53 7 867 1374",
    email: "reservas@labodeguita.cu",
    descripcion:
      "Auténtica cocina cubana en el corazón de La Habana Vieja. Ambiente tradicional con música en vivo.",
    foto: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    fotos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    ],
    propietarioId: "3",
    calificacion: 4.9,
    totalResenas: 342,
    precioPromedio: 35,
    horarios: {
      lunes: { abierto: true, inicio: "12:00", fin: "23:00" },
      martes: { abierto: true, inicio: "12:00", fin: "23:00" },
      miercoles: { abierto: true, inicio: "12:00", fin: "23:00" },
      jueves: { abierto: true, inicio: "12:00", fin: "23:00" },
      viernes: { abierto: true, inicio: "12:00", fin: "00:00" },
      sabado: { abierto: true, inicio: "12:00", fin: "00:00" },
      domingo: { abierto: true, inicio: "12:00", fin: "22:00" },
    },
  },
];
