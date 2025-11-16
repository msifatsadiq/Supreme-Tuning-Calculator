@echo off
echo Supreme Tuning - Quick Setup Script
echo ======================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo Node.js installed
node -v
echo.

:: Install root dependencies
echo Installing root dependencies...
call npm install

:: Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
cd ..

:: Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

:: Create backups directory
echo Creating backups directory...
if not exist "backend\backups" mkdir backend\backups

:: Copy .env if not exists
if not exist "backend\.env" (
    echo Creating backend\.env file...
    copy .env.example backend\.env
)

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Review backend\.env and update credentials if needed
echo 2. Run 'npm run dev' to start both servers
echo 3. Visit http://localhost:5173 for the calculator
echo 4. Visit http://localhost:5173/admin/login for admin panel
echo.
echo Admin credentials:
echo    Email: admin@supa.com
echo    Password: password123
echo.
echo Happy coding!
pause
