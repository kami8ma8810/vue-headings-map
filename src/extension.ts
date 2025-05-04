import * as vscode from 'vscode';
import { HeadingsTreeProvider } from './view/headingsTreeProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('VueHeadingsMap is now active!');

  // ヘッディングツリープロバイダーのインスタンスを作成
  const headingsTreeProvider = new HeadingsTreeProvider();
  
  // ツリービューを登録
  const treeView = vscode.window.createTreeView('vueHeadingsMapExplorer', {
    treeDataProvider: headingsTreeProvider,
    showCollapseAll: true
  });
  
  // コマンドを登録
  context.subscriptions.push(
    vscode.commands.registerCommand('vueHeadingsMap.refreshHeadings', () => {
      headingsTreeProvider.refresh();
    }),
    
    vscode.commands.registerCommand('vueHeadingsMap.setBaseDirectory', async () => {
      const options: vscode.OpenDialogOptions = {
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: 'Select Base Directory'
      };
      
      const fileUri = await vscode.window.showOpenDialog(options);
      if (fileUri && fileUri.length > 0) {
        headingsTreeProvider.setBaseDirectory(fileUri[0].fsPath);
      }
    }),
    
    vscode.commands.registerCommand('vueHeadingsMap.gotoHeading', (filePath: string, line: number) => {
      vscode.workspace.openTextDocument(filePath).then(document => {
        vscode.window.showTextDocument(document).then(editor => {
          const position = new vscode.Position(line, 0);
          editor.selection = new vscode.Selection(position, position);
          editor.revealRange(
            new vscode.Range(position, position),
            vscode.TextEditorRevealType.InCenter
          );
        });
      });
    }),
    
    treeView
  );
}

export function deactivate() {}
