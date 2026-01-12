# Script PowerShell para validar y probar el build de Docker
# Ejecutar: .\test-build.ps1

Write-Host "[*] Validando configuracion de Docker..." -ForegroundColor Cyan

# Verificar Docker
$dockerVersion = docker --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker no esta instalado o no esta en el PATH" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Docker instalado: $dockerVersion" -ForegroundColor Green

# Verificar que Docker Desktop esta corriendo
Write-Host ""
Write-Host "[*] Verificando que Docker Desktop esta corriendo..." -ForegroundColor Cyan
$dockerInfo = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker Desktop no esta corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "[INFO] Solucion:" -ForegroundColor Yellow
    Write-Host "   1. Abre Docker Desktop desde el menu de inicio" -ForegroundColor Yellow
    Write-Host "   2. Espera a que se inicie completamente" -ForegroundColor Yellow
    Write-Host "   3. Vuelve a ejecutar este script" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Docker Desktop esta corriendo" -ForegroundColor Green

# Verificar archivos necesarios
Write-Host ""
Write-Host "[*] Verificando archivos necesarios..." -ForegroundColor Cyan

$files = @(
    "Dockerfile",
    "package.json",
    "server/package.json",
    "cuba-connect-ui/package.json",
    "server/prisma/schema.prisma"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $file no encontrado" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "[ERROR] Faltan archivos necesarios" -ForegroundColor Red
    exit 1
}

# Validar Dockerfile basico
Write-Host ""
Write-Host "[*] Validando Dockerfile..." -ForegroundColor Cyan
$dockerfileContent = Get-Content Dockerfile -Raw

if ($dockerfileContent -notmatch "FROM") {
    Write-Host "[ERROR] Dockerfile no tiene instruccion FROM" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Dockerfile tiene estructura valida" -ForegroundColor Green

# Intentar el build
Write-Host ""
Write-Host "[*] Iniciando build de Docker..." -ForegroundColor Cyan
Write-Host "   Esto puede tardar varios minutos..." -ForegroundColor Yellow
Write-Host ""

docker build -t cuba-connect .

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Build completado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "[INFO] Imagen creada: cuba-connect" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "[INFO] Para probar la imagen localmente:" -ForegroundColor Yellow
    Write-Host "   docker run -p 3000:3000 -e NODE_ENV=production cuba-connect" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "[ERROR] Build fallo. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}

