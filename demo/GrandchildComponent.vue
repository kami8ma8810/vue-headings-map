<template>
  <div class="grandchild-component">
    <h3>Grandchild Component</h3>
    <p>This is a grandchild component (nested inside a child component).</p>
    
    <div class="grandchild-content">
      <h4>Grandchild Content Section</h4>
      <p>This section demonstrates deeply nested component heading structures.</p>
      
      <div class="grandchild-details">
        <h5>Detailed Information</h5>
        <p>The extension should handle headings at any nesting level, preserving hierarchy awareness.</p>
        
        <h6>Special Notes</h6>
        <p>The deepest level of HTML headings is h6.</p>
      </div>
    </div>
    
    <slot name="extra-content"></slot>
  </div>
</template>

<script>
export default {
  name: 'GrandchildComponent'
}
</script>

<style scoped>
.grandchild-component {
  border: 1px solid #35495e;
  border-radius: 6px;
  padding: 15px;
  margin: 15px 0;
  background-color: #f2f7f9;
}

h3 {
  color: #35495e;
  font-size: 1.2em;
  border-bottom: 1px dashed #42b883;
  padding-bottom: 5px;
}

h4, h5, h6 {
  margin-top: 15px;
  margin-bottom: 8px;
}

h4 {
  color: #42b883;
}

h5 {
  color: #35495e;
  font-size: 0.95em;
}

h6 {
  color: #666;
  font-size: 0.9em;
  font-style: italic;
}

.grandchild-details {
  margin-left: 15px;
  padding-left: 10px;
  border-left: 2px dotted #42b883;
}
</style>
