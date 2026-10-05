Write-Host "========================================================" -ForegroundColor Green
Write-Host "      BITEFLOW - Order. Prepare. Deliver." -ForegroundColor Green
Write-Host "      Swiggy-style Food Ordering Platform" -ForegroundColor Green
Write-Host "      Bengaluru, Karnataka, India" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "[DEMO CREDENTIALS]" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor Yellow
Write-Host " ADMIN / STORE PORTAL:" -ForegroundColor Cyan
Write-Host "   URL:      http://localhost:5173/login"
Write-Host "   Email:    admin@biteflow.com"
Write-Host "   Password: AdminPassword123!"
Write-Host "   Role:     ADMIN"
Write-Host ""
Write-Host " CUSTOMER INTERFACE:" -ForegroundColor Cyan
Write-Host "   URL:      http://localhost:5173/login"
Write-Host "   Email:    user@biteflow.com"
Write-Host "   Password: UserPassword123!"
Write-Host "   Role:     USER"
Write-Host "--------------------------------------------------------" -ForegroundColor Yellow
Write-Host "Tip: Sign in with the credentials above on http://localhost:5173/login" -ForegroundColor Gray
Write-Host "Or access from any mobile phone or device on the same local Wi-Fi!" -ForegroundColor Gray
Write-Host "Launching Backend API (http://localhost:5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; Write-Host 'Starting BiteFlow Backend...' -ForegroundColor Cyan; npm run dev"

Write-Host "Launching Frontend UI (http://localhost:5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; Write-Host 'Starting BiteFlow Frontend...' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "Both servers started in separate terminal windows." -ForegroundColor Green
Write-Host "Customer App:   http://localhost:5173" -ForegroundColor White
Write-Host "Admin Portal:   http://localhost:5173/admin" -ForegroundColor White
Write-Host "Backend Health: http://localhost:5000/api/health" -ForegroundColor White
