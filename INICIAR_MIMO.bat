@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title MIMO - Seu amigo 3D - BETA
color 0D
echo.
echo ============================================
echo             MIMO - BETA 3D
 echo ============================================
echo Seu jogo e seus dados ficam no seu computador.
echo Servidor gratis. Nao precisa de conta ou API.
echo.
where node >nul 2>nul
if not errorlevel 1 (
  start "" "http://localhost:8765"
  node tools\server.mjs
  goto :eof
)
where py >nul 2>nul
if not errorlevel 1 (
  start "" "http://localhost:8765"
  py -3 -m http.server 8765 --bind 0.0.0.0
  goto :eof
)
where python >nul 2>nul
if not errorlevel 1 (
  start "" "http://localhost:8765"
  python -m http.server 8765 --bind 0.0.0.0
  goto :eof
)
echo ERRO: Voce precisa ter Node.js OU Python instalado no computador.
echo O MIMO nao precisa de bibliotecas ou instalacoes por npm.
pause