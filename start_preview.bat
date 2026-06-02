@echo off
cd /d "%~dp0"
echo Starting local server on port 8088...
python -m http.server 8088
pause
