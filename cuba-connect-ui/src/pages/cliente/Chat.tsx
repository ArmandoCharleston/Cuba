import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { chatsMock } from "@/data/chatsMock";
import { negociosMock } from "@/data/negociosMock";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ClienteChat() {
  // Filtrar chats del cliente actual (mock: usuario 1)
  const clienteId = "1";
  const chatsCliente = chatsMock.filter((chat) => chat.clienteId === clienteId);

  const getUltimoMensaje = (chatId: string) => {
    const chat = chatsMock.find((c) => c.id === chatId);
    if (!chat || chat.mensajes.length === 0) return null;
    return chat.mensajes[chat.mensajes.length - 1];
  };

  const getNegocioInfo = (negocioId: string) => {
    return negociosMock.find((n) => n.id === negocioId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mensajes</h1>
          <p className="text-muted-foreground mt-1">
            Conversaciones con negocios
          </p>
        </div>
      </div>

      {chatsCliente.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tienes mensajes</h3>
            <p className="text-muted-foreground text-center">
              Cuando contactes un negocio, tus conversaciones aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chatsCliente.map((chat) => {
            const ultimoMensaje = getUltimoMensaje(chat.id);
            const negocio = getNegocioInfo(chat.negocioId);

            return (
              <Link key={chat.id} to={`/cliente/chat/${chat.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative">
                      {negocio?.foto ? (
                        <img
                          src={negocio.foto}
                          alt={negocio.nombre}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      {chat.noLeidosCliente > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {chat.noLeidosCliente}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {negocio?.nombre || "Negocio"}
                        </h3>
                        {ultimoMensaje && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {format(new Date(ultimoMensaje.fecha), "HH:mm", {
                              locale: es,
                            })}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm truncate ${
                          chat.noLeidosCliente > 0
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {ultimoMensaje?.remitente === "cliente" && "Tú: "}
                        {ultimoMensaje?.texto || "Sin mensajes"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
