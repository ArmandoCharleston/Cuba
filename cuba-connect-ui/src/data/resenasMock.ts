export interface Resena {
  id: string;
  negocioId: string;
  clienteId: string;
  calificacion: number; // 1-5
  comentario: string;
  fecha: string;
  respuesta?: string;
  fechaRespuesta?: string;
}

export const resenasMock: Resena[] = [
  {
    id: "1",
    negocioId: "1",
    clienteId: "1",
    calificacion: 5,
    comentario:
      "Excelente servicio! El corte quedó perfecto y el trato fue muy profesional. Definitivamente volveré.",
    fecha: "2024-11-20",
    respuesta: "¡Muchas gracias María! Nos encanta tenerte como clienta.",
    fechaRespuesta: "2024-11-21",
  },
  {
    id: "2",
    negocioId: "1",
    clienteId: "2",
    calificacion: 5,
    comentario:
      "Me encantó el ambiente y la atención. Las estilistas son muy creativas y profesionales.",
    fecha: "2024-11-15",
  },
  {
    id: "3",
    negocioId: "2",
    clienteId: "1",
    calificacion: 5,
    comentario:
      "El mejor spa de Varadero. El masaje fue increíble y las instalaciones son de primera. Total relajación.",
    fecha: "2024-10-28",
    respuesta:
      "Gracias por tu visita. Esperamos verte pronto para otra sesión de relajación.",
    fechaRespuesta: "2024-10-29",
  },
  {
    id: "4",
    negocioId: "2",
    clienteId: "2",
    calificacion: 5,
    comentario:
      "Ambiente paradisíaco y servicio excepcional. El facial hidratante dejó mi piel renovada.",
    fecha: "2024-11-05",
  },
  {
    id: "5",
    negocioId: "3",
    clienteId: "1",
    calificacion: 4,
    comentario:
      "Buen servicio de manicure. Productos de calidad y buen precio. Solo mejoraría los tiempos de espera.",
    fecha: "2024-11-10",
  },
  {
    id: "6",
    negocioId: "4",
    clienteId: "2",
    calificacion: 5,
    comentario:
      "Gimnasio completo con excelentes máquinas y entrenadores. Las clases grupales son muy motivadoras.",
    fecha: "2024-11-01",
  },
  {
    id: "7",
    negocioId: "5",
    clienteId: "1",
    calificacion: 5,
    comentario:
      "Comida deliciosa y auténtica. El ambiente es único con música en vivo. Muy recomendado!",
    fecha: "2024-11-26",
    respuesta:
      "¡Gracias por tu visita! Nos alegra que hayas disfrutado de la experiencia cubana.",
    fechaRespuesta: "2024-11-27",
  },
];
