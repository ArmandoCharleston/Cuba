import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Building2, ShieldCheck, Calendar, Heart, MessageSquare, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthPage = location.pathname.includes("/auth");
  const isClientPanel = location.pathname.startsWith("/cliente");
  const isBusinessPanel = location.pathname.startsWith("/empresa");
  const isAdminPanel = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`.toUpperCase() || "U";
  };

  if (isClientPanel || isBusinessPanel || isAdminPanel) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Reservate Cuba" className="h-10 w-10" />
          <span className="text-xl font-bold text-foreground">Reservate Cuba</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          {!isAuthPage && (
            <>
              <Link
                to="/negocios"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Explorar Negocios
              </Link>
              <Link
                to="/categorias"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                Categorías
              </Link>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.nombre} {user.apellido}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.rol === 'cliente' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/cliente/perfil')}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Mi Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/cliente/reservas')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Mis Reservas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/cliente/favoritos')}>
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Favoritos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/cliente/chat')}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Mensajes</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {user.rol === 'empresa' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/empresa')}>
                          <Building2 className="mr-2 h-4 w-4" />
                          <span>Panel de Empresa</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {user.rol === 'admin' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          <span>Panel de Admin</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth/login">
                    <Button variant="ghost" size="sm">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/auth/registro">
                    <Button size="sm">Registrarse</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container space-y-4 py-4">
            {!isAuthPage && (
              <>
                <Link
                  to="/negocios"
                  className="block text-sm font-medium text-foreground/80"
                  onClick={() => setIsOpen(false)}
                >
                  Explorar Negocios
                </Link>
                <Link
                  to="/categorias"
                  className="block text-sm font-medium text-foreground/80"
                  onClick={() => setIsOpen(false)}
                >
                  Categorías
                </Link>
                {user ? (
                  <div className="space-y-2 border-t pt-4">
                    <p className="text-sm font-medium">
                      {user.nombre} {user.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.rol === 'cliente' && (
                      <>
                        <Link to="/cliente/perfil" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            Mi Perfil
                          </Button>
                        </Link>
                        <Link to="/cliente/reservas" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <Calendar className="mr-2 h-4 w-4" />
                            Mis Reservas
                          </Button>
                        </Link>
                        <Link to="/cliente/favoritos" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <Heart className="mr-2 h-4 w-4" />
                            Favoritos
                          </Button>
                        </Link>
                        <Link to="/cliente/chat" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Mensajes
                          </Button>
                        </Link>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link to="/auth/registro" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Registrarse</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
