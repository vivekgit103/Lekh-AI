@echo off
echo ========================================================
echo   Starting DocuSaathi (Backend + Frontend)
echo ========================================================
start "DocuSaathi Backend API (Port 5001)" cmd /k "cd server && node server.js"
start "DocuSaathi Frontend App (Port 5174)" cmd /k "cd client && npm run dev"
echo.
echo Both servers have been launched!
echo Access the full application at: http://localhost:5174
echo Backend API available at:       http://localhost:5001/api/health
echo ========================================================
pause
