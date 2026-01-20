import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  ciudad: string | null;
  rol: "cliente" | "empresa" | "admin";
  createdAt: string;
  _count?: {
    negocios: number;
    reservas: number;
  };
}

const Usuarios = () => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getUsuarios({ limit: 100 });
      setUsuarios(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: "cliente" | "empresa" | "admin") => {
    try {
      setUpdating(userId);
      await api.admin.updateUserRole(userId.toString(), newRole);
      toast({
        title: "Rol actualizado",
        description: `El rol del usuario ha sido actualizado a ${newRole}`,
      });
      // Refresh usuarios
      await fetchUsuarios();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el rol",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    usuario.telefono?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">Administra todos los usuarios del sistema</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search size={20} className="text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              className="border-0 focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Rol</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Registro</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">
                            {usuario.nombre} {usuario.apellido}
                          </p>
                          {usuario.telefono && (
                            <p className="text-sm text-muted-foreground">{usuario.telefono}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{usuario.email}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            usuario.rol === "admin"
                              ? "default"
                              : usuario.rol === "empresa"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {usuario.rol}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(usuario.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={updating === usuario.id}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {updating === usuario.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreVertical className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            {usuario.rol !== "cliente" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateRole(usuario.id, "cliente");
                                }}
                              >
                                Cambiar a Cliente
                              </DropdownMenuItem>
                            )}
                            {usuario.rol !== "empresa" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateRole(usuario.id, "empresa");
                                }}
                              >
                                Cambiar a Empresa
                              </DropdownMenuItem>
                            )}
                            {usuario.rol !== "admin" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateRole(usuario.id, "admin");
                                }}
                              >
                                Cambiar a Admin
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;
