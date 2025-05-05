"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadingItem = void 0;
const vscode = require("vscode");
// ツリービュー項目の拡張クラス
class HeadingItem extends vscode.TreeItem {
    constructor(label, collapsibleState, options) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.options = options;
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
exports.HeadingItem = HeadingItem;
//# sourceMappingURL=types.js.map