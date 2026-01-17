@echo off
echo ==========================================
echo   アリスのお茶会 - 診断ツール
echo ==========================================
echo.

echo [1] Node.js のバージョン確認...
node --version
if %errorlevel% neq 0 (
    echo [ERROR] Node.js がインストールされていません！
    echo https://nodejs.org/ からインストールしてください
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
    echo 依存関係をインストールする必要があります
    echo.
    echo インストールを開始しますか？ (Y/N)
    set /p install="> "
    if /i "%install%"=="Y" (
        echo.
        echo [4] 依存関係をインストール中...
        call npm install
        if %errorlevel% neq 0 (
            echo [ERROR] 依存関係のインストールに失敗しました
            pause
            exit /b 1
        )
    )
)
echo.

echo [5] .env.local ファイルの確認...
if exist ".env.local" (
    echo [OK] .env.local ファイルが見つかりました
) else (
    echo [情報] .env.local ファイルが見つかりません（オプション）
    echo APIキーがない場合、モックデータが使用されます
)
echo.

echo [6] Next.js のビルドチェック...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] ビルドエラーが発生しました
    echo 上記のエラーメッセージを確認してください
    pause
    exit /b 1
)
echo.
echo [OK] ビルドが正常に完了しました！
echo.
echo ==========================================
echo   診断完了
echo ==========================================
echo.
echo 開発サーバーを起動するには:
echo   npm run dev
echo.
pause
