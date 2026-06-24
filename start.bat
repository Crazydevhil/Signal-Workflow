@echo off
title Signal Workflows - Dev Server
echo ===================================================
echo Starting Signal Workflows Development Server...
echo The site will be available at http://localhost:3000
echo ===================================================
cd /d "%~dp0"
call npm run dev
pause
