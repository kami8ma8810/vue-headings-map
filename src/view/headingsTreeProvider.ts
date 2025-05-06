import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { HeadingNode, HeadingItem } from '../model/types';
import { parseVueFile } from '../util/vueParser';
import { settingsChangeEvent } from '../model/settings';

export class HeadingsTreeProvider implements vscode.TreeDataProvider<HeadingItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<HeadingItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  
  private headings: Map<string, HeadingNode[]> = new Map();
  private baseDir = ''; // 型推論で十分なので型アノテーションを削除
  // 最後に解析した時刻を保存するマップ
  private lastParsedTime: Map<string, number> = new Map();

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
    
    // 設定変更イベントをリッスンして自動的に更新する
    settingsChangeEvent.event((() => {
      console.log('Settings changed, refreshing headings...');
      this.refresh();
    }).bind(this));
  }

  refresh(): void {
    this.scanDirectory();
    this._onDidChangeTreeData.fire(undefined);
  }

  setBaseDirectory(directory: string): void {
    this.baseDir = directory;
    this.refresh();
  }
  
  /**
   * 特定のファイルのみを更新
   */
  refreshFile(filePath: string): void {
    // デバウンスのため、最後の解析から一定時間経過していない場合は無視
    const now = Date.now();
    const lastParsed = this.lastParsedTime.get(filePath) || 0;
    if (now - lastParsed < 500) { // 500ms以内の変更は無視
      return;
    }
    
    try {
      const fileHeadings = parseVueFile(filePath);
      if (fileHeadings.length > 0) {
        // 階層構造を構築する
        const hierarchicalHeadings = this.buildHeadingHierarchy(fileHeadings);
        this.headings.set(filePath, hierarchicalHeadings);
      } else {
        this.headings.delete(filePath);
      }
      
      // 最後の解析時刻を更新
      this.lastParsedTime.set(filePath, now);
      
      // ツリーデータの更新をトリガー
      this._onDidChangeTreeData.fire(undefined);
    } catch (err) {
      console.error(`Error refreshing file ${filePath}:`, err);
    }
  }
  
  /**
   * ファイルが削除された時に呼ばれるメソッド
   */
  removeFile(filePath: string): void {
    if (this.headings.has(filePath)) {
      this.headings.delete(filePath);
      this.lastParsedTime.delete(filePath);
      this._onDidChangeTreeData.fire(undefined);
    }
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
  private buildHeadingHierarchy(headings: HeadingNode[]): HeadingNode[] {
    // ソート済みの配列をコピー（元の行番号順を維持）
    const sortedHeadings = [...headings].sort((a, b) => a.line - b.line);
    
    // ルートレベルの見出しを格納する配列
    const rootHeadings: HeadingNode[] = [];
    
    // スタックを使用して階層を追跡
    const stack: HeadingNode[] = [];
    
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
      } else {
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

  getTreeItem(element: HeadingItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: HeadingItem): Thenable<HeadingItem[]> {
    if (!element) {
      // ルートレベル：ファイルごとのアイテムを返す
      return Promise.resolve(this.createFileItems());
    } else if (element.contextValue === 'file' && element.filePath) {
      // ファイルレベル：そのファイル内のルート見出しアイテムを返す
      return Promise.resolve(this.createHeadingItems(element.filePath));
    } else if (element.contextValue === 'heading' && element.headingNode && element.headingNode.children && element.headingNode.children.length > 0) {
      // 見出しレベル：その見出しの子見出しアイテムを返す
      return Promise.resolve(this.createChildHeadingItems(element.headingNode.children, element.filePath || ''));
    }
    
    return Promise.resolve([]);
  }

  /**
   * 見出しノードとその子孫に警告があるかどうかを再帰的にチェックする
   */
  private hasWarningsDeep(nodes: HeadingNode[]): boolean {
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
  private collectWarningMessages(nodes: HeadingNode[]): string[] {
    const messages: string[] = [];
    
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
  private createFileItems(): HeadingItem[] {
    const items: HeadingItem[] = [];
    
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
      
      const item = new HeadingItem(
        fileLabel,
        vscode.TreeItemCollapsibleState.Collapsed,
        {
          tooltip: tooltip,
          description: ''
        }
      );
      
      item.contextValue = 'file';
      item.filePath = filePath;
      
      // 警告がある場合はアイコンも変更
      if (hasWarnings) {
        item.iconPath = new vscode.ThemeIcon('warning');
      } else {
        item.iconPath = new vscode.ThemeIcon('file-code');
      }
      
      items.push(item);
    });
    
    return items;
  }

  // 見出しアイテムの作成（ルートレベルの見出し用）
  private createHeadingItems(filePath: string): HeadingItem[] {
    const items: HeadingItem[] = [];
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
  private createChildHeadingItems(headingNodes: HeadingNode[], filePath: string): HeadingItem[] {
    const items: HeadingItem[] = [];
    
    headingNodes.forEach(node => {
      items.push(this.createHeadingItemFromNode(node, filePath));
    });
    
    return items;
  }
  
  // 単一の見出しノードからHeadingItemを作成するヘルパーメソッド
  private createHeadingItemFromNode(node: HeadingNode, filePath: string): HeadingItem {
    // 子ノードがある場合は展開可能に設定
    const hasChildren = node.children && node.children.length > 0;
    const collapsibleState = hasChildren 
      ? vscode.TreeItemCollapsibleState.Collapsed
      : vscode.TreeItemCollapsibleState.None;
    
    // この見出し自体または子孫に警告があるかチェック
    let directWarning = node.hasWarning;
    
    // よりわかりやすくするために詳細なログ出力
    console.log(`Creating TreeItem for h${node.level} "${node.content}" at line ${node.line}`);
    console.log(`  hasWarning=${directWarning}, message="${node.warningMessage || 'none'}"`);
    
    // h2がh1の前にある特定のケースを明示的に確認 - すべてのファイルから見出しノードを取得
    let isH2BeforeH1 = false;
    
    // h2ノードの場合、h1との位置関係を全ノードから判定
    if (node.level === 2) {
      // すべての見出しノードをフラットに取得して行番号でソート
      const allHeadings: HeadingNode[] = [];
      const fileHeadings = this.headings.get(filePath);
      
      if (fileHeadings) {
        // 再帰的に全ノードを抽出する関数
        const extractAllNodes = (nodes: HeadingNode[]) => {
          for (const n of nodes) {
            allHeadings.push(n);
            if (n.children && n.children.length > 0) {
              extractAllNodes(n.children);
            }
          }
        };
        
        extractAllNodes(fileHeadings);
        
        // 行番号でソート
        const sortedNodes = allHeadings.sort((a, b) => a.line - b.line);
        
        // すべてのh1ノードと、現在のh2ノードを検索
        const allH1s = sortedNodes.filter(h => h.level === 1);
        const h2Index = sortedNodes.findIndex(h => h === node);
        
        if (h2Index !== -1) {
          if (allH1s.length === 0) {
            // h1が存在しない場合
            console.log(`  ⚠️ NO H1 DETECTED in document, h2 "${node.content}" should have warning`);
            isH2BeforeH1 = true;
            directWarning = true;
          } else {
            // 最初のh1の位置を確認
            const firstH1Index = sortedNodes.findIndex(h => h.level === 1);
            
            // このh2がh1より前に配置されているか確認
            if (firstH1Index > h2Index) {
              console.log(`  ⚠️ H2 "${node.content}" at line ${node.line} BEFORE H1 at line ${sortedNodes[firstH1Index].line}`);
              isH2BeforeH1 = true;
              directWarning = true;
              
              // 警告フラグを明示的に設定
              node.hasWarning = true;
              if (!node.warningMessage) {
                node.warningMessage = "This h2 appears before any h1 in the document";
              }
            }
          }
        }
      }
    }
    
    // 通常のアイコン判定用フラグ
    const childrenHaveWarnings = hasChildren && node.children ? this.hasWarningsDeep(node.children) : false;
    const hasAnyWarnings = directWarning || childrenHaveWarnings || isH2BeforeH1;
    
    // 階層レベルに応じたインデントと視覚的なライン表現を追加
    const indent = this.createVisualIndent(node);
    const levelPrefix = `${node.level} - `;
    
    // 警告がある場合はラベルに警告アイコンを追加
    let label = `${indent}${levelPrefix}${node.content}`;
    
    // h2でh1より前にある場合、または他の警告がある場合は警告アイコンを追加
    if (node.hasWarning || isH2BeforeH1) {
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
        } else {
          tooltip = 'Child Element Warnings:\n';
        }
        tooltip += childWarnings.join('\n');
      }
    }
    
    const item = new HeadingItem(
      label,
      collapsibleState,
      {
        tooltip: tooltip || undefined,
        description: '',
        filePath: filePath,
        headingNode: node
      }
    );
    
    item.contextValue = 'heading';
    item.command = {
      command: 'vueHeadingsMap.gotoHeading',
      title: 'Go to Heading',
      arguments: [filePath, node.line]
    };
    
    // 1. ファイル位置に基づくh2の検出（デバッグ用）
    if (node.level === 2) {
      const headingsList = this.headings.get(filePath);
      if (headingsList) {
        // 行番号でソートした配列
        const sortedByLine = [...headingsList].sort((a, b) => a.line - b.line);
        const allH1s = sortedByLine.filter(h => h.level === 1);
        const allH2s = sortedByLine.filter(h => h.level === 2);
        
        if (allH2s.length > 0 && allH1s.length > 0) {
          const h2Lines = allH2s.map(h => h.line);
          const h1Lines = allH1s.map(h => h.line);
          console.log(`H1 lines: ${h1Lines.join(', ')}, H2 lines: ${h2Lines.join(', ')}`);
          
          // このh2が最初のh1より前にあるか確認
          if (h1Lines[0] > node.line) {
            console.log(`DETECTED: h2 at line ${node.line} comes before h1 at line ${h1Lines[0]}`);
            node.hasWarning = true;
            isH2BeforeH1 = true;
            if (!node.warningMessage) {
              node.warningMessage = "This h2 appears before any h1 in the document";
            }
          }
        }
      }
    }
    
    // アイコン表示ロジック
    if (node.level === 2 && (directWarning || isH2BeforeH1)) {
      // h2タグに警告がある場合は特別なマーキング
      console.log(`Marking h2 "${node.content}" with warning icon - directWarning=${directWarning}, isH2BeforeH1=${isH2BeforeH1}`);
      item.iconPath = new vscode.ThemeIcon('warning');
    } else {
      // エラー以外の場合はアイコンを表示しない（新しい要件）
      item.iconPath = undefined;
    }
    
    return item;
  }
  
  /**
   * 見出しの階層を視覚的に表現するインデントとライン文字列を生成
   */
  private createVisualIndent(node: HeadingNode): string {
    let indent = '';
    
    // 親をたどって階層構造を視覚化
    const depthMap: boolean[] = [];
    let currentNode: HeadingNode | undefined = node;
    
    // 親ノードの階層を収集
    while (currentNode && currentNode.parent) {
      // 親がいて、その親に他の子供（兄弟）がいるかチェック
      const parent: HeadingNode = currentNode.parent;
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
      } else {
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
      } else {
        indent = indent.substring(0, indent.length - 2) + '├─'; // 途中の子はT字
      }
    }
    
    return indent;
  }
}
