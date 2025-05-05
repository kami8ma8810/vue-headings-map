"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const headingsTreeProvider_1 = require("./view/headingsTreeProvider");
const settings_1 = require("./model/settings");
function activate(context) {
    console.log('VueHeadingsMap is now active!');
    // 設定マネージャーの初期化（アプリケーション全体で使用できるようにする）
    settings_1.SettingsManager.getInstance();
    // ヘッディングツリープロバイダーのインスタンスを作成
    const headingsTreeProvider = new headingsTreeProvider_1.HeadingsTreeProvider();
    // ツリービューを登録
    const treeView = vscode.window.createTreeView('vueHeadingsMapExplorer', {
        treeDataProvider: headingsTreeProvider,
        showCollapseAll: true
    });
    // ファイル変更イベントの監視を設定
    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.vue');
    // ファイルが変更された時のイベントハンドラ
    fileWatcher.onDidChange(uri => {
        headingsTreeProvider.refreshFile(uri.fsPath);
    });
    // ファイルが作成された時のイベントハンドラ
    fileWatcher.onDidCreate(uri => {
        headingsTreeProvider.refreshFile(uri.fsPath);
    });
    // ファイルが削除された時のイベントハンドラ
    fileWatcher.onDidDelete(uri => {
        headingsTreeProvider.removeFile(uri.fsPath);
    });
    // エディタ内容の変更を監視
    vscode.workspace.onDidChangeTextDocument(event => {
        // Vueファイルか確認
        if (path.extname(event.document.fileName) === '.vue') {
            headingsTreeProvider.refreshFile(event.document.fileName);
        }
    });
    // コマンドを登録
    context.subscriptions.push(vscode.commands.registerCommand('vueHeadingsMap.refreshHeadings', () => {
        headingsTreeProvider.refresh();
    }), vscode.commands.registerCommand('vueHeadingsMap.setBaseDirectory', async () => {
        const options = {
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select Base Directory'
        };
        const fileUri = await vscode.window.showOpenDialog(options);
        if (fileUri && fileUri.length > 0) {
            headingsTreeProvider.setBaseDirectory(fileUri[0].fsPath);
        }
    }), vscode.commands.registerCommand('vueHeadingsMap.gotoHeading', (filePath, line) => {
        vscode.workspace.openTextDocument(filePath).then(document => {
            vscode.window.showTextDocument(document).then(editor => {
                const position = new vscode.Position(line, 0);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
            });
        });
    }), treeView);
}
exports.activate = activate;
/**
 * この拡張機能は特別なクリーンアップを必要としないため、
 * deactivate関数は空のままです。
 */
function deactivate() {
    // 拡張機能のシャットダウン時に必要な処理がない
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map