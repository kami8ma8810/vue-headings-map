import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { HeadingNode, HeadingItem } from '../model/types';
import { parseVueFile } from '../util/vueParser';

export class HeadingsTreeProvider implements vscode.TreeDataProvider<HeadingItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<HeadingItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  
  private headings: Map<string, HeadingNode[]> = new Map();
  private baseDir: string = '';

  constructor() {
    // 初期ディレクトリの設定
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
      const srcDir = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'src');
      if (fs.existsSync(srcDir)) {
        this.baseDir = srcDir;
        this.refresh();
      } else {
        this.baseDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
        this.refresh();
      }
    }
  }

  refresh(): void {
    this.scanDirectory();
    this._onDidChangeTreeData.fire(undefined);
  }

  setBaseDirectory(directory: string): void {
    this.baseDir = directory;
    this.refresh();
  }

  // ディレクトリをスキャンして全Vueファイルを解析
  private scanDirectory(): void {
    if (!this.baseDir || !fs.existsSync(this.baseDir)) {
      return;
    }

    this.headings.clear();
    
    // Vueファイルを再帰的に検索
    vscode.workspace.findFiles(
      new vscode.RelativePattern(this.baseDir, '**/*.vue'),
      '**/node_modules/**'
    ).then(files => {
      // 各ファイルを処理
      files.forEach(file => {
        const fileHeadings = parseVueFile(file.fsPath);
        if (fileHeadings.length > 0) {
          this.headings.set(file.fsPath, fileHeadings);
        }
      });
      
      // ツリーデータの更新をトリガー
      this._onDidChangeTreeData.fire(undefined);
    });
  }

  getTreeItem(element: HeadingItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HeadingItem): Thenable<HeadingItem[]> {
    if (!element) {
      // ルートレベル：ファイルごとのアイテムを返す
      return Promise.resolve(this.createFileItems());
    } else if (element.contextValue === 'file' && element.filePath) {
      // ファイルレベル：そのファイル内の見出しアイテムを返す
      return Promise.resolve(this.createHeadingItems(element.filePath));
    }
    
    return Promise.resolve([]);
  }

  // ファイルアイテムの作成
  private createFileItems(): HeadingItem[] {
    const items: HeadingItem[] = [];
    
    this.headings.forEach((headingNodes, filePath) => {
      const hasWarnings = headingNodes.some(h => h.hasWarning);
      const fileName = path.basename(filePath);
      const relativePath = vscode.workspace.asRelativePath(filePath);
      
      const item = new HeadingItem(
        fileName,
        vscode.TreeItemCollapsibleState.Collapsed,
        {
          tooltip: relativePath,
          description: hasWarnings ? '⚠️ Warnings' : ''
        }
      );
      
      item.contextValue = 'file';
      item.filePath = filePath;
      item.iconPath = new vscode.ThemeIcon('file-code');
      
      items.push(item);
    });
    
    return items;
  }

  // 見出しアイテムの作成
  private createHeadingItems(filePath: string): HeadingItem[] {
    const items: HeadingItem[] = [];
    const headingNodes = this.headings.get(filePath);
    
    if (!headingNodes) {
      return items;
    }
    
    headingNodes.forEach(node => {
      const label = `${'#'.repeat(node.level)} ${node.content}`;
      
      const item = new HeadingItem(
        label,
        vscode.TreeItemCollapsibleState.None,
        {
          tooltip: node.hasWarning ? node.warningMessage : undefined,
          description: node.hasWarning ? '⚠️' : ''
        }
      );
      
      item.contextValue = 'heading';
      item.command = {
        command: 'vueHeadingsMap.gotoHeading',
        title: 'Go to Heading',
        arguments: [filePath, node.line]
      };
      
      // 見出しレベルに応じたアイコンを設定
      item.iconPath = new vscode.ThemeIcon(
        node.hasWarning ? 'warning' : `symbol-variable`
      );
      
      items.push(item);
    });
    
    return items;
  }
}
