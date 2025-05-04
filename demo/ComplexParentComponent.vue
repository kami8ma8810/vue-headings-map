<template>
  <div class="complex-parent-component">
    <h1>Complex Component Structure</h1>
    <p>This component demonstrates a complex structure with multiple child components and deep nesting.</p>
    
    <div class="header-section">
      <h2>Component Architecture</h2>
      <p>This example shows how VueHeadingsMap handles complex component hierarchies.</p>
    </div>
    
    <!-- First Column - Direct Child -->
    <div class="layout-container">
      <div class="column left-column">
        <h2>First Column</h2>
        <p>This column contains a direct child component.</p>
        
        <ChildComponent :title="'Direct Child'" :showGrandchild="false">
          <h4>Slotted Content in Left Column</h4>
          <p>This heading comes from the parent but is rendered inside the child component.</p>
        </ChildComponent>
        
        <h3>After Direct Child</h3>
        <p>The parent component continues with its own headings after the child.</p>
      </div>
      
      <!-- Second Column - Child with Grandchild -->
      <div class="column middle-column">
        <h2>Second Column</h2>
        <p>This column contains a child component with its grandchild.</p>
        
        <ChildComponent :title="'Child with Grandchild'" :showGrandchild="true">
          <h4>Additional Slotted Content</h4>
          <p>Adding more slotted content to demonstrate complex slot usage.</p>
        </ChildComponent>
      </div>
      
      <!-- Third Column - Multiple Children -->
      <div class="column right-column">
        <h2>Third Column</h2>
        <p>This column demonstrates multiple child components with different configurations.</p>
        
        <h3>Multiple Sibling Components</h3>
        <p>These components are siblings, each with their own heading structure.</p>
        
        <ChildComponent 
          v-for="(child, index) in childConfigs" 
          :key="index"
          :title="child.title"
          :showGrandchild="child.showGrand">
          <template v-if="index === 0">
            <h4>First Sibling Slot</h4>
            <p>Content for the first sibling.</p>
          </template>
          <template v-else-if="index === 1">
            <h5>Second Sibling Slot</h5>
            <p>Content for the second sibling with an improper heading level.</p>
          </template>
        </ChildComponent>
        
        <h3>After Multiple Components</h3>
        <p>Parent headings continue after multiple child components.</p>
      </div>
    </div>
    
    <!-- Single Wide Row at Bottom -->
    <div class="full-width-section">
      <h2>Comprehensive Example</h2>
      <p>This section combines various patterns for heading structure across components.</p>
      
      <ParentWithChildren />
      
      <h3>Final Notes</h3>
      <p>This complex structure demonstrates how VueHeadingsMap can handle sophisticated component architectures.</p>
    </div>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';
import ParentWithChildren from './ParentWithChildren.vue';

export default {
  name: 'ComplexParentComponent',
  components: {
    ChildComponent,
    ParentWithChildren
  },
  data() {
    return {
      childConfigs: [
        { title: 'First Sibling', showGrand: false },
        { title: 'Second Sibling', showGrand: true }
      ]
    }
  }
}
</script>

<style scoped>
.complex-parent-component {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #35495e;
  margin-bottom: 30px;
}

h2 {
  color: #42b883;
  border-bottom: 1px solid #42b883;
  padding-bottom: 5px;
}

.layout-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 30px 0;
}

.column {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.left-column {
  border-left: 4px solid #42b883;
}

.middle-column {
  border-left: 4px solid #35495e;
}

.right-column {
  border-left: 4px solid #ff7e67;
}

.full-width-section {
  margin-top: 40px;
  padding: 30px;
  background-color: #f0f9f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.2);
}
</style>
