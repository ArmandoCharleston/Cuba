#!/bin/bash
# Script para crear usuario admin usando curl
# Uso: ./create-admin.sh [URL_DEL_DOMINIO]
# Ejemplo: ./create-admin.sh https://mi-dominio.com

API_URL="${1:-https://tu-dominio.com}/api"

echo "🚀 Creando usuario admin..."
echo "📡 URL: $API_URL/auth/register"
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@reservatecuba.com",
    "password": "Admin123!@#",
    "telefono": "+53 7 000 0000",
    "ciudad": "La Habana",
    "rol": "admin"
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 201 ]; then
  echo "✅ Usuario admin creado exitosamente!"
  echo ""
  echo "🔑 Credenciales de acceso:"
  echo "   Email: admin@reservatecuba.com"
  echo "   Password: Admin123!@#"
  echo ""
  echo "⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión!"
elif [ "$http_code" -eq 400 ]; then
  echo "⚠️  El usuario admin ya existe."
  echo ""
  echo "💡 Puedes iniciar sesión con:"
  echo "   Email: admin@reservatecuba.com"
  echo "   Password: Admin123!@#"
else
  echo "❌ Error al crear usuario admin:"
  echo "$body" | jq '.' 2>/dev/null || echo "$body"
fi


