"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVueFile = void 0;
const fs = require("fs");
const settings_1 = require("../model/settings");
// VSCodeの型定義は既にimportされているので追加は不要
/**
 * Vueファイルを解析して見出し要素を抽出する
 */
function parseVueFile(filePath) {
    try {
        // ファイルの内容を読み込む
        const content = fs.readFileSync(filePath, 'utf8');
        // templateタグとscriptタグの内容を抽出
        const templateMatch = content.match(/<template>([\s\S]*?)<\/template>/);
        const scriptMatch = content.match(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/);
        let headings = [];
        // テンプレート部分を解析
        if (templateMatch && templateMatch.index !== undefined) {
            const template = templateMatch[1];
            const lineOffset = getLineOffset(content, templateMatch.index + 10); // <template>の長さを考慮
            headings = extractHeadingsFromTemplate(template, lineOffset);
        }
        // スクリプト部分から動的な見出しコンポーネントの定義を検出
        if (scriptMatch && scriptMatch.index !== undefined) {
            const script = scriptMatch[1];
            const scriptLineOffset = getLineOffset(content, scriptMatch.index + 8); // <script>の長さを考慮
            const scriptHeadings = extractHeadingsFromScript(script, scriptLineOffset);
            headings = [...headings, ...scriptHeadings];
        }
        // 見出し要素の検証を追加実行（h1がないときにh2以降に警告を表示するため）
        validateHeadingStructure(headings);
        return headings;
    }
    catch (err) {
        console.error(`Error parsing Vue file ${filePath}:`, err);
        return [];
    }
}
exports.parseVueFile = parseVueFile;
/**
 * 見出し構造全体を検証し、必要な警告を追加
 */
function validateHeadingStructure(headings) {
    if (headings.length === 0) {
        return;
    }
    console.log("\n==== VALIDATING HEADING STRUCTURE ====");
    console.log(`Found ${headings.length} headings in document`);
    // 見出しを行番号順にソート
    const sortedHeadingsByLine = [...headings].sort((a, b) => a.line - b.line);
    // 行番号付きですべての見出しを表示
    sortedHeadingsByLine.forEach((h, idx) => {
        console.log(`${idx + 1}. h${h.level} at line ${h.line}: "${h.content}"`);
    });
    // ファイル内のすべてのh1とh2以上の見出しを探す
    const h1Headings = headings.filter(h => h.level === 1);
    const h2PlusHeadings = headings.filter(h => h.level >= 2);
    console.log(`Found ${h1Headings.length} h1 headings and ${h2PlusHeadings.length} h2+ headings`);
    // まず、すべての警告をリセット（検証を繰り返し実行する場合に必要）
    headings.forEach(h => {
        h.hasWarning = false;
        h.warningMessage = undefined;
    });
    // ステップ1: h1が存在しない場合の警告
    if (h1Headings.length === 0) {
        console.log("No h1 found - marking all h2+ headings with warning");
        // h1がない場合、すべてのh2以降の見出しに警告を追加
        h2PlusHeadings.forEach(heading => {
            heading.hasWarning = true;
            heading.warningMessage = "No h1 heading found in document";
            console.log(`  Marked h${heading.level} "${heading.content}" with warning`);
        });
    }
    else {
        // h1がある場合、最初のh1の位置を特定
        const firstH1 = sortedHeadingsByLine.find(h => h.level === 1);
        if (firstH1) {
            const firstH1Index = sortedHeadingsByLine.indexOf(firstH1);
            console.log(`First h1 "${firstH1.content}" found at position ${firstH1Index + 1}`);
            // h1の前にh2以上の見出しがある場合、それらの見出しに警告を表示
            if (firstH1Index > 0) {
                // h1より前に配置されている見出しを特定
                const headingsBeforeH1 = sortedHeadingsByLine.slice(0, firstH1Index);
                console.log(`Found ${headingsBeforeH1.length} headings before first h1`);
                // それらの見出しに警告を追加
                for (const heading of headingsBeforeH1) {
                    if (heading.level >= 2) {
                        heading.hasWarning = true;
                        heading.warningMessage = "This heading appears before h1";
                        console.log(`  Marked h${heading.level} "${heading.content}" with warning (before h1)`);
                    }
                }
            }
        }
    }
    // ステップ2: 逆順の見出しレベルをチェック (例: h3 → h2)
    let lastLevel = 0;
    for (const heading of sortedHeadingsByLine) {
        // 逆順チェック: h3の後にh2が来るなど、高いレベルから低いレベルへの移行
        if (lastLevel > heading.level && heading.level > 1) {
            heading.hasWarning = true;
            heading.warningMessage = `Heading level decreased from h${lastLevel} to h${heading.level}`;
            console.log(`  Marked h${heading.level} "${heading.content}" with warning (out of order)`);
        }
        // レベルスキップのチェック (例: h2 → h4)
        if (lastLevel > 0 && heading.level > lastLevel + 1) {
            heading.hasWarning = true;
            heading.warningMessage = `Heading level skipped from h${lastLevel} to h${heading.level}`;
            console.log(`  Marked h${heading.level} "${heading.content}" with warning (level skip)`);
        }
        lastLevel = heading.level;
    }
    // 最終結果をログ出力
    console.log("\n==== FINAL HEADING VALIDATION RESULTS ====");
    headings.forEach(h => {
        const warningStatus = h.hasWarning
            ? `WARNING: ${h.warningMessage}`
            : "OK";
        console.log(`h${h.level} "${h.content}" - ${warningStatus}`);
    });
    console.log("====================================\n");
}
/**
 * コンテンツ内の特定位置までの行数を計算
 */
function getLineOffset(content, index) {
    return content.substring(0, index).split('\n').length - 1;
}
/**
 * テンプレート内の見出し要素を抽出
 */
function extractHeadingsFromTemplate(template, lineOffset) {
    const headings = [];
    let lastLevel = 0;
    // 1. 通常の見出しタグを検索
    const headingRegex = /<h([1-6])(?:\s+[^>]*)?>([\s\S]*?)<\/h\1>/g;
    let match;
    while ((match = headingRegex.exec(template)) !== null) {
        const level = parseInt(match[1], 10);
        const content = cleanContent(match[2]);
        // 見出しレベルの妥当性をチェック
        const hasWarning = checkHeadingLevelValidity(level, lastLevel);
        const warningMessage = hasWarning ?
            `Heading level skipped from h${lastLevel} to h${level}` :
            undefined;
        addHeadingNode(headings, level, content, template, match.index, lineOffset, lastLevel, hasWarning, warningMessage);
        lastLevel = level;
    }
    // 2. 動的コンポーネントのパターン検索
    /*
    // 2.1 <component :is="..."> パターン - 明示的にh1-h6に関連するリテラル文字列のみを検出
    // シングルクォートかダブルクォートを使った文字列リテラルのみにマッチするパターン
    // `:is="h1"` や `:is='h2'` のような文字列リテラルのみを検出
    const hTagPattern = 'h[1-6]';
    const dynamicComponentRegex = new RegExp(`<component\\s+:is=["']${hTagPattern}["']|<component\\s+:is=["']${hTagPattern}\\$\\{(\\d+)\\}["']`, 'g');
    
    // 変数名や式は実行時まで値が不明なため検出しない
    // 例: :is="selectedComponent" や :is="content" のようなものは検出しない
    
    while ((match = dynamicComponentRegex.exec(template)) !== null) {
      // キャプチャグループを確認
      const headingText = match[0];
      // h1-h6を抽出
      const headingMatch = headingText.match(/h([1-6])/);
      
      if (headingMatch && headingMatch[1]) {
        const level = parseInt(headingMatch[1], 10);
        if (level >= 1 && level <= 6) {
          const hasWarning = checkHeadingLevelValidity(level, lastLevel);
          const warningMessage = hasWarning ?
            `Heading level skipped from h${lastLevel} to h${level}` :
            undefined;
          
          addHeadingNode(headings, level, "Dynamic Component", template, match.index, lineOffset, lastLevel, hasWarning, warningMessage);
          lastLevel = level;
        }
      }
    }
    */
    // 2.2 headingLevel 属性パターン
    const headingLevelRegex = /:headingLevel=["'](\d+)["']|headingLevel=["'](\d+)["']/g;
    while ((match = headingLevelRegex.exec(template)) !== null) {
        const level = parseInt(match[1] || match[2], 10);
        if (level >= 1 && level <= 6) {
            const hasWarning = checkHeadingLevelValidity(level, lastLevel);
            const warningMessage = hasWarning ?
                `Heading level skipped from h${lastLevel} to h${level}` :
                undefined;
            addHeadingNode(headings, level, "Dynamic Heading Component", template, match.index, lineOffset, lastLevel, hasWarning, warningMessage);
            lastLevel = level;
        }
    }
    // 2.3 v-if/v-else-if パターン
    const conditionalHeadingRegex = /<h([1-6])\s+v-if|<h([1-6])\s+v-else-if/g;
    while ((match = conditionalHeadingRegex.exec(template)) !== null) {
        const level = parseInt(match[1] || match[2], 10);
        if (level >= 1 && level <= 6) {
            const hasWarning = checkHeadingLevelValidity(level, lastLevel);
            const warningMessage = hasWarning ?
                `Heading level skipped from h${lastLevel} to h${level}` :
                undefined;
            addHeadingNode(headings, level, "Conditional Heading", template, match.index, lineOffset, lastLevel, hasWarning, warningMessage);
            lastLevel = level;
        }
    }
    return headings;
}
/**
 * スクリプト部分から動的な見出し定義を検出
 */
function extractHeadingsFromScript(script, lineOffset) {
    const headings = [];
    // 1. Render関数内の見出し
    const renderHeadingRegex = /h\(\s*['"`]h([1-6])['"`]|createElement\(\s*['"`]h([1-6])['"`]/g;
    let match;
    while ((match = renderHeadingRegex.exec(script)) !== null) {
        const level = parseInt(match[1] || match[2], 10);
        if (level >= 1 && level <= 6) {
            const beforeMatch = script.substring(0, match.index);
            const line = lineOffset + beforeMatch.split('\n').length - 1;
            const lastNewline = beforeMatch.lastIndexOf('\n');
            const column = lastNewline >= 0 ? match.index - lastNewline - 1 : match.index;
            headings.push({
                level,
                content: "Render Function Heading",
                line,
                column,
                hasWarning: false,
                warningMessage: undefined
            });
        }
    }
    // 2. computedプロパティで計算されるheadingTag
    const headingTagRegex = /headingTag.*return\s+[`'"]{1}h\$\{([^}]+)\}[`'"]{1}/g;
    while ((match = headingTagRegex.exec(script)) !== null) {
        const beforeMatch = script.substring(0, match.index);
        const line = lineOffset + beforeMatch.split('\n').length - 1;
        const lastNewline = beforeMatch.lastIndexOf('\n');
        const column = lastNewline >= 0 ? match.index - lastNewline - 1 : match.index;
        headings.push({
            level: 1,
            content: "Computed Heading Tag",
            line,
            column,
            hasWarning: true,
            warningMessage: "Dynamic heading level detected in computed property"
        });
    }
    // 3. JSX/TSX構文
    const jsxHeadingRegex = /<h([1-6])[^>]*>[\s\S]*?<\/h\1>|<Tag[\s\S]*?>[\s\S]*?<\/Tag>/g;
    while ((match = jsxHeadingRegex.exec(script)) !== null) {
        const level = parseInt(match[1], 10);
        const beforeMatch = script.substring(0, match.index);
        const line = lineOffset + beforeMatch.split('\n').length - 1;
        const lastNewline = beforeMatch.lastIndexOf('\n');
        const column = lastNewline >= 0 ? match.index - lastNewline - 1 : match.index;
        if (!isNaN(level) && level >= 1 && level <= 6) {
            headings.push({
                level,
                content: "JSX Heading",
                line,
                column,
                hasWarning: false,
                warningMessage: undefined
            });
        }
        else {
            // Tag変数の場合は動的なJSX要素として検出
            headings.push({
                level: 1,
                content: "Dynamic JSX Heading",
                line,
                column,
                hasWarning: true,
                warningMessage: "Dynamic heading element detected in JSX/TSX"
            });
        }
    }
    return headings;
}
/**
 * 見出しノードをリストに追加するヘルパー関数
 */
function addHeadingNode(headings, level, content, template, matchIndex, lineOffset, lastLevel, hasWarning, warningMessage) {
    // 行番号と列の計算
    const beforeMatch = template.substring(0, matchIndex);
    const line = lineOffset + beforeMatch.split('\n').length - 1;
    const lastNewline = beforeMatch.lastIndexOf('\n');
    const column = lastNewline >= 0 ? matchIndex - lastNewline - 1 : matchIndex;
    // 警告フラグが明示的に指定されていない場合は妥当性をチェック
    if (hasWarning === undefined) {
        hasWarning = checkHeadingLevelValidity(level, lastLevel);
    }
    // 警告メッセージが指定されていない場合はデフォルトのメッセージを使用
    if (hasWarning && warningMessage === undefined) {
        warningMessage = `Heading level skipped from h${lastLevel} to h${level}`;
    }
    headings.push({
        level,
        content,
        line,
        column,
        hasWarning,
        warningMessage
    });
}
/**
 * 見出しレベルの妥当性をチェック
 */
function checkHeadingLevelValidity(currentLevel, lastLevel) {
    const settings = settings_1.SettingsManager.getInstance().getSettings();
    // 初めての見出しの場合
    if (lastLevel === 0) {
        // 最初の見出しがh1でなければ、設定に基づいて警告
        if (currentLevel !== 1 && settings.requireH1AsFirstHeading) {
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
    // 逆順の見出しレベルをチェック（例：h3の後にh2）
    // より大きな番号の見出し（h3、h4など）の後に、より小さな番号の見出し（h2、h3など）が来た場合で、
    // かつ両者が1（h1）でない場合
    if (lastLevel > currentLevel && currentLevel > 1) {
        return true;
    }
    // レベルのスキップをチェック（例：h2の後にh4）（設定に基づいて判断）
    if (currentLevel > lastLevel + 1 && settings.warnOnHeadingLevelSkip) {
        return true;
    }
    return false;
}
/**
 * HTML内容からテキストコンテンツをクリーンアップ
 */
function cleanContent(html) {
    // 簡易的なHTMLタグ除去
    return html.replace(/<[^>]+>/g, '').trim();
}
//# sourceMappingURL=vueParser.js.map