import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { toast } from "sonner";
import { ciudadesMock } from "@/data/ciudadesMock";

const Perfil = () => {
  const [formData, setFormData] = useState({
    nombre: "María",
    apellido: "González",
    email: "maria@example.com",
    telefono: "+53 5 234 5678",
    ciudad: "1",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Perfil actualizado exitosamente");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Administra tu información personal</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="mx-auto mb-4 h-24 w-24">
              <AvatarFallback className="text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h3 className="mb-1 text-xl font-semibold">
              {formData.nombre} {formData.apellido}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{formData.email}</p>
            <Button variant="outline" className="w-full">
              Cambiar Foto
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <select
                    id="ciudad"
                    name="ciudad"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.ciudad}
                    onChange={handleChange}
                  >
                    {ciudadesMock.map((ciudad) => (
                      <option key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input id="currentPassword" type="password" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Actualizar Contraseña</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
