@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo   APIキー設定 (.env.local)
echo ==========================================
echo.

REM .env.localファイルが既に存在するか確認
if exist ".env.local" (
    echo [警告] .env.local ファイルが既に存在します
    echo.
    echo 上書きしますか？ (Y/N)
    set /p overwrite="> "
    if /i not "%overwrite%"=="Y" (
        echo キャンセルしました
        echo.
        pause
        exit /b 0
    )
    echo.
)

REM .env.localファイルを作成
echo [1] .env.local ファイルを作成中...
(
    echo OPENAI_API_KEY=your_api_key_here
) > .env.local

if %errorlevel% equ 0 (
    echo [OK] .env.local ファイルを作成しました
) else (
    echo [エラー] ファイルの作成に失敗しました
    echo.
    echo 手動で以下の内容を .env.local ファイルに保存してください：
    echo.
    echo OPENAI_API_KEY=your_api_key_here
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   設定完了！
echo ==========================================
echo.
echo 次のステップ：
echo 1. サーバーを再起動してください（環境変数は起動時に読み込まれます）
echo 2. サーバーのログで以下が表示されることを確認してください：
echo    [API] APIキーの確認: 設定済み (sk-proj-EM...)
echo.
echo サーバーを今すぐ起動しますか？ (Y/N)
set /p startserver="> "

if /i "%startserver%"=="Y" (
    echo.
    echo [2] サーバーを起動します...
    echo.
    echo ==========================================
    echo   サーバー起動中...
    echo ==========================================
    echo.
    call npm run dev
) else (
    echo.
    echo 手動でサーバーを起動してください：
    echo   npm run dev
    echo または
    echo   完全クリーンアップ.bat
    echo.
    pause
)
