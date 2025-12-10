import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical } from "lucide-react";
import { usuariosMock } from "@/data/usuariosMock";

const Usuarios = () => {
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
            <Input placeholder="Buscar usuarios..." className="border-0 focus-visible:ring-0" />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
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
                {usuariosMock.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {usuario.nombre} {usuario.apellido}
                        </p>
                        <p className="text-sm text-muted-foreground">{usuario.telefono}</p>
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
                      {new Date(usuario.fechaRegistro).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;
