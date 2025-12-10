import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Star } from "lucide-react";
import { negociosMock } from "@/data/negociosMock";
import { ciudadesMock } from "@/data/ciudadesMock";
import { categoriasMock } from "@/data/categoriasMock";

const Favoritos = () => {
  // Mock: primeros 3 negocios como favoritos
  const favoritos = negociosMock.slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Mis Favoritos</h1>
        <p className="text-muted-foreground">Negocios que te gustan</p>
      </div>

      {favoritos.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No tienes favoritos aún</h3>
            <p className="mb-6 text-muted-foreground">
              Explora negocios y guarda tus favoritos
            </p>
            <Link to="/negocios">
              <Button>Explorar Negocios</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favoritos.map((negocio) => {
            const ciudad = ciudadesMock.find((c) => c.id === negocio.ciudadId);
            const categoria = categoriasMock.find((c) => c.id === negocio.categoriaId);

            return (
              <Card key={negocio.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={negocio.foto}
                    alt={negocio.nombre}
                    className="aspect-video w-full object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-3"
                  >
                    <Heart className="h-5 w-5 fill-current text-destructive" />
                  </Button>
                </div>
                <CardContent className="p-5">
                  <h3 className="mb-2 text-xl font-semibold">{negocio.nombre}</h3>

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
                    <Link to={`/negocios/${negocio.id}`}>
                      <Button size="sm">Ver Detalles</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favoritos;
