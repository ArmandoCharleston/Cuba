import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, DollarSign, Users, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);
  const [clientesNuevos, setClientesNuevos] = useState(0);
  const [actividadReciente, setActividadReciente] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [reservasRes] = await Promise.all([
        api.reservas.getAll({ limit: 100 }),
      ]);
      
      const reservasData = reservasRes.data || [];
      setReservas(reservasData);

      // Calcular clientes nuevos (últimos 30 días)
      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);
      const clientesIds = new Set<string>();
      reservasData.forEach((r: any) => {
        if (r.cliente?.id && r.createdAt) {
          const fechaReserva = new Date(r.createdAt);
          if (fechaReserva >= hace30Dias) {
            clientesIds.add(r.cliente.id.toString());
          }
        }
      });
      setClientesNuevos(clientesIds.size);

      // Actividad reciente (últimas 10 reservas y reseñas)
      const actividad: any[] = [];
      reservasData.slice(0, 10).forEach((r: any) => {
        if (r.fecha) {
          const fecha = new Date(r.fecha);
          const ahora = new Date();
          const diffMs = ahora.getTime() - fecha.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let tiempo = "";
          if (diffMins < 60) {
            tiempo = `Hace ${diffMins} min`;
          } else if (diffHours < 24) {
            tiempo = `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
          } else {
            tiempo = `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
          }

          actividad.push({
            action: r.estado === 'confirmada' ? 'Reserva confirmada' : r.estado === 'completada' ? 'Reserva completada' : 'Nueva reserva',
            time: tiempo,
            client: r.cliente ? `${r.cliente.nombre || ''} ${r.cliente.apellido || ''}`.trim() || 'Cliente' : 'Cliente',
            fecha: fecha,
          });
        }
      });
      
      // Ordenar por fecha más reciente
      actividad.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
      setActividadReciente(actividad.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    };
  };

  const reservasHoy = reservas.filter((r) => {
    if (!r.fecha) return false;
    const hoy = new Date().toDateString();
    const fechaReserva = new Date(r.fecha).toDateString();
    return fechaReserva === hoy;
  }).length;

  const ingresosMes = reservas.reduce((total, r) => {
    if (!r.fecha) return total;
    const fechaReserva = new Date(r.fecha);
    const hoy = new Date();
    if (fechaReserva.getMonth() === hoy.getMonth() && fechaReserva.getFullYear() === hoy.getFullYear()) {
      return total + (r.precioTotal || 0);
    }
    return total;
  }, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">{user?.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : 'Empresa'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reservas Hoy</p>
                <p className="text-3xl font-bold">{reservasHoy}</p>
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
                <p className="text-3xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : reservas.length}</p>
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
                <p className="text-sm text-muted-foreground">Ingresos del Mes</p>
                <p className="text-3xl font-bold">${ingresosMes}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes Nuevos (30 días)</p>
                <p className="text-3xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : clientesNuevos}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : actividadReciente.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No hay actividad reciente
            </div>
          ) : (
            <div className="space-y-4">
              {actividadReciente.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.client}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
