<script lang="ts" setup>
import { computed } from 'vue';
type Props = {
  title?: string
  titleId?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Dynamic Heading',
  headingLevel: 1,
})

const headingTag = computed(() => `h${props.headingLevel}`)
</script>

<template>
  <div class="dynamic-heading-wrapper">
    <component :is="headingTag" :id="titleId">
      {{ title }}
      <slot />
    </component>
  </div>
</template>

<style scoped>
.dynamic-heading-wrapper {
  margin: 1rem 0;
}
</style>
