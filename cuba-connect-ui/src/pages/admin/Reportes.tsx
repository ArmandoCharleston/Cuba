import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Building2, Calendar, DollarSign, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const Reportes = () => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalNegocios: 0,
    totalReservas: 0,
    totalResenas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getDashboard();
      setStats({
        totalUsuarios: response.data.totalUsuarios || 0,
        totalNegocios: response.data.totalNegocios || 0,
        totalReservas: response.data.totalReservas || 0,
        totalResenas: response.data.totalResenas || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  const statsCards = [
    {
      title: "Total Usuarios",
      value: loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalUsuarios.toLocaleString(),
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Empresas Activas",
      value: loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalNegocios.toLocaleString(),
      icon: Building2,
      color: "text-secondary",
    },
    {
      title: "Reservas Totales",
      value: loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalReservas.toLocaleString(),
      icon: Calendar,
      color: "text-accent",
    },
    {
      title: "Reseñas Totales",
      value: loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalResenas.toLocaleString(),
      icon: DollarSign,
      color: "text-chart-2",
    },
  ];

  // Datos vacíos para gráficos (se pueden implementar después con endpoints específicos)
  const reservasData: any[] = [];
  const ingresosData: any[] = [];
  const categoriasData: any[] = [];
  const ciudadesData: any[] = [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground">Análisis completo del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="reservas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="ciudades">Ciudades</TabsTrigger>
        </TabsList>

        <TabsContent value="reservas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reservas Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              {reservasData.length === 0 ? (
                <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                  No hay datos de reservas disponibles
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={reservasData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="reservas" fill="hsl(var(--primary))" name="Reservas" />
                    <Bar dataKey="canceladas" fill="hsl(var(--destructive))" name="Canceladas" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingresos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              {ingresosData.length === 0 ? (
                <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                  No hay datos de ingresos disponibles
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={ingresosData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ingresos" stroke="hsl(var(--primary))" strokeWidth={2} name="Ingresos ($)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {categoriasData.length === 0 ? (
                <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                  No hay datos de categorías disponibles
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoriasData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nombre, valor }) => `${nombre}: ${valor}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {categoriasData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ciudades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios y Empresas por Provincia</CardTitle>
            </CardHeader>
            <CardContent>
              {ciudadesData.length === 0 ? (
                <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                  No hay datos de provincias disponibles
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={ciudadesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usuarios" fill="hsl(var(--primary))" name="Usuarios" />
                    <Bar dataKey="empresas" fill="hsl(var(--secondary))" name="Empresas" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reportes;
