import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, ShieldCheck } from "lucide-react";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Iniciar Sesión</h1>
          <p className="text-muted-foreground">Selecciona tu tipo de cuenta</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link to="/auth/login/cliente">
            <Card className="transition-all hover:shadow-medium hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Cliente</CardTitle>
                <CardDescription>Accede para hacer reservas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Entrar como Cliente</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/auth/login/empresa">
            <Card className="transition-all hover:shadow-medium hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Empresa</CardTitle>
                <CardDescription>Gestiona tu negocio</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Entrar como Empresa</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/auth/login/admin">
            <Card className="transition-all hover:shadow-medium hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Admin</CardTitle>
                <CardDescription>Panel administrativo</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Entrar como Admin</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/auth/registro" className="font-medium text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
