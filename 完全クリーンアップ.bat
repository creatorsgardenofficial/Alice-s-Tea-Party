@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo   完全クリーンアップと再起動
echo ==========================================
echo.

echo [1] 実行中のサーバーを停止してください...
echo     コマンドプロンプトで Ctrl+C を押してください
echo.
pause

echo [2] .next フォルダを削除中...
if exist ".next" (
    echo .next フォルダが見つかりました。削除します...
    rmdir /s /q .next
    if %errorlevel% equ 0 (
        echo [OK] .next フォルダを削除しました
    ) else (
        echo [警告] .next フォルダの削除に失敗しました
        echo 手動で削除してください
    )
) else (
    echo [情報] .next フォルダは存在しませんでした
)
echo.

echo [3] キャッシュを削除中...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" 2>nul
    echo [OK] キャッシュを削除しました
) else (
    echo [情報] キャッシュフォルダは存在しませんでした
)
echo.

echo [4] サーバーを起動します...
echo.
echo ==========================================
echo   サーバー起動中...
echo ==========================================
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
