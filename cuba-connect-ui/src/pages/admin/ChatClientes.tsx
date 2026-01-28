import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageSquare, User, Plus, Search } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminChatClientes() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchChats();
    fetchClientes();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await api.chats.getAll();
      // Filtrar solo chats con clientes (donde hay clienteId)
      const chatsConClientes = res.data.filter((chat: any) => chat.clienteId);
      setChats(chatsConClientes || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.admin.getUsuarios({ limit: 100 });
      const clientesData = (response.data || []).filter((u: any) => u.rol === 'cliente');
      setClientes(clientesData);
    } catch (error) {
      console.error('Error fetching clientes:', error);
      setClientes([]);
    }
  };

  const handleCreateChat = async (clienteId: number) => {
    try {
      setCreating(true);
      // Buscar si ya existe un chat con este cliente
      const existingChat = chats.find(c => c.clienteId === clienteId);
      if (existingChat) {
        navigate(`/admin/chat-clientes/${existingChat.id}`);
        setDialogOpen(false);
        return;
      }
      
      // Crear nuevo chat
      const response = await api.chats.create({
        clienteId: clienteId.toString(),
        tipo: 'cliente-admin',
      });
      
      toast.success('Chat creado exitosamente');
      navigate(`/admin/chat-clientes/${response.data.id}`);
      setDialogOpen(false);
      fetchChats();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear el chat');
    } finally {
      setCreating(false);
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.apellido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUltimoMensaje = (chat: any) => {
    if (!chat.mensajes || chat.mensajes.length === 0) return null;
    return chat.mensajes[chat.mensajes.length - 1];
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Seleccionar Cliente</DialogTitle>
              <DialogDescription>
                Elige un cliente para iniciar una conversación
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {clientesFiltrados.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No se encontraron clientes
                  </p>
                ) : (
                  clientesFiltrados.map((cliente) => (
                    <Card
                      key={cliente.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleCreateChat(cliente.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        {cliente.avatar ? (
                          <img
                            src={cliente.avatar}
                            alt={cliente.nombre}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xl font-semibold text-primary">
                              {cliente.nombre?.charAt(0) || "C"}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {cliente.nombre} {cliente.apellido}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {cliente.email}
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
            <p className="text-muted-foreground">Cargando chats...</p>
          </CardContent>
        </Card>
      ) : chats.length === 0 ? (
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
          {chats.map((chat) => {
            const ultimoMensaje = getUltimoMensaje(chat);
            const cliente = chat.cliente;

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
