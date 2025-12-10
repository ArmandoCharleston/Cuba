export interface MensajeClienteAdmin {
  id: string;
  remitente: "cliente" | "admin";
  texto: string;
  fecha: string;
  leido: boolean;
}

export interface ChatClienteAdmin {
  id: string;
  clienteId: string;
  adminId: string;
  mensajes: MensajeClienteAdmin[];
  actualizadoEn: string;
  noLeidosCliente: number;
  noLeidosAdmin: number;
}

export const chatsClienteAdminMock: ChatClienteAdmin[] = [
  {
    id: "1",
    clienteId: "1",
    adminId: "4",
    mensajes: [
      {
        id: "1",
        remitente: "cliente",
        texto: "Hola, tengo un problema con mi reserva",
        fecha: "2024-03-15T11:00:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "admin",
        texto: "¡Hola! Lamento el inconveniente. ¿Qué sucedió?",
        fecha: "2024-03-15T11:05:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "cliente",
        texto: "El negocio canceló mi reserva sin previo aviso",
        fecha: "2024-03-15T11:10:00",
        leido: true,
      },
      {
        id: "4",
        remitente: "admin",
        texto: "Entiendo tu molestia. Voy a contactar al negocio y te informo pronto",
        fecha: "2024-03-15T11:15:00",
        leido: false,
      },
    ],
    actualizadoEn: "2024-03-15T11:15:00",
    noLeidosCliente: 1,
    noLeidosAdmin: 0,
  },
  {
    id: "2",
    clienteId: "1",
    adminId: "4",
    mensajes: [
      {
        id: "1",
        remitente: "cliente",
        texto: "¿Cómo puedo reportar un negocio?",
        fecha: "2024-03-14T15:30:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "admin",
        texto: "Puedes usar el botón de reportar en la página del negocio o contáctame directamente",
        fecha: "2024-03-14T15:35:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "cliente",
        texto: "Perfecto, gracias por la información",
        fecha: "2024-03-14T15:40:00",
        leido: true,
      },
    ],
    actualizadoEn: "2024-03-14T15:40:00",
    noLeidosCliente: 0,
    noLeidosAdmin: 1,
  },
  {
    id: "3",
    clienteId: "2",
    adminId: "4",
    mensajes: [
      {
        id: "1",
        remitente: "admin",
        texto: "¡Bienvenido a Reservate Cuba! ¿En qué te puedo ayudar?",
        fecha: "2024-03-13T09:00:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "cliente",
        texto: "Gracias, solo estaba explorando la plataforma",
        fecha: "2024-03-13T09:15:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "admin",
        texto: "Excelente. Si necesitas ayuda, estoy aquí",
        fecha: "2024-03-13T09:20:00",
        leido: true,
      },
    ],
    actualizadoEn: "2024-03-13T09:20:00",
    noLeidosCliente: 0,
    noLeidosAdmin: 0,
  },
];
