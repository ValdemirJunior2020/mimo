$ErrorActionPreference = 'Stop'
Write-Host 'Verificando arquivos basicos MIMO...' -ForegroundColor Magenta
$required = @('index.html','src/app.js','src/audio.js','src/scene.js','src/styles.css','tools/server.mjs','manifest.webmanifest','sw.js')
foreach ($item in $required) { if (!(Test-Path (Join-Path $PSScriptRoot $item))) { throw "Arquivo ausente: $item" } }
Write-Host 'Arquivos basicos: OK' -ForegroundColor Green
Write-Host 'Clique INICIAR_MIMO.bat para abrir o jogo.'