import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

    if (user) {
      fetchReservas();
    }
  }, [user]);

  const proximasReservas = reservas.filter((r) => r.estado !== "completada" && r.estado !== "cancelada");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">
          Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}
        </h1>
        <p className="text-muted-foreground">Aquí está un resumen de tus reservas</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2">
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
                <p className="text-3xl font-bold">{reservas.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
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
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          ) : proximasReservas.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No tienes reservas próximas</p>
              <Link to="/negocios">
                <Button className="mt-4">Explorar Negocios</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {proximasReservas.slice(0, 3).map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center space-x-4">
                    {reserva.negocio?.foto && (
                      <img
                        src={reserva.negocio.foto}
                        alt={reserva.negocio?.nombre || 'Negocio'}
                        className="h-16 w-16 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{reserva.negocio?.nombre || 'Negocio'}</h3>
                      <p className="text-sm text-muted-foreground">{reserva.servicio?.nombre || 'Servicio'}</p>
                      <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>
                          {reserva.fecha ? new Date(reserva.fecha).toLocaleDateString() : '--'} - {reserva.hora || '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="mt-2 text-sm font-semibold">${reserva.precioTotal}</p>
                  </div>
                </div>
              ))}
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
            <h3 className="mb-2 text-xl font-semibold">Explorar Negocios</h3>
            <p className="mb-4 text-muted-foreground">
              Descubre nuevos lugares y servicios disponibles
            </p>
            <Link to="/negocios">
              <Button variant="outline" className="w-full">Explorar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
