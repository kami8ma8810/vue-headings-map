# VueHeadingsMap

VueHeadingsMap is a VSCode/Cursor extension to visualize heading structure in Vue projects.

[日本語のREADME](README.ja.md)

## Features

- Extract and display heading elements (h1-h6) from Vue files in a tree view
- Highlight improper heading levels (e.g., h2 followed by h4) as warnings
- View heading structure based on specific directories
- Navigate to the target location by clicking on a heading
- Support for complex component hierarchies, including nested child components

## Usage

1. Click on the "VueHeadingsMap Explorer" icon in the VSCode sidebar
2. Vue files in the `src` directory are automatically analyzed and their heading structure is displayed
3. To use a different base directory, click the "Set Base Directory" button in the tree view header
4. Click on a heading to navigate to its position in the corresponding file
5. Headings with a warning icon (⚠️) indicate improper heading level hierarchy

## Demo

The repository includes several Vue demo components that showcase how VueHeadingsMap handles different component structures:

- `demo/DemoComponent.vue`: Basic Vue component with heading structure
- `demo/ChildComponent.vue`: Demonstrates child component headings
- `demo/GrandchildComponent.vue`: Shows deeply nested component headings
- `demo/ParentWithChildren.vue`: Parent component with child components
- `demo/ComplexParentComponent.vue`: Complex structure with multiple children and grandchildren

These demo files can be used to test the extension and see how it visualizes heading structures across component boundaries.

### Screenshots

When using the extension with these demo files, you will see a tree structure in the sidebar showing all headings, with warnings for improper heading level hierarchy:

![VueHeadingsMap Demo](https://github.com/kami8ma8810/vue-headings-map/raw/main/demo/screenshots/demo-screenshot.png)

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
