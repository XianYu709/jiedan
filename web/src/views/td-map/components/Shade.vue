<template>
  <Dialog v-model:open="open" title="阴影分析" @cancel="handleCancel" noPadding>
    <template #extra>
      <div class="flex items-center cursor-pointer" @click="drawerOpen = !drawerOpen">
        <span class="iconfont icon-shuqian align-middle" />
      </div>
    </template>
    <div class="relative overflow-hidden px-5 py-5">
      <Button @click="openBookMark" class="ml-3">保存至书签</Button>
      <Shade :params="markParams" ref="shadeRef"></Shade>
      <BookMark ref="bmRef" v-model:open="drawerOpen" @params="getParams" type="shade"></BookMark>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import Dialog from './Dialog.vue';
  import { ref, watch } from 'vue';
  import { Shade } from 'td-gis';
  import { Button } from 'ant-design-vue';
  import BookMark from './BookMark.vue';

  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const emits = defineEmits(['update:open']);
  const open = ref<Boolean>(false);
  const handleCancel = () => {
    console.log(open.value);
    open.value = false;
    emits('update:open', false);
  };
  watch(
    () => props,
    () => {
      open.value = props.open;
    },
    { deep: true },
  );

  const drawerOpen = ref(false);

  const shadeRef = ref(null);
  const bmRef = ref(null);

  const openBookMark = () => {
    let params = shadeRef.value.getParams();
    bmRef.value.set(params);
  };

  const markParams = ref({});
  const getParams = (e) => {
    markParams.value = e;
    shadeRef.value.setParams(e);
  };
</script>
<style scoped>
  .title {
    color: #3b3b3b;
    cursor: pointer;
  }

  .title :hover {
    color: #40a9ff;
  }

  .active_title {
    color: #40a9ff;
    cursor: pointer;
  }
</style>
