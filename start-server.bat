@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo    サーバーを起動します
echo ==========================================
echo.
echo 作業ディレクトリ: %CD%
echo.
echo サーバーが起動すると、以下のようなメッセージが表示されます：
echo   ▲ Next.js 14.x.x
echo   - Local:        http://localhost:3000
echo   - Ready in X.Xs
echo.
echo 表示されたURLをブラウザで開いてください。
echo.
echo サーバーを停止するには Ctrl+C を押してください。
echo.
echo ==========================================
echo.
call npm run dev
