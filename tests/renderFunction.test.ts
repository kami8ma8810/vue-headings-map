import { describe, test, expect } from 'bun:test';

/**
 * このテストファイルでは、Render関数内の見出し検出ロジックをテストします。
 * Render関数の見出し検出ロジックをモックなしで直接テストすることで、
 * コアロジックの正確性を確認します。
 */

// Render関数内の見出しを検出する正規表現をテスト
function testRenderHeadingRegex(scriptContent: string): { level: number, found: boolean }[] {
  const results: { level: number, found: boolean }[] = [];
  
  // vueParser.tsで使用されている正規表現と同じものを使用
  const renderHeadingRegex = /h\(\s*['"`]h([1-6])['"`]|createElement\(\s*['"`]h([1-6])['"`]/g;
  let match;
  
  while ((match = renderHeadingRegex.exec(scriptContent)) !== null) {
    const level = parseInt(match[1] || match[2], 10);
    if (level >= 1 && level <= 6) {
      results.push({ level, found: true });
    }
  }
  
  return results;
}

describe('Render関数の見出し検出', () => {
  test('h()関数で定義されたh1-h6の見出しを検出すること', () => {
    // h()関数を使用するスクリプト内容
    const scriptContent = `
      export default {
        render() {
          return h('h1', { class: 'title' }, 'Main Title');
          
          h('h2', {}, 'Subtitle');
          h('h3', {}, 'Section');
          h('h4', {}, 'Subsection');
          h('h5', {}, 'Detail');
          h('h6', {}, 'Minor Detail');
        }
      }
    `;
    
    // 関数を実行
    const results = testRenderHeadingRegex(scriptContent);
    
    // h1-h6の見出しタグがすべて検出されることを期待
    expect(results.length).toBe(6);
    
    // 各レベルが正しく検出されているか確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
    expect(levels).toContain(4);
    expect(levels).toContain(5);
    expect(levels).toContain(6);
  });
  
  test('createElement()関数で定義されたh1-h3の見出しを検出すること', () => {
    // createElement()関数を使用するスクリプト内容
    const scriptContent = `
      export default {
        render(createElement) {
          return createElement('h1', { class: 'title' }, 'Main Title');
          
          createElement('h2', {}, 'Subtitle');
          createElement('h3', {}, 'Section');
        }
      }
    `;
    
    // 関数を実行
    const results = testRenderHeadingRegex(scriptContent);
    
    // h1-h3の見出しタグが検出されることを期待
    expect(results.length).toBe(3);
    
    // 各レベルが正しく検出されているか確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
  });
  
  test('異なる引用符スタイルのh()関数呼び出しが検出されること', () => {
    // 様々な引用符スタイルを使用するスクリプト内容
    const scriptContent = `
      export default {
        render() {
          // シングルクォート
          h('h1', {}, 'Single Quote');
          
          // ダブルクォート
          h("h2", {}, "Double Quote");
          
          // バッククォート
          h(\`h3\`, {}, \`Backtick Quote\`);
          
          // 間にスペースがある場合
          h(  'h4'  , {}, 'Spaces');
        }
      }
    `;
    
    // 関数を実行
    const results = testRenderHeadingRegex(scriptContent);
    
    // 4つの見出しタグが全て検出されること
    expect(results.length).toBe(4);
    
    // 各レベルが正しく検出されているか確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
    expect(levels).toContain(4);
  });
});
