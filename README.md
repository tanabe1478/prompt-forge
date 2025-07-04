# PromptForge

人間とAIが協働して生成AI/LLMに関する知識を蓄積・活用するための知識ベース管理アプリケーション

## 概要

PromptForgeは、プロンプトエンジニアリングやLLM活用のノウハウを効率的に管理・検索・活用するためのWebアプリケーションです。学習した知識を実践で即座に引き出し、AIとの対話を通じて最適なプロンプトや手法を発見できます。

### 主な機能

- **知識管理**: 人間向け・AI向けのハイブリッド形式での知識保存
- **曖昧検索**: リアルタイムでタイプミスに強い検索機能
- **AI協働**: 知識ベース参照型プロンプト生成・改善支援
- **データ可視化**: 使用頻度・学習進捗の可視化

## 技術スタック

### フロントエンド
- **React** 18.2.0 - UIライブラリ
- **TypeScript** 5.2.2 - 型安全性
- **Vite** 5.0.8 - ビルドツール
- **Tailwind CSS** 3.3.0 - スタイリング

### データベース・検索
- **IndexedDB** - ブラウザローカルストレージ
- **idb** 8.0.0 - IndexedDBライブラリ
- **asearch** 1.0.0 - 曖昧検索エンジン

### 可視化
- **Chart.js** 4.4.1 - グラフ描画
- **react-chartjs-2** 5.2.0 - React統合

### 開発・テスト
- **Jest** 29.7.0 - 単体テスト
- **React Testing Library** 14.1.2 - コンポーネントテスト
- **Playwright** 1.40.1 - E2Eテスト
- **ESLint** 8.55.0 - 静的解析
- **Prettier** 3.1.1 - コードフォーマット

## 環境要件

### 必須環境
- **Node.js**: 18.0.0以上（推奨: 20.x LTS）
- **npm**: 9.0.0以上
- **ブラウザ**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 推奨環境
- **Node.js**: 22.14.0
- **npm**: 10.9.2
- **OS**: Windows 10+, macOS 12+, Ubuntu 20.04+

### ブラウザサポート
- IndexedDB対応ブラウザ（IE11非対応）
- ES2020対応ブラウザ
- WebAssembly対応ブラウザ

## セットアップ

### 1. リポジトリクローン
```bash
git clone https://github.com/your-username/prompt-forge.git
cd prompt-forge
```

### 2. 依存関係インストール
```bash
npm install
```

### 3. 環境変数設定（オプション）
```bash
# .env.local ファイルを作成
cp .env.example .env.local

# 必要に応じて環境変数を設定
VITE_API_KEY=your_api_key_here
```

## 開発

### 開発サーバー起動
```bash
npm run dev
```
ブラウザで http://localhost:5173 にアクセス

### IndexedDB動作確認
1. 開発サーバー起動後、ブラウザでアプリを開く
2. 「テストデータ作成」ボタンをクリック
3. 「全データ読み込み」ボタンで動作確認
4. ブラウザのDevTools > Application > IndexedDB で直接確認可能

### 開発用コマンド
```bash
# 型チェック
npm run typecheck

# リント実行
npm run lint

# フォーマット実行
npm run format

# フォーマットチェック
npm run format:check
```

## テスト

### テスト実行
```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き実行
npm run test:coverage

# E2Eテスト
npm run test:e2e

# E2EテストUI
npm run test:e2e:ui
```

### テスト構成
- **単体テスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright
- **カバレッジ目標**: 85%以上
- **テスト環境**: fake-indexeddb使用

詳細は [TEST_SPECIFICATION.md](TEST_SPECIFICATION.md) を参照

## ビルド・デプロイ

### プロダクションビルド
```bash
npm run build
```
`dist/`ディレクトリに出力

### ビルド確認
```bash
npm run preview
```
ビルド結果を http://localhost:4173 で確認

### 静的ファイル配置
```bash
# ビルド後のファイルをWebサーバーに配置
cp -r dist/* /path/to/web/server/
```

### デプロイ対応
- **Vercel**: 自動デプロイ対応
- **Netlify**: 自動デプロイ対応
- **GitHub Pages**: `npm run build` → `dist/`配置
- **AWS S3**: 静的サイトホスティング
- **Docker**: Dockerfile提供予定

## プロジェクト構造

```
prompt-forge/
├── public/                 # 静的ファイル
├── src/
│   ├── components/         # Reactコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── services/          # データアクセス・API
│   │   ├── database.ts    # IndexedDB初期化
│   │   └── knowledgeService.ts  # CRUD操作
│   ├── types/             # TypeScript型定義
│   ├── utils/             # ユーティリティ関数
│   ├── stores/            # 状態管理
│   └── __tests__/         # テストファイル
├── e2e/                   # E2Eテスト
├── docs/                  # ドキュメント
├── .github/               # GitHub Actions
└── dist/                  # ビルド出力（生成）
```

## 開発フロー

### git-flow使用
```bash
# 新機能開発
git checkout develop
git checkout -b feature/your-feature-name

# 開発・テスト・コミット
npm test
git add .
git commit -m "feat: your feature description"

# プッシュ・PR作成
git push -u origin feature/your-feature-name
```

### TDD開発サイクル
1. **Red**: 失敗するテストを書く
2. **Green**: テストを通すための最小実装
3. **Refactor**: コードを改善する

### コミット規約
- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `style:` フォーマット変更
- `refactor:` リファクタリング
- `test:` テスト追加・修正
- `chore:` その他の変更

## API仕様

### KnowledgeItem型
```typescript
interface KnowledgeItem {
  id: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
  };
  humanReadable: {
    title: string;
    description: string;
    personalNotes: string;
    tags: string[];
    usageScenarios: string[];
    examples: Example[];
  };
  aiReadable: {
    technique: string;
    category: string;
    template: string;
    parameters: Record<string, unknown>;
    constraints: string[];
    effectiveness: EffectivenessMetrics;
  };
  usage: {
    count: number;
    lastUsed: Date;
    successRate: number;
    contexts: UsageContext[];
  };
  relations: {
    relatedTechniques: string[];
    prerequisites: string[];
    alternatives: string[];
  };
}
```

### サービス関数
```typescript
// CRUD操作
createKnowledge(item: CreateKnowledgeItem): Promise<KnowledgeItem>
getKnowledge(id: string): Promise<KnowledgeItem | null>
getAllKnowledge(): Promise<KnowledgeItem[]>
updateKnowledge(id: string, updates: UpdateKnowledgeItem): Promise<KnowledgeItem | null>
deleteKnowledge(id: string): Promise<boolean>

// 検索
searchKnowledge(options: SearchOptions): Promise<SearchResult[]>
```

## トラブルシューティング

### よくある問題

#### 1. インストールエラー
```bash
# キャッシュクリア
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScriptエラー
```bash
# 型チェック実行
npm run typecheck

# VSCodeでTypeScript再起動
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

#### 3. テスト失敗
```bash
# テストキャッシュクリア
npm test -- --no-cache

# 個別テスト実行
npm test -- database.test.ts

# 詳細ログ
npm test -- --verbose
```

#### 4. IndexedDBエラー
```bash
# ブラウザのIndexedDBをクリア
# DevTools > Application > Storage > Clear storage

# テスト環境確認
npm test -- --testPathPattern=database.test.ts
```

#### 5. ビルドエラー
```bash
# 依存関係確認
npm ls

# 型エラー確認
npm run typecheck

# ESLintエラー確認
npm run lint
```

### パフォーマンス最適化

#### 開発時
- HMR（Hot Module Replacement）対応
- TypeScript型チェック高速化
- ESLintキャッシュ利用

#### 本番時
- Tree Shaking対応
- コード分割（Lazy Loading）
- 画像最適化
- Bundle Analyzer使用可能

### ブラウザ対応
- **モダンブラウザ**: 完全対応
- **IndexedDB必須**: IE11非対応
- **PWA対応**: 今後追加予定

## コントリビューション

### 開発参加
1. Issueの作成・確認
2. フィーチャーブランチでの開発
3. テストの追加・実行
4. プルリクエストの作成
5. コードレビュー

### コーディング規約
- TypeScript strict mode
- ESLint + Prettier
- テストカバレッジ85%以上
- コンポーネント設計原則遵守

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

## サポート・連絡先

- **Issues**: [GitHub Issues](https://github.com/your-username/prompt-forge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/prompt-forge/discussions)
- **Wiki**: [プロジェクトWiki](https://github.com/your-username/prompt-forge/wiki)

## ロードマップ

### Phase 1: 基本機能（現在）
- [x] プロジェクト初期化
- [x] IndexedDBセットアップ
- [x] 基本CRUD操作
- [ ] 基本UIコンポーネント

### Phase 2: 核心機能
- [ ] 曖昧検索エンジン（asearch）
- [ ] 知識エディター
- [ ] リアルタイム検索

### Phase 3: 高度な機能
- [ ] AI API連携
- [ ] データ可視化
- [ ] エクスポート機能
- [ ] PWA対応

詳細は [PROGRESS.md](PROGRESS.md) を参照