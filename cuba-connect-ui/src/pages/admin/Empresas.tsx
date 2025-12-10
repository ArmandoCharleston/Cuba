import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, CheckCircle, XCircle, Eye, Building2 } from "lucide-react";
import { negociosMock } from "@/data/negociosMock";
import { categoriasMock } from "@/data/categoriasMock";
import { ciudadesMock } from "@/data/ciudadesMock";
import { useToast } from "@/hooks/use-toast";

type EstadoEmpresa = "pendiente" | "aprobada" | "rechazada";

interface EmpresaExtendida {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  categoria: string;
  estado: EstadoEmpresa;
  fechaRegistro: string;
}

const Empresas = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaExtendida | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Simular empresas con estados
  const [empresas, setEmpresas] = useState<EmpresaExtendida[]>(
    negociosMock.map((negocio, index) => {
      const ciudad = ciudadesMock.find((c) => c.id === negocio.ciudadId);
      const categoria = categoriasMock.find((c) => c.id === negocio.categoriaId);
      
      return {
        id: negocio.id,
        nombre: negocio.nombre,
        email: negocio.email,
        telefono: negocio.telefono,
        ciudad: ciudad?.nombre || "Sin ciudad",
        categoria: categoria?.nombre || "Sin categoría",
        estado: index % 3 === 0 ? "pendiente" : index % 3 === 1 ? "aprobada" : "rechazada",
        fechaRegistro: `2024-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      };
    })
  );

  const handleAprobar = (id: string) => {
    setEmpresas((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, estado: "aprobada" as EstadoEmpresa } : emp))
    );
    toast({
      title: "Empresa Aprobada",
      description: "La empresa ha sido aprobada exitosamente.",
    });
    setDialogOpen(false);
  };

  const handleRechazar = (id: string) => {
    setEmpresas((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, estado: "rechazada" as EstadoEmpresa } : emp))
    );
    toast({
      title: "Empresa Rechazada",
      description: "La empresa ha sido rechazada.",
      variant: "destructive",
    });
    setDialogOpen(false);
  };

  const filteredEmpresas = empresas.filter((emp) =>
    emp.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.ciudad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendientes = empresas.filter((e) => e.estado === "pendiente").length;
  const aprobadas = empresas.filter((e) => e.estado === "aprobada").length;
  const rechazadas = empresas.filter((e) => e.estado === "rechazada").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Gestión de Empresas</h1>
        <p className="text-muted-foreground">Aprueba o rechaza solicitudes de empresas</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{pendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{aprobadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{rechazadas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search size={20} className="text-muted-foreground" />
            <Input
              placeholder="Buscar empresas..."
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
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmpresas.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{empresa.nombre}</p>
                        <p className="text-sm text-muted-foreground">{empresa.telefono}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{empresa.email}</TableCell>
                  <TableCell className="text-sm">{empresa.ciudad}</TableCell>
                  <TableCell className="text-sm">{empresa.categoria}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        empresa.estado === "aprobada"
                          ? "default"
                          : empresa.estado === "pendiente"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {empresa.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(empresa.fechaRegistro).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEmpresa(empresa);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Empresa</DialogTitle>
            <DialogDescription>Revisa la información y aprueba o rechaza la solicitud</DialogDescription>
          </DialogHeader>
          {selectedEmpresa && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="text-lg font-semibold">{selectedEmpresa.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{selectedEmpresa.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p className="text-lg">{selectedEmpresa.telefono}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ciudad</p>
                  <p className="text-lg">{selectedEmpresa.ciudad}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categoría</p>
                  <p className="text-lg">{selectedEmpresa.categoria}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado Actual</p>
                  <Badge
                    variant={
                      selectedEmpresa.estado === "aprobada"
                        ? "default"
                        : selectedEmpresa.estado === "pendiente"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {selectedEmpresa.estado}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedEmpresa?.estado !== "aprobada" && (
              <Button onClick={() => handleAprobar(selectedEmpresa?.id || "")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar
              </Button>
            )}
            {selectedEmpresa?.estado !== "rechazada" && (
              <Button variant="destructive" onClick={() => handleRechazar(selectedEmpresa?.id || "")}>
                <XCircle className="mr-2 h-4 w-4" />
                Rechazar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Empresas;
