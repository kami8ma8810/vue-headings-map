import { describe, test, expect } from 'bun:test';

/**
 * このテストファイルでは、JSX/TSX構文内の見出し要素の検出ロジックをテストします。
 * JSX/TSX形式の見出し要素を検出するロジックの正確性を確認します。
 */

// JSX/TSX内の見出し要素を検出する正規表現をテスト
function testJsxHeadingRegex(scriptContent: string): { level: number, found: boolean, isDynamic: boolean }[] {
  const results: { level: number, found: boolean, isDynamic: boolean }[] = [];
  
  // vueParser.tsで使用されている正規表現と同じものを使用
  const jsxHeadingRegex = /<h([1-6])[^>]*>[\s\S]*?<\/h\1>|<Tag[\s\S]*?>[\s\S]*?<\/Tag>/g;
  let match;
  
  while ((match = jsxHeadingRegex.exec(scriptContent)) !== null) {
    const level = parseInt(match[1], 10);
    
    if (!isNaN(level) && level >= 1 && level <= 6) {
      results.push({
        level,
        found: true,
        isDynamic: false
      });
    } else {
      // Tag変数の場合は動的なJSX要素として検出
      results.push({
        level: 1, // デフォルトレベル
        found: true,
        isDynamic: true
      });
    }
  }
  
  return results;
}

describe('JSX/TSX構文の見出し検出', () => {
  test('静的なJSX見出し要素が検出されること', () => {
    // 静的なJSX見出し要素
    const scriptContent = `
      const element = (
        <div>
          <h1>見出し1</h1>
          <p>Content</p>
          <h2>見出し2</h2>
          <h3>見出し3</h3>
        </div>
      );
    `;
    
    // 関数を実行
    const results = testJsxHeadingRegex(scriptContent);
    
    // 3つの見出しタグが検出されることを期待
    expect(results.length).toBe(3);
    
    // 各レベルが正しく検出されているか確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
    
    // 全て静的な見出しであることを確認
    results.forEach(result => {
      expect(result.isDynamic).toBe(false);
    });
  });
  
  test('属性を持つJSX見出し要素が検出されること', () => {
    // 属性を持つJSX見出し要素
    const scriptContent = `
      const element = (
        <div>
          <h1 className="title" id="main-title">メインタイトル</h1>
          <h2 style={{ color: 'blue' }}>サブタイトル</h2>
          <h3 onClick={() => handleClick()}>クリック可能な見出し</h3>
        </div>
      );
    `;
    
    // 関数を実行
    const results = testJsxHeadingRegex(scriptContent);
    
    // 3つの見出しタグが検出されることを期待
    expect(results.length).toBe(3);
    
    // 各レベルが正しく検出されているか確認
    const levels = results.map(r => r.level);
    expect(levels).toContain(1);
    expect(levels).toContain(2);
    expect(levels).toContain(3);
  });
  
  test('動的なTag変数を使用した見出し要素が検出されること', () => {
    // 動的なTag変数を使用するJSX
    const scriptContent = `
      const DynamicHeading = ({ level, children }) => {
        const Tag = \`h\${level}\`;
        return <Tag>{children}</Tag>;
      };
      
      const element = (
        <div>
          <DynamicHeading level={1}>動的な見出し1</DynamicHeading>
          <DynamicHeading level={2}>動的な見出し2</DynamicHeading>
          <Tag>これも動的な見出し</Tag>
        </div>
      );
    `;
    
    // 関数を実行
    const results = testJsxHeadingRegex(scriptContent);
    
    // 少なくとも1つの動的見出しタグが検出されることを期待
    expect(results.filter(r => r.isDynamic).length).toBeGreaterThan(0);
  });

  test('複雑なJSXパターンでも見出しが検出されること', () => {
    // 複雑なJSXパターン
    const scriptContent = `
      const Content = () => {
        const headings = [
          { level: 1, text: '見出し1' },
          { level: 2, text: '見出し2' },
          { level: 3, text: '見出し3' }
        ];
        
        return (
          <article>
            <h1 className="main-title">メイン見出し</h1>
            {headings.map(({ level, text }) => {
              const Tag = \`h\${level}\`;
              return <Tag key={text}>{text}</Tag>;
            })}
            <h4>固定見出し</h4>
            {condition && <h5>条件付き見出し</h5>}
          </article>
        );
      };
    `;
    
    // 関数を実行
    const results = testJsxHeadingRegex(scriptContent);
    
    // 少なくとも2つの静的見出しが検出されることを期待
    const staticHeadings = results.filter(r => !r.isDynamic);
    expect(staticHeadings.length).toBeGreaterThanOrEqual(2);
    
    // 動的見出しが検出されることを期待
    const dynamicHeadings = results.filter(r => r.isDynamic);
    expect(dynamicHeadings.length).toBeGreaterThan(0);
  });
});
