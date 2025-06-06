# VueHeadingsMap

VueHeadingsMapは、Vueプロジェクト内の見出し構造を可視化するためのVSCode/Cursor拡張機能です。

## 特徴

- Vueファイル内の見出し要素（h1-h6）を抽出してツリー表示
- 不適切な見出しレベル（h2の次にh4など）を警告としてハイライト
- h1より前に配置されたh2-h6タグに警告表示（アクセシビリティ上の問題）
- 特定ディレクトリをベースとした見出し構造の表示
- 見出しをクリックして対象の位置に移動
- 複雑なコンポーネント階層（入れ子になった子コンポーネントを含む）のサポート
- さまざまな動的見出しパターンの検出：
  - `:headingLevel` プロパティ
  - JSX/TSX形式の見出し
  - `h()` または `createElement()` を使用したRender関数
  - 見出しタグを返すcomputed プロパティ
  - v-if/v-else-ifを使用した条件付き見出し

## 使い方

1. VSCodeのサイドバーに表示される「VueHeadingsMap Explorer」アイコンをクリック
2. 自動的にプロジェクトの `src` ディレクトリ内のVueファイルが解析され、見出し構造が表示されます
3. 別のディレクトリを基準にしたい場合は、ツリービューのヘッダーにある「Set Base Directory」ボタンをクリック
4. 見出しをクリックすると、対応するファイルの該当位置に移動します
5. 警告アイコン（⚠️）が表示されている見出しは、見出しレベルの階層が不適切な箇所を示しています

## 設定

VSCode設定を通じて拡張機能の動作をカスタマイズできます：

1. VSCode設定（ファイル > 設定 > 設定）を開く
2. 「Vue Headings Map」を検索
3. 次のオプションを設定：

| 設定 | 説明 | デフォルト |
|---------|-------------|---------|
| `vueHeadingsMap.requireH1AsFirstHeading` | ファイル内の最初の見出しがh1であることを要求します。無効にすると、警告なしに任意の見出しレベルから始めることができます。 | `true` |
| `vueHeadingsMap.warnOnHeadingLevelSkip` | 見出しレベルがスキップされた場合に警告を表示します（例：h2の後にh4）。 | `true` |

## デモ

このリポジトリには、VueHeadingsMapがさまざまなコンポーネント構造をどのように処理するかを示すいくつかのVueデモコンポーネントが含まれています：

- `demo/DemoComponent.vue`: 基本的なVueコンポーネントと見出し構造
- `demo/ChildComponent.vue`: 子コンポーネントの見出しを示します
- `demo/GrandchildComponent.vue`: 深くネストされたコンポーネントの見出しを表示
- `demo/ParentWithChildren.vue`: 子コンポーネントを持つ親コンポーネント
- `demo/ComplexParentComponent.vue`: 複数の子コンポーネントと孫コンポーネントを持つ複雑な構造
- `demo/DynamicHeading.vue`: `:is`を使用して動的な見出しレベルをレンダリングするコンポーネント
- `demo/DynamicHeadingDemo.vue`: 動的見出しコンポーネントの使用例を示すデモ

これらのデモファイルを使用して拡張機能をテストし、コンポーネント間の見出し構造をどのように可視化するかを確認できます。

### スクリーンショット

これらのデモファイルを使用すると、サイドバーにすべての見出しをツリー構造で表示し、不適切な見出しレベル階層には警告が表示されます：

![VueHeadingsMapデモ](https://github.com/kami8ma8810/vue-headings-map/raw/main/demo/screenshots/demo-screenshot.png)

注：スクリーンショットは拡張機能をインストールして実行した後に表示されます。実際の画面は多少異なる場合があります。

## 開発

### 前提条件

- Node.js 
- npm/yarn

### セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発モードでの実行
npm run watch

# F5キーで新しいVSCodeウィンドウでデバッグ実行
```

### ビルド

```bash
# 拡張機能のパッケージング
npm run vscode:prepublish
```

## バージョン履歴

### 0.0.6
- h1より前に出現するh2-h6タグに警告を表示するよう見出しレベルの検証を強化
- より良いアクセシビリティガイダンスのためのドキュメント構造検証の改善

### 0.0.5
- 見出しレベルの検証を改善し、h1タグがどの見出しレベル（h2-h6）の後に出現しても検出できるように
- すべての動的見出しパターンに対する包括的なテストスイートを追加
- 一時的に無効化された機能に関する参照をドキュメントから削除
- 互換性向上のためにコンポーネントの型定義を修正

### 0.0.4
- アクセシビリティ向上のための見出し構造検証の改善
- h2タグの後にh1タグが出現する場合の警告システムを強化
- 実際の見出し要素に焦点を当てた動的タグ検出の最適化
- パフォーマンス向上のためのコンポーネント解決方法の修正

### 0.0.3
- Cursorエディタ（v0.49.6+）をサポートするためにVSCodeエンジン要件を変更
- より広い互換性のためにVSCode要件をv1.99.1からv1.60.0に引き下げ
- 新しいエンジン要件に合わせて型定義を修正

### 0.0.2
- 最初の公開リリース
- 複雑なコンポーネント階層のサポートを追加
- 動的な見出しパターンのサポートを追加

### 0.0.1
- 初期開発バージョン
- 基本的な見出し抽出と可視化

## ライセンス

MIT
