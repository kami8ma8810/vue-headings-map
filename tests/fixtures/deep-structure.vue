<template>
  <div class="deeply-nested">
    <div class="container">
      <h2>This is a level 2 heading</h2>
      <div class="content">
        <p>Some content before a level 1 heading</p>
        <h1>This should cause a warning</h1>
        <h3>This is a level 3 heading</h3>
        <h5>This skips level 4 - another warning</h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComplexStructureComponent'
}
</script>
