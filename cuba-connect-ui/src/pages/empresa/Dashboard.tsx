import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, DollarSign, Users } from "lucide-react";
import { reservasMock } from "@/data/reservasMock";

const Dashboard = () => {
  const misReservas = reservasMock.filter((r) => r.negocioId === "1");
  const reservasHoy = 3;
  const ingresosMes = 1250;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Salón Bella Cuba</p>
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
                <p className="text-sm text-muted-foreground">Clientes Nuevos</p>
                <p className="text-3xl font-bold">12</p>
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
          <div className="space-y-4">
            {[
              { action: "Nueva reserva", time: "Hace 10 min", client: "María González" },
              { action: "Reserva confirmada", time: "Hace 1 hora", client: "Carlos Rodríguez" },
              { action: "Nueva reseña (5★)", time: "Hace 2 horas", client: "Ana Martínez" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.client}</p>
                </div>
                <span className="text-sm text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
