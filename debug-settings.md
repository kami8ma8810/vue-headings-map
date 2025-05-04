# デバッグモードでの設定変更方法

デバッグモードでVue Headings Mapの設定を変更する方法は以下の通りです：

## VSCodeの設定UIから変更する方法

1. デバッグウィンドウ（F5で起動した新しいVSCodeウィンドウ）を開いた状態で
2. メニューから「ファイル」 > 「基本設定」 > 「設定」を選択
3. 検索バーに「vueHeadingsMap」と入力
4. 表示される設定項目を変更：
   - `vueHeadingsMap.requireH1AsFirstHeading`: 最初の見出しがh1である必要があるかどうか
   - `vueHeadingsMap.warnOnHeadingLevelSkip`: 見出しレベルのスキップを警告するかどうか

## settings.jsonを直接編集する方法

1. デバッグウィンドウで、メニューから「ファイル」 > 「基本設定」 > 「設定」を選択
2. 右上の「{}」アイコン（JSONを開く）をクリック
3. `settings.json`に以下の設定を追加：

```json
{
  "vueHeadingsMap.requireH1AsFirstHeading": false,
  "vueHeadingsMap.warnOnHeadingLevelSkip": true
}
```

## 即時反映について

- 設定を変更すると、設定マネージャーが自動的に変更を検知します
- 次回のファイル解析時に新しい設定が適用されます
- 手動で即時反映させるには、エクスプローラービューの「Refresh Headings」ボタンをクリックします

## デバッグ用の設定例

### 例1: h2から始めることを許可（h1スキップを許可）
```json
{
  "vueHeadingsMap.requireH1AsFirstHeading": false
}
```

### 例2: すべての見出しレベル検証を無効化
```json
{
  "vueHeadingsMap.requireH1AsFirstHeading": false,
  "vueHeadingsMap.warnOnHeadingLevelSkip": false
}
```
