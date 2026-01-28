import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";
import { api } from "@/lib/api";

const Negocios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [negocios, setNegocios] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load provincias and categorias only once
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [provinciasRes, categoriasRes] = await Promise.all([
          api.provincias.getAll(),
          api.categorias.getAll(),
        ]);
        setProvincias(provinciasRes.data || []);
        setCategorias(categoriasRes.data || []);
      } catch (err: any) {
        console.error('Error fetching static data:', err);
      }
    };

    fetchStaticData();
  }, []);

  // Load municipios when provincia is selected
  useEffect(() => {
    const fetchMunicipios = async () => {
      if (selectedProvincia) {
        try {
          const municipiosRes = await api.municipios.getAll(selectedProvincia);
          setMunicipios(municipiosRes.data || []);
        } catch (err: any) {
          console.error('Error fetching municipios:', err);
          setMunicipios([]);
        }
      } else {
        setMunicipios([]);
        setSelectedMunicipio("");
      }
    };

    fetchMunicipios();
  }, [selectedProvincia]);

  // Fetch negocios with debounce for search
  useEffect(() => {
    const fetchNegocios = async () => {
      try {
        setLoading(true);
        setError(null);
        const negociosRes = await api.negocios.getAll({
          categoriaId: selectedCategory || undefined,
          provinciaId: selectedProvincia || undefined,
          municipioId: selectedMunicipio || undefined,
          search: searchTerm || undefined,
        });
        setNegocios(negociosRes.data || []);
      } catch (err: any) {
        setError(err.message || "Error al cargar negocios");
        console.error('Error fetching negocios:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search term
    const timeoutId = setTimeout(() => {
      fetchNegocios();
    }, searchTerm ? 500 : 0); // 500ms delay for search, immediate for filters

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, selectedProvincia, selectedMunicipio, searchTerm]);

  // Filtering is now done on the backend, but we can do client-side filtering for search
  const filteredNegocios = negocios.filter((negocio) => {
    if (searchTerm) {
      const matchesSearch =
        negocio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        negocio.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }
    return true;
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
            <div className="grid gap-4 md:grid-cols-5">
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
                  value={selectedProvincia}
                  onChange={(e) => {
                    setSelectedProvincia(e.target.value);
                    setSelectedMunicipio("");
                  }}
                >
                  <option value="">Todas las provincias</option>
                  {provincias.map((provincia) => (
                    <option key={provincia.id} value={provincia.id}>
                      {provincia.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={selectedMunicipio}
                  onChange={(e) => setSelectedMunicipio(e.target.value)}
                  disabled={!selectedProvincia}
                >
                  <option value="">Todos los municipios</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.id} value={municipio.id}>
                      {municipio.nombre}
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
                  {categorias.map((cat) => (
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
        {loading && (
          <div className="mb-4 text-muted-foreground">Cargando negocios...</div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-500">Error: {error}</div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredNegocios.length} negocio{filteredNegocios.length !== 1 ? "s" : ""} encontrado
            {filteredNegocios.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNegocios.map((negocio) => {
            const provincia = negocio.provincia;
            const municipio = negocio.municipio;
            const categoria = negocio.categoria || categorias.find((c) => c.id === negocio.categoriaId);
            const fotoUrl = negocio.foto || (negocio.fotos && negocio.fotos.length > 0 
              ? (typeof negocio.fotos[0] === 'string' ? negocio.fotos[0] : negocio.fotos[0].url)
              : null);

            return (
              <Link key={negocio.id} to={`/negocios/${negocio.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-medium hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden">
                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={negocio.nombre}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="text-xl font-semibold">{negocio.nombre}</h3>
                    </div>

                    <div className="mb-2 flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin size={14} />
                      <span>{municipio?.nombre || 'Municipio no especificado'}</span>
                      {provincia && <span>, {provincia.nombre}</span>}
                      <span>•</span>
                      <span>{categoria?.nombre || 'Sin categoría'}</span>
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
