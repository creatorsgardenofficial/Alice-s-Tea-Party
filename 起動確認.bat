@echo off
chcp 65001 >nul
echo ==========================================
echo    アリスのお茶会 - サーバー起動確認
echo ==========================================
echo.

REM 現在のディレクトリを確認
cd /d "%~dp0"
echo 作業ディレクトリ: %CD%
echo.

echo [1] Node.js のバージョン確認...
node --version
if %errorlevel% neq 0 (
    echo.
    echo [エラー] Node.js がインストールされていません！
    echo https://nodejs.org/ からインストールしてください
    echo.
    pause
    exit /b 1
)
echo.

echo [2] npm のバージョン確認...
npm --version
if %errorlevel% neq 0 (
    echo.
    echo [エラー] npm がインストールされていません！
    echo.
    pause
    exit /b 1
)
echo.

echo [3] node_modules フォルダの確認...
if exist "node_modules" (
    echo [OK] node_modules フォルダが見つかりました
) else (
    echo [警告] node_modules フォルダが見つかりません
    echo 依存関係をインストールしますか？ (Y/N)
    set /p install="> "
    if /i "%install%"=="Y" (
        echo.
        echo インストール中（数分かかる場合があります）...
        call npm install
        if %errorlevel% neq 0 (
            echo [エラー] インストールに失敗しました
            echo.
            pause
            exit /b 1
        )
        echo [OK] インストール完了
    ) else (
        echo キャンセルしました。先に npm install を実行してください。
        echo.
        pause
        exit /b 1
    )
)
echo.

echo [4] .next フォルダをクリーンアップ...
if exist ".next" (
    echo .next フォルダを削除中...
    rmdir /s /q .next 2>nul
    if %errorlevel% equ 0 (
        echo [OK] 削除完了
    ) else (
        echo [警告] 削除に失敗しました。手動で削除してください。
        echo エクスプローラーで .next フォルダを削除してください。
    )
) else (
    echo [情報] .next フォルダは存在しません
)
echo.

echo [5] キャッシュを削除中...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" 2>nul
    echo [OK] キャッシュを削除しました
) else (
    echo [情報] キャッシュフォルダは存在しませんでした
)
echo.

echo ==========================================
echo    サーバーを起動します
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
pause

call npm run dev