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

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:31',message:'API error response',data:{status:response.status,statusText:response.statusText,endpoint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      let errorMessage = 'Ocurrió un error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        // Map common HTTP status codes to user-friendly messages
        if (!errorData.message && !errorData.error) {
          switch (response.status) {
            case 400:
              errorMessage = 'Solicitud inválida. Por favor verifica los datos ingresados.';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tienes permisos para realizar esta acción.';
              break;
            case 404:
              errorMessage = 'El recurso solicitado no fue encontrado.';
              break;
            case 409:
              errorMessage = 'Ya existe un recurso con estos datos.';
              break;
            case 422:
              errorMessage = 'Los datos proporcionados no son válidos.';
              break;
            case 500:
              errorMessage = 'Error del servidor. Por favor intenta más tarde.';
              break;
            case 502:
              errorMessage = 'Error de conexión con el servidor. Por favor intenta más tarde.';
              break;
            case 503:
              errorMessage = 'El servicio no está disponible temporalmente.';
              break;
            default:
              errorMessage = `Error ${response.status}: ${errorMessage}`;
          }
        }
      } catch {
        // If we can't parse the error response, use status-based messages
        switch (response.status) {
          case 400:
            errorMessage = 'Solicitud inválida. Por favor verifica los datos ingresados.';
            break;
          case 401:
            errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
            break;
          case 403:
            errorMessage = 'No tienes permisos para realizar esta acción.';
            break;
          case 404:
            errorMessage = 'El recurso solicitado no fue encontrado.';
            break;
          case 500:
            errorMessage = 'Error del servidor. Por favor intenta más tarde.';
            break;
          case 502:
            errorMessage = 'Error de conexión con el servidor. Por favor intenta más tarde.';
            break;
          case 503:
            errorMessage = 'El servicio no está disponible temporalmente.';
            break;
          default:
            errorMessage = `Error ${response.status}: Ocurrió un error inesperado.`;
        }
      }
      throw new Error(errorMessage);
    }

    // Try to parse JSON, but handle cases where response might be empty
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:105',message:'API success response',data:{hasData:!!data,dataKeys:data?Object.keys(data):[],endpoint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return data;
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/83673a87-98f7-4596-9f03-dcd88d1d4c01',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.ts:110',message:'Non-JSON response',data:{contentType,endpoint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      // If not JSON, return empty object or handle accordingly
      return {} as T;
    }
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
    }
    throw error;
  }
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
      provinciaId?: string;
      municipioId?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.categoriaId) queryParams.append('categoriaId', params.categoriaId);
      if (params?.provinciaId) queryParams.append('provinciaId', params.provinciaId);
      if (params?.municipioId) queryParams.append('municipioId', params.municipioId);
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
      categoriaId?: number;
      provinciaId: number;
      municipioId: number;
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

    create: async (data: { nombre: string; icono: string; descripcion?: string }) => {
      return request<{ success: boolean; data: any }>('/categorias', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  // Ciudades (mantener para compatibilidad)
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
      empresaId?: string;
      negocioId?: string;
      adminId?: string;
      tipo?: 'cliente-empresa' | 'empresa-admin' | 'cliente-admin';
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

    updateNegocioEstado: async (negocioId: string, estado: 'pendiente' | 'aprobada' | 'rechazada') => {
      return request<{ success: boolean; data: any; message: string }>(`/admin/negocios/${negocioId}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
    },

    removeDuplicateAdmins: async () => {
      return request<{ success: boolean; data: any; message: string }>('/admin/remove-duplicate-admins', {
        method: 'POST',
      });
    },

    deleteUsuario: async (userId: string) => {
      return request<{ success: boolean; message: string }>(`/admin/usuarios/${userId}`, {
        method: 'DELETE',
      });
    },

    deleteEmpresa: async (empresaId: string) => {
      return request<{ success: boolean; message: string }>(`/admin/empresas/${empresaId}`, {
        method: 'DELETE',
      });
    },
  },
};


