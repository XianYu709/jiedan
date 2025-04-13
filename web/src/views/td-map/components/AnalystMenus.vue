<template>
  <Dialog v-model:open="open" :width="150" title="三维分析" @cancel="handleCancel">
    <div class="pt-3"
      ><div v-for="item in AnalystMenus" :key="item.id" class="title" @click="selectClick(item)"
        ><p class="ml-3">{{ item.title }}</p></div
      ></div
    >
  </Dialog>
</template>
<script setup lang="ts">
  import { ref,watch } from 'vue';
  import Dialog from './Dialog.vue';
  const open = ref(true);
  const AnalystMenus = [
    { id: 0, title: '网络分析' },
    { id: 1, title: '通视分析' },
    { id: 2, title: '视廊分析' },
    { id: 3, title: '天际线分析' },
    { id: 4, title: '退线分析' },
    { id: 5, title: '限高分析' },
    { id: 6, title: '坡度坡向分析' },
    { id: 7, title: '地形分析' },
    { id: 8, title: '阴影分析' },
    { id: 9, title: '剖面分析' },
    { id: 10, title: '立面分析' },
    { id: 11, title: '开敞度分析' },
    { id: 12, title: '绿地率分析' },
  ];
  const props = defineProps({
    open: { type: Boolean, default: false },
  })
  const emits = defineEmits(['AnalystMenus','update:open'])
  const selectClick = (value) => {
    emits('AnalystMenus',value)
  };
  const handleCancel = () => {
    open.value = false;
    emits('update:open', false);
  };

  watch(
    () => props,
    () => {
      open.value = props.open;
    },{deep:true}
  );
</script>
<style lang="less" scoped>
  .title {
    color: #3b3b3b;
    cursor: pointer;
    line-height: 25px;
    margin: 0 -24px;
  }
  .title:hover {
    color: #2297f7;
    background: linear-gradient(to right, #72bcfc, #f2f9ff);
  
  }
</style>
