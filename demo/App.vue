<template>
  <div class="demo-app">
    <header>
      <h1>VueHeadingsMap Demo</h1>
      <p>This is a demo page with various heading levels to test the VueHeadingsMap extension</p>
    </header>
    
    <nav class="demo-nav">
      <h2>Demo Components</h2>
      <ul>
        <li><a href="#basic-demo" @click.prevent="activateComponent('basic')">基本的な見出し構造</a></li>
        <li><a href="#dynamic-demo" @click.prevent="activateComponent('dynamic')">動的な見出しコンポーネント</a></li>
        <li><a href="#complex-demo" @click.prevent="activateComponent('complex')">複雑なコンポーネント階層</a></li>
      </ul>
    </nav>
    
    <main>
      <component :is="currentComponent"></component>
    </main>
    
    <footer>
      <h2>Extension Documentation</h2>
      <p>For more details on how to use the extension, check the <a href="https://github.com/kami8ma8810/vue-headings-map" target="_blank">README</a> file.</p>
    </footer>
  </div>
</template>

<script>
import DemoComponent from './DemoComponent.vue';
import ParentWithChildren from './ParentWithChildren.vue';
import DynamicHeadingDemo from './DynamicHeadingDemo.vue';
import ComplexParentComponent from './ComplexParentComponent.vue';

export default {
  name: 'App',
  components: {
    DemoComponent,
    ParentWithChildren,
    DynamicHeadingDemo,
    ComplexParentComponent
  },
  data() {
    return {
      activeComponent: 'basic'
    };
  },
  computed: {
    currentComponent() {
      switch(this.activeComponent) {
        case 'basic':
          return DemoComponent;
        case 'dynamic':
          return DynamicHeadingDemo;
        case 'complex':
          return ComplexParentComponent;
        default:
          return DemoComponent;
      }
    }
  },
  methods: {
    activateComponent(component) {
      this.activeComponent = component;
    }
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
  background-color: #f8f8f8;
}

.demo-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

h1 {
  color: #42b883;
}

h2 {
  color: #35495e;
  margin-top: 30px;
  margin-bottom: 15px;
}

footer {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
}

.demo-nav {
  margin-bottom: 30px;
  padding: 15px;
  background: #f0f9f5;
  border-radius: 8px;
}

.demo-nav ul {
  display: flex;
  gap: 20px;
  list-style: none;
  padding: 0;
  justify-content: center;
}

.demo-nav a {
  text-decoration: none;
  color: #42b883;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.demo-nav a:hover {
  background-color: #e0f2eb;
}
</style>
