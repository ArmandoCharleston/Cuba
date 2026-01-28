/**
 * Utilidad para manejar y mostrar errores de manera profesional
 */

export interface ErrorDetails {
  message: string;
  code?: string;
  field?: string;
  suggestions?: string[];
}

/**
 * Extrae un mensaje de error amigable de una respuesta de error
 */
export const getErrorMessage = (error: any): string => {
  // Si es un string, devolverlo directamente
  if (typeof error === 'string') {
    return error;
  }

  // Si tiene un mensaje directo
  if (error?.message) {
    return error.message;
  }

  // Si es una respuesta de API con estructura estándar
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Mensaje directo
    if (data.message) {
      return data.message;
    }
    
    // Mensaje de error genérico
    if (data.error) {
      return data.error;
    }
    
    // Errores de validación (array de mensajes)
    if (Array.isArray(data.errors)) {
      return data.errors.join(', ');
    }
  }

  // Errores de red
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
    return 'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.';
  }

  // Error de timeout
  if (error?.code === 'TIMEOUT' || error?.message?.includes('timeout')) {
    return 'La solicitud tardó demasiado. Por favor, intenta nuevamente.';
  }

  // Error 401 - No autorizado
  if (error?.response?.status === 401) {
    return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
  }

  // Error 403 - Prohibido
  if (error?.response?.status === 403) {
    return 'No tienes permisos para realizar esta acción.';
  }

  // Error 404 - No encontrado
  if (error?.response?.status === 404) {
    return 'El recurso solicitado no fue encontrado.';
  }

  // Error 500 - Error del servidor
  if (error?.response?.status === 500) {
    return 'Ocurrió un error en el servidor. Por favor, intenta más tarde.';
  }

  // Error genérico
  return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
};

/**
 * Obtiene sugerencias basadas en el tipo de error
 */
export const getErrorSuggestions = (error: any): string[] => {
  const suggestions: string[] = [];

  // Error de validación
  if (error?.response?.status === 400) {
    suggestions.push('Verifica que todos los campos estén completos correctamente.');
    suggestions.push('Asegúrate de que los datos ingresados sean válidos.');
  }

  // Error de autenticación
  if (error?.response?.status === 401) {
    suggestions.push('Verifica que tu email y contraseña sean correctos.');
    suggestions.push('Si olvidaste tu contraseña, puedes recuperarla.');
  }

  // Error de red
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
    suggestions.push('Verifica tu conexión a internet.');
    suggestions.push('Intenta recargar la página.');
  }

  // Error del servidor
  if (error?.response?.status >= 500) {
    suggestions.push('El problema es temporal, intenta en unos momentos.');
    suggestions.push('Si el problema persiste, contacta al soporte.');
  }

  return suggestions;
};

/**
 * Formatea un error para mostrarlo de manera profesional
 */
export const formatError = (error: any): ErrorDetails => {
  return {
    message: getErrorMessage(error),
    code: error?.response?.status?.toString() || error?.code,
    suggestions: getErrorSuggestions(error),
  };
};

