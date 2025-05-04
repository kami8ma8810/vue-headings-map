<template>
  <div class="demo-component">
    <h1>Vue Component Example</h1>
    <p>This is a Vue Single File Component with various heading levels.</p>
    
    <div class="section">
      <h2>Component Overview</h2>
      <p>This component demonstrates how the VueHeadingsMap extension parses Vue files.</p>
      
      <div class="subsection">
        <h3>How It Works</h3>
        <p>The extension extracts heading elements from the template section of Vue files.</p>
        
        <h4>Technical Details</h4>
        <p>Using regex pattern matching, headings are identified and their hierarchy is analyzed.</p>
      </div>
      
      <div class="subsection">
        <h3>Usage Examples</h3>
        <p>Here are some examples of how to use this extension.</p>
        
        <h5>Advanced Features</h5>
        <p>This heading skips h4, which would be flagged as a warning by the extension.</p>
      </div>
    </div>
    
    <!-- Child Component Integration -->
    <div class="section">
      <h2>Nested Components</h2>
      <p>This demonstrates how the extension handles headings in nested child components.</p>
      
      <ChildComponent>
        <p>Content passed to the child component through slots.</p>
      </ChildComponent>
      
      <h3>Parent Component Continues</h3>
      <p>After the child component, the parent component can continue with its own heading structure.</p>
    </div>
    
    <div class="section">
      <h2>Benefits of Structured Headings</h2>
      <p>Properly structured headings improve accessibility and SEO.</p>
      
      <h3>Accessibility</h3>
      <p>Screen readers use heading structure to help users navigate content.</p>
      
      <h3>SEO Advantages</h3>
      <p>Search engines give more weight to content with clear heading structure.</p>
    </div>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'DemoComponent',
  components: {
    ChildComponent
  },
  data() {
    return {
      title: 'Headings Demo'
    }
  }
}
</script>

<style scoped>
.demo-component {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #42b883;
  border-bottom: 2px solid #35495e;
  padding-bottom: 10px;
}

h2 {
  color: #35495e;
  margin-top: 30px;
}

h3, h4, h5, h6 {
  margin-top: 20px;
}

.section {
  margin-top: 40px;
}

.subsection {
  margin-left: 20px;
  border-left: 3px solid #42b883;
  padding-left: 20px;
}
</style>
