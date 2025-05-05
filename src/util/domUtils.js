"use strict";
// DOM解析のためのユーティリティ関数
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttribute = exports.extractTextContent = exports.findNodes = void 0;
/**
 * 指定したタグ名を持つノードを検索します
 *
 * @param content HTML文字列またはDOMノード
 * @param tagName 検索するタグ名
 * @returns 見つかったノードの配列
 */
function findNodes(content, tagName) {
    // 簡易実装：実際には parse5 などのパーサーを利用して正確に解析する
    if (typeof content === 'string') {
        const regex = new RegExp(`<${tagName}[^>]*>(.*?)</${tagName}>`, 'g');
        const results = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            results.push({
                tag: tagName,
                content: match[1],
                fullMatch: match[0],
                index: match.index
            });
        }
        return results;
    }
    return [];
}
exports.findNodes = findNodes;
/**
 * ノードからテキストコンテンツを抽出します
 *
 * @param node DOMノードまたはHTMLコンテンツ
 * @returns テキストコンテンツ
 */
function extractTextContent(node) {
    if (typeof node === 'string') {
        // HTMLタグを取り除く
        return node.replace(/<[^>]+>/g, '').trim();
    }
    if (node && node.content) {
        return extractTextContent(node.content);
    }
    if (node && node.fullMatch) {
        return extractTextContent(node.fullMatch);
    }
    return '';
}
exports.extractTextContent = extractTextContent;
/**
 * ノードの属性を取得します
 *
 * @param node DOMノードまたはHTML文字列
 * @param attrName 属性名
 * @returns 属性値またはnull
 */
function getAttribute(node, attrName) {
    if (typeof node === 'string') {
        const regex = new RegExp(`${attrName}=["']([^"']*)["']`);
        const match = node.match(regex);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}
exports.getAttribute = getAttribute;
//# sourceMappingURL=domUtils.js.map