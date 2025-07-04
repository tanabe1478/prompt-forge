# PromptForge デプロイガイド

## デプロイオプション比較

### 推奨：Netlify（個人利用に最適）

#### メリット
- **無料プラン充実**: 月100GB帯域、週300分ビルド
- **簡単セットアップ**: GitHubリポジトリ連携で自動デプロイ
- **基本認証対応**: ユーザー名・パスワードで簡単アクセス制限
- **プレビューデプロイ**: PRごとに自動プレビュー環境
- **カスタムドメイン**: 独自ドメイン対応（SSL自動）
- **高速CDN**: 世界中のエッジロケーション

#### デメリット
- ビルド時間制限（無料プランは週300分）
- サーバーサイド処理不可（静的サイトのみ）

### 代替案

#### Vercel
- **メリット**: Next.js最適化、高速、GitHub連携
- **デメリット**: 基本認証が有料プラン（$20/月〜）

#### GitHub Pages
- **メリット**: 完全無料、GitHub統合
- **デメリット**: 基本認証なし、カスタムビルド制限

#### Cloudflare Pages
- **メリット**: 無料、高速、無制限リクエスト
- **デメリ**: 基本認証設定が複雑

## Netlifyデプロイ手順（推奨）

### 1. Netlifyアカウント作成
```bash
# Netlify CLI インストール
npm install -g netlify-cli

# ログイン
netlify login
```

### 2. サイト作成
```bash
# プロジェクトディレクトリで実行
netlify init

# 手動設定の場合
netlify sites:create --name prompt-forge-your-name
```

### 3. ビルド設定
Netlify Web UI で設定：
```
Build command: npm run build
Publish directory: dist
```

### 4. 基本認証設定（アクセス制限）

#### 方法1: netlify.toml ファイル（推奨）
```toml
# netlify.toml をプロジェクトルートに作成
[build]
  command = "npm run build"
  publish = "dist"

# 基本認証設定
[context.production]
  [context.production.headers]
    # セキュリティヘッダー
    "/*"
      X-Frame-Options = "DENY"
      X-XSS-Protection = "1; mode=block"
      X-Content-Type-Options = "nosniff"
      Referrer-Policy = "strict-origin-when-cross-origin"

# パスワード保護（Netlify UI で設定）
# Site Settings > Access control > Visitor access で設定
```

#### 方法2: Netlify UI設定
1. Site Settings
2. Access control
3. Visitor access
4. Password protection
5. パスワード設定

### 5. 環境変数設定

#### Netlify UI で設定
```
Site Settings > Environment variables

NETLIFY_AUTH_TOKEN: [Personal Access Token]
NETLIFY_SITE_ID: [Site ID]
```

#### Personal Access Token取得
1. Netlify > User settings > Personal access tokens
2. New access token
3. Expiration: No expiration
4. Scopes: すべて選択

### 6. GitHub Actions設定

#### リポジトリSecrets設定
```
Settings > Secrets and variables > Actions

NETLIFY_AUTH_TOKEN: [上記で取得したトークン]
NETLIFY_SITE_ID: [Site IDをコピー]
```

#### Site ID確認方法
```bash
# CLIで確認
netlify status

# または Netlify UI: Site settings > General > Site ID
```

## より強固なアクセス制限オプション

### 1. Netlify Identity（無料）
```javascript
// src/auth.js
import { netlifyIdentity } from 'netlify-identity-widget'

// 認証チェック
if (!netlifyIdentity.currentUser()) {
  netlifyIdentity.open()
}
```

### 2. IP制限 + 基本認証
```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/401.html"
  status = 401
  conditions = {Country = ["!JP"]}  # 日本以外からのアクセス拒否

# カスタムエラーページ
[[redirects]]
  from = "/401.html"
  to = "/index.html"
  status = 200
```

### 3. 環境変数によるアクセス制御
```javascript
// src/config.js
const isDev = import.meta.env.DEV
const allowedUsers = import.meta.env.VITE_ALLOWED_USERS?.split(',') || []

export const isAccessAllowed = (userEmail) => {
  return isDev || allowedUsers.includes(userEmail)
}
```

## デプロイ手順詳細

### 初回設定
```bash
# 1. リポジトリをNetlifyに接続
netlify link

# 2. 初回デプロイ
netlify deploy

# 3. 本番デプロイ
netlify deploy --prod

# 4. 設定確認
netlify status
```

### 自動デプロイ設定確認
```bash
# GitHub Actions が正しく設定されているかテスト
git checkout -b test-deploy
git push -u origin test-deploy

# PRを作成して、プレビューデプロイが動作するか確認
```

## セキュリティ設定

### netlify.toml セキュリティ設定例
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# セキュリティヘッダー
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"

# パスワード保護対象外（health check等）
[[redirects]]
  from = "/health"
  to = "/.netlify/functions/health"
  status = 200

# SPA対応
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 監視・ログ

### Netlify Analytics（有料）
- リアルタイムアクセス解析
- パフォーマンス監視
- エラー追跡

### 無料代替案
```javascript
// src/analytics.js
// Google Analytics 4 (無料)
import { gtag } from 'gtag'

// Cloudflare Web Analytics (無料)
// <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "TOKEN"}'></script>
```

## トラブルシューティング

### よくある問題

#### 1. ビルドエラー
```bash
# ローカルで確認
npm run build

# Netlify CLI でローカルビルドテスト
netlify build
```

#### 2. 認証設定が反映されない
```bash
# 設定確認
netlify env:list

# 再デプロイ
netlify deploy --prod
```

#### 3. カスタムドメイン設定
```bash
# ドメイン追加
netlify domains:add yourdomain.com

# DNS設定確認
netlify dns
```

## 費用目安

### Netlify無料プラン
- 帯域: 100GB/月
- ビルド: 300分/月
- サイト数: 無制限
- **基本認証: 無料**

### 有料が必要になる場合
- 帯域超過: $55/月〜
- ビルド時間超過: $7/300分
- 高度な認証: Identity $99/月〜

## 推奨設定まとめ

個人用途なら**Netlify + 基本認証**が最適：

1. **簡単**: GitHubリポジトリ連携のみ
2. **安全**: パスワード保護で十分
3. **無料**: 個人使用レベルなら完全無料
4. **高速**: グローバルCDN
5. **自動**: PR毎のプレビュー環境

次のステップでnetlify.tomlファイルを作成しますか？