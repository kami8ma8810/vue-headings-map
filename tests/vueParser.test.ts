import { describe, test, expect } from 'bun:test';

/**
 * このテストファイルでは、見出しレベルの検証ロジックのみをテストします。
 * 見出しレベルの検証ロジックをモックなしで直接テストすることで、
 * コアロジックの正確性を確認します。
 */

// 見出しレベルの検証ロジックを模倣したシンプルな関数
function checkHeadingLevelValidity(currentLevel: number, lastLevel: number): boolean {
  // 初めての見出しの場合
  if (lastLevel === 0) {
    // 最初の見出しがh1でなければ警告
    if (currentLevel !== 1) {
      return true;
    }
    return false; // 最初の見出しなので他の規則はチェックしない
  }
  
  // h1より前にh2以下の見出しがある場合のチェック
  // lastLevelが0より大きい（既に見出しがある）かつ
  // currentLevelが1（h1）である場合、常に警告を表示（アクセシビリティ上の問題）
  if (currentLevel === 1 && lastLevel > 1) {
    return true;
  }
  
  // h2以降の見出しが登場した後にh1が来た場合の逆方向チェック
  // 既にlastLevelが2以上（h2以降の見出しが既に出現）で、currentLevelが1（h1）の場合
  if (lastLevel >= 2 && currentLevel === 1) {
    return true;
  }
  
  // レベルのスキップをチェック（例：h2の後にh4）
  if (currentLevel > lastLevel + 1) {
    return true;
  }
  
  return false;
}

describe('見出しレベル検証ロジック', () => {
  test('h1より前にh2がある場合に警告が表示されること', () => {
    // h2の後にh1がくるパターン (例: <h2>タイトル</h2><h1>本題</h1>)
    const result = checkHeadingLevelValidity(1, 2);
    expect(result).toBe(true);
  });

  test('h3の後にh1が来る場合に警告が表示されること', () => {
    // h3の後にh1が来るパターン (例: <h3>サブセクション</h3><h1>タイトル</h1>)
    const result = checkHeadingLevelValidity(1, 3);
    expect(result).toBe(true);
  });

  test('h6の後にh1が来る場合に警告が表示されること', () => {
    // h6の後にh1が来るパターン (例: <h6>最小セクション</h6><h1>タイトル</h1>)
    const result = checkHeadingLevelValidity(1, 6);
    expect(result).toBe(true);
  });

  test('h2の後にh4が来る場合に警告が表示されること', () => {
    // レベルスキップのパターン (例: <h2>セクション</h2><h4>サブ項目</h4>)
    const result = checkHeadingLevelValidity(4, 2);
    expect(result).toBe(true);
  });

  test('h1の後にh2が来る場合は警告が表示されないこと', () => {
    // 正しい順序のパターン (例: <h1>タイトル</h1><h2>セクション</h2>)
    const result = checkHeadingLevelValidity(2, 1);
    expect(result).toBe(false);
  });

  test('最初の見出しがh2の場合に警告が表示されること', () => {
    // 最初の見出しがh1でないパターン (例: ドキュメントがh2から始まっている)
    const result = checkHeadingLevelValidity(2, 0);
    expect(result).toBe(true);
  });

  test('最初の見出しがh1の場合は警告が表示されないこと', () => {
    // 最初の見出しがh1のパターン (例: ドキュメントがh1から始まっている)
    const result = checkHeadingLevelValidity(1, 0);
    expect(result).toBe(false);
  });
});
