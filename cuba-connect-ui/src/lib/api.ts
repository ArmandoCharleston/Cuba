const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
};

export const api = {
  // Auth
  auth: {
    register: async (data: {
      nombre: string;
      apellido: string;
      email: string;
      password: string;
      telefono?: string;
      ciudad?: string;
      rol?: 'cliente' | 'empresa' | 'admin';
    }) => {
      return request<{ success: boolean; data: { user: any; token: string } }>(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
    },

    login: async (data: { email: string; password: string }) => {
      return request<{ success: boolean; data: { user: any; token: string } }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
    },

    getMe: async () => {
      return request<{ success: boolean; data: any }>('/auth/me');
    },
  },

  // Usuarios
  usuarios: {
    getProfile: async () => {
      return request<{ success: boolean; data: any }>('/usuarios/profile');
    },

    updateProfile: async (data: {
      nombre?: string;
      apellido?: string;
      telefono?: string;
      ciudad?: string;
      avatar?: string;
    }) => {
      return request<{ success: boolean; data: any }>('/usuarios/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  // Negocios
  negocios: {
    getAll: async (params?: {
      categoriaId?: string;
      ciudadId?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.categoriaId) queryParams.append('categoriaId', params.categoriaId);
      if (params?.ciudadId) queryParams.append('ciudadId', params.ciudadId);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      return request<{ success: boolean; data: any[]; pagination: any }>(
        `/negocios${query ? `?${query}` : ''}`
      );
    },

    getById: async (id: string) => {
      return request<{ success: boolean; data: any }>(`/negocios/${id}`);
    },

    create: async (data: {
      nombre: string;
      direccion: string;
      telefono: string;
      email: string;
      descripcion?: string;
      categoriaId: number;
      ciudadId: number;
      foto?: string;
      horarios?: any;
      precioPromedio?: number;
    }) => {
      return request<{ success: boolean; data: any }>('/negocios', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: any) => {
      return request<{ success: boolean; data: any }>(`/negocios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/negocios/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Categorias
  categorias: {
    getAll: async () => {
      return request<{ success: boolean; data: any[] }>('/categorias');
    },

    getById: async (id: string) => {
      return request<{ success: boolean; data: any }>(`/categorias/${id}`);
    },
  },

  // Ciudades
  ciudades: {
    getAll: async () => {
      return request<{ success: boolean; data: any[] }>('/ciudades');
    },
  },

  // Provincias
  provincias: {
    getAll: async () => {
      return request<{ success: boolean; data: any[] }>('/provincias');
    },

    getById: async (id: string) => {
      return request<{ success: boolean; data: any }>(`/provincias/${id}`);
    },
  },

  // Municipios
  municipios: {
    getAll: async (provinciaId?: string) => {
      const query = provinciaId ? `?provinciaId=${provinciaId}` : '';
      return request<{ success: boolean; data: any[] }>(`/municipios${query}`);
    },

    getById: async (id: string) => {
      return request<{ success: boolean; data: any }>(`/municipios/${id}`);
    },
  },

  // Servicios
  servicios: {
    getByNegocio: async (negocioId: string) => {
      return request<{ success: boolean; data: any[] }>(
        `/servicios/negocio/${negocioId}`
      );
    },

    create: async (negocioId: string, data: {
      nombre: string;
      descripcion?: string;
      precio: number;
      duracion: number;
      categoria?: string;
    }) => {
      return request<{ success: boolean; data: any }>(
        `/servicios/negocio/${negocioId}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
    },

    update: async (id: string, data: any) => {
      return request<{ success: boolean; data: any }>(`/servicios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return request<{ success: boolean; message: string }>(`/servicios/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Reservas
  reservas: {
    getAll: async (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      return request<{ success: boolean; data: any[]; pagination: any }>(
        `/reservas${query ? `?${query}` : ''}`
      );
    },

    getById: async (id: string) => {
      return request<{ success: boolean; data: any }>(`/reservas/${id}`);
    },

    create: async (data: {
      negocioId: string;
      servicioId: string;
      fecha: string;
      hora: string;
      notas?: string;
      precioTotal?: number;
    }) => {
      return request<{ success: boolean; data: any }>('/reservas', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    updateEstado: async (id: string, estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada') => {
      return request<{ success: boolean; data: any }>(`/reservas/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
    },
  },

  // Chats
  chats: {
    getAll: async () => {
      return request<{ success: boolean; data: any[] }>('/chats');
    },

    getById: async (id: string) => {
      return request<{ success: boolean; data: any }>(`/chats/${id}`);
    },

    create: async (data: {
      empresaId: string;
      negocioId: string;
    }) => {
      return request<{ success: boolean; data: any }>('/chats', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    sendMessage: async (chatId: string, texto: string) => {
      return request<{ success: boolean; data: any }>(`/chats/${chatId}/mensajes`, {
        method: 'POST',
        body: JSON.stringify({ texto }),
      });
    },
  },

  // Resenas
  resenas: {
    getByNegocio: async (negocioId: string, params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      return request<{ success: boolean; data: any[]; pagination: any }>(
        `/resenas/negocio/${negocioId}${query ? `?${query}` : ''}`
      );
    },

    create: async (data: {
      negocioId: string;
      reservaId?: string;
      calificacion: number;
      comentario?: string;
    }) => {
      return request<{ success: boolean; data: any }>('/resenas', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // Favoritos
  favoritos: {
    getAll: async () => {
      return request<{ success: boolean; data: any[] }>('/favoritos');
    },

    toggle: async (negocioId: string) => {
      return request<{ success: boolean; data: any; message: string }>('/favoritos/toggle', {
        method: 'POST',
        body: JSON.stringify({ negocioId }),
      });
    },
  },

  // Admin
  admin: {
    getDashboard: async () => {
      return request<{ success: boolean; data: any }>('/admin/dashboard');
    },

    getUsuarios: async (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      return request<{ success: boolean; data: any[]; pagination: any }>(
        `/admin/usuarios${query ? `?${query}` : ''}`
      );
    },

    getEmpresas: async (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const query = queryParams.toString();
      return request<{ success: boolean; data: any[]; pagination: any }>(
        `/admin/empresas${query ? `?${query}` : ''}`
      );
    },

    updateUserRole: async (userId: string, rol: 'cliente' | 'empresa' | 'admin') => {
      return request<{ success: boolean; data: any }>(`/admin/usuarios/${userId}/rol`, {
        method: 'PATCH',
        body: JSON.stringify({ rol }),
      });
    },
  },
};


