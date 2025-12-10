import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, Star, TrendingUp } from "lucide-react";
import { categoriasMock } from "@/data/categoriasMock";
import { negociosMock } from "@/data/negociosMock";
import { ciudadesMock } from "@/data/ciudadesMock";
import * as LucideIcons from "lucide-react";

const Index = () => {
  const featuredBusinesses = negociosMock.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 text-primary-foreground">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              Reserva los mejores servicios en Cuba
            </h1>
            <p className="mb-8 text-xl opacity-90">
              Peluquerías, spas, restaurantes y más. Todo en un solo lugar.
            </p>

            {/* Search Bar */}
            <div className="mx-auto max-w-2xl">
              <Card className="shadow-strong">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row">
                    <div className="flex flex-1 items-center space-x-2 rounded-md border border-input bg-background px-3">
                      <Search size={20} className="text-muted-foreground" />
                      <Input
                        placeholder="¿Qué servicio buscas?"
                        className="border-0 focus-visible:ring-0"
                      />
                    </div>
                    <div className="flex flex-1 items-center space-x-2 rounded-md border border-input bg-background px-3">
                      <MapPin size={20} className="text-muted-foreground" />
                      <select className="w-full border-0 bg-transparent py-2 text-sm focus:outline-none">
                        <option>Selecciona ciudad</option>
                        {ciudadesMock.map((ciudad) => (
                          <option key={ciudad.id} value={ciudad.id}>
                            {ciudad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Link to="/negocios">
                      <Button size="lg" className="w-full md:w-auto">
                        Buscar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Categorías Populares</h2>
            <p className="text-lg text-muted-foreground">
              Explora servicios por categoría
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoriasMock.map((categoria) => {
              const IconComponent =
                LucideIcons[categoria.icono as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
              return (
                <Link key={categoria.id} to="/negocios">
                  <Card className="transition-all hover:shadow-medium hover:-translate-y-1">
                    <CardContent className="flex items-center space-x-4 p-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        {IconComponent && (
                          <IconComponent className="h-7 w-7 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{categoria.nombre}</h3>
                        <p className="text-sm text-muted-foreground">
                          {categoria.descripcion}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-4xl font-bold">Negocios Destacados</h2>
              <p className="text-lg text-muted-foreground">
                Los mejor valorados de la semana
              </p>
            </div>
            <Link to="/negocios">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredBusinesses.map((negocio) => (
              <Link key={negocio.id} to={`/negocios/${negocio.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-medium">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={negocio.foto}
                      alt={negocio.nombre}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="mb-2 text-xl font-semibold">{negocio.nombre}</h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {negocio.descripcion}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{negocio.calificacion}</span>
                        <span className="text-sm text-muted-foreground">
                          ({negocio.totalResenas})
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Desde ${negocio.precioPromedio}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <Card className="overflow-hidden bg-gradient-hero text-primary-foreground shadow-strong">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">¿Tienes un negocio?</h2>
              <p className="mb-8 text-xl opacity-90">
                Únete a Reservate Cuba y llega a miles de clientes potenciales
              </p>
              <Link to="/auth/registro/empresa">
                <Button size="lg" variant="secondary" className="shadow-medium">
                  Registra tu Negocio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="mb-2 text-4xl font-bold text-primary">10,000+</div>
              <p className="text-muted-foreground">Reservas realizadas</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="mb-2 text-4xl font-bold text-primary">500+</div>
              <p className="text-muted-foreground">Negocios registrados</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="mb-2 text-4xl font-bold text-primary">4.8</div>
              <p className="text-muted-foreground">Calificación promedio</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
