import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Building2, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname.includes("/auth");
  const isClientPanel = location.pathname.startsWith("/cliente");
  const isBusinessPanel = location.pathname.startsWith("/empresa");
  const isAdminPanel = location.pathname.startsWith("/admin");

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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
