import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, Briefcase, Images, Settings, LogOut, BarChart3, MessageSquare, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const EmpresaLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: "/empresa", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/empresa/reservas", icon: Calendar, label: "Reservas" },
    { path: "/empresa/chat", icon: MessageSquare, label: "Mensajes" },
    { path: "/empresa/chat-admin", icon: Shield, label: "Soporte" },
    { path: "/empresa/servicios", icon: Briefcase, label: "Servicios" },
    { path: "/empresa/fotos", icon: Images, label: "Fotos" },
    { path: "/empresa/estadisticas", icon: BarChart3, label: "Estadísticas" },
    { path: "/empresa/configuracion", icon: Settings, label: "Configuración" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-background">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Reservate Cuba" className="h-8 w-8" />
            <span className="text-lg font-bold">Reservate Cuba</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Panel Empresa</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
