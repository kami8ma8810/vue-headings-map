# VueHeadingsMap

VueHeadingsMapは、Vueプロジェクト内の見出し構造を可視化するためのVSCode/Cursor拡張機能です。

## 特徴

- Vueファイル内の見出し要素（h1-h6）を抽出してツリー表示
- 不適切な見出しレベル（h2の次にh4など）を警告としてハイライト
- 特定ディレクトリをベースとした見出し構造の表示
- 見出しをクリックして対象の位置に移動
- 複雑なコンポーネント階層（入れ子になった子コンポーネントを含む）のサポート

## 使い方

1. VSCodeのサイドバーに表示される「VueHeadingsMap Explorer」アイコンをクリック
2. 自動的にプロジェクトの `src` ディレクトリ内のVueファイルが解析され、見出し構造が表示されます
3. 別のディレクトリを基準にしたい場合は、ツリービューのヘッダーにある「Set Base Directory」ボタンをクリック
4. 見出しをクリックすると、対応するファイルの該当位置に移動します
5. 警告アイコン（⚠️）が表示されている見出しは、見出しレベルの階層が不適切な箇所を示しています

## デモ

このリポジトリには、VueHeadingsMapがさまざまなコンポーネント構造をどのように処理するかを示すいくつかのVueデモコンポーネントが含まれています：

- `demo/DemoComponent.vue`: 基本的なVueコンポーネントと見出し構造
- `demo/ChildComponent.vue`: 子コンポーネントの見出しを示します
- `demo/GrandchildComponent.vue`: 深くネストされたコンポーネントの見出しを表示
- `demo/ParentWithChildren.vue`: 子コンポーネントを持つ親コンポーネント
- `demo/ComplexParentComponent.vue`: 複数の子コンポーネントと孫コンポーネントを持つ複雑な構造

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

## ライセンス

MIT
