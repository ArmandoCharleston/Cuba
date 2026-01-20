import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, CheckCircle, XCircle, Eye, Building2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type EstadoEmpresa = "pendiente" | "aprobada" | "rechazada";

interface Empresa {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  ciudad: string | null;
  createdAt: string;
  negocios: Array<{
    id: number;
    nombre: string;
    estado: EstadoEmpresa;
    categoria: { nombre: string };
    ciudad: { nombre: string };
    _count: {
      reservas: number;
      resenas: number;
    };
  }>;
}

const Empresas = () => {
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNegocio, setSelectedNegocio] = useState<{ id: number; nombre: string; estado: EstadoEmpresa; empresa: Empresa } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getEmpresas({ limit: 100 });
      setEmpresas(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar las empresas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (negocioId: number) => {
    try {
      setUpdating(true);
      await api.admin.updateNegocioEstado(negocioId.toString(), "aprobada");
      toast({
        title: "Empresa Aprobada",
        description: "La empresa ha sido aprobada exitosamente.",
      });
      setDialogOpen(false);
      await fetchEmpresas();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al aprobar la empresa",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRechazar = async (negocioId: number) => {
    try {
      setUpdating(true);
      await api.admin.updateNegocioEstado(negocioId.toString(), "rechazada");
      toast({
        title: "Empresa Rechazada",
        description: "La empresa ha sido rechazada.",
        variant: "destructive",
      });
      setDialogOpen(false);
      await fetchEmpresas();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al rechazar la empresa",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Flatten empresas to show each negocio as a row
  const negociosList = empresas.flatMap((empresa) =>
    empresa.negocios.map((negocio) => ({
      id: negocio.id,
      nombre: negocio.nombre,
      email: empresa.email,
      telefono: empresa.telefono || "N/A",
      ciudad: negocio.ciudad.nombre,
      categoria: negocio.categoria.nombre,
      estado: negocio.estado,
      fechaRegistro: empresa.createdAt,
      empresa,
    }))
  );

  const filteredNegocios = negociosList.filter((negocio) =>
    negocio.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    negocio.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    negocio.ciudad.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendientes = negociosList.filter((e) => e.estado === "pendiente").length;
  const aprobadas = negociosList.filter((e) => e.estado === "aprobada").length;
  const rechazadas = negociosList.filter((e) => e.estado === "rechazada").length;

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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredNegocios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron empresas</p>
            </div>
          ) : (
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
                {filteredNegocios.map((negocio) => (
                  <TableRow key={negocio.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{negocio.nombre}</p>
                          <p className="text-sm text-muted-foreground">{negocio.telefono}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{negocio.email}</TableCell>
                    <TableCell className="text-sm">{negocio.ciudad}</TableCell>
                    <TableCell className="text-sm">{negocio.categoria}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          negocio.estado === "aprobada"
                            ? "default"
                            : negocio.estado === "pendiente"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {negocio.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(negocio.fechaRegistro).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedNegocio({
                            id: negocio.id,
                            nombre: negocio.nombre,
                            estado: negocio.estado,
                            empresa: negocio.empresa,
                          });
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
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Empresa</DialogTitle>
            <DialogDescription>Revisa la información y aprueba o rechaza la solicitud</DialogDescription>
          </DialogHeader>
          {selectedNegocio && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre del Negocio</p>
                  <p className="text-lg font-semibold">{selectedNegocio.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-lg">{selectedNegocio.empresa.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p className="text-lg">{selectedNegocio.empresa.telefono || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ciudad</p>
                  <p className="text-lg">{selectedNegocio.empresa.ciudad || "N/A"}</p>
                </div>
                {selectedNegocio.empresa.negocios[0] && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Categoría</p>
                      <p className="text-lg">{selectedNegocio.empresa.negocios[0].categoria.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ciudad del Negocio</p>
                      <p className="text-lg">{selectedNegocio.empresa.negocios[0].ciudad.nombre}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado Actual</p>
                  <Badge
                    variant={
                      selectedNegocio.estado === "aprobada"
                        ? "default"
                        : selectedNegocio.estado === "pendiente"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {selectedNegocio.estado}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedNegocio?.estado !== "aprobada" && (
              <Button
                onClick={() => handleAprobar(selectedNegocio?.id || 0)}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Aprobar
              </Button>
            )}
            {selectedNegocio?.estado !== "rechazada" && (
              <Button
                variant="destructive"
                onClick={() => handleRechazar(selectedNegocio?.id || 0)}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
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
