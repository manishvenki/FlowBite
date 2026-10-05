@echo off
title BiteFlow Runner
color 0A
cls
echo ========================================================
echo       BITEFLOW - Order. Prepare. Deliver.
echo       Swiggy-style Food Ordering Platform
echo       Bengaluru, Karnataka, India
echo ========================================================
echo.
echo [DEMO CREDENTIALS]
echo --------------------------------------------------------
echo  ADMIN / STORE PORTAL:
echo    URL:      http://localhost:5173/login
echo    Email:    admin@biteflow.com
echo    Password: AdminPassword123!
echo    Access:   Full Store Management, Orders, Menu, Analytics
echo.
echo  CUSTOMER INTERFACE:
echo    URL:      http://localhost:5173/login
echo    Email:    user@biteflow.com
echo    Password: UserPassword123!
echo    Access:   Browse, Cart, 5s Demo Payment, Live SSE Tracking
echo --------------------------------------------------------
echo Tip: Sign in with the credentials above on http://localhost:5173/login
echo Or access from any device on your local Wi-Fi / LAN!
echo [STARTING SERVERS]
echo 1. Starting Backend API on http://localhost:5000 ...
start "BiteFlow Backend Server (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

echo 2. Starting Frontend UI on http://localhost:5173 ...
start "BiteFlow Frontend Server (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo Once loaded:
echo   - Customer / Main UI:  http://localhost:5173
echo   - Admin Portal:        http://localhost:5173/admin
echo   - Backend Health:      http://localhost:5000/api/health
echo.
echo Press any key to close this launcher (servers will remain running)...
pause >nul
