@echo off
echo 🔍 Checking deployment size for Vercel...

REM Calculate deployable size (excluding large directories)
powershell -Command "$totalSize = (Get-ChildItem -Recurse -File | Where-Object {$_.FullName -notmatch 'node_modules|\.git|dist|\.next\\cache|\.next\\standalone' -and $_.Name -notmatch '\.(log|exe|asar|pack)$'} | Measure-Object -Property Length -Sum).Sum; $sizeMB = [math]::Round($totalSize/1MB,2); Write-Host \"📦 Deployable project size: $sizeMB MB\"; if($sizeMB -lt 100) { Write-Host \"✅ Size OK for Vercel deployment (under 100MB limit)\" -ForegroundColor Green } else { Write-Host \"❌ Size too large for Vercel deployment (over 100MB limit)\" -ForegroundColor Red }"

echo.
echo 💡 If size is still too large, check:
echo    - Remove dist/ folder: Remove-Item -Recurse -Force dist
echo    - Clear Next.js cache: Remove-Item -Recurse -Force .next\cache
echo    - Check for large files: Get-ChildItem -Recurse ^| Where-Object {$_.Length -gt 10MB}

pause
