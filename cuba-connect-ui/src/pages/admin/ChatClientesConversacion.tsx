import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, User } from "lucide-react";
import {
  chatsClienteAdminMock,
  MensajeClienteAdmin,
} from "@/data/chatsClienteAdminMock";
import { usuariosMock } from "@/data/usuariosMock";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminChatClientesConversacion() {
  const { id } = useParams();
  const [mensajes, setMensajes] = useState<MensajeClienteAdmin[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = chatsClienteAdminMock.find((c) => c.id === id);
  const cliente = usuariosMock.find((u) => u.id === chat?.clienteId);

  useEffect(() => {
    if (chat) {
      setMensajes(chat.mensajes);
    }
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, escribiendo]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.83) {
        setEscribiendo(true);

        setTimeout(() => {
          const mensajesSimulados = [
            "¿Pueden ayudarme con esto?",
            "Gracias por la respuesta",
            "Tengo otra pregunta",
            "¿Cuándo estará resuelto?",
          ];

          const nuevoMensajeSimulado: MensajeClienteAdmin = {
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
          toast.info("Nuevo mensaje del cliente");
        }, 2500);
      }
    }, 21000);

    return () => clearInterval(interval);
  }, []);

  const handleEnviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const mensaje: MensajeClienteAdmin = {
      id: Date.now().toString(),
      remitente: "admin",
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
      <Card className="rounded-b-none border-b">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Link to="/admin/chat-clientes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {cliente.avatar ? (
              <img
                src={cliente.avatar}
                alt={cliente.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">
              {cliente.nombre} {cliente.apellido}
            </h2>
            <p className="text-xs text-muted-foreground">
              {escribiendo ? "Escribiendo..." : cliente.ciudad}
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${
              mensaje.remitente === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                mensaje.remitente === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border"
              }`}
            >
              <p className="text-sm">{mensaje.texto}</p>
              <p
                className={`text-xs mt-1 ${
                  mensaje.remitente === "admin"
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
