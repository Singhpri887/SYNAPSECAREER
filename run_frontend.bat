@echo off
echo ===================================================
echo Starting SynapseCareer Web UI Server (Port 8000)
echo ===================================================
cd /d "%~dp0"
python -m http.server 8000
pause
