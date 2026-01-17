@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo   Git履歴をリセットして再プッシュ
echo ==========================================
echo.
echo [警告] この操作は既存のGit履歴を削除します
echo.
echo 続行しますか？ (Y/N)
set /p confirm="> "

if /i not "%confirm%"=="Y" (
    echo キャンセルしました
    pause
    exit /b 0
)

echo.
echo [1] 既存の.gitフォルダをバックアップ...
if exist .git (
    move .git .git.backup
    echo [OK] .gitフォルダをバックアップしました
) else (
    echo [情報] .gitフォルダが見つかりません
)

echo.
echo [2] 新しいGitリポジトリを初期化...
git init
git branch -M main

echo.
echo [3] ファイルを追加（.env.localは除外）...
git add .
git commit -m "Initial commit - API keys removed"

echo.
echo [4] リモートを追加...
echo [重要] Personal Access Tokenを入力してください
set /p token="Token: "
git remote add origin https://creatorsgardenofficial:%token%@github.com/creatorsgardenofficial/Alice-s-Tea-Party.git

echo.
echo [5] 強制プッシュを実行...
echo [警告] これにより、GitHub上の既存の履歴が上書きされます
echo.
git push -u origin main --force

echo.
echo ==========================================
echo   完了！
echo ==========================================
echo.
pause

