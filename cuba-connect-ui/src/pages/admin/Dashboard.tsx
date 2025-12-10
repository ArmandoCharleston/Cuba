import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Calendar, DollarSign } from "lucide-react";
import { usuariosMock } from "@/data/usuariosMock";
import { negociosMock } from "@/data/negociosMock";
import { reservasMock } from "@/data/reservasMock";

const Dashboard = () => {
  const totalUsuarios = usuariosMock.length;
  const totalNegocios = negociosMock.length;
  const totalReservas = reservasMock.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Panel Administrativo</h1>
        <p className="text-muted-foreground">Vista general del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                <p className="text-3xl font-bold">{totalUsuarios}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Empresas</p>
                <p className="text-3xl font-bold">{totalNegocios}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reservas</p>
                <p className="text-3xl font-bold">{totalReservas}</p>
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
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-3xl font-bold">$8.5K</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { event: "Nuevo negocio registrado", time: "Hace 2 horas" },
                { event: "10 nuevas reservas", time: "Hace 4 horas" },
                { event: "5 nuevos usuarios", time: "Hace 1 día" },
                { event: "Reporte mensual generado", time: "Hace 2 días" },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between border-b border-border pb-4 last:border-0">
                  <p className="font-medium">{item.event}</p>
                  <span className="text-sm text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Revisar 3 negocios pendientes de aprobación", priority: "alta" },
                { task: "Responder 5 reportes de usuarios", priority: "media" },
                { task: "Actualizar categorías", priority: "baja" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
                  <p className="font-medium">{item.task}</p>
                  <span
                    className={`text-xs font-semibold ${
                      item.priority === "alta"
                        ? "text-destructive"
                        : item.priority === "media"
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
