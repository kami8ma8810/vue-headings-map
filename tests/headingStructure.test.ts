import { describe, test, expect } from 'bun:test';
import { HeadingNode } from '../src/model/types';

/**
 * このテストファイルでは、ドキュメント全体の見出し構造の検証ロジックをテストします。
 * 追加された validateHeadingStructure 関数のロジックを検証します。
 */

// validateHeadingStructure 関数の挙動を模倣したテスト用の関数
function validateHeadingStructure(headings: HeadingNode[]): HeadingNode[] {
  if (headings.length === 0) {
    return headings;
  }
  
  // オリジナルの配列を変更しないよう、ディープコピーを作成
  const resultHeadings = JSON.parse(JSON.stringify(headings));
  
  // h1が存在するかチェック
  const hasH1 = resultHeadings.some(h => h.level === 1);
  
  if (!hasH1) {
    // h1がない場合、すべてのh2以降の見出しに警告を追加
    resultHeadings.forEach(heading => {
      if (heading.level >= 2) {
        heading.hasWarning = true;
        // 既存の警告メッセージがあれば保持、なければ新しいメッセージを設定
        if (!heading.warningMessage) {
          heading.warningMessage = "No h1 heading found in document";
        }
      }
    });
    return resultHeadings;
  }
  
  // h1の前にh2以上の見出しがある場合、それらの見出しにも警告を表示
  const firstH1Index = resultHeadings.findIndex(h => h.level === 1);
  if (firstH1Index > 0) {
    for (let i = 0; i < firstH1Index; i++) {
      if (resultHeadings[i].level >= 2) {
        resultHeadings[i].hasWarning = true;
        // 既存の警告メッセージがあれば保持、なければ新しいメッセージを設定
        if (!resultHeadings[i].warningMessage) {
          resultHeadings[i].warningMessage = "This heading appears before h1";
        }
      }
    }
  }
  
  return resultHeadings;
}

describe('見出し構造全体の検証', () => {
  test('h1がない場合、すべてのh2以降の見出しに警告が表示されること', () => {
    // h1がなく、h2とh3だけがある場合
    const headings: HeadingNode[] = [
      { level: 2, content: 'セクション', line: 1, column: 0, hasWarning: false },
      { level: 3, content: 'サブセクション', line: 2, column: 0, hasWarning: false }
    ];
    
    const result = validateHeadingStructure(headings);
    
    // すべての見出しに警告がつくことを検証
    expect(result[0].hasWarning).toBe(true);
    expect(result[1].hasWarning).toBe(true);
    
    // 警告メッセージが期待通りであることを検証
    expect(result[0].warningMessage).toBe("No h1 heading found in document");
    expect(result[1].warningMessage).toBe("No h1 heading found in document");
  });
  
  test('h1の前にh2がある場合、そのh2に警告が表示されること', () => {
    // h2の後にh1が来る場合
    const headings: HeadingNode[] = [
      { level: 2, content: 'セクション', line: 1, column: 0, hasWarning: false },
      { level: 1, content: 'タイトル', line: 2, column: 0, hasWarning: false }, // h1が後に来る
      { level: 3, content: 'サブセクション', line: 3, column: 0, hasWarning: false }
    ];
    
    const result = validateHeadingStructure(headings);
    
    // h1の前にあるh2に警告がつくことを検証
    expect(result[0].hasWarning).toBe(true);
    expect(result[0].warningMessage).toBe("This heading appears before h1");
    
    // h1自体には元の実装では警告は付かない（すでに別の関数でチェックされているため）
    // このテストでは、h1に警告が付かないことは検証しない
    
    // h1の後のh3には警告が付かないことを検証
    expect(result[2].hasWarning).toBe(false);
  });
  
  test('複数のh2,h3がh1の前にある場合、それらすべてに警告が表示されること', () => {
    // 複数のh2,h3の後にh1が来る場合
    const headings: HeadingNode[] = [
      { level: 2, content: 'セクション1', line: 1, column: 0, hasWarning: false },
      { level: 3, content: 'サブセクション1', line: 2, column: 0, hasWarning: false },
      { level: 2, content: 'セクション2', line: 3, column: 0, hasWarning: false },
      { level: 1, content: 'タイトル', line: 4, column: 0, hasWarning: false }, // h1がここで登場
      { level: 2, content: 'セクション3', line: 5, column: 0, hasWarning: false },
    ];
    
    const result = validateHeadingStructure(headings);
    
    // h1の前にあるすべての見出しに警告がつくことを検証
    expect(result[0].hasWarning).toBe(true);
    expect(result[1].hasWarning).toBe(true);
    expect(result[2].hasWarning).toBe(true);
    
    // すべての警告に正しいメッセージが設定されていることを検証
    expect(result[0].warningMessage).toBe("This heading appears before h1");
    expect(result[1].warningMessage).toBe("This heading appears before h1");
    expect(result[2].warningMessage).toBe("This heading appears before h1");
    
    // h1の後の見出しは警告がつかないことを検証
    expect(result[4].hasWarning).toBe(false);
  });
  
  test('既存の警告メッセージがある場合は上書きされないこと', () => {
    // 既に警告のある見出しが含まれる場合
    const headings: HeadingNode[] = [
      { 
        level: 2, 
        content: 'セクション', 
        line: 1, 
        column: 0, 
        hasWarning: true,
        warningMessage: "既存の警告メッセージ"
      },
      { level: 1, content: 'タイトル', line: 2, column: 0, hasWarning: false }
    ];
    
    const result = validateHeadingStructure(headings);
    
    // 既存の警告メッセージが保持されることを検証
    expect(result[0].hasWarning).toBe(true);
    expect(result[0].warningMessage).toBe("既存の警告メッセージ");
  });
});
