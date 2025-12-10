import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { serviciosMock } from "@/data/serviciosMock";
import { toast } from "sonner";

const Servicios = () => {
  const [showForm, setShowForm] = useState(false);
  const misServicios = serviciosMock.filter((s) => s.negocioId === "1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Servicio guardado exitosamente");
    setShowForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Mis Servicios</h1>
          <p className="text-muted-foreground">Gestiona los servicios que ofreces</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-5 w-5" />
          Nuevo Servicio
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Servicio</Label>
                  <Input id="nombre" placeholder="Ej: Corte de Cabello" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Input id="categoria" placeholder="Ej: Cortes" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  placeholder="Describe el servicio..."
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio (USD)</Label>
                  <Input id="precio" type="number" placeholder="25" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracion">Duración (minutos)</Label>
                  <Input id="duracion" type="number" placeholder="60" required />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Servicio</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {misServicios.map((servicio) => (
          <Card key={servicio.id}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{servicio.nombre}</h3>
                  <Badge variant="secondary" className="mt-2">
                    {servicio.categoria}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <p className="mb-4 text-sm text-muted-foreground">{servicio.descripcion}</p>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">${servicio.precio}</div>
                {servicio.duracion > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {servicio.duracion} min
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Servicios;
