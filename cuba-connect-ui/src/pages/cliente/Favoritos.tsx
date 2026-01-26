import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const response = await api.favoritos.getAll();
        setFavoritos(response.data || []);
      } catch (error) {
        console.error('Error fetching favoritos:', error);
        setFavoritos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, []);

  const handleToggleFavorito = async (negocioId: string) => {
    try {
      await api.favoritos.toggle(negocioId);
      // Refresh favoritos
      const response = await api.favoritos.getAll();
      setFavoritos(response.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar favoritos');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Mis Favoritos</h1>
        <p className="text-muted-foreground">Negocios que te gustan</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Cargando favoritos...</p>
          </CardContent>
        </Card>
      ) : favoritos.length === 0 ? (
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
          {favoritos.map((favorito) => {
            const negocio = favorito.negocio || favorito;
            return (
              <Card key={negocio.id} className="overflow-hidden">
                <div className="relative">
                  {negocio.foto && (
                    <img
                      src={negocio.foto}
                      alt={negocio.nombre}
                      className="aspect-video w-full object-cover"
                    />
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-3"
                    onClick={() => handleToggleFavorito(negocio.id.toString())}
                  >
                    <Heart className="h-5 w-5 fill-current text-destructive" />
                  </Button>
                </div>
                <CardContent className="p-5">
                  <h3 className="mb-2 text-xl font-semibold">{negocio.nombre}</h3>

                  <div className="mb-2 flex items-center space-x-2 text-sm text-muted-foreground">
                    {negocio.ciudad && (
                      <>
                        <MapPin size={14} />
                        <span>{negocio.ciudad}</span>
                      </>
                    )}
                    {negocio.categoria && (
                      <>
                        <span>•</span>
                        <span>{negocio.categoria.nombre || negocio.categoria}</span>
                      </>
                    )}
                  </div>

                  {negocio.descripcion && (
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                      {negocio.descripcion}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{negocio.calificacion || 0}</span>
                      {negocio.totalResenas !== undefined && (
                        <span className="text-sm text-muted-foreground">
                          ({negocio.totalResenas})
                        </span>
                      )}
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
