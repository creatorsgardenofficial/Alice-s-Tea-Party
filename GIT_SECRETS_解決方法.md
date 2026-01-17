# GitHub Push Protection 解決方法

## 問題
GitHubのPush ProtectionがAPIキーを検出してプッシュをブロックしています。

## 解決済み
以下のファイルからAPIキーを削除しました：
- `API確認方法.md`
- `APIキー設定.bat`
- `APIキー設定と再起動手順.md`
- `API連携確認方法.md`
- `API連携診断ページ.md`

## 次のステップ

### 1. 変更をコミット

```bash
git add .
git commit -m "Remove API keys from documentation files"
```

### 2. プッシュを再試行

```bash
git push -u origin main
```

## 注意事項

- APIキーは機密情報です。今後、ドキュメントファイルに実際のAPIキーを記載しないでください
- プレースホルダー（`your_api_key_here`）を使用してください
- 実際のAPIキーは`.env.local`ファイルにのみ保存してください（このファイルは`.gitignore`に含まれています）

