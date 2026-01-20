# Script para eliminar administradores duplicados
param([string]$Domain = "https://app.reservate.tech")

$API_URL = "$Domain/api"
$AdminEmail = "admin@reservatecuba.com"
$AdminPassword = "Admin123!@#"

Write-Host "🔐 Iniciando sesión como admin..." -ForegroundColor Yellow
$loginBody = @{email=$AdminEmail;password=$AdminPassword} | ConvertTo-Json
try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al iniciar sesión: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{"Authorization"="Bearer $token";"Content-Type"="application/json"}

Write-Host ""
Write-Host "🗑️  Eliminando administradores duplicados..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/admin/remove-duplicate-admins" -Method POST -Headers $headers
    Write-Host "✅ $($response.message)" -ForegroundColor Green
    Write-Host "   - Administrador principal: $($response.data.mainAdmin.email)" -ForegroundColor Gray
    Write-Host "   - Administradores eliminados: $($response.data.deletedCount)" -ForegroundColor Gray
    Write-Host "   - Total de administradores restantes: $($response.data.totalAdmins)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Proceso completado!" -ForegroundColor Green

