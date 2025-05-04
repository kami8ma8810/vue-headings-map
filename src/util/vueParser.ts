import * as fs from 'fs';
import * as path from 'path';
import { HeadingNode } from '../model/types';
// domUtilsは実際には使用していないので削除

// Vueファイルを解析して見出し要素を抽出する
export function parseVueFile(filePath: string): HeadingNode[] {
  try {
    // ファイルの内容を読み込む
    const content = fs.readFileSync(filePath, 'utf8');
    
    // templateタグの内容を抽出
    const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
    if (!templateMatch || templateMatch.index === undefined) {
      return [];
    }
    
    const template = templateMatch[1];
    const lineOffset = getLineOffset(content, templateMatch.index + 10); // <template>の長さを考慮
    
    // 見出し要素を抽出して返す
    return extractHeadings(template, lineOffset);
  } catch (err) {
    console.error(`Error parsing Vue file ${filePath}:`, err);
    return [];
  }
}

// コンテンツ内の特定位置までの行数を計算
function getLineOffset(content: string, index: number): number {
  return content.substring(0, index).split('\n').length - 1;
}

// テンプレート内の見出し要素を抽出
function extractHeadings(template: string, lineOffset: number): HeadingNode[] {
  const headings: HeadingNode[] = [];
  let lastLevel = 0;
  
  // 1. 通常の見出しタグを検索
  const headingRegex = /<h([1-6])(?:\s+[^>]*)?>([\s\S]*?)<\/h\1>/g;
  let match;
  
  while ((match = headingRegex.exec(template)) !== null) {
    const level = parseInt(match[1], 10);
    const content = cleanContent(match[2]);
    
    // 見出しの行番号を計算
    const beforeMatch = template.substring(0, match.index);
    const line = lineOffset + beforeMatch.split('\n').length - 1;
    
    // 行内の列位置を計算
    const lastNewline = beforeMatch.lastIndexOf('\n');
    const column = lastNewline >= 0 ? match.index - lastNewline - 1 : match.index;
    
    // 見出しレベルの妥当性をチェック
    const hasWarning = checkHeadingLevelValidity(level, lastLevel);
    const warningMessage = hasWarning ? 
      `Heading level skipped from h${lastLevel} to h${level}` : 
      undefined;
    
    headings.push({
      level,
      content,
      line,
      column,
      hasWarning,
      warningMessage
    });
    
    lastLevel = level;
  }
  
  // 2. 動的コンポーネントを検索 (<component :is="hN"> or <component :is="`h${N}`"> パターン)
  const dynamicComponentRegex = /<component\s+:is=["'`]h([1-6])["'`]|<component\s+:is=["'`]h\$\{(\d+)\}["'`]|:headingLevel=["'](\d+)["']/g;
  while ((match = dynamicComponentRegex.exec(template)) !== null) {
    // マッチしたグループから数値を取得（実際の見出しレベル）
    const level = parseInt(match[1] || match[2] || match[3], 10);
    
    if (level >= 1 && level <= 6) {
      // 行番号と列の計算は通常の見出しと同様
      const beforeMatch = template.substring(0, match.index);
      const line = lineOffset + beforeMatch.split('\n').length - 1;
      const lastNewline = beforeMatch.lastIndexOf('\n');
      const column = lastNewline >= 0 ? match.index - lastNewline - 1 : match.index;
      
      // 見出しの内容を抽出するため、終了タグを探す
      // ここでは単純化のため、「Dynamic Component」という固定テキストを使用
      const content = "Dynamic Component";
      
      // 見出しレベルの妥当性をチェック
      const hasWarning = checkHeadingLevelValidity(level, lastLevel);
      const warningMessage = hasWarning ? 
        `Heading level skipped from h${lastLevel} to h${level}` : 
        undefined;
      
      headings.push({
        level,
        content,
        line,
        column,
        hasWarning,
        warningMessage
      });
      
      lastLevel = level;
    }
  }
  
  return headings;
}

// 見出しレベルの妥当性をチェック
function checkHeadingLevelValidity(currentLevel: number, lastLevel: number): boolean {
  // 最初の見出しはh1であるべき
  if (lastLevel === 0 && currentLevel !== 1) {
    return true;
  }
  
  // レベルのスキップをチェック（例：h2の後にh4）
  if (lastLevel > 0 && currentLevel > lastLevel + 1) {
    return true;
  }
  
  return false;
}

// HTML内容からテキストコンテンツをクリーンアップ
function cleanContent(html: string): string {
  // 簡易的なHTMLタグ除去（実際の実装では構文解析が必要かもしれません）
  return html.replace(/<[^>]+>/g, '').trim();
}

// DOMユーティリティ（将来的にはより高度な解析に）
// 既にdomUtilsをインポートしているため、こちらは削除
