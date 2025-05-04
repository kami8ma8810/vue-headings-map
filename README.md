# VueHeadingsMap

VueHeadingsMap is a VSCode/Cursor extension to visualize heading structure in Vue projects.

[日本語のREADME](README.ja.md)

## Features

- Extract and display heading elements (h1-h6) from Vue files in a tree view
- Highlight improper heading levels (e.g., h2 followed by h4) as warnings
- View heading structure based on specific directories
- Navigate to the target location by clicking on a heading

## Usage

1. Click on the "VueHeadingsMap Explorer" icon in the VSCode sidebar
2. Vue files in the `src` directory are automatically analyzed and their heading structure is displayed
3. To use a different base directory, click the "Set Base Directory" button in the tree view header
4. Click on a heading to navigate to its position in the corresponding file
5. Headings with a warning icon (⚠️) indicate improper heading level hierarchy

## Development

### Prerequisites

- Node.js
- npm/yarn

### Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run watch

# Debug in a new VSCode window with F5 key
```

### Build

```bash
# Package the extension
npm run vscode:prepublish
```

## License

MIT
