import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Building2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

const RegistroEmpresa = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombreNegocio: "",
    nombreContacto: "",
    apellidoContacto: "",
    email: "",
    telefono: "",
    ciudad: "",
    categoria: "",
    direccion: "",
    password: "",
    confirmPassword: "",
  });

  const [ciudades, setCiudades] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ciudadesRes, categoriasRes] = await Promise.all([
          api.ciudades.getAll(),
          api.categorias.getAll(),
        ]);
        setCiudades(ciudadesRes.data || []);
        setCategorias(categoriasRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Error al cargar datos");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    try {
      setLoading(true);
      await register({
        nombre: formData.nombreContacto,
        apellido: formData.apellidoContacto,
        email: formData.email,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        password: formData.password,
        rol: "empresa",
      });
      toast.success("Cuenta de empresa creada exitosamente!");
      // Nota: La creación detallada del negocio (nombreNegocio, categoría, etc.)
      // se puede manejar en el panel de empresa con formularios adicionales.
    } catch (error: any) {
      toast.error(error.message || "Error al registrar la empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-3xl">
        <Link to="/auth/registro" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>

        <Card className="shadow-medium">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Registro de Empresa</CardTitle>
            <CardDescription>Registra tu negocio en Reservate Cuba</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Información del Negocio</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreNegocio">Nombre del Negocio *</Label>
                    <Input
                      id="nombreNegocio"
                      name="nombreNegocio"
                      placeholder="Salón Bella Cuba"
                      value={formData.nombreNegocio}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría *</Label>
                      <select
                        id="categoria"
                        name="categoria"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                        disabled={loadingData}
                      >
                        <option value="">{loadingData ? "Cargando..." : "Selecciona"}</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <select
                        id="ciudad"
                        name="ciudad"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                        disabled={loadingData}
                      >
                        <option value="">{loadingData ? "Cargando..." : "Selecciona"}</option>
                        {ciudades.map((ciudad) => (
                          <option key={ciudad.id} value={ciudad.nombre}>
                            {ciudad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      placeholder="Calle 23 #456, Vedado"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo del Negocio</Label>
                    <div className="flex items-center space-x-2">
                      <Input id="logo" type="file" accept="image/*" />
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Formato: JPG, PNG. Máx: 2MB</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">Datos de Contacto</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombreContacto">Nombre *</Label>
                      <Input
                        id="nombreContacto"
                        name="nombreContacto"
                        placeholder="Ana"
                        value={formData.nombreContacto}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apellidoContacto">Apellido *</Label>
                      <Input
                        id="apellidoContacto"
                        name="apellidoContacto"
                        placeholder="Martínez"
                        value={formData.apellidoContacto}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contacto@negocio.cu"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        placeholder="+53 7 832 1234"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                      />
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
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input type="checkbox" id="terms" className="mt-1 rounded" required />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  Acepto los términos y condiciones y la política de privacidad
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg">
                {loading ? "Registrando..." : "Registrar Negocio"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/auth/login/empresa" className="font-medium text-primary hover:underline">
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

export default RegistroEmpresa;
