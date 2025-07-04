# PromptForge テスト仕様書

## 概要

PromptForgeプロジェクトのテスト仕様書です。TDD（テスト駆動開発）アプローチに従い、すべての機能にテストを実装しています。

## テスト戦略

### テストレベル

1. **単体テスト (Unit Tests)**
   - 対象: 個別の関数、コンポーネント、サービス
   - フレームワーク: Jest + React Testing Library
   - カバレッジ目標: 85%以上

2. **統合テスト (Integration Tests)**
   - 対象: コンポーネント間の連携
   - フレームワーク: Jest + React Testing Library

3. **E2Eテスト (End-to-End Tests)**
   - 対象: ユーザージャーニー全体
   - フレームワーク: Playwright

### テスト環境

- **実行環境**: Node.js + jsdom
- **IndexedDBモック**: fake-indexeddb
- **並行実行**: Jest並行実行対応
- **CI/CD**: GitHub Actions対応

## テストファイル構造

```
src/
├── __tests__/           # アプリレベルテスト
│   └── App.test.tsx
├── services/
│   └── __tests__/       # サービスレイヤーテスト
│       ├── database.test.ts
│       ├── knowledgeService.test.ts
│       └── error-handling.test.ts
└── components/
    └── __tests__/       # コンポーネントテスト
e2e/                     # E2Eテスト
└── app.spec.ts
```

## 詳細テスト仕様

### 1. Database Tests (`database.test.ts`)

#### テスト対象
- IndexedDB初期化機能
- データベース接続管理
- オブジェクトストア作成

#### テストケース

| No | テスト名 | 目的 | 期待結果 |
|----|----------|------|----------|
| DB-001 | should create database with correct version | DBバージョン確認 | 指定バージョンでDB作成 |
| DB-002 | should create knowledge object store | オブジェクトストア作成 | 'knowledge'ストア存在 |
| DB-003 | should create indexes on knowledge store | インデックス作成確認 | 必要インデックス存在 |
| DB-004 | should handle database upgrade | DBアップグレード | バージョン管理正常 |
| DB-005 | should reuse existing connection | 接続再利用 | 同一インスタンス返却 |

### 2. Knowledge Service Tests (`knowledgeService.test.ts`)

#### テスト対象
- CRUD操作（作成・読取・更新・削除）
- 検索機能
- データバリデーション

#### テストケース

| No | テスト名 | 目的 | 期待結果 |
|----|----------|------|----------|
| KS-001 | should create a new knowledge item | 知識作成 | 新規知識アイテム作成成功 |
| KS-002 | should retrieve a knowledge item by ID | ID検索 | 指定IDの知識取得 |
| KS-003 | should return null for non-existent ID | 存在しないID | null返却 |
| KS-004 | should update an existing knowledge item | 知識更新 | 部分更新成功 |
| KS-005 | should delete an existing knowledge item | 知識削除 | 削除後null取得 |
| KS-006 | should return empty array for empty query | 空クエリ検索 | 空配列返却 |

### 3. Error Handling Tests (`error-handling.test.ts`)

#### テスト対象
- データバリデーション
- エラーハンドリング
- データ整合性

#### テストケース

| No | テスト名 | 目的 | 期待結果 |
|----|----------|------|----------|
| EH-001 | should validate required fields | 必須フィールド検証 | バリデーションエラー |
| EH-002 | should handle invalid ID formats | 不正ID処理 | null返却 |
| EH-003 | should handle partial updates safely | 部分更新安全性 | データ整合性保持 |
| EH-004 | should not allow deletion of non-existent items | 存在しない削除 | false返却 |
| EH-005 | should maintain data consistency after errors | データ整合性 | エラー後も一貫性保持 |

### 4. App Component Tests (`App.test.tsx`)

#### テスト対象
- Reactコンポーネントレンダリング
- 基本UI表示

#### テストケース

| No | テスト名 | 目的 | 期待結果 |
|----|----------|------|----------|
| AC-001 | should render the app title | タイトル表示 | "PromptForge"表示 |
| AC-002 | should render the app subtitle | サブタイトル表示 | サブタイトル表示 |

### 5. E2E Tests (`app.spec.ts`)

#### テスト対象
- ページ全体の動作
- ユーザーインタラクション

#### テストケース

| No | テスト名 | 目的 | 期待結果 |
|----|----------|------|----------|
| E2E-001 | has title | ページタイトル | HTMLタイトル確認 |
| E2E-002 | displays main heading | メインヘッダー | h1要素表示確認 |

## テスト実行コマンド

### 基本実行
```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き実行
npm run test:coverage
```

### 個別実行
```bash
# 特定ファイルのテスト
npm test -- database.test.ts

# 特定パターンのテスト
npm test -- --testNamePattern="create"

# E2Eテスト
npm run test:e2e
```

### デバッグ実行
```bash
# 詳細出力
npm test -- --verbose

# シーケンシャル実行
npm test -- --runInBand

# タイムアウト調整
npm test -- --testTimeout=30000
```

## カバレッジ基準

### 目標カバレッジ
- **全体**: 85%以上
- **重要機能**: 95%以上

### 現在のカバレッジ
- **Statements**: 65.81%
- **Branches**: 58.33%
- **Functions**: 76.47%
- **Lines**: 66.07%

### カバレッジ除外
- 型定義ファイル (.d.ts)
- エントリーポイント (main.tsx)
- 設定ファイル (vite-env.d.ts)

## モック戦略

### IndexedDB
- **ライブラリ**: fake-indexeddb
- **目的**: ブラウザAPIのNode.js環境モック
- **設定**: setupTests.tsで自動設定

### structuredClone
- **実装**: JSON.parse(JSON.stringify())
- **目的**: Node.js 16以下での互換性

## CI/CD統合

### GitHub Actions
- **実行タイミング**: PR作成・更新時
- **テストタイムアウト**: 10分
- **失敗時**: PRマージブロック

### 品質ゲート
1. 全テスト成功
2. カバレッジ基準達成
3. ESLintエラーなし
4. TypeScriptエラーなし

## テストデータ

### モックデータ構造
```typescript
const mockKnowledgeItem: CreateKnowledgeItem = {
  humanReadable: {
    title: 'Test Knowledge',
    description: 'Test description',
    personalNotes: 'Personal notes',
    tags: ['test', 'example'],
    usageScenarios: ['testing'],
    examples: []
  },
  aiReadable: {
    technique: 'Test Technique',
    category: 'Testing',
    template: 'Test template',
    parameters: {},
    constraints: [],
    effectiveness: {
      averageSatisfaction: 4.5,
      totalUses: 10,
      successfulUses: 9,
      failedUses: 1
    }
  },
  relations: {
    relatedTechniques: [],
    prerequisites: [],
    alternatives: []
  }
}
```

## トラブルシューティング

### よくある問題

1. **タイムアウトエラー**
   ```bash
   # 解決方法: タイムアウト時間延長
   npm test -- --testTimeout=30000
   ```

2. **IndexedDBエラー**
   ```bash
   # 解決方法: setupTests.ts確認
   # fake-indexeddbが正しく設定されているか確認
   ```

3. **並行実行エラー**
   ```bash
   # 解決方法: シーケンシャル実行
   npm test -- --runInBand
   ```

### デバッグ方法

1. **詳細ログ確認**
   ```bash
   npm test -- --verbose --no-cache
   ```

2. **個別テスト実行**
   ```bash
   npm test -- --testPathPattern=specific-test.ts
   ```

3. **ハンドルリーク確認**
   ```bash
   npm test -- --detectOpenHandles
   ```

## メンテナンス

### 定期的な作業
- テストカバレッジの確認・改善
- テストケースの追加・更新
- モックデータの最新化
- パフォーマンステストの追加

### アップデート時の対応
- Jestバージョンアップ時の設定確認
- React Testing Libraryの最新化
- fake-indexeddbの互換性確認