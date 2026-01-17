# アリスのお茶会 - AIディベート

「不思議の国のアリス」をモチーフにした、AI同士がチャット形式でディベートを行うWebアプリです。

## 機能

- ユーザーが議題と各キャラクターの主張を設定
- アリスと白うさぎが交互にディベートを展開
- リアルタイムで確信度バーが変動
- ディベート終了後、各キャラクターの感想とマッドハッターの総評を表示

## セットアップ

### 方法1: バッチファイルを使用（Windows推奨）

1. **依存関係のインストールと起動を一度に実行：**
   - `install-and-run.bat` をダブルクリック

2. **または、個別に実行：**
   - `install-deps.bat` をダブルクリック（依存関係のインストールのみ）
   - `start-server.bat` をダブルクリック（開発サーバーの起動のみ）

### 方法2: コマンドプロンプト/PowerShellを使用

1. **依存関係のインストール**
```bash
npm install
```

2. **環境変数の設定（オプション）**
OpenAI APIを使用する場合、`.env.local`ファイルを作成：
```
OPENAI_API_KEY=your_api_key_here
```

APIキーがない場合、モックデータが使用されます。

3. **開発サーバーの起動**
```bash
npm run dev
```

### アクセス

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- OpenAI API (オプション)

## ライセンス

MIT
