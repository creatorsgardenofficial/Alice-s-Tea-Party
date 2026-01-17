@echo off
echo ==========================================
echo   Next.js ビルドキャッシュのクリーンアップ
echo ==========================================
echo.

echo [1] .next フォルダを削除中...
if exist ".next" (
    rmdir /s /q .next
    echo [OK] .next フォルダを削除しました
) else (
    echo [情報] .next フォルダは存在しませんでした
)
echo.

echo [2] node_modules/.cache を削除中...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo [OK] キャッシュを削除しました
) else (
    echo [情報] キャッシュフォルダは存在しませんでした
)
echo.

echo ==========================================
echo   サーバーを起動します
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
