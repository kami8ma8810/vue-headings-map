<script lang="ts" setup>
import { computed } from 'vue';
type Props = {
  title?: string
  titleId?: string
  headingLevel?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Dynamic Heading',
  headingLevel: 1,
})

const headingTag = computed(() => `h${props.headingLevel}`)
</script>

<template>
  <div class="dynamic-heading-wrapper">
    <!-- TODO: component :is パターンは一時的に無効化されています -->
    <!-- <component :is="headingTag" :id="titleId">
      {{ title }}
      <slot />
    </component> -->
    
    <!-- 代替実装 -->
    <h1 v-if="headingLevel === 1" :id="titleId">{{ title }}<slot /></h1>
    <h2 v-else-if="headingLevel === 2" :id="titleId">{{ title }}<slot /></h2>
    <h3 v-else-if="headingLevel === 3" :id="titleId">{{ title }}<slot /></h3>
    <h4 v-else-if="headingLevel === 4" :id="titleId">{{ title }}<slot /></h4>
    <h5 v-else-if="headingLevel === 5" :id="titleId">{{ title }}<slot /></h5>
    <h6 v-else-if="headingLevel === 6" :id="titleId">{{ title }}<slot /></h6>
  </div>
</template>

<style scoped>
.dynamic-heading-wrapper {
  margin: 1rem 0;
}
</style>
