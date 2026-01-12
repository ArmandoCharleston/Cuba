# Script para construir la imagen Docker
# Ejecutar cuando Docker Desktop este completamente iniciado

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build de Docker - Cuba Connect" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker esta corriendo
Write-Host "[*] Verificando Docker..." -ForegroundColor Yellow
$dockerCheck = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker Desktop no esta corriendo o no esta listo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "  1. Abre Docker Desktop" -ForegroundColor Yellow
    Write-Host "  2. Espera a que el icono en la bandeja del sistema muestre 'Docker Desktop is running'" -ForegroundColor Yellow
    Write-Host "  3. Vuelve a ejecutar este script" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker esta corriendo" -ForegroundColor Green
Write-Host ""

# Limpiar imagenes anteriores si existen
Write-Host "[*] Limpiando imagenes anteriores..." -ForegroundColor Yellow
docker rmi cuba-connect 2>&1 | Out-Null
Write-Host "[OK] Limpieza completada" -ForegroundColor Green
Write-Host ""

# Iniciar el build
Write-Host "[*] Iniciando build de Docker..." -ForegroundColor Yellow
Write-Host "    Esto puede tardar varios minutos..." -ForegroundColor Gray
Write-Host ""

$startTime = Get-Date
docker build --load -t cuba-connect .

if ($LASTEXITCODE -eq 0) {
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Build completado exitosamente!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tiempo de build: $($duration.Minutes) minutos $($duration.Seconds) segundos" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "[INFO] Imagen creada: cuba-connect" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para ver la imagen:" -ForegroundColor Yellow
    Write-Host "  docker images cuba-connect" -ForegroundColor White
    Write-Host ""
    Write-Host "Para ejecutar el contenedor (requiere DATABASE_URL):" -ForegroundColor Yellow
    Write-Host "  docker run -p 3000:3000 -e NODE_ENV=production -e DATABASE_URL='tu-url' cuba-connect" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Build fallo" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Revisa los errores arriba para mas detalles." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

