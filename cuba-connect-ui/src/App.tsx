import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClienteLayout } from "@/components/ClienteLayout";
import { EmpresaLayout } from "@/components/EmpresaLayout";
import { AdminLayout } from "@/components/AdminLayout";

// Public pages
import Index from "./pages/Index";
import Negocios from "./pages/Negocios";
import NegocioDetalle from "./pages/NegocioDetalle";
import Categorias from "./pages/Categorias";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/auth/Login";
import LoginCliente from "./pages/auth/LoginCliente";
import LoginEmpresa from "./pages/auth/LoginEmpresa";
import LoginAdmin from "./pages/auth/LoginAdmin";
import Registro from "./pages/auth/Registro";
import RegistroCliente from "./pages/auth/RegistroCliente";
import RegistroEmpresa from "./pages/auth/RegistroEmpresa";

// Cliente pages
import ClienteDashboard from "./pages/cliente/Dashboard";
import ClienteReservas from "./pages/cliente/Reservas";
import ClientePerfil from "./pages/cliente/Perfil";
import ClienteFavoritos from "./pages/cliente/Favoritos";
import ClienteConfiguracion from "./pages/cliente/Configuracion";
import ClienteChat from "./pages/cliente/Chat";
import ClienteChatConversacion from "./pages/cliente/ChatConversacion";
import ClienteChatAdmin from "./pages/cliente/ChatAdmin";
import ClienteChatAdminConversacion from "./pages/cliente/ChatAdminConversacion";

// Empresa pages
import EmpresaDashboard from "./pages/empresa/Dashboard";
import EmpresaServicios from "./pages/empresa/Servicios";
import EmpresaChat from "./pages/empresa/Chat";
import EmpresaChatConversacion from "./pages/empresa/ChatConversacion";
import EmpresaChatAdmin from "./pages/empresa/ChatAdmin";
import EmpresaChatAdminConversacion from "./pages/empresa/ChatAdminConversacion";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsuarios from "./pages/admin/Usuarios";
import AdminEmpresas from "./pages/admin/Empresas";
import AdminCategorias from "./pages/admin/Categorias";
import AdminReportes from "./pages/admin/Reportes";
import AdminChatEmpresas from "./pages/admin/ChatEmpresas";
import AdminChatEmpresasConversacion from "./pages/admin/ChatEmpresasConversacion";
import AdminChatClientes from "./pages/admin/ChatClientes";
import AdminChatClientesConversacion from "./pages/admin/ChatClientesConversacion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/negocios" element={<Negocios />} />
          <Route path="/negocios/:id" element={<NegocioDetalle />} />
          <Route path="/categorias" element={<Categorias />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/login/cliente" element={<LoginCliente />} />
          <Route path="/auth/login/empresa" element={<LoginEmpresa />} />
          <Route path="/auth/login/admin" element={<LoginAdmin />} />
          <Route path="/auth/registro" element={<Registro />} />
          <Route path="/auth/registro/cliente" element={<RegistroCliente />} />
          <Route path="/auth/registro/empresa" element={<RegistroEmpresa />} />

          {/* Cliente Routes */}
          <Route path="/cliente" element={<ClienteLayout />}>
            <Route index element={<ClienteDashboard />} />
            <Route path="reservas" element={<ClienteReservas />} />
            <Route path="chat" element={<ClienteChat />} />
            <Route path="chat/:id" element={<ClienteChatConversacion />} />
            <Route path="chat-admin" element={<ClienteChatAdmin />} />
            <Route path="chat-admin/:id" element={<ClienteChatAdminConversacion />} />
            <Route path="perfil" element={<ClientePerfil />} />
            <Route path="favoritos" element={<ClienteFavoritos />} />
            <Route path="configuracion" element={<ClienteConfiguracion />} />
          </Route>

          {/* Empresa Routes */}
          <Route path="/empresa" element={<EmpresaLayout />}>
            <Route index element={<EmpresaDashboard />} />
            <Route path="servicios" element={<EmpresaServicios />} />
            <Route path="chat" element={<EmpresaChat />} />
            <Route path="chat/:id" element={<EmpresaChatConversacion />} />
            <Route path="chat-admin" element={<EmpresaChatAdmin />} />
            <Route path="chat-admin/:id" element={<EmpresaChatAdminConversacion />} />
            <Route path="reservas" element={<ClienteDashboard />} />
            <Route path="fotos" element={<ClienteDashboard />} />
            <Route path="estadisticas" element={<ClienteDashboard />} />
            <Route path="configuracion" element={<ClienteConfiguracion />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="empresas" element={<AdminEmpresas />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="reportes" element={<AdminReportes />} />
            <Route path="chat-empresas" element={<AdminChatEmpresas />} />
            <Route path="chat-empresas/:id" element={<AdminChatEmpresasConversacion />} />
            <Route path="chat-clientes" element={<AdminChatClientes />} />
            <Route path="chat-clientes/:id" element={<AdminChatClientesConversacion />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
