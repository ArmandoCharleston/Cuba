import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Clock, Star, TrendingUp } from "lucide-react";
import { reservasMock } from "@/data/reservasMock";
import { negociosMock } from "@/data/negociosMock";
import { serviciosMock } from "@/data/serviciosMock";

const Dashboard = () => {
  const misReservas = reservasMock.filter((r) => r.clienteId === "1");
  const proximasReservas = misReservas.filter((r) => r.estado !== "completada" && r.estado !== "cancelada");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Bienvenida, María</h1>
        <p className="text-muted-foreground">Aquí está un resumen de tus reservas</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximas Reservas</p>
                <p className="text-3xl font-bold">{proximasReservas.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reservas</p>
                <p className="text-3xl font-bold">{misReservas.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Favoritos</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximas Reservas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Próximas Reservas</CardTitle>
            <Link to="/cliente/reservas">
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {proximasReservas.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No tienes reservas próximas</p>
              <Link to="/negocios">
                <Button className="mt-4">Explorar Negocios</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {proximasReservas.map((reserva) => {
                const negocio = negociosMock.find((n) => n.id === reserva.negocioId);
                const servicio = serviciosMock.find((s) => s.id === reserva.servicioId);

                return (
                  <div
                    key={reserva.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={negocio?.foto}
                        alt={negocio?.nombre}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{negocio?.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{servicio?.nombre}</p>
                        <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock size={14} />
                          <span>
                            {new Date(reserva.fecha).toLocaleDateString()} - {reserva.hora}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          reserva.estado === "confirmada" ? "default" : "secondary"
                        }
                      >
                        {reserva.estado}
                      </Badge>
                      <p className="mt-2 text-sm font-semibold">${reserva.precioTotal}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-hero text-primary-foreground">
          <CardContent className="p-6">
            <h3 className="mb-2 text-xl font-semibold">Explorar Negocios</h3>
            <p className="mb-4 opacity-90">
              Descubre nuevos lugares y reserva tu próxima experiencia
            </p>
            <Link to="/negocios">
              <Button variant="secondary">Explorar Ahora</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-xl font-semibold">¿Necesitas Ayuda?</h3>
            <p className="mb-4 text-muted-foreground">
              Contacta con nuestro equipo de soporte
            </p>
            <Button variant="outline">Contactar Soporte</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
