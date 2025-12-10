import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";
import { negociosMock } from "@/data/negociosMock";
import { ciudadesMock } from "@/data/ciudadesMock";
import { categoriasMock } from "@/data/categoriasMock";

const Negocios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredNegocios = negociosMock.filter((negocio) => {
    const matchesSearch =
      negocio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      negocio.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || negocio.ciudadId === selectedCity;
    const matchesCategory = !selectedCategory || negocio.categoriaId === selectedCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Explorar Negocios</h1>
          <p className="text-lg text-muted-foreground">
            Encuentra y reserva en los mejores establecimientos de Cuba
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-medium">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 rounded-md border border-input bg-background px-3">
                  <Search size={20} className="text-muted-foreground" />
                  <Input
                    placeholder="Buscar negocios..."
                    className="border-0 focus-visible:ring-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Todas las ciudades</option>
                  {ciudadesMock.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categoriasMock.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredNegocios.length} negocio{filteredNegocios.length !== 1 ? "s" : ""} encontrado
            {filteredNegocios.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNegocios.map((negocio) => {
            const ciudad = ciudadesMock.find((c) => c.id === negocio.ciudadId);
            const categoria = categoriasMock.find((c) => c.id === negocio.categoriaId);

            return (
              <Link key={negocio.id} to={`/negocios/${negocio.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-medium hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={negocio.foto}
                      alt={negocio.nombre}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-xl font-semibold">{negocio.nombre}</h3>
                    </div>

                    <div className="mb-2 flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      <span>{ciudad?.nombre}</span>
                      <span>•</span>
                      <span>{categoria?.nombre}</span>
                    </div>

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
                      <span className="text-sm font-medium">
                        Desde ${negocio.precioPromedio}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredNegocios.length === 0 && (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-lg text-muted-foreground">
                No se encontraron negocios con los filtros seleccionados
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Negocios;
