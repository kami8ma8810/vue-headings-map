import * as vscode from 'vscode';

/**
 * 見出しマップの設定モデル
 */
export interface HeadingsMapSettings {
  // 最初の見出しがh1でなければいけないかどうか
  requireH1AsFirstHeading: boolean;
  
  // 見出しレベルのスキップを警告するかどうか
  warnOnHeadingLevelSkip: boolean;
}

/**
 * デフォルト設定
 */
export const DEFAULT_SETTINGS: HeadingsMapSettings = {
  requireH1AsFirstHeading: true,
  warnOnHeadingLevelSkip: true
};

/**
 * 設定変更イベントを発行するためのイベントエミッター
 */
export const settingsChangeEvent = new vscode.EventEmitter<void>();

/**
 * 設定マネージャークラス
 */
export class SettingsManager {
  private static instance: SettingsManager;
  private settings: HeadingsMapSettings;
  
  private constructor() {
    this.settings = this.loadSettings();
    
    // 設定変更を監視
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('vueHeadingsMap')) {
        this.settings = this.loadSettings();
        // 設定変更をブロードキャスト
        settingsChangeEvent.fire();
      }
    });
  }
  
  /**
   * シングルトンインスタンスを取得
   */
  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }
  
  /**
   * 設定を取得
   */
  public getSettings(): HeadingsMapSettings {
    return this.settings;
  }
  
  /**
   * VSCodeの設定から値を読み込む
   */
  private loadSettings(): HeadingsMapSettings {
    const config = vscode.workspace.getConfiguration('vueHeadingsMap');
    
    return {
      requireH1AsFirstHeading: config.get<boolean>('requireH1AsFirstHeading', DEFAULT_SETTINGS.requireH1AsFirstHeading),
      warnOnHeadingLevelSkip: config.get<boolean>('warnOnHeadingLevelSkip', DEFAULT_SETTINGS.warnOnHeadingLevelSkip)
    };
  }
}
