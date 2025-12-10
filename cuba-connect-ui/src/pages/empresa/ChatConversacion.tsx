import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, MoreVertical } from "lucide-react";
import { chatsMock, Mensaje } from "@/data/chatsMock";
import { usuariosMock } from "@/data/usuariosMock";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function EmpresaChatConversacion() {
  const { id } = useParams();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = chatsMock.find((c) => c.id === id);
  const cliente = usuariosMock.find((u) => u.id === chat?.clienteId);

  useEffect(() => {
    if (chat) {
      setMensajes(chat.mensajes);
    }
  }, [chat]);

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, escribiendo]);

  // Simulación de mensajes entrantes
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% de probabilidad
        setEscribiendo(true);

        setTimeout(() => {
          const mensajesSimulados = [
            "¿Tienen disponibilidad para hoy?",
            "Gracias por la información",
            "¿Cuánto cuesta ese servicio?",
            "Me interesa hacer una reserva",
          ];

          const nuevoMensajeSimulado: Mensaje = {
            id: Date.now().toString(),
            remitente: "cliente",
            texto: mensajesSimulados[
              Math.floor(Math.random() * mensajesSimulados.length)
            ],
            fecha: new Date().toISOString(),
            leido: false,
          };

          setMensajes((prev) => [...prev, nuevoMensajeSimulado]);
          setEscribiendo(false);
          toast.info("Nuevo mensaje recibido");
        }, 2500);
      }
    }, 25000); // Cada 25 segundos

    return () => clearInterval(interval);
  }, []);

  const handleEnviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const mensaje: Mensaje = {
      id: Date.now().toString(),
      remitente: "empresa",
      texto: nuevoMensaje,
      fecha: new Date().toISOString(),
      leido: true,
    };

    setMensajes((prev) => [...prev, mensaje]);
    setNuevoMensaje("");
    toast.success("Mensaje enviado");
  };

  if (!chat || !cliente) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Chat no encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <Card className="rounded-b-none border-b">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Link to="/empresa/chat">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Avatar className="h-10 w-10">
            {cliente.avatar ? (
              <img
                src={cliente.avatar}
                alt={cliente.nombre}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {cliente.nombre.charAt(0)}
                </span>
              </div>
            )}
          </Avatar>
          <div className="flex-1">
            <h2 className="font-semibold">
              {cliente.nombre} {cliente.apellido}
            </h2>
            <p className="text-xs text-muted-foreground">
              {escribiendo ? "Escribiendo..." : cliente.ciudad}
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </CardHeader>
      </Card>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${
              mensaje.remitente === "empresa" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                mensaje.remitente === "empresa"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border"
              }`}
            >
              <p className="text-sm">{mensaje.texto}</p>
              <p
                className={`text-xs mt-1 ${
                  mensaje.remitente === "empresa"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {format(new Date(mensaje.fecha), "HH:mm", { locale: es })}
              </p>
            </div>
          </div>
        ))}

        {escribiendo && (
          <div className="flex justify-start">
            <div className="bg-background border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card className="rounded-t-none border-t">
        <CardContent className="p-4">
          <form onSubmit={handleEnviarMensaje} className="flex gap-2">
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
