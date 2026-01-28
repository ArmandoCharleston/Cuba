import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import * as LucideIcons from "lucide-react";

const Categorias = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const res = await api.categorias.getAll();
        setCategorias(res.data || []);
      } catch (e: any) {
        setError(e.message || "Error al cargar categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Todas las Categorías</h1>
          <p className="text-lg text-muted-foreground">
            Explora servicios por categoría y encuentra lo que necesitas
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando categorías...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => {
              const IconComponent =
                LucideIcons[categoria.icono as keyof typeof LucideIcons] as React.ComponentType<{
                  className?: string;
                }>;

              const negociosCount = categoria._count?.negocios ?? 0;

              return (
                <Link key={categoria.id} to="/negocios">
                  <Card className="transition-all hover:shadow-medium hover:-translate-y-1">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        {IconComponent && (
                          <IconComponent className="h-10 w-10 text-primary" />
                        )}
                      </div>
                      <h3 className="mb-2 text-2xl font-semibold">{categoria.nombre}</h3>
                      <p className="mb-4 text-muted-foreground">{categoria.descripcion}</p>
                      <p className="text-sm font-medium text-primary">
                        {negociosCount} negocio{negociosCount !== 1 ? "s" : ""}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && !error && categorias.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay categorías disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categorias;
