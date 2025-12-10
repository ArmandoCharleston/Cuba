import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Building2, Calendar, DollarSign } from "lucide-react";

const Reportes = () => {
  // Mock data para gráficos
  const reservasData = [
    { mes: "Ene", reservas: 45, canceladas: 8 },
    { mes: "Feb", reservas: 52, canceladas: 12 },
    { mes: "Mar", reservas: 68, canceladas: 10 },
    { mes: "Abr", reservas: 71, canceladas: 9 },
    { mes: "May", reservas: 85, canceladas: 15 },
    { mes: "Jun", reservas: 92, canceladas: 11 },
  ];

  const ingresosData = [
    { mes: "Ene", ingresos: 12500 },
    { mes: "Feb", ingresos: 15200 },
    { mes: "Mar", ingresos: 18900 },
    { mes: "Abr", ingresos: 21400 },
    { mes: "May", ingresos: 24800 },
    { mes: "Jun", ingresos: 28300 },
  ];

  const categoriasData = [
    { nombre: "Peluquería", valor: 35 },
    { nombre: "Spa", valor: 25 },
    { nombre: "Belleza", valor: 20 },
    { nombre: "Fitness", valor: 12 },
    { nombre: "Otros", valor: 8 },
  ];

  const ciudadesData = [
    { nombre: "La Habana", usuarios: 450, empresas: 85 },
    { nombre: "Varadero", usuarios: 320, empresas: 62 },
    { nombre: "Santiago", usuarios: 280, empresas: 48 },
    { nombre: "Holguín", usuarios: 195, empresas: 35 },
    { nombre: "Camagüey", usuarios: 160, empresas: 28 },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  const stats = [
    {
      title: "Total Usuarios",
      value: "1,405",
      icon: Users,
      trend: "+12.5%",
      color: "text-primary",
    },
    {
      title: "Empresas Activas",
      value: "258",
      icon: Building2,
      trend: "+8.2%",
      color: "text-secondary",
    },
    {
      title: "Reservas Totales",
      value: "413",
      icon: Calendar,
      trend: "+15.3%",
      color: "text-accent",
    },
    {
      title: "Ingresos Totales",
      value: "$121,200",
      icon: DollarSign,
      trend: "+22.1%",
      color: "text-chart-2",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground">Análisis completo del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="mt-1 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-primary" />
                  <span className="text-primary">{stat.trend}</span>
                  <span className="ml-1 text-muted-foreground">vs mes anterior</span>
                </div>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingresos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popularidad de Categorías</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoriasData.map((cat, index) => (
                    <div key={cat.nombre} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{cat.nombre}</span>
                        <span className="text-muted-foreground">{cat.valor}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${cat.valor}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ciudades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios y Empresas por Ciudad</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reportes;
