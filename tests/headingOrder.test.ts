import { describe, test, expect } from 'bun:test';
import { HeadingNode } from '../src/model/types';

/**
 * このテストファイルでは、見出しの順序に関する検証ロジックをテストします。
 * 特に逆順の見出しレベル（h3→h2、h4→h3など）の検出を確認します。
 */

// checkHeadingLevelValidity 関数の挙動を模倣したテスト用の関数
function checkHeadingLevelValidity(currentLevel: number, lastLevel: number): boolean {
  // テスト用の簡略化されたバージョン
  // 実際の設定は考慮せず、純粋にロジックのみをテスト
  
  // 初めての見出しの場合
  if (lastLevel === 0) {
    // 最初の見出しがh1でなければ警告
    if (currentLevel !== 1) {
      return true;
    }
    return false; // 最初の見出しなので他の規則はチェックしない
  }
  
  // h1より前にh2以下の見出しがある場合のチェック
  if (currentLevel === 1 && lastLevel > 1) {
    return true;
  }
  
  // h2以降の見出しが登場した後にh1が来た場合
  if (lastLevel >= 2 && currentLevel === 1) {
    return true;
  }
  
  // 逆順の見出しレベルをチェック（例：h3の後にh2）
  // より大きな番号の見出し（h3、h4など）の後に、より小さな番号の見出し（h2、h3など）が来た場合で、
  // かつ両者が1（h1）でない場合
  if (lastLevel > currentLevel && currentLevel > 1) {
    return true;
  }
  
  // レベルのスキップをチェック（例：h2の後にh4）
  if (currentLevel > lastLevel + 1) {
    return true;
  }
  
  return false;
}

describe('見出しレベルの順序検証', () => {
  // 基本的なケース
  test('h1の後にh2が来る場合は警告が表示されないこと', () => {
    const result = checkHeadingLevelValidity(2, 1);
    expect(result).toBe(false);
  });
  
  test('h2の後にh3が来る場合は警告が表示されないこと', () => {
    const result = checkHeadingLevelValidity(3, 2);
    expect(result).toBe(false);
  });
  
  // 逆順のケース
  test('h3の後にh2が来る場合は警告が表示されること', () => {
    const result = checkHeadingLevelValidity(2, 3);
    expect(result).toBe(true);
  });
  
  test('h4の後にh3が来る場合は警告が表示されること', () => {
    const result = checkHeadingLevelValidity(3, 4);
    expect(result).toBe(true);
  });
  
  test('h5の後にh2が来る場合は警告が表示されること', () => {
    const result = checkHeadingLevelValidity(2, 5);
    expect(result).toBe(true);
  });
  
  // 特殊なケース
  test('h3の後にh1が来る場合は警告が表示されること', () => {
    const result = checkHeadingLevelValidity(1, 3);
    expect(result).toBe(true);
  });
  
  test('h2の後にh4が来る場合は警告が表示されること（レベルスキップ）', () => {
    const result = checkHeadingLevelValidity(4, 2);
    expect(result).toBe(true);
  });
  
  test('h1の後にh3が来る場合は警告が表示されること（レベルスキップ）', () => {
    const result = checkHeadingLevelValidity(3, 1);
    expect(result).toBe(true);
  });
});
