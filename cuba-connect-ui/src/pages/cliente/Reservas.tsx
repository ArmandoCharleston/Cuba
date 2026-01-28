import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const Reservas = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await api.reservas.getAll();
        setReservas(response.data || []);
      } catch (error) {
        console.error('Error fetching reservas:', error);
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const handleCancelar = async (reservaId: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      setCancelling(reservaId);
      await api.reservas.updateEstado(reservaId, 'cancelada');
      toast.success('Reserva cancelada exitosamente');
      // Refresh reservas
      const response = await api.reservas.getAll();
      setReservas(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error al cancelar la reserva');
    } finally {
      setCancelling(null);
    }
  };

  const proximas = reservas.filter((r) => r.estado === "confirmada" || r.estado === "pendiente");
  const completadas = reservas.filter((r) => r.estado === "completada");
  const canceladas = reservas.filter((r) => r.estado === "cancelada");

  const ReservaCard = ({ reserva }: { reserva: any }) => {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-4">
              {reserva.negocio?.foto && (
                <img
                  src={reserva.negocio.foto}
                  alt={reserva.negocio?.nombre || 'Negocio'}
                  className="h-20 w-20 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">{reserva.negocio?.nombre || 'Negocio'}</h3>
                <p className="text-sm text-muted-foreground">{reserva.servicio?.nombre || 'Servicio'}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {reserva.fecha ? new Date(reserva.fecha).toLocaleDateString() : '--'} - {reserva.hora || '--'}
                  </div>
                  {(reserva.negocio?.municipio || reserva.negocio?.provincia) && (
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {reserva.negocio.municipio?.nombre || ''}{reserva.negocio.provincia?.nombre ? `, ${reserva.negocio.provincia.nombre}` : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <Badge
                variant={
                  reserva.estado === "confirmada"
                    ? "default"
                    : reserva.estado === "completada"
                    ? "secondary"
                    : reserva.estado === "cancelada"
                    ? "destructive"
                    : "outline"
                }
              >
                {reserva.estado}
              </Badge>
              <p className="text-lg font-semibold">${reserva.precioTotal}</p>
              {(reserva.estado === "confirmada" || reserva.estado === "pendiente") && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCancelar(reserva.id.toString())}
                  disabled={cancelling === reserva.id.toString()}
                >
                  {cancelling === reserva.id.toString() ? "Cancelando..." : "Cancelar"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Mis Reservas</h1>
        <p className="text-muted-foreground">Gestiona todas tus reservas</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Cargando reservas...</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="proximas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="proximas">Próximas ({proximas.length})</TabsTrigger>
          <TabsTrigger value="completadas">Completadas ({completadas.length})</TabsTrigger>
          <TabsTrigger value="canceladas">Canceladas ({canceladas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="proximas" className="space-y-4">
          {proximas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tienes reservas próximas</p>
              </CardContent>
            </Card>
          ) : (
            proximas.map((reserva) => <ReservaCard key={reserva.id} reserva={reserva} />)
          )}
        </TabsContent>

        <TabsContent value="completadas" className="space-y-4">
          {completadas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tienes reservas completadas</p>
              </CardContent>
            </Card>
          ) : (
            completadas.map((reserva) => <ReservaCard key={reserva.id} reserva={reserva} />)
          )}
        </TabsContent>

        <TabsContent value="canceladas" className="space-y-4">
          {canceladas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No tienes reservas canceladas</p>
              </CardContent>
            </Card>
          ) : (
            canceladas.map((reserva) => <ReservaCard key={reserva.id} reserva={reserva} />)
          )}
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
};

export default Reservas;
