"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsManager = exports.settingsChangeEvent = exports.DEFAULT_SETTINGS = void 0;
const vscode = require("vscode");
/**
 * デフォルト設定
 */
exports.DEFAULT_SETTINGS = {
    requireH1AsFirstHeading: true,
    warnOnHeadingLevelSkip: true
};
/**
 * 設定変更イベントを発行するためのイベントエミッター
 */
exports.settingsChangeEvent = new vscode.EventEmitter();
/**
 * 設定マネージャークラス
 */
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        // 設定変更を監視
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('vueHeadingsMap')) {
                this.settings = this.loadSettings();
                // 設定変更をブロードキャスト
                exports.settingsChangeEvent.fire();
            }
        });
    }
    /**
     * シングルトンインスタンスを取得
     */
    static getInstance() {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    }
    /**
     * 設定を取得
     */
    getSettings() {
        return this.settings;
    }
    /**
     * VSCodeの設定から値を読み込む
     */
    loadSettings() {
        const config = vscode.workspace.getConfiguration('vueHeadingsMap');
        return {
            requireH1AsFirstHeading: config.get('requireH1AsFirstHeading', exports.DEFAULT_SETTINGS.requireH1AsFirstHeading),
            warnOnHeadingLevelSkip: config.get('warnOnHeadingLevelSkip', exports.DEFAULT_SETTINGS.warnOnHeadingLevelSkip)
        };
    }
}
exports.SettingsManager = SettingsManager;
//# sourceMappingURL=settings.js.map