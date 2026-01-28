import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Building2 } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminChatEmpresas() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.chats.getAll();
        // Filtrar solo chats con empresas (donde hay empresaId)
        const chatsConEmpresas = res.data.filter((chat: any) => chat.empresaId);
        setChats(chatsConEmpresas || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const getUltimoMensaje = (chat: any) => {
    if (!chat.mensajes || chat.mensajes.length === 0) return null;
    return chat.mensajes[chat.mensajes.length - 1];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chat con Empresas</h1>
          <p className="text-muted-foreground mt-1">
            Conversaciones con empresas de la plataforma
          </p>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Cargando chats...</p>
          </CardContent>
        </Card>
      ) : chats.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tienes mensajes</h3>
            <p className="text-muted-foreground text-center">
              Las conversaciones con empresas aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const ultimoMensaje = getUltimoMensaje(chat);
            const empresa = chat.empresa;
            const negocio = chat.negocio;

            return (
              <Link key={chat.id} to={`/admin/chat-empresas/${chat.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative">
                      {negocio?.foto ? (
                        <img
                          src={negocio.foto}
                          alt={negocio.nombre || 'Negocio'}
                          className="w-14 h-14 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      {chat.noLeidosEmpresa > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {chat.noLeidosEmpresa}
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">
                          {negocio?.nombre || empresa?.nombre || "Empresa"}
                        </h3>
                        {ultimoMensaje && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {ultimoMensaje.createdAt || ultimoMensaje.fecha ? format(new Date(ultimoMensaje.createdAt || ultimoMensaje.fecha!), "HH:mm", { locale: es }) : '--:--'}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm truncate ${
                          chat.noLeidosEmpresa > 0
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
