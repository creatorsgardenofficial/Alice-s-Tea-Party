@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo   サーバー再起動
echo ==========================================
echo.

echo [1] 実行中のサーバーを確認中...
echo     もしサーバーが起動している場合は、Ctrl+C で停止してください
echo.
pause

echo [2] .next フォルダをクリーンアップ...
if exist ".next" (
    echo .next フォルダを削除中...
    rmdir /s /q .next 2>nul
    if %errorlevel% equ 0 (
        echo [OK] 削除完了
    ) else (
        echo [警告] 削除に失敗しました。手動で削除してください。
    )
) else (
    echo [情報] .next フォルダは存在しません
)
echo.

echo [3] サーバーを起動します...
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
