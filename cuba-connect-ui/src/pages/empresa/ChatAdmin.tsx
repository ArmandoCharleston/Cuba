import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function EmpresaChatAdmin() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.chats.getAll();
        // Filtrar solo chats de tipo empresa-admin
        const chatsAdmin = res.data.filter((chat: any) => chat.tipo === 'empresa-admin');
        setChats(chatsAdmin || []);
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
          <h1 className="text-3xl font-bold">Soporte Admin</h1>
          <p className="text-muted-foreground mt-1">
            Conversaciones con el equipo de soporte
          </p>
        </div>
        <Button
          onClick={async () => {
            try {
              // Obtener el admin (asumiendo que hay un admin con id 1 o el primer admin)
              const adminId = "1"; // TODO: Obtener el ID del admin desde la API
              const res = await api.chats.create({
                adminId,
                tipo: 'empresa-admin',
              });
              window.location.href = `/empresa/chat-admin/${res.data.id}`;
            } catch (error: any) {
              toast.error(error.message || "Error al crear chat con soporte");
            }
          }}
        >
          <Shield className="mr-2 h-4 w-4" />
          Contactar Soporte
        </Button>
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
              Cuando contactes al equipo de soporte, las conversaciones
              aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const ultimoMensaje = getUltimoMensaje(chat);

            return (
              <Link key={chat.id} to={`/empresa/chat-admin/${chat.id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-7 w-7 text-primary" />
                      </div>
                      {chat.noLeidosEmpresa > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {chat.noLeidosEmpresa}
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
                            {format(new Date(ultimoMensaje.createdAt || ultimoMensaje.fecha), "HH:mm", {
                              locale: es,
                            })}
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
                        {ultimoMensaje?.remitente === "empresa" && "Tú: "}
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
