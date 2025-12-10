import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User } from "lucide-react";
import { chatsClienteAdminMock } from "@/data/chatsClienteAdminMock";
import { usuariosMock } from "@/data/usuariosMock";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminChatClientes() {
  const getUltimoMensaje = (chatId: string) => {
    const chat = chatsClienteAdminMock.find((c) => c.id === chatId);
    if (!chat || chat.mensajes.length === 0) return null;
    return chat.mensajes[chat.mensajes.length - 1];
  };

  const getClienteInfo = (clienteId: string) => {
    return usuariosMock.find((u) => u.id === clienteId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chat con Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Conversaciones con clientes de la plataforma
          </p>
        </div>
      </div>

      {chatsClienteAdminMock.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tienes mensajes</h3>
            <p className="text-muted-foreground text-center">
              Las conversaciones con clientes aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chatsClienteAdminMock.map((chat) => {
            const ultimoMensaje = getUltimoMensaje(chat.id);
            const cliente = getClienteInfo(chat.clienteId);

            return (
              <Link key={chat.id} to={`/admin/chat-clientes/${chat.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative">
                      {cliente?.avatar ? (
                        <img
                          src={cliente.avatar}
                          alt={cliente.nombre}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      {chat.noLeidosAdmin > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {chat.noLeidosAdmin}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {cliente
                            ? `${cliente.nombre} ${cliente.apellido}`
                            : "Cliente"}
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
                          chat.noLeidosAdmin > 0
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {ultimoMensaje?.remitente === "admin" && "Tú: "}
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
