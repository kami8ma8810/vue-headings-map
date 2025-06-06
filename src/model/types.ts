import * as vscode from 'vscode';

// 見出しノードの定義
export interface HeadingNode {
  // 見出しレベル（1-6）
  level: number;
  
  // 見出しのテキスト内容
  content: string;
  
  // 見出しが存在する行番号
  line: number;
  
  // 見出しの列位置
  column: number;
  
  // 警告フラグ（見出しレベルの問題など）
  hasWarning: boolean;
  
  // 警告メッセージ
  warningMessage?: string;
  
  // 子見出しノード
  children?: HeadingNode[];
  
  // 親見出しノードへの参照
  parent?: HeadingNode;
}

// ツリービュー項目の拡張クラス
export class HeadingItem extends vscode.TreeItem {
  // ファイルパス（ファイル項目の場合）
  filePath?: string;
  
  // 見出しノードへの参照（見出し項目の場合）
  headingNode?: HeadingNode;
  
  // 追加のプロパティを定義して、TypeScript エラーを解決
  tooltip?: string;
  description?: string;
  
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly options?: {
      tooltip?: string;
      description?: string;
      filePath?: string;
      headingNode?: HeadingNode;
    }
  ) {
    super(label, collapsibleState);
    
    if (options) {
      if (options.tooltip) {
        this.tooltip = options.tooltip;
      }
      if (options.description) {
        this.description = options.description;
      }
      if (options.filePath) {
        this.filePath = options.filePath;
      }
      if (options.headingNode) {
        this.headingNode = options.headingNode;
      }
    }
  }
}
