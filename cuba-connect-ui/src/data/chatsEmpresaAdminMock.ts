export interface MensajeEmpresaAdmin {
  id: string;
  remitente: "empresa" | "admin";
  texto: string;
  fecha: string;
  leido: boolean;
}

export interface ChatEmpresaAdmin {
  id: string;
  propietarioId: string;
  adminId: string;
  mensajes: MensajeEmpresaAdmin[];
  actualizadoEn: string;
  noLeidosEmpresa: number;
  noLeidosAdmin: number;
}

export const chatsEmpresaAdminMock: ChatEmpresaAdmin[] = [
  {
    id: "1",
    propietarioId: "3",
    adminId: "4",
    mensajes: [
      {
        id: "1",
        remitente: "empresa",
        texto: "Hola, necesito ayuda con la verificación de mi negocio",
        fecha: "2024-03-15T14:30:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "admin",
        texto: "¡Hola! Con gusto te ayudo. ¿Qué información necesitas verificar?",
        fecha: "2024-03-15T14:35:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "empresa",
        texto: "Quiero actualizar el logo y añadir más fotos",
        fecha: "2024-03-15T14:40:00",
        leido: true,
      },
      {
        id: "4",
        remitente: "admin",
        texto: "Perfecto, puedes hacerlo desde tu panel en la sección de 'Perfil del Negocio'",
        fecha: "2024-03-15T14:45:00",
        leido: false,
      },
    ],
    actualizadoEn: "2024-03-15T14:45:00",
    noLeidosEmpresa: 1,
    noLeidosAdmin: 0,
  },
  {
    id: "2",
    propietarioId: "3",
    adminId: "4",
    mensajes: [
      {
        id: "1",
        remitente: "admin",
        texto: "Tu solicitud de verificación ha sido aprobada",
        fecha: "2024-03-14T10:00:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "empresa",
        texto: "¡Gracias! ¿Cuándo estará visible mi negocio?",
        fecha: "2024-03-14T10:15:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "admin",
        texto: "Ya está visible en la plataforma. ¡Mucho éxito!",
        fecha: "2024-03-14T10:20:00",
        leido: true,
      },
    ],
    actualizadoEn: "2024-03-14T10:20:00",
    noLeidosEmpresa: 0,
    noLeidosAdmin: 0,
  },
  {
    id: "3",
    propietarioId: "3",
    adminId: "4",
    mensajes: [
      {
        id: "1",
        remitente: "empresa",
        texto: "¿Cómo puedo destacar mi negocio en la búsqueda?",
        fecha: "2024-03-13T16:00:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "admin",
        texto: "Hay varias opciones: mejorar tu perfil, añadir fotos de calidad y responder reseñas",
        fecha: "2024-03-13T16:10:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "empresa",
        texto: "Entendido, trabajaré en eso. Gracias",
        fecha: "2024-03-13T16:15:00",
        leido: true,
      },
    ],
    actualizadoEn: "2024-03-13T16:15:00",
    noLeidosEmpresa: 0,
    noLeidosAdmin: 1,
  },
];
