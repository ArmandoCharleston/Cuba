import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Reservate Cuba" className="h-8 w-8" />
              <span className="text-lg font-bold">Reservate Cuba</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              La plataforma líder en reservas para servicios en Cuba.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Para Clientes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/negocios" className="hover:text-foreground">
                  Explorar Negocios
                </Link>
              </li>
              <li>
                <Link to="/categorias" className="hover:text-foreground">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/auth/registro/cliente" className="hover:text-foreground">
                  Crear Cuenta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Para Empresas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/auth/registro/empresa" className="hover:text-foreground">
                  Registra tu Negocio
                </Link>
              </li>
              <li>
                <Link to="/auth/login/empresa" className="hover:text-foreground">
                  Acceso Empresas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+53 7 000 0000</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@reservatecuba.com</span>
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Reservate Cuba. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
