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

Write-Host "`n[3/3] Redémarrage à chaud du Cluster Kubernetes..." -ForegroundColor Yellow
kubectl rollout restart deployment auth-service event-service interaction-service gateway frontend

Write-Host "`n==================================" -ForegroundColor Green
Write-Host "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !" -ForegroundColor Green
Write-Host "Les nouveaux pods sont en train de démarrer avec vos modifications." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
