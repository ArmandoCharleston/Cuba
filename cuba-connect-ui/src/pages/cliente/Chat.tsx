import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function ClienteChat() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [negocios, setNegocios] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchChats();
    fetchNegocios();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await api.chats.getAll();
      setChats(response.data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNegocios = async () => {
    try {
      const response = await api.negocios.getAll({ limit: 100 });
      setNegocios(response.data || []);
    } catch (error) {
      console.error('Error fetching negocios:', error);
      setNegocios([]);
    }
  };

  const handleCreateChat = async (negocioId: number) => {
    try {
      setCreating(true);
      // Buscar si ya existe un chat con este negocio
      const existingChat = chats.find(c => c.negocioId === negocioId);
      if (existingChat) {
        navigate(`/cliente/chat/${existingChat.id}`);
        setDialogOpen(false);
        return;
      }
      
      // Crear nuevo chat
      const response = await api.chats.create({
        negocioId: negocioId.toString(),
        tipo: 'cliente-empresa',
      });
      
      toast.success('Chat creado exitosamente');
      navigate(`/cliente/chat/${response.data.id}`);
      setDialogOpen(false);
      fetchChats();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear el chat');
    } finally {
      setCreating(false);
    }
  };

  const negociosFiltrados = negocios.filter(n => 
    n.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mensajes</h1>
          <p className="text-muted-foreground mt-1">
            Conversaciones con negocios
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Seleccionar Negocio</DialogTitle>
              <DialogDescription>
                Elige un negocio para iniciar una conversación
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar negocio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {negociosFiltrados.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No se encontraron negocios
                  </p>
                ) : (
                  negociosFiltrados.map((negocio) => (
                    <Card
                      key={negocio.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleCreateChat(negocio.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        {negocio.foto ? (
                          <img
                            src={negocio.foto}
                            alt={negocio.nombre}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{negocio.nombre}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {negocio.descripcion || negocio.categoria?.nombre || 'Sin descripción'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Cargando mensajes...</p>
          </CardContent>
        </Card>
      ) : chats.length === 0 ? (
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
          {chats.map((chat) => {
            const ultimoMensaje = chat.mensajes && chat.mensajes.length > 0 
              ? chat.mensajes[chat.mensajes.length - 1] 
              : null;
            const negocio = chat.negocio;

            return (
              <Link key={chat.id} to={`/cliente/chat/${chat.id}`}>
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
                            {ultimoMensaje.createdAt || ultimoMensaje.fecha ? format(new Date(ultimoMensaje.createdAt || ultimoMensaje.fecha!), "HH:mm", { locale: es }) : '--:--'}
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
