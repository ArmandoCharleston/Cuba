import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const [provincias, setProvincias] = useState<any[]>([]);
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    provincia: "",
    municipio: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: user.telefono || "",
        provincia: "",
        municipio: "",
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

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
      }
    };
    fetchMunicipios();
  }, [formData.provincia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let avatarBase64 = null;
      if (avatarFile) {
        const reader = new FileReader();
        avatarBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
      }
      
      // Construir texto de ciudad desde provincia y municipio
      const provinciaSeleccionada = provincias.find(p => p.id === parseInt(formData.provincia));
      const municipioSeleccionado = municipios.find(m => m.id === parseInt(formData.municipio));
      const ciudadTexto = municipioSeleccionado?.nombre && provinciaSeleccionada?.nombre 
        ? `${municipioSeleccionado.nombre}, ${provinciaSeleccionada.nombre}`
        : "";
      
      await updateUser({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        ciudad: ciudadTexto,
        avatar: avatarBase64 || avatarPreview || undefined,
      });
      toast.success("Perfil actualizado exitosamente");
      setAvatarFile(null);
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("La imagen no puede ser mayor a 2MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Administra tu información personal</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="relative mx-auto mb-4 h-24 w-24">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <h3 className="mb-1 text-xl font-semibold">
              {formData.nombre} {formData.apellido}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{formData.email}</p>
            <label htmlFor="avatar-upload">
              <Button variant="outline" className="w-full" asChild>
                <span>Cambiar Foto</span>
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <select
                    id="provincia"
                    name="provincia"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.provincia}
                    onChange={handleChange}
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
                  <Label htmlFor="municipio">Municipio</Label>
                  {!formData.provincia ? (
                    <select
                      id="municipio"
                      name="municipio"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm opacity-50"
                      disabled
                    >
                      <option value="">Selecciona primero una provincia</option>
                    </select>
                  ) : municipios.length === 0 ? (
                    <select
                      id="municipio"
                      name="municipio"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm opacity-50"
                      disabled
                    >
                      <option value="">Cargando municipios...</option>
                    </select>
                  ) : (
                    <select
                      id="municipio"
                      name="municipio"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.municipio}
                      onChange={handleChange}
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

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input id="currentPassword" type="password" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Actualizar Contraseña</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
