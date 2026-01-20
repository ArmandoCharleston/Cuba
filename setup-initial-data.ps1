# Script para limpiar datos mock y crear categorías y ciudades iniciales
# Uso: .\setup-initial-data.ps1 [URL_DEL_DOMINIO]
# Ejemplo: .\setup-initial-data.ps1 https://app.reservate.tech

param(
    [string]$Domain = "https://app.reservate.tech"
)

$API_URL = "$Domain/api"
$AdminEmail = "admin@reservatecuba.com"
$AdminPassword = "Admin123!@#"

Write-Host "🚀 Configurando datos iniciales..." -ForegroundColor Cyan
Write-Host "📡 URL: $API_URL" -ForegroundColor Gray
Write-Host ""

# 1. Login como admin para obtener el token
Write-Host "🔐 Iniciando sesión como admin..." -ForegroundColor Yellow
$loginBody = @{
    email = $AdminEmail
    password = $AdminPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al iniciar sesión: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Limpiar datos mock
Write-Host ""
Write-Host "🧹 Limpiando datos mock..." -ForegroundColor Yellow
try {
    $cleanResponse = Invoke-RestMethod -Uri "$API_URL/admin/clean-mock-data" -Method POST -Headers $headers
    Write-Host "✅ Datos mock eliminados:" -ForegroundColor Green
    Write-Host "   - Usuarios: $($cleanResponse.data.usuariosEliminados)" -ForegroundColor Gray
    Write-Host "   - Negocios: $($cleanResponse.data.negociosEliminados)" -ForegroundColor Gray
    Write-Host "   - Reservas: $($cleanResponse.data.reservasEliminadas)" -ForegroundColor Gray
    Write-Host "   - Chats: $($cleanResponse.data.chatsEliminados)" -ForegroundColor Gray
    Write-Host "   - Reseñas: $($cleanResponse.data.resenasEliminadas)" -ForegroundColor Gray
    Write-Host "   - Favoritos: $($cleanResponse.data.favoritosEliminados)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Error al limpiar datos: $($_.Exception.Message)" -ForegroundColor Yellow
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}

# 3. Eliminar categorías existentes (si las hay)
Write-Host ""
Write-Host "🗑️  Eliminando categorías existentes..." -ForegroundColor Yellow
try {
    $categorias = Invoke-RestMethod -Uri "$API_URL/categorias" -Method GET
    if ($categorias.data -and $categorias.data.Count -gt 0) {
        Write-Host "   ⚠️  Hay $($categorias.data.Count) categorías existentes" -ForegroundColor Yellow
        Write-Host "   💡 Las categorías se crearán de nuevo a continuación" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ℹ️  No se pudieron obtener categorías existentes" -ForegroundColor Gray
}

# 4. Crear categorías
Write-Host ""
Write-Host "📁 Creando categorías..." -ForegroundColor Yellow
$categorias = @(
    @{ nombre = "Peluquería"; icono = "Scissors"; descripcion = "Cortes, peinados y tratamientos capilares" },
    @{ nombre = "Spa & Masajes"; icono = "Sparkles"; descripcion = "Relajación y tratamientos corporales" },
    @{ nombre = "Belleza"; icono = "Heart"; descripcion = "Manicure, pedicure y estética facial" },
    @{ nombre = "Fitness"; icono = "Dumbbell"; descripcion = "Gimnasios y entrenamiento personal" },
    @{ nombre = "Restaurantes"; icono = "UtensilsCrossed"; descripcion = "Reservas en restaurantes" },
    @{ nombre = "Médico"; icono = "Stethoscope"; descripcion = "Consultas y tratamientos médicos" }
)

$categoriasCreadas = 0
foreach ($cat in $categorias) {
    try {
        $body = $cat | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$API_URL/categorias" -Method POST -Body $body -Headers $headers
        Write-Host "   ✅ $($cat.nombre)" -ForegroundColor Green
        $categoriasCreadas++
    } catch {
        if ($_.ErrorDetails.Message -like "*already exists*" -or $_.ErrorDetails.Message -like "*unique*") {
            Write-Host "   ⚠️  $($cat.nombre) ya existe" -ForegroundColor Yellow
        } else {
            Write-Host "   ❌ Error al crear $($cat.nombre): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# 5. Eliminar ciudades existentes (si las hay)
Write-Host ""
Write-Host "🗑️  Eliminando ciudades existentes..." -ForegroundColor Yellow
try {
    $ciudades = Invoke-RestMethod -Uri "$API_URL/ciudades" -Method GET
    if ($ciudades.data -and $ciudades.data.Count -gt 0) {
        Write-Host "   ⚠️  Hay $($ciudades.data.Count) ciudades existentes" -ForegroundColor Yellow
        Write-Host "   💡 Las ciudades se crearán de nuevo a continuación" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ℹ️  No se pudieron obtener ciudades existentes" -ForegroundColor Gray
}

# 6. Crear ciudades
Write-Host ""
Write-Host "🏙️  Creando ciudades..." -ForegroundColor Yellow
$ciudades = @(
    "La Habana",
    "Varadero",
    "Santiago de Cuba",
    "Trinidad",
    "Viñales",
    "Cienfuegos",
    "Camagüey",
    "Holguín"
)

$ciudadesCreadas = 0
foreach ($ciudad in $ciudades) {
    try {
        $body = @{ nombre = $ciudad } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$API_URL/ciudades" -Method POST -Body $body -Headers $headers
        Write-Host "   ✅ $ciudad" -ForegroundColor Green
        $ciudadesCreadas++
    } catch {
        if ($_.ErrorDetails.Message -like "*already exists*" -or $_.ErrorDetails.Message -like "*unique*") {
            Write-Host "   ⚠️  $ciudad ya existe" -ForegroundColor Yellow
        } else {
            Write-Host "   ❌ Error al crear $ciudad : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Resumen
Write-Host ""
Write-Host "✅ Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Resumen:" -ForegroundColor Cyan
Write-Host "   - Categorías creadas: $categoriasCreadas" -ForegroundColor Gray
Write-Host "   - Ciudades creadas: $ciudadesCreadas" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 La aplicación está lista para usar!" -ForegroundColor Green

