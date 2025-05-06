"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadingsTreeProvider = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const types_1 = require("../model/types");
const vueParser_1 = require("../util/vueParser");
const settings_1 = require("../model/settings");
class HeadingsTreeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.headings = new Map();
        this.baseDir = ''; // 型推論で十分なので型アノテーションを削除
        // 最後に解析した時刻を保存するマップ
        this.lastParsedTime = new Map();
        // 初期ディレクトリの設定
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            const srcDir = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'src');
            if (fs.existsSync(srcDir)) {
                this.baseDir = srcDir;
                this.refresh();
            }
            else {
                this.baseDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
                this.refresh();
            }
        }
        // 設定変更イベントをリッスンして自動的に更新する
        settings_1.settingsChangeEvent.event((() => {
            console.log('Settings changed, refreshing headings...');
            this.refresh();
        }).bind(this));
    }
    refresh() {
        this.scanDirectory();
        this._onDidChangeTreeData.fire(undefined);
    }
    setBaseDirectory(directory) {
        this.baseDir = directory;
        this.refresh();
    }
    /**
     * 特定のファイルのみを更新
     */
    refreshFile(filePath) {
        // デバウンスのため、最後の解析から一定時間経過していない場合は無視
        const now = Date.now();
        const lastParsed = this.lastParsedTime.get(filePath) || 0;
        if (now - lastParsed < 500) { // 500ms以内の変更は無視
            return;
        }
        try {
            const fileHeadings = (0, vueParser_1.parseVueFile)(filePath);
            if (fileHeadings.length > 0) {
                // 階層構造を構築する
                const hierarchicalHeadings = this.buildHeadingHierarchy(fileHeadings);
                this.headings.set(filePath, hierarchicalHeadings);
            }
            else {
                this.headings.delete(filePath);
            }
            // 最後の解析時刻を更新
            this.lastParsedTime.set(filePath, now);
            // ツリーデータの更新をトリガー
            this._onDidChangeTreeData.fire(undefined);
        }
        catch (err) {
            console.error(`Error refreshing file ${filePath}:`, err);
        }
    }
    /**
     * ファイルが削除された時に呼ばれるメソッド
     */
    removeFile(filePath) {
        if (this.headings.has(filePath)) {
            this.headings.delete(filePath);
            this.lastParsedTime.delete(filePath);
            this._onDidChangeTreeData.fire(undefined);
        }
    }
    // ディレクトリをスキャンして全Vueファイルを解析
    scanDirectory() {
        if (!this.baseDir || !fs.existsSync(this.baseDir)) {
            return;
        }
        this.headings.clear();
        // Vueファイルを再帰的に検索
        vscode.workspace.findFiles(new vscode.RelativePattern(this.baseDir, '**/*.vue'), '**/node_modules/**').then(files => {
            // 各ファイルを処理
            files.forEach(file => {
                const fileHeadings = (0, vueParser_1.parseVueFile)(file.fsPath);
                if (fileHeadings.length > 0) {
                    // 階層構造を構築する
                    const hierarchicalHeadings = this.buildHeadingHierarchy(fileHeadings);
                    this.headings.set(file.fsPath, hierarchicalHeadings);
                }
            });
            // ツリーデータの更新をトリガー
            this._onDidChangeTreeData.fire(undefined);
        });
    }
    /**
     * 見出しノードを階層構造に変換する
     */
    buildHeadingHierarchy(headings) {
        // ソート済みの配列をコピー（元の行番号順を維持）
        const sortedHeadings = [...headings].sort((a, b) => a.line - b.line);
        // ルートレベルの見出しを格納する配列
        const rootHeadings = [];
        // スタックを使用して階層を追跡
        const stack = [];
        // 各見出しを処理
        for (const heading of sortedHeadings) {
            // 子ノード配列の初期化
            heading.children = [];
            // 現在の見出しよりも高いレベル（数値が大きい）の見出しをスタックから削除
            while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
                stack.pop();
            }
            if (stack.length === 0) {
                // スタックが空の場合、これはルートレベルの見出し
                rootHeadings.push(heading);
            }
            else {
                // スタックの最後の要素が親
                const parent = stack[stack.length - 1];
                heading.parent = parent;
                parent.children?.push(heading);
            }
            // 現在の見出しをスタックに追加
            stack.push(heading);
        }
        return rootHeadings;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            // ルートレベル：ファイルごとのアイテムを返す
            return Promise.resolve(this.createFileItems());
        }
        else if (element.contextValue === 'file' && element.filePath) {
            // ファイルレベル：そのファイル内のルート見出しアイテムを返す
            return Promise.resolve(this.createHeadingItems(element.filePath));
        }
        else if (element.contextValue === 'heading' && element.headingNode && element.headingNode.children && element.headingNode.children.length > 0) {
            // 見出しレベル：その見出しの子見出しアイテムを返す
            return Promise.resolve(this.createChildHeadingItems(element.headingNode.children, element.filePath || ''));
        }
        return Promise.resolve([]);
    }
    /**
     * 見出しノードとその子孫に警告があるかどうかを再帰的にチェックする
     */
    hasWarningsDeep(nodes) {
        if (!nodes || nodes.length === 0) {
            return false;
        }
        for (const node of nodes) {
            // 直接の警告をチェック
            if (node.hasWarning) {
                return true;
            }
            // 子孫の警告をチェック
            if (node.children && node.children.length > 0 && this.hasWarningsDeep(node.children)) {
                return true;
            }
        }
        return false;
    }
    /**
     * 見出しノードとその子孫から警告メッセージを収集する
     */
    collectWarningMessages(nodes) {
        const messages = [];
        for (const node of nodes) {
            if (node.hasWarning && node.warningMessage) {
                messages.push(`${node.content}: ${node.warningMessage}`);
            }
            if (node.children && node.children.length > 0) {
                messages.push(...this.collectWarningMessages(node.children));
            }
        }
        return messages;
    }
    // ファイルアイテムの作成
    createFileItems() {
        const items = [];
        this.headings.forEach((headingNodes, filePath) => {
            // ファイル内のどこかに警告があるかを再帰的に確認
            const hasWarnings = this.hasWarningsDeep(headingNodes);
            const fileName = path.basename(filePath);
            const relativePath = vscode.workspace.asRelativePath(filePath);
            // 警告がある場合はファイル名の後に警告アイコンを表示
            let fileLabel = fileName;
            if (hasWarnings) {
                fileLabel = `${fileName} ⚠️`;
            }
            // 警告メッセージをツールチップに追加
            let tooltip = relativePath;
            if (hasWarnings) {
                const warningMessages = this.collectWarningMessages(headingNodes);
                tooltip = `${relativePath}\n\nWarnings:\n${warningMessages.join('\n')}`;
            }
            const item = new types_1.HeadingItem(fileLabel, vscode.TreeItemCollapsibleState.Collapsed, {
                tooltip: tooltip,
                description: ''
            });
            item.contextValue = 'file';
            item.filePath = filePath;
            // 警告がある場合はアイコンも変更
            if (hasWarnings) {
                item.iconPath = new vscode.ThemeIcon('warning');
            }
            else {
                item.iconPath = new vscode.ThemeIcon('file-code');
            }
            items.push(item);
        });
        return items;
    }
    // 見出しアイテムの作成（ルートレベルの見出し用）
    createHeadingItems(filePath) {
        const items = [];
        const headingNodes = this.headings.get(filePath);
        if (!headingNodes) {
            return items;
        }
        // ルートレベルの見出しノードを処理
        headingNodes.forEach(node => {
            items.push(this.createHeadingItemFromNode(node, filePath));
        });
        return items;
    }
    // 子見出しアイテムの作成（階層構造内の子見出し用）
    createChildHeadingItems(headingNodes, filePath) {
        const items = [];
        headingNodes.forEach(node => {
            items.push(this.createHeadingItemFromNode(node, filePath));
        });
        return items;
    }
    // 単一の見出しノードからHeadingItemを作成するヘルパーメソッド
    createHeadingItemFromNode(node, filePath) {
        // 子ノードがある場合は展開可能に設定
        const hasChildren = node.children && node.children.length > 0;
        const collapsibleState = hasChildren
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None;
        // この見出し自体または子孫に警告があるかチェック
        const directWarning = node.hasWarning;
        // デバッグ用にログ出力
        console.log(`Creating TreeItem for h${node.level} "${node.content}" hasWarning=${directWarning}, message="${node.warningMessage || 'none'}"`);
        const childrenHaveWarnings = hasChildren && node.children ? this.hasWarningsDeep(node.children) : false;
        const hasAnyWarnings = directWarning || childrenHaveWarnings;
        // 階層レベルに応じたインデントと視覚的なライン表現を追加
        const indent = this.createVisualIndent(node);
        const levelPrefix = `${node.level} - `;
        // 警告がある場合はラベルに警告アイコンを追加
        let label = `${indent}${levelPrefix}${node.content}`;
        if (hasAnyWarnings) {
            label = `${label} ⚠️`;
        }
        // ツールチップに警告情報を追加
        let tooltip = '';
        if (directWarning && node.warningMessage) {
            tooltip = node.warningMessage;
        }
        // 子に警告がある場合、それらの警告も表示
        if (childrenHaveWarnings && hasChildren && node.children) {
            const childWarnings = this.collectWarningMessages(node.children);
            if (childWarnings.length > 0) {
                if (tooltip) {
                    tooltip += '\n\nChild Element Warnings:\n';
                }
                else {
                    tooltip = 'Child Element Warnings:\n';
                }
                tooltip += childWarnings.join('\n');
            }
        }
        const item = new types_1.HeadingItem(label, collapsibleState, {
            tooltip: tooltip || undefined,
            description: '',
            filePath: filePath,
            headingNode: node
        });
        item.contextValue = 'heading';
        item.command = {
            command: 'vueHeadingsMap.gotoHeading',
            title: 'Go to Heading',
            arguments: [filePath, node.line]
        };
        // 警告状態を明示的にマーク
        if (directWarning) {
            // このノード自体に警告がある場合に特別なマーキング
            console.log(`Marking h${node.level} "${node.content}" with warning icon (direct warning)`);
            item.iconPath = new vscode.ThemeIcon('warning');
        }
        else if (hasAnyWarnings) {
            // 子孫に警告がある場合も警告アイコン
            console.log(`Marking h${node.level} "${node.content}" with warning icon (child warnings)`);
            item.iconPath = new vscode.ThemeIcon('warning');
        }
        else {
            // 見出しレベルに応じた適切なアイコンを選択
            switch (node.level) {
                case 1:
                    item.iconPath = new vscode.ThemeIcon('symbol-class');
                    break;
                case 2:
                    item.iconPath = new vscode.ThemeIcon('symbol-method');
                    break;
                case 3:
                    item.iconPath = new vscode.ThemeIcon('symbol-field');
                    break;
                case 4:
                    item.iconPath = new vscode.ThemeIcon('symbol-property');
                    break;
                case 5:
                    item.iconPath = new vscode.ThemeIcon('symbol-variable');
                    break;
                case 6:
                    item.iconPath = new vscode.ThemeIcon('symbol-constant');
                    break;
                default:
                    item.iconPath = new vscode.ThemeIcon('symbol-variable');
            }
        }
        return item;
    }
    /**
     * 見出しの階層を視覚的に表現するインデントとライン文字列を生成
     */
    createVisualIndent(node) {
        let indent = '';
        // 親をたどって階層構造を視覚化
        const depthMap = [];
        let currentNode = node;
        // 親ノードの階層を収集
        while (currentNode && currentNode.parent) {
            // 親がいて、その親に他の子供（兄弟）がいるかチェック
            const parent = currentNode.parent;
            const isLastChild = parent.children &&
                parent.children.length > 0 &&
                parent.children[parent.children.length - 1] === currentNode;
            // 最後の子でなければ縦線を表示するためにtrue
            depthMap.unshift(!isLastChild);
            currentNode = parent;
        }
        // 階層ごとにインデントと縦線を適用
        for (let i = 0; i < depthMap.length; i++) {
            if (depthMap[i]) {
                indent += '│ '; // 縦線と空白
            }
            else {
                indent += '  '; // 空白のみ
            }
        }
        // 最後の接続部分
        if (node.parent) {
            const isLastChild = node.parent.children &&
                node.parent.children.length > 0 &&
                node.parent.children[node.parent.children.length - 1] === node;
            if (isLastChild) {
                indent = indent.substring(0, indent.length - 2) + '└─'; // 最後の子は角
            }
            else {
                indent = indent.substring(0, indent.length - 2) + '├─'; // 途中の子はT字
            }
        }
        return indent;
    }
}
exports.HeadingsTreeProvider = HeadingsTreeProvider;
//# sourceMappingURL=headingsTreeProvider.js.map