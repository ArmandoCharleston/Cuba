import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Calendar,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const NegocioDetalle = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [negocio, setNegocio] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNegocio = async () => {
      try {
        setLoading(true);
        setError(null);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NegocioDetalle.tsx:32',message:'Fetching negocio',data:{negocioId:id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        const response = await api.negocios.getById(id);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NegocioDetalle.tsx:36',message:'API response received',data:{hasData:!!response.data,hasProvincia:!!response.data?.provincia,hasMunicipio:!!response.data?.municipio,provinciaNombre:response.data?.provincia?.nombre,municipioNombre:response.data?.municipio?.nombre},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
        // #endregion
        setNegocio(response.data);
      } catch (err: any) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NegocioDetalle.tsx:40',message:'Error fetching negocio',data:{error:err?.message,errorType:typeof err},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setError(err.message || "Error al cargar el negocio");
      } finally {
        setLoading(false);
      }
    };

    fetchNegocio();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando negocio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!negocio) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Negocio no encontrado</p>
      </div>
    );
  }

  const provincia = negocio.provincia;
  const municipio = negocio.municipio;
  const categoria = negocio.categoria;
  const servicios = negocio.servicios || [];
  const resenas = negocio.resenas || [];

  const handleReserva = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    try {
      await api.reservas.create({
        negocioId: negocio.id.toString(),
        servicioId: selectedService,
        fecha: selectedDate,
        hora: selectedTime,
      });
      toast.success("Reserva realizada exitosamente!");
      // Reset form
      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
    } catch (error: any) {
      toast.error(error.message || "Error al crear la reserva");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container">
        <Link
          to="/negocios"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a negocios
        </Link>

        {/* Hero Images */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {(() => {
            // Handle fotos - can be array of strings or array of objects with url property
            const fotos = negocio.fotos || [];
            const fotoUrls = fotos.map((foto: any) => 
              typeof foto === 'string' ? foto : foto.url
            );
            const mainFoto = negocio.foto || fotoUrls[0] || null;
            
            return (
              <>
                <div className="md:col-span-2">
                  {mainFoto ? (
                    <img
                      src={mainFoto}
                      alt={negocio.nombre || 'Negocio'}
                      className="h-[400px] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-muted">
                      <span className="text-muted-foreground">Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className="grid gap-4">
                  {fotoUrls.slice(1, 3).map((fotoUrl: string, idx: number) => (
                    <img
                      key={idx}
                      src={fotoUrl}
                      alt={`${negocio.nombre || 'Negocio'} ${idx + 2}`}
                      className="h-[192px] w-full rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              </>
            );
          })()}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="mb-2 text-4xl font-bold">{negocio.nombre || 'Negocio'}</h1>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span>{negocio.direccion}</span>
                  </div>
                </div>
                <Button variant="outline" size="icon">
                  <Heart size={20} />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="secondary">{categoria?.nombre}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold">{negocio.calificacion}</span>
                  <span className="text-sm text-muted-foreground">
                    ({negocio.totalResenas} reseñas)
                  </span>
                </div>
              </div>
            </div>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Acerca de</h2>
                <p className="text-muted-foreground">{negocio.descripcion}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">Servicios</h2>
                <div className="space-y-4">
                  {servicios.map((servicio) => (
                    <div
                      key={servicio.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{servicio.nombre}</h3>
                        <p className="text-sm text-muted-foreground">
                          {servicio.descripcion}
                        </p>
                        {servicio.duracion > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            <Clock className="mr-1 inline h-3 w-3" />
                            {servicio.duracion} min
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-lg font-semibold">${servicio.precio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">Contacto</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{negocio.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{negocio.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {/* #region agent log */}
                      {(()=>{fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NegocioDetalle.tsx:236',message:'Rendering location',data:{hasMunicipio:!!negocio?.municipio,hasProvincia:!!negocio?.provincia,municipioNombre:negocio?.municipio?.nombre,provinciaNombre:negocio?.provincia?.nombre},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});return null;})()}
                      {/* #endregion */}
                      {negocio.direccion}{negocio.municipio?.nombre ? `, ${negocio.municipio.nombre}` : ''}{negocio.provincia?.nombre ? `, ${negocio.provincia.nombre}` : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">Reseñas</h2>
                <div className="space-y-6">
                  {resenas.map((resena: any) => (
                    <div key={resena.id} className="border-b border-border pb-6 last:border-0">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {resena.cliente?.nombre} {resena.cliente?.apellido}
                          </p>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: resena.calificacion }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-accent text-accent"
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {resena.createdAt ? new Date(resena.createdAt).toLocaleDateString() : '--'}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{resena.comentario}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-medium">
              <CardContent className="p-6">
                <h3 className="mb-6 text-xl font-semibold">Hacer una Reserva</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Servicio</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                    >
                      <option value="">Selecciona un servicio</option>
                      {servicios.map((servicio) => (
                        <option key={servicio.id} value={servicio.id}>
                          {servicio.nombre} - ${servicio.precio}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fecha</label>
                    <input
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hora</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Selecciona hora</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleReserva}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Reservar Ahora
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Confirmación inmediata por email
                  </p>
                </div>

                {negocio.horarios && (
                  <div className="mt-6 space-y-2 border-t border-border pt-6">
                    <h4 className="font-semibold">Horario de Atención</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      {Object.entries(negocio.horarios as Record<string, any>).map(([dia, horario]) => (
                        <div key={dia} className="flex justify-between">
                          <span className="capitalize">{dia}</span>
                          <span>
                            {horario?.abierto
                              ? `${horario.inicio} - ${horario.fin}`
                              : "Cerrado"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegocioDetalle;
