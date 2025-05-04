<template>
  <div class="child-component">
    <h2>{{ title }}</h2>
    <p>This is a child component with its own heading structure.</p>
    
    <div class="child-section">
      <h3>Child Section Title</h3>
      <p>This section demonstrates headings in nested components.</p>
      
      <div class="child-subsection">
        <h4>Detailed Information</h4>
        <p>The extension should be able to parse headings from child components as well.</p>
        
        <h5>Deep Nesting Example</h5>
        <p>This demonstrates a deeply nested heading structure.</p>
      </div>
    </div>
    
    <div class="child-section">
      <h3>Another Child Section</h3>
      <p>Multiple sections with headings at the same level are properly structured.</p>
      
      <h6>Special Note</h6>
      <p>This heading skips from h3 to h6, which would trigger a warning.</p>
    </div>
    
    <!-- Grandchild Component Integration -->
    <div v-if="showGrandchild" class="grandchild-container">
      <h3>Grandchild Component Container</h3>
      <p>This section demonstrates even deeper component nesting.</p>
      
      <GrandchildComponent>
        <template #extra-content>
          <div class="slotted-grandchild-content">
            <h5>Slotted Content in Grandchild</h5>
            <p>This content is passed from the child component to its grandchild.</p>
          </div>
        </template>
      </GrandchildComponent>
    </div>
    
    <slot></slot>
  </div>
</template>

<script>
import GrandchildComponent from './GrandchildComponent.vue';

export default {
  name: 'ChildComponent',
  components: {
    GrandchildComponent
  },
  props: {
    title: {
      type: String,
      default: 'Child Component'
    },
    showGrandchild: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.child-component {
  border: 2px solid #42b883;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  background-color: #f8f8f8;
}

h2 {
  color: #42b883;
  border-bottom: 1px solid #35495e;
}

h3 {
  color: #35495e;
}

.child-section {
  margin-top: 20px;
}

.child-subsection {
  margin-left: 20px;
  padding-left: 15px;
  border-left: 3px solid #42b883;
}
</style>
