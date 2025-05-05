import { describe, test, expect } from 'bun:test';

/**
 * このテストファイルでは、v-if/v-else-ifによる条件付き見出し要素の検出ロジックをテストします。
 * v-if/v-else-ifを使用した条件付き見出し要素の検出ロジックの正確性を確認します。
 */

// v-if/v-else-ifによる条件付き見出し要素を検出する正規表現をテスト
function testConditionalHeadingRegex(templateContent: string): { level: number, found: boolean }[] {
  const results: { level: number, found: boolean }[] = [];
  
  // vueParser.tsで使用されている正規表現と同じものを使用
  const conditionalHeadingRegex = /<h([1-6])\s+v-if|<h([1-6])\s+v-else-if/g;
  let match;
  
  while ((match = conditionalHeadingRegex.exec(templateContent)) !== null) {
    const level = parseInt(match[1] || match[2], 10);
    if (level >= 1 && level <= 6) {
      results.push({
        level,
        found: true
      });
    }
  }
  
  return results;
}

describe('条件付き見出しの検出', () => {
  test('v-ifディレクティブを持つ見出し要素が検出されること', () => {
    // v-ifを持つテンプレート
    const templateContent = `
      <div>
        <h1 v-if="isMainVisible">メインタイトル</h1>
        <h2 v-if="isSubtitleVisible">サブタイトル</h2>
        <h3 v-if="isSectionVisible">セクション</h3>
      </div>
    `;
    
    // 関数を実行
    const results = testConditionalHeadingRegex(templateContent);
    
    // 3つの条件付き見出しタグが検出されることを期待
    expect(results.length).toBe(3);
    
    // 各レベルが正しく検出されているか確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
  });
  
  test('v-else-ifディレクティブを持つ見出し要素が検出されること', () => {
    // v-else-ifを持つテンプレート
    const templateContent = `
      <div>
        <h1 v-if="level === 1">H1タイトル</h1>
        <h2 v-else-if="level === 2">H2タイトル</h2>
        <h3 v-else-if="level === 3">H3タイトル</h3>
        <h4 v-else>その他のタイトル</h4>
      </div>
    `;
    
    // 関数を実行
    const results = testConditionalHeadingRegex(templateContent);
    
    // v-ifとv-else-ifを持つ見出しタグが検出されることを期待
    // 注：v-elseのみの場合は検出されないため、h4は含まれない
    expect(results.length).toBe(3);
    
    // 各レベルが正しく検出されているか確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
    expect(levels).not.toContain(4); // v-elseだけのh4は検出されない
  });
  
  test('複雑な条件式を持つ見出し要素も検出されること', () => {
    // 複雑な条件式を持つテンプレート
    const templateContent = `
      <div>
        <h1 v-if="user && user.isAdmin && showAdminPanel">管理者向けタイトル</h1>
        <h2 v-else-if="user && user.isLoggedIn">ログインユーザー向けタイトル</h2>
        <h3 v-else>ゲスト向けタイトル</h3>
        
        <h2 v-if="items.length > 0">アイテム一覧</h2>
        <h4 v-if="isVisible && canEdit">編集可能セクション</h4>
      </div>
    `;
    
    // 関数を実行
    const results = testConditionalHeadingRegex(templateContent);
    
    // v-ifとv-else-ifを持つ見出しタグが検出されることを期待
    expect(results.length).toBe(4);
    
    // 各レベルが検出されていることを確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(4);
  });

  test('属性を複数持つ条件付き見出し要素も検出されること', () => {
    // 複数の属性を持つ条件付き見出しを含むテンプレート
    const templateContent = `
      <div>
        <h1 v-if="isVisible" class="title" id="main-title">メインタイトル</h1>
        <h2 v-if="showSubtitle" class="subtitle" @click="handleClick">クリック可能なサブタイトル</h2>
        <h3 v-else-if="showAlternative" :class="{ 'active': isActive }">代替タイトル</h3>
      </div>
    `;
    
    // 関数を実行
    const results = testConditionalHeadingRegex(templateContent);
    
    // 3つの条件付き見出しタグが検出されることを期待
    expect(results.length).toBe(3);
    
    // 各レベルが正しく検出されているか確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
  });
});
