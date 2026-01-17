# Git Push 403エラー解決方法

## 問題
```
remote: Permission to creatorsgardenofficial/Alice-s-Tea-Party.git denied to daichiyamada-ow.
fatal: unable to access 'https://github.com/creatorsgardenofficial/Alice-s-Tea-Party.git/': The requested URL returned error: 403
```

現在、`daichiyamada-ow`アカウントで`creatorsgardenofficial`のリポジトリにプッシュしようとしていますが、権限がありません。

## 解決方法

### 方法1: Personal Access Token (PAT) を使用（推奨）

1. **GitHubでPersonal Access Tokenを作成**
   - GitHubにログイン（`creatorsgardenofficial`アカウントで）
   - 右上のプロフィール画像 → **Settings**
   - 左メニューの一番下 → **Developer settings**
   - **Personal access tokens** → **Tokens (classic)**
   - **Generate new token** → **Generate new token (classic)**
   - Note: `Alice-s-Tea-Party-deploy` など適当な名前
   - Expiration: 適切な期間を選択（90日、1年など）
   - Scopes: 以下の権限にチェック
     - ✅ `repo` (Full control of private repositories)
   - **Generate token** をクリック
   - **トークンをコピー**（この画面を閉じると二度と見れません！）

2. **リモートURLを更新（トークンを含める）**
   ```bash
   git remote set-url origin https://<YOUR_TOKEN>@github.com/creatorsgardenofficial/Alice-s-Tea-Party.git
   ```
   または、ユーザー名とトークンを使用：
   ```bash
   git remote set-url origin https://creatorsgardenofficial:<YOUR_TOKEN>@github.com/creatorsgardenofficial/Alice-s-Tea-Party.git
   ```

3. **プッシュを再試行**
   ```bash
   git push -u origin main
   ```

### 方法2: GitHub認証情報マネージャーを使用

1. **Windows認証情報マネージャーを開く**
   - Windowsキー + R
   - `control /name Microsoft.CredentialManager` と入力
   - Enter

2. **Windows認証情報を確認**
   - **Windows認証情報** タブを開く
   - `git:https://github.com` を探す
   - 削除する

3. **GitHub Desktopまたはブラウザで再認証**
   - 次回プッシュ時に、正しいアカウント（`creatorsgardenofficial`）で認証

### 方法3: SSH認証を使用

1. **SSHキーを生成（まだ持っていない場合）**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   - Enterキーを押してデフォルトの場所に保存
   - パスフレーズを設定（オプション）

2. **SSH公開鍵をGitHubに追加**
   - `C:\Users\yamada\.ssh\id_ed25519.pub` を開く
   - 内容をコピー
   - GitHub → Settings → SSH and GPG keys → New SSH key
   - タイトルを入力して、公開鍵を貼り付け

3. **リモートURLをSSHに変更**
   ```bash
   git remote set-url origin git@github.com:creatorsgardenofficial/Alice-s-Tea-Party.git
   ```

4. **プッシュを再試行**
   ```bash
   git push -u origin main
   ```

### 方法4: リポジトリの権限を確認

1. **GitHubでリポジトリの設定を確認**
   - `creatorsgardenofficial/Alice-s-Tea-Party` リポジトリを開く
   - **Settings** → **Collaborators**
   - `daichiyamada-ow` がコラボレーターとして追加されているか確認
   - 追加されていない場合は、**Add people** で追加

## 推奨手順

最も簡単な方法は**方法1（Personal Access Token）**です：

1. GitHubでPATを作成
2. 以下のコマンドを実行（`<YOUR_TOKEN>`を実際のトークンに置き換え）：
   ```bash
   git remote set-url origin https://creatorsgardenofficial:<YOUR_TOKEN>@github.com/creatorsgardenofficial/Alice-s-Tea-Party.git
   git push -u origin main
   ```

## 注意事項

- Personal Access Tokenは機密情報です。絶対にGitにコミットしないでください
- トークンは`.gitignore`に含まれている`.env`ファイルなどに保存しないでください
- トークンが漏洩した場合は、すぐにGitHubで無効化してください

