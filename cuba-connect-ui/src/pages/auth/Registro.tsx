import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2 } from "lucide-react";

const Registro = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Crear Cuenta</h1>
          <p className="text-muted-foreground">Selecciona el tipo de cuenta que deseas crear</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/auth/registro/cliente">
            <Card className="transition-all hover:shadow-medium hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Cliente</CardTitle>
                <CardDescription>Reserva servicios en tus negocios favoritos</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Registrarse como Cliente</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/auth/registro/empresa">
            <Card className="transition-all hover:shadow-medium hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Empresa</CardTitle>
                <CardDescription>Registra tu negocio y gestiona reservas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Registrar Negocio</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/auth/login" className="font-medium text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
