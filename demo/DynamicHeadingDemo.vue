<script lang="ts" setup>
import { ref } from 'vue';
import DynamicHeading from './DynamicHeading.vue';

// 異なるレベルの見出しを示すためのデータ
const sections = [
  { id: 'section1', title: 'Dynamic H1 Title', level: 1, content: '最上位の見出しです。' },
  { id: 'section2', title: 'Dynamic H2 Subtitle', level: 2, content: '2番目のレベルの見出しです。' },
  { id: 'section3', title: 'Dynamic H3 Section', level: 3, content: '3番目のレベルの見出しです。' },
  { id: 'section4', title: 'Dynamic H4 Subsection', level: 4, content: '4番目のレベルの見出しです。' },
  { id: 'section5', title: 'Dynamic H5 Detail', level: 5, content: '5番目のレベルの見出しです。' },
  { id: 'section6', title: 'Dynamic H6 Minor Detail', level: 6, content: '6番目のレベルの見出しです。' },
];

// 階層が正しくない例
const incorrectHierarchy = [
  { id: 'incorrect1', title: 'Starting with H2', level: 2, content: 'H1をスキップして直接H2から始まっています。' },
  { id: 'incorrect2', title: 'Jumping to H5', level: 5, content: 'H3をスキップしてH5に飛んでいます。' },
  { id: 'incorrect3', title: 'Back to H3', level: 3, content: 'H5からH3に戻っています。' },
];

// 変数を使用して動的に見出しレベルを変更する例
const dynamicLevel = ref(2);

const incrementLevel = () => {
  if (dynamicLevel.value < 6) {
    dynamicLevel.value++;
  }
};

const decrementLevel = () => {
  if (dynamicLevel.value > 1) {
    dynamicLevel.value--;
  }
};
</script>

<template>
  <div class="dynamic-heading-demo">
    <h1>動的見出しコンポーネントのデモ</h1>
    <p>これは動的に見出しレベルを変更するコンポーネントのデモです。</p>
    <!-- TODO: component :is パターンは一時的に無効化されています -->
    
    <section class="demo-section">
      <h2>正しい階層の例</h2>
      <p>以下は適切な階層で構成された動的見出しの例です。</p>
      
      <div v-for="section in sections" :key="section.id" class="section-item">
        <DynamicHeading 
          :title="section.title"
          :titleId="section.id"
          :headingLevel="section.level"
        >
          <span class="heading-badge">H{{ section.level }}</span>
        </DynamicHeading>
        <p>{{ section.content }}</p>
      </div>
    </section>
    
    <section class="demo-section">
      <h2>不適切な階層の例</h2>
      <p>以下は不適切な階層で構成された動的見出しの例です。拡張機能はこれらの問題を検出します。</p>
      
      <div v-for="section in incorrectHierarchy" :key="section.id" class="section-item warning">
        <DynamicHeading 
          :title="section.title"
          :titleId="section.id"
          :headingLevel="section.level"
        >
          <span class="heading-badge error">H{{ section.level }}</span>
        </DynamicHeading>
        <p>{{ section.content }}</p>
      </div>
    </section>
    
    <section class="demo-section">
      <h2>ユーザー操作による動的な変更</h2>
      <p>ボタンをクリックすると見出しレベルが変わります。</p>
      
      <div class="controls">
        <button @click="decrementLevel" :disabled="dynamicLevel <= 1">レベルを下げる</button>
        <span class="level-display">現在のレベル: H{{ dynamicLevel }}</span>
        <button @click="incrementLevel" :disabled="dynamicLevel >= 6">レベルを上げる</button>
      </div>
      
      <div class="section-item">
        <DynamicHeading 
          title="動的に変化する見出し"
          titleId="dynamic-level"
          :headingLevel="dynamicLevel"
        >
          <span class="heading-badge">H{{ dynamicLevel }}</span>
        </DynamicHeading>
        <p>このコンポーネントは現在H{{ dynamicLevel }}として表示されています。ボタンをクリックすると見出しレベルが変わります。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dynamic-heading-demo {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.section-item {
  margin: 20px 0;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-item.warning {
  border-left: 4px solid #ff9800;
  background-color: #fff9e6;
}

.heading-badge {
  display: inline-block;
  margin-left: 10px;
  padding: 2px 6px;
  font-size: 0.7em;
  background-color: #42b883;
  color: white;
  border-radius: 4px;
  vertical-align: middle;
}

.heading-badge.error {
  background-color: #ff5252;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 15px;
}

button {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.level-display {
  font-weight: bold;
  min-width: 150px;
  text-align: center;
}
</style>
