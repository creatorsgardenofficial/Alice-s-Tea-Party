# デプロイ手順

このプロジェクトをデプロイする方法を説明します。

## 推奨プラットフォーム

### 1. Vercel（推奨）

VercelはNext.jsの開発元が提供するプラットフォームで、最も簡単にデプロイできます。

#### 手順

1. **Vercelアカウントを作成**
   - [https://vercel.com](https://vercel.com) にアクセス
   - GitHubアカウントでサインアップ

2. **プロジェクトをGitHubにプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Vercelでプロジェクトをインポート**
   - Vercelダッシュボードで「New Project」をクリック
   - GitHubリポジトリを選択
   - 自動的に設定が検出されます

4. **環境変数の設定**
   - Vercelダッシュボードの「Settings」→「Environment Variables」
   - 以下を追加：
     ```
     OPENAI_API_KEY=your_api_key_here
     ```
   - 本番環境、プレビュー環境、開発環境すべてに適用

5. **デプロイ**
   - 「Deploy」ボタンをクリック
   - 数分でデプロイが完了します

### 2. Netlify

#### 手順

1. **Netlifyアカウントを作成**
   - [https://www.netlify.com](https://www.netlify.com) にアクセス

2. **プロジェクトをGitHubにプッシュ**（Vercelと同じ）

3. **Netlifyでプロジェクトをインポート**
   - 「Add new site」→「Import an existing project」
   - GitHubリポジトリを選択

4. **ビルド設定**
   - Build command: `npm run build`
   - Publish directory: `.next`

5. **環境変数の設定**
   - 「Site settings」→「Environment variables」
   - `OPENAI_API_KEY`を追加

6. **デプロイ**
   - 自動的にデプロイが開始されます

### 3. その他のプラットフォーム

#### Railway
- [https://railway.app](https://railway.app) でデプロイ可能
- GitHubリポジトリを接続して自動デプロイ

#### Render
- [https://render.com](https://render.com) でデプロイ可能
- Web Serviceとして設定

## デプロイ前の確認事項

### 1. ビルドテスト

ローカルでビルドが成功することを確認：

```bash
npm run build
```

エラーがないことを確認してください。

### 2. 環境変数の確認

`.env.local`ファイルはGitにコミットしないでください（`.gitignore`に含まれています）。

デプロイ先のプラットフォームで環境変数を設定してください。

### 3. 静的ファイルの確認

`public`フォルダ内のファイル（`alice.png`など）が正しく配置されていることを確認してください。

## トラブルシューティング

### ビルドエラーが発生する場合

1. **依存関係の確認**
   ```bash
   npm install
   ```

2. **TypeScriptエラーの確認**
   ```bash
   npm run lint
   ```

3. **ビルドログの確認**
   - デプロイプラットフォームのビルドログを確認
   - エラーメッセージに従って修正

### 環境変数が読み込まれない場合

- デプロイ先のプラットフォームで環境変数が正しく設定されているか確認
- 環境変数名が`OPENAI_API_KEY`であることを確認
- デプロイ後に環境変数を追加した場合は、再デプロイが必要です

### 画像が表示されない場合

- `public`フォルダ内のファイルがGitにコミットされているか確認
- 画像のパスが正しいか確認（`/alice.png`）

## カスタムドメインの設定

VercelやNetlifyでは、カスタムドメインを設定できます：

1. デプロイ先のプラットフォームの設定で「Domains」を開く
2. カスタムドメインを追加
3. DNS設定を指示に従って変更

## 継続的デプロイ（CI/CD）

GitHubにプッシュすると自動的にデプロイされるように設定されます：

- **Vercel**: 自動的に有効
- **Netlify**: 自動的に有効
- **その他**: プラットフォームの設定を確認

## 注意事項

- OpenAI APIキーは機密情報です。絶対にGitにコミットしないでください
- 環境変数はデプロイ先のプラットフォームで設定してください
- 本番環境では、APIキーの使用量に注意してください

