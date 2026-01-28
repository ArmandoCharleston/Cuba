import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MessageSquare, Building2, Plus, Search } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminChatEmpresas() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchChats();
    fetchEmpresas();
  }, []);

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

  const fetchEmpresas = async () => {
    try {
      const response = await api.admin.getEmpresas({ limit: 100 });
      setEmpresas(response.data || []);
    } catch (error) {
      console.error('Error fetching empresas:', error);
      setEmpresas([]);
    }
  };

  const handleCreateChat = async (empresaId: number) => {
    try {
      setCreating(true);
      // Buscar si ya existe un chat con esta empresa
      const existingChat = chats.find(c => c.empresaId === empresaId);
      if (existingChat) {
        navigate(`/admin/chat-empresas/${existingChat.id}`);
        setDialogOpen(false);
        return;
      }
      
      // Crear nuevo chat
      const response = await api.chats.create({
        empresaId: empresaId.toString(),
        tipo: 'empresa-admin',
      });
      
      toast.success('Chat creado exitosamente');
      navigate(`/admin/chat-empresas/${response.data.id}`);
      setDialogOpen(false);
      fetchChats();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear el chat');
    } finally {
      setCreating(false);
    }
  };

  const empresasFiltradas = empresas.filter(e => {
    const nombreCompleto = `${e.nombre || ''} ${e.apellido || ''}`.toLowerCase();
    const email = e.email?.toLowerCase() || '';
    const negocioNombre = e.negocios?.[0]?.nombre?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return nombreCompleto.includes(query) || email.includes(query) || negocioNombre.includes(query);
  });

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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Chat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Seleccionar Empresa</DialogTitle>
              <DialogDescription>
                Elige una empresa para iniciar una conversación
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empresa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {empresasFiltradas.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No se encontraron empresas
                  </p>
                ) : (
                  empresasFiltradas.map((empresa) => {
                    const negocio = empresa.negocios?.[0];
                    return (
                      <Card
                        key={empresa.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleCreateChat(empresa.id)}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          {negocio?.foto ? (
                            <img
                              src={negocio.foto}
                              alt={negocio.nombre || 'Empresa'}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {negocio?.nombre || `${empresa.nombre} ${empresa.apellido}`}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {empresa.email}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
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
