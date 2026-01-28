import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

type Mensaje = {
  id: number | string;
  remitente: "cliente" | "admin" | "empresa";
  texto: string;
  createdAt?: string;
  fecha?: string;
  leido?: boolean;
};

export default function ClienteChatAdminConversacion() {
  const { id } = useParams();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [chat, setChat] = useState<any | null>(null);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const res = await api.chats.getById(id);
        setChat(res.data);
        setMensajes(res.data.mensajes || []);
      } catch (e: any) {
        toast.error(e.message || "No se pudo cargar el chat");
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, escribiendo]);

  const handleEnviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !id) return;

    try {
      const res = await api.chats.sendMessage(id, nuevoMensaje);
      setMensajes((prev) => [...prev, res.data]);
      setNuevoMensaje("");
      toast.success("Mensaje enviado");
    } catch (e: any) {
      toast.error(e.message || "Error al enviar mensaje");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Cargando chat...</p>
      </div>
    );
  }

  if (!chat) {
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
          <Link to="/cliente/chat-admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">Soporte Admin</h2>
            <p className="text-xs text-muted-foreground">
              {escribiendo ? "Escribiendo..." : "Equipo de soporte"}
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${
              mensaje.remitente === "cliente" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                mensaje.remitente === "cliente"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border"
              }`}
            >
              <p className="text-sm">{mensaje.texto}</p>
              <p
                className={`text-xs mt-1 ${
                  mensaje.remitente === "cliente"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {format(new Date(mensaje.createdAt || mensaje.fecha), "HH:mm", { locale: es })}
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
