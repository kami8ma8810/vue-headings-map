<template>
  <div class="parent-component">
    <h1>Parent Component With Children</h1>
    <p>This component demonstrates how the VueHeadingsMap handles complex nested component structures.</p>
    
    <div class="parent-section">
      <h2>Parent's Own Content</h2>
      <p>This content belongs to the parent component directly.</p>
      
      <h3>Before Child Components</h3>
      <p>This heading is still part of the parent, before any children are included.</p>
    </div>
    
    <!-- First Child -->
    <div class="child-wrapper">
      <h2>First Child Container</h2>
      <p>This is a container for the first child component.</p>
      
      <ChildComponent :title="firstChildTitle">
        <h4>Slotted Content Heading</h4>
        <p>This heading is passed through a slot from parent to child.</p>
      </ChildComponent>
    </div>
    
    <!-- Direct Headings Continue -->
    <div class="parent-section">
      <h2>Between Child Components</h2>
      <p>Parent component headings continue between child components.</p>
      
      <h3>Mid-Document Section</h3>
      <p>The parent can have its own heading structure interspersed with child components.</p>
    </div>
    
    <!-- Second Child with Different Nesting Pattern -->
    <div class="child-wrapper">
      <ChildComponent :title="secondChildTitle">
        <div class="nested-slot-content">
          <h3>Nested Slot Heading</h3>
          <p>This demonstrates another pattern of slot usage with headings.</p>
          
          <h5>Deep Slotted Heading</h5>
          <p>This heading skips a level, which would trigger a warning.</p>
        </div>
      </ChildComponent>
    </div>
    
    <!-- Conclusion in Parent -->
    <div class="parent-section">
      <h2>Conclusion</h2>
      <p>The parent component concludes with its own headings.</p>
      
      <h3>Summary</h3>
      <p>This example demonstrates the complex interaction of headings across component boundaries.</p>
    </div>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentWithChildren',
  components: {
    ChildComponent
  },
  data() {
    return {
      firstChildTitle: 'First Child Instance',
      secondChildTitle: 'Second Child Instance'
    }
  }
}
</script>

<style scoped>
.parent-component {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
}

h1 {
  color: #35495e;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #42b883;
  border-bottom: 1px solid #42b883;
  padding-bottom: 5px;
}

.parent-section {
  margin-bottom: 40px;
}

.child-wrapper {
  margin: 40px 0;
  padding: 20px;
  background-color: #f0f9f5;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.1);
}

.nested-slot-content {
  margin: 20px;
  padding: 15px;
  background-color: #fff;
  border-left: 4px solid #35495e;
}
</style>
