$ErrorActionPreference = "Stop"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🚀 DÉMARRAGE DU DÉPLOIEMENT LOCAL" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Liste des microservices
$services = @("authService", "eventService", "interactionService", "gateway", "frontend")

foreach ($service in $services) {
    # Nettoyage du nom pour Docker Hub (ex: authService -> auth-service)
    $imageName = $service.ToLower()
    if ($imageName -match "service$") {
        $imageName = $imageName -replace "service$", "-service"
    }

    Write-Host "`n[1/3] Construction de l'image pour $service sans cache..." -ForegroundColor Yellow
    docker build --no-cache -t aymanesbe3/$imageName`:latest ./$service

    Write-Host "[2/3] Envoi de l'image aymanesbe3/$imageName vers Docker Hub..." -ForegroundColor Yellow
    docker push aymanesbe3/$imageName`:latest
}

Write-Host "`n[3/3] Synchronisation via Argo CD (GitOps)..." -ForegroundColor Yellow
Write-Host "Argo CD détectera automatiquement les nouvelles images poussées sur Docker Hub." -ForegroundColor Gray

Write-Host "`n==================================" -ForegroundColor Green
Write-Host "✅ IMAGES POUSSÉES AVEC SUCCÈS !" -ForegroundColor Green
Write-Host "Le cluster se synchronisera via Argo CD sous peu." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
