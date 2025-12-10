import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin } from "lucide-react";
import { reservasMock } from "@/data/reservasMock";
import { negociosMock } from "@/data/negociosMock";
import { serviciosMock } from "@/data/serviciosMock";
import { ciudadesMock } from "@/data/ciudadesMock";

const Reservas = () => {
  const misReservas = reservasMock.filter((r) => r.clienteId === "1");

  const proximas = misReservas.filter((r) => r.estado === "confirmada" || r.estado === "pendiente");
  const completadas = misReservas.filter((r) => r.estado === "completada");
  const canceladas = misReservas.filter((r) => r.estado === "cancelada");

  const ReservaCard = ({ reserva }: { reserva: typeof misReservas[0] }) => {
    const negocio = negociosMock.find((n) => n.id === reserva.negocioId);
    const servicio = serviciosMock.find((s) => s.id === reserva.servicioId);
    const ciudad = ciudadesMock.find((c) => c.id === negocio?.ciudadId);

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src={negocio?.foto}
                alt={negocio?.nombre}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{negocio?.nombre}</h3>
                <p className="text-sm text-muted-foreground">{servicio?.nombre}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {new Date(reserva.fecha).toLocaleDateString()} - {reserva.hora}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {ciudad?.nombre}
                  </div>
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
                    : "outline"
                }
              >
                {reserva.estado}
              </Badge>
              <p className="text-lg font-semibold">${reserva.precioTotal}</p>
              {reserva.estado === "confirmada" && (
                <Button variant="outline" size="sm">
                  Cancelar
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
    </div>
  );
};

export default Reservas;
