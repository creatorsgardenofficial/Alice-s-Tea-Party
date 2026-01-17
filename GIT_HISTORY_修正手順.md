# Git履歴からAPIキーを削除する手順

## 問題
最初のコミット（9a9bef3）にAPIキーが含まれているため、GitHubのPush Protectionがブロックしています。

## 解決方法

### 方法1: GitHubのURLで許可（最も簡単）

エラーメッセージに表示されたURLにアクセスして、シークレットを許可：

1. ブラウザで以下のURLを開く：
   - https://github.com/creatorsgardenofficial/Alice-s-Tea-Party/security/secret-scanning/unblock-secret/38Nxq2Vidb6JLklb21Nj2SSEhpi
   - https://github.com/creatorsgardenofficial/Alice-s-Tea-Party/security/secret-scanning/unblock-secret/38Nxq39ftTorFdG4AOmGMNRoRL0

2. 「Allow secret」をクリック

3. 再度プッシュ：
   ```bash
   git push -u origin main
   ```

### 方法2: コミット履歴を書き換え（推奨）

最初のコミットからAPIキーを削除して、新しい履歴を作成します。

#### 手順

1. **現在の状態を確認**
   ```bash
   git log --oneline
   ```

2. **履歴を書き換え**
   ```bash
   git filter-branch --force --index-filter "git rm --cached --ignore-unmatch 'API確認方法.md' 'APIキー設定.bat' 'APIキー設定と再起動手順.md' 'API連携確認方法.md' 'API連携診断ページ.md'" --prune-empty --tag-name-filter cat -- --all
   ```

3. **変更を追加**
   ```bash
   git add .
   git commit -m "Remove API keys from documentation files"
   ```

4. **強制プッシュ**
   ```bash
   git push origin --force --all
   ```

### 方法3: 新しいリポジトリとして始める（最も確実）

最初のコミットを削除して、新しい履歴を作成します。

#### 手順

1. **現在の.gitフォルダをバックアップ**
   ```bash
   move .git .git.backup
   ```

2. **新しいGitリポジトリを初期化**
   ```bash
   git init
   git branch -M main
   ```

3. **すべてのファイルを追加（.env.localは除外）**
   ```bash
   git add .
   git commit -m "Initial commit - API keys removed"
   ```

4. **リモートを追加**
   ```bash
   git remote add origin https://creatorsgardenofficial:<YOUR_TOKEN>@github.com/creatorsgardenofficial/Alice-s-Tea-Party.git
   ```
   （`<YOUR_TOKEN>`を実際のPersonal Access Tokenに置き換えてください）

5. **強制プッシュ**
   ```bash
   git push -u origin main --force
   ```

## 推奨手順

**まず方法1を試してください。** それでもダメな場合は、方法3（新しいリポジトリとして始める）が最も確実です。

