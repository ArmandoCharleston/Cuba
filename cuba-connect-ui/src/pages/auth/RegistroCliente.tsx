import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

const RegistroCliente = () => {
  const { register } = useAuth();
  const [provincias, setProvincias] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    provincia: "",
    municipio: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await api.provincias.getAll();
        setProvincias(response.data || []);
      } catch (error) {
        console.error('Error fetching provincias:', error);
      }
    };

    fetchProvincias();
  }, []);

  useEffect(() => {
    const fetchMunicipios = async () => {
      if (formData.provincia) {
        try {
          const municipiosRes = await api.municipios.getAll(formData.provincia);
          if (municipiosRes && municipiosRes.data && Array.isArray(municipiosRes.data)) {
            setMunicipios(municipiosRes.data);
          } else {
            setMunicipios([]);
          }
        } catch (error: any) {
          console.error('Error fetching municipios:', error);
          setMunicipios([]);
        }
      } else {
        setMunicipios([]);
        setFormData({ ...formData, municipio: "" });
      }
    };
    fetchMunicipios();
  }, [formData.provincia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (!formData.provincia || !formData.municipio) {
      toast.error("Por favor selecciona provincia y municipio");
      return;
    }
    try {
      setLoading(true);
      // Obtener nombres de provincia y municipio para guardar en ciudad
      const provinciaSeleccionada = provincias.find(p => p.id === parseInt(formData.provincia));
      const municipioSeleccionado = municipios.find(m => m.id === parseInt(formData.municipio));
      const ciudadTexto = municipioSeleccionado?.nombre && provinciaSeleccionada?.nombre 
        ? `${municipioSeleccionado.nombre}, ${provinciaSeleccionada.nombre}`
        : formData.municipio;
      
      await register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        ciudad: ciudadTexto,
        password: formData.password,
        rol: "cliente",
      });
      toast.success("Cuenta creada exitosamente!");
    } catch (error: any) {
      toast.error(error.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'provincia') {
      setFormData({ ...formData, [name]: value, municipio: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-2xl">
        <Link to="/auth/registro" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>

        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Registro de Cliente</CardTitle>
            <CardDescription>Crea tu cuenta y empieza a reservar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    placeholder="Pérez"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    placeholder="+53 5 234 5678"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia *</Label>
                  <select
                    id="provincia"
                    name="provincia"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.provincia}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona provincia</option>
                    {provincias.map((provincia) => (
                      <option key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="municipio">Municipio *</Label>
                  {!formData.provincia ? (
                    <select
                      id="municipio"
                      name="municipio"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background opacity-50"
                      disabled
                    >
                      <option value="">Selecciona primero una provincia</option>
                    </select>
                  ) : municipios.length === 0 ? (
                    <select
                      id="municipio"
                      name="municipio"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background opacity-50"
                      disabled
                    >
                      <option value="">Cargando municipios...</option>
                    </select>
                  ) : (
                    <select
                      id="municipio"
                      name="municipio"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.municipio}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona municipio</option>
                      {municipios.map((municipio) => (
                        <option key={municipio.id} value={municipio.id}>
                          {municipio.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Repetir Contraseña *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input type="checkbox" id="terms" className="mt-1 rounded" required />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  Acepto los términos y condiciones y la política de privacidad
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                {loading ? "Creando..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/auth/login/cliente" className="font-medium text-primary hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistroCliente;
