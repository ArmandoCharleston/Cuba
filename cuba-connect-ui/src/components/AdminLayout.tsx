import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Building2, Tag, FileText, LogOut, ShieldCheck, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/usuarios", icon: Users, label: "Usuarios" },
    { path: "/admin/empresas", icon: Building2, label: "Empresas" },
    { path: "/admin/categorias", icon: Tag, label: "Categorías" },
    { path: "/admin/reportes", icon: FileText, label: "Reportes" },
    { path: "/admin/chat-empresas", icon: MessageSquare, label: "Chat Empresas" },
    { path: "/admin/chat-clientes", icon: MessageSquare, label: "Chat Clientes" },
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
          <div className="mt-2 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold text-primary">Panel Admin</p>
          </div>
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
