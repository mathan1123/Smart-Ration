@echo off
echo Starting Ration Project...

echo Starting Frontend (Vite)...
start cmd /k "npm run dev"

echo.
echo ============================================================
echo BACKEND STARTUP INSTRUCTIONS
echo ============================================================
echo Since Maven (mvn) was not found on your system, please:
echo 1. Open 'ration-backend' folder in your IDE (IntelliJ / VS Code).
echo 2. Run 'BackendApplication.java' to start the server.
echo.
echo Once BOTH are running:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:8080
echo ============================================================
echo.
pause
