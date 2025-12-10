import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Shield } from "lucide-react";
import { chatsClienteAdminMock } from "@/data/chatsClienteAdminMock";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ClienteChatAdmin() {
  const clienteId = "1";
  const chatsCliente = chatsClienteAdminMock.filter(
    (chat) => chat.clienteId === clienteId
  );

  const getUltimoMensaje = (chatId: string) => {
    const chat = chatsClienteAdminMock.find((c) => c.id === chatId);
    if (!chat || chat.mensajes.length === 0) return null;
    return chat.mensajes[chat.mensajes.length - 1];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Soporte Admin</h1>
          <p className="text-muted-foreground mt-1">
            Conversaciones con el equipo de soporte
          </p>
        </div>
      </div>

      {chatsCliente.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tienes mensajes</h3>
            <p className="text-muted-foreground text-center">
              Cuando contactes al equipo de soporte, las conversaciones
              aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chatsCliente.map((chat) => {
            const ultimoMensaje = getUltimoMensaje(chat.id);

            return (
              <Link key={chat.id} to={`/cliente/chat-admin/${chat.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-7 w-7 text-primary" />
                      </div>
                      {chat.noLeidosCliente > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {chat.noLeidosCliente}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          Soporte Admin
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
