@echo off
echo ==========================================
echo   サーバー起動確認ツール
echo ==========================================
echo.

echo [1] Node.js のバージョン確認...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js がインストールされていません！
    pause
    exit /b 1
)
echo.

echo [2] npm のバージョン確認...
npm --version
if %errorlevel% neq 0 (
    echo [ERROR] npm がインストールされていません！
    pause
    exit /b 1
)
echo.

echo [3] node_modules フォルダの確認...
if exist "node_modules" (
    echo [OK] node_modules フォルダが見つかりました
) else (
    echo [警告] node_modules フォルダが見つかりません
    echo 依存関係をインストールしてください: npm install
    pause
    exit /b 1
)
echo.

echo [4] ポート3000の使用状況確認...
netstat -ano | findstr :3000
if %errorlevel% equ 0 (
    echo [情報] ポート3000は使用中です
) else (
    echo [情報] ポート3000は空いています
)
echo.

echo [5] ポート3002の使用状況確認...
netstat -ano | findstr :3002
if %errorlevel% equ 0 (
    echo [情報] ポート3002は使用中です
) else (
    echo [情報] ポート3002は空いています
)
echo.

echo [6] Node.jsプロセスの確認...
tasklist | findstr node.exe
if %errorlevel% equ 0 (
    echo [情報] Node.jsプロセスが実行中です
) else (
    echo [情報] Node.jsプロセスは実行されていません
)
echo.

echo ==========================================
echo   確認完了
echo ==========================================
echo.
echo サーバーを起動するには:
echo   npm run dev
echo.
echo 別のポートで起動するには:
echo   npm run dev -- -p 3003
echo.
echo このウィンドウを閉じても構いません。
echo.
pause
