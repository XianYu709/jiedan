<template>
  <Tabs v-model:activeKey="activeKey">
    <TabPane key="1" tab="影像卷帘"><ImageRoller></ImageRoller></TabPane>
    <TabPane key="2" tab="模型卷帘" force-render><ModelRoller></ModelRoller></TabPane>
  </Tabs>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { Tabs } from 'ant-design-vue';
  import ModelRoller from './ModelRoller.vue';
  import ImageRoller from './ImageRoller.vue';

  const activeKey = ref('1');
  const TabPane = Tabs.TabPane;
</script>
