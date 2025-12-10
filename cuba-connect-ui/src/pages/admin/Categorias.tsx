import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Edit, Trash2, Scissors, Sparkles, Heart, Dumbbell, UtensilsCrossed, Stethoscope } from "lucide-react";
import { categoriasMock, Categoria } from "@/data/categoriasMock";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scissors,
  Sparkles,
  Heart,
  Dumbbell,
  UtensilsCrossed,
  Stethoscope,
};

const Categorias = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>(categoriasMock);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    icono: "Scissors",
    descripcion: "",
  });

  const handleOpenCreate = () => {
    setEditMode(false);
    setFormData({ nombre: "", icono: "Scissors", descripcion: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (categoria: Categoria) => {
    setEditMode(true);
    setSelectedCategoria(categoria);
    setFormData({
      nombre: categoria.nombre,
      icono: categoria.icono,
      descripcion: categoria.descripcion,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.nombre || !formData.descripcion) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      });
      return;
    }

    if (editMode && selectedCategoria) {
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategoria.id
            ? { ...cat, nombre: formData.nombre, icono: formData.icono, descripcion: formData.descripcion }
            : cat
        )
      );
      toast({
        title: "Categoría Actualizada",
        description: "La categoría ha sido actualizada exitosamente.",
      });
    } else {
      const newCategoria: Categoria = {
        id: String(categorias.length + 1),
        nombre: formData.nombre,
        icono: formData.icono,
        descripcion: formData.descripcion,
      };
      setCategorias((prev) => [...prev, newCategoria]);
      toast({
        title: "Categoría Creada",
        description: "La categoría ha sido creada exitosamente.",
      });
    }

    setDialogOpen(false);
    setFormData({ nombre: "", icono: "Scissors", descripcion: "" });
  };

  const handleDelete = () => {
    if (selectedCategoria) {
      setCategorias((prev) => prev.filter((cat) => cat.id !== selectedCategoria.id));
      toast({
        title: "Categoría Eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
      });
    }
    setDeleteDialogOpen(false);
  };

  const filteredCategorias = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableIcons = ["Scissors", "Sparkles", "Heart", "Dumbbell", "UtensilsCrossed", "Stethoscope"];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Crea, edita y elimina categorías de servicios</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search size={20} className="text-muted-foreground" />
            <Input
              placeholder="Buscar categorías..."
              className="border-0 focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icono</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => {
                const IconComponent = iconMap[categoria.icono] || Scissors;
                return (
                  <TableRow key={categoria.id}>
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{categoria.nombre}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{categoria.descripcion}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(categoria)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(categoria)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
            <DialogDescription>
              {editMode ? "Modifica los datos de la categoría" : "Completa el formulario para crear una nueva categoría"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Peluquería"
              />
            </div>
            <div>
              <Label htmlFor="icono">Icono</Label>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {availableIcons.map((iconName) => {
                  const IconComponent = iconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({ ...formData, icono: iconName })}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition-colors ${
                        formData.icono === iconName
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe brevemente esta categoría"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editMode ? "Guardar Cambios" : "Crear Categoría"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La categoría "{selectedCategoria?.nombre}" será eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categorias;
