export interface Mensaje {
  id: string;
  remitente: "cliente" | "empresa";
  texto: string;
  fecha: string;
  leido: boolean;
}

export interface Chat {
  id: string;
  clienteId: string;
  empresaId: string;
  negocioId: string;
  mensajes: Mensaje[];
  actualizadoEn: string;
  noLeidosCliente: number;
  noLeidosEmpresa: number;
}

export const chatsMock: Chat[] = [
  {
    id: "1",
    clienteId: "1",
    empresaId: "3",
    negocioId: "1",
    mensajes: [
      {
        id: "1",
        remitente: "cliente",
        texto: "Hola, quisiera saber si tienen disponibilidad para mañana por la tarde",
        fecha: "2024-03-15T10:30:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "empresa",
        texto: "¡Hola! Sí, tenemos disponibilidad mañana. ¿A qué hora prefieres?",
        fecha: "2024-03-15T10:35:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "cliente",
        texto: "Perfecto, ¿pueden a las 4:00 PM?",
        fecha: "2024-03-15T10:40:00",
        leido: true,
      },
      {
        id: "4",
        remitente: "empresa",
        texto: "Claro, te esperamos a las 4:00 PM. ¿Qué servicio te interesa?",
        fecha: "2024-03-15T10:42:00",
        leido: false,
      },
    ],
    actualizadoEn: "2024-03-15T10:42:00",
    noLeidosCliente: 1,
    noLeidosEmpresa: 0,
  },
  {
    id: "2",
    clienteId: "1",
    empresaId: "3",
    negocioId: "2",
    mensajes: [
      {
        id: "1",
        remitente: "cliente",
        texto: "Buenos días, me gustaría reservar un masaje relajante",
        fecha: "2024-03-14T09:15:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "empresa",
        texto: "¡Buenos días! Tenemos disponibilidad esta semana. ¿Qué día te viene mejor?",
        fecha: "2024-03-14T09:20:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "cliente",
        texto: "El viernes estaría bien",
        fecha: "2024-03-14T09:25:00",
        leido: true,
      },
    ],
    actualizadoEn: "2024-03-14T09:25:00",
    noLeidosCliente: 0,
    noLeidosEmpresa: 1,
  },
  {
    id: "3",
    clienteId: "2",
    empresaId: "3",
    negocioId: "1",
    mensajes: [
      {
        id: "1",
        remitente: "cliente",
        texto: "Hola, ¿hacen cortes de cabello para niños?",
        fecha: "2024-03-13T14:00:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "empresa",
        texto: "¡Hola! Sí, tenemos experiencia con niños. ¿Qué edad tiene?",
        fecha: "2024-03-13T14:05:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "cliente",
        texto: "Tiene 5 años. ¿Tienen algún horario especial?",
        fecha: "2024-03-13T14:10:00",
        leido: true,
      },
      {
        id: "4",
        remitente: "empresa",
        texto: "Por las mañanas es mejor para niños, más tranquilo. Te recomiendo entre 10-11 AM",
        fecha: "2024-03-13T14:15:00",
        leido: true,
      },
    ],
    actualizadoEn: "2024-03-13T14:15:00",
    noLeidosCliente: 0,
    noLeidosEmpresa: 0,
  },
  {
    id: "4",
    clienteId: "1",
    empresaId: "3",
    negocioId: "3",
    mensajes: [
      {
        id: "1",
        remitente: "cliente",
        texto: "¿Qué productos naturales utilizan?",
        fecha: "2024-03-12T16:20:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "empresa",
        texto: "Usamos productos orgánicos certificados: aceites esenciales, arcillas naturales y extractos de plantas",
        fecha: "2024-03-12T16:25:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "cliente",
        texto: "Excelente, me interesa un tratamiento facial",
        fecha: "2024-03-12T16:30:00",
        leido: true,
      },
    ],
    actualizadoEn: "2024-03-12T16:30:00",
    noLeidosCliente: 0,
    noLeidosEmpresa: 1,
  },
  {
    id: "5",
    clienteId: "2",
    empresaId: "3",
    negocioId: "5",
    mensajes: [
      {
        id: "1",
        remitente: "cliente",
        texto: "¿Tienen menú vegetariano?",
        fecha: "2024-03-11T12:00:00",
        leido: true,
      },
      {
        id: "2",
        remitente: "empresa",
        texto: "Sí, tenemos varias opciones vegetarianas y también veganas. Te puedo enviar el menú",
        fecha: "2024-03-11T12:05:00",
        leido: true,
      },
      {
        id: "3",
        remitente: "cliente",
        texto: "Perfecto, me gustaría reservar para 4 personas el sábado",
        fecha: "2024-03-11T12:10:00",
        leido: true,
      },
      {
        id: "4",
        remitente: "empresa",
        texto: "¿A qué hora prefieres? Tenemos disponibilidad a las 7:00 PM y 9:00 PM",
        fecha: "2024-03-11T12:15:00",
        leido: false,
      },
    ],
    actualizadoEn: "2024-03-11T12:15:00",
    noLeidosCliente: 1,
    noLeidosEmpresa: 0,
  },
];
