# VueHeadingsMap

VueHeadingsMap is a VSCode/Cursor extension to visualize heading structure in Vue projects.

[日本語](README.ja.md)

## Features

- Extract and display heading elements (h1-h6) from Vue files in a tree view
- Highlight improper heading levels (e.g., h2 followed by h4) as warnings
- Warn on h2-h6 tags placed before h1 (accessibility issue)
- View heading structure based on specific directories
- Navigate to the target location by clicking on a heading
- Support for complex component hierarchies, including nested child components
- Detection of various dynamic heading patterns:
  - `:headingLevel` props
  - JSX/TSX headings
  - Render functions with `h()` or `createElement()`
  - Computed properties that return heading tags
  - Conditional headings with v-if/v-else-if

## Usage

1. Click on the "VueHeadingsMap Explorer" icon in the VSCode sidebar
2. Vue files in the `src` directory are automatically analyzed and their heading structure is displayed
3. To use a different base directory, click the "Set Base Directory" button in the tree view header
4. Click on a heading to navigate to its position in the corresponding file
5. Headings with a warning icon (⚠️) indicate improper heading level hierarchy

## Configuration

You can customize the extension's behavior through VSCode settings:

1. Open VSCode Settings (File > Preferences > Settings)
2. Search for "Vue Headings Map"
3. Configure the following options:

| Setting | Description | Default |
|---------|-------------|---------|
| `vueHeadingsMap.requireH1AsFirstHeading` | Require that the first heading in a file is an h1. When disabled, you can start with any heading level without warnings. | `true` |
| `vueHeadingsMap.warnOnHeadingLevelSkip` | Show warnings when heading levels are skipped (e.g., h2 followed by h4). | `true` |

## Demo

The repository includes several Vue demo components that showcase how VueHeadingsMap handles different component structures:

- `demo/DemoComponent.vue`: Basic Vue component with heading structure
- `demo/ChildComponent.vue`: Demonstrates child component headings
- `demo/GrandchildComponent.vue`: Shows deeply nested component headings
- `demo/ParentWithChildren.vue`: Parent component with child components
- `demo/ComplexParentComponent.vue`: Complex structure with multiple children and grandchildren
- `demo/DynamicHeading.vue`: Component that renders dynamic heading levels using `:is`
- `demo/DynamicHeadingDemo.vue`: Demonstrates usage of dynamic heading components

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

## Version History

### 0.0.6
- Enhanced heading level validation to show warnings on h2-h6 tags that appear before h1
- Improved document structure validation for better accessibility guidance

### 0.0.5
- Improved heading level validation to detect h1 tags appearing after any heading level (h2-h6)
- Added comprehensive test suite for all dynamic heading patterns
- Updated documentation to remove references to temporarily disabled features
- Fixed component type definitions for better compatibility

### 0.0.4
- Improved heading structure validation for accessibility
- Enhanced warning system for h1 tags appearing after h2 tags
- Optimized dynamic tag detection to focus on actual heading elements
- Modified component resolution for better performance

### 0.0.3
- Modified VSCode engine requirements to support Cursor editor (v0.49.6+)
- Lowered VSCode requirement from v1.99.1 to v1.60.0 for wider compatibility
- Fixed type definitions to match new engine requirements

### 0.0.2
- Update icon

### 0.0.1
- Initial development version
- Basic heading extraction and visualization

## License

MIT
