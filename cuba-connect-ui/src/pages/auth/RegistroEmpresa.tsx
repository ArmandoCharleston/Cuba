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
    provincia: "",
    municipio: "",
    categoria: "",
    direccion: "",
    password: "",
    confirmPassword: "",
  });

  const [provincias, setProvincias] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [provinciasRes, categoriasRes] = await Promise.all([
          api.provincias.getAll(),
          api.categorias.getAll(),
        ]);
        if (provinciasRes && provinciasRes.data && Array.isArray(provinciasRes.data)) {
          setProvincias(provinciasRes.data);
        } else {
          setProvincias([]);
        }
        if (categoriasRes && categoriasRes.data && Array.isArray(categoriasRes.data)) {
          setCategorias(categoriasRes.data);
        } else {
          setCategorias([]);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(error.message || "Error al cargar datos. Puedes continuar sin seleccionar.");
        setProvincias([]);
        setCategorias([]);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
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
    try {
      setLoading(true);
      await register({
        nombre: formData.nombreContacto,
        apellido: formData.apellidoContacto,
        email: formData.email,
        telefono: formData.telefono || undefined,
        ciudad: formData.ciudad || undefined,
        password: formData.password,
        rol: "empresa",
      });
      toast.success("Cuenta de empresa creada exitosamente! Puedes agregar los detalles del negocio en tu panel.");
      // Nota: La creación detallada del negocio (nombreNegocio, categoría, etc.)
      // se puede manejar en el panel de empresa con formularios adicionales.
    } catch (error: any) {
      toast.error(error.message || "Error al registrar la empresa");
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

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("La imagen no puede ser mayor a 2MB");
        return;
      }
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
                      <Label htmlFor="categoria">Categoría</Label>
                      {loadingData ? (
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                          Cargando categorías...
                        </div>
                      ) : categorias.length === 0 ? (
                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                          No hay categorías disponibles (opcional)
                        </div>
                      ) : (
                        <select
                          id="categoria"
                          name="categoria"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.categoria}
                          onChange={handleChange}
                        >
                          <option value="">Selecciona (opcional)</option>
                          {categorias.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.nombre}
                            </option>
                          ))}
                        </select>
                      )}
                      <p className="text-xs text-muted-foreground">Puedes agregar la categoría después del registro</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="provincia">Provincia *</Label>
                        {loadingData ? (
                          <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                            Cargando provincias...
                          </div>
                        ) : provincias.length === 0 ? (
                          <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                            No hay provincias disponibles
                          </div>
                        ) : (
                          <select
                            id="provincia"
                            name="provincia"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="municipio">Municipio *</Label>
                        {!formData.provincia ? (
                          <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                            Selecciona primero una provincia
                          </div>
                        ) : municipios.length === 0 ? (
                          <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                            Cargando municipios...
                          </div>
                        ) : (
                          <select
                            id="municipio"
                            name="municipio"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    <Label htmlFor="logo">Foto del Negocio</Label>
                    <div className="space-y-2">
                      {fotoPreview && (
                        <div className="relative w-full max-w-xs">
                          <img
                            src={fotoPreview}
                            alt="Preview"
                            className="h-32 w-full rounded-md object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFotoPreview(null);
                              setFotoFile(null);
                            }}
                            className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleFotoChange}
                        />
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
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
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        placeholder="+53 7 832 1234 (opcional)"
                        value={formData.telefono}
                        onChange={handleChange}
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
