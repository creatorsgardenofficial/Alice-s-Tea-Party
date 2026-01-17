@echo off
echo ==========================================
echo   完全診断と修正ツール
echo ==========================================
echo.

echo [1] Node.js のバージョン確認...
node --version
if %errorlevel% neq 0 (
    echo [エラー] Node.js がインストールされていません！
    pause
    exit /b 1
)
echo.

echo [2] npm のバージョン確認...
npm --version
if %errorlevel% neq 0 (
    echo [エラー] npm がインストールされていません！
    pause
    exit /b 1
)
echo.

echo [3] 既存のビルドを削除...
if exist ".next" (
    echo .next フォルダを削除中...
    rmdir /s /q .next
    echo [OK] 削除完了
) else (
    echo [情報] .next フォルダは存在しません
)
echo.

echo [4] キャッシュを削除...
if exist "node_modules\.cache" (
    echo キャッシュを削除中...
    rmdir /s /q "node_modules\.cache"
    echo [OK] 削除完了
) else (
    echo [情報] キャッシュフォルダは存在しません
)
echo.

echo [5] ビルドテストを実行...
call npm run build
if %errorlevel% neq 0 (
    echo [警告] ビルドエラーが発生しました
    echo 上記のエラーメッセージを確認してください
    pause
    exit /b 1
)
echo [OK] ビルドが正常に完了しました
echo.

echo [6] 開発サーバーを起動します...
echo.
echo ==========================================
echo   サーバー起動中...
echo ==========================================
echo.
echo サーバーが起動したら、ブラウザで以下にアクセス：
echo   http://localhost:3000
echo.
echo 停止するには Ctrl+C を押してください
echo.
pause
echo.

call npm run dev
