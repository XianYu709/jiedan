<template>
  <div>
    <Dialog v-model:open="open" title="视廊分析" @cancel="handleCancel" noPadding>
      <template #extra>
        <div class="flex items-center cursor-pointer" @click="drawerOpen = !drawerOpen">
          <span class="iconfont icon-shuqian align-middle" />
        </div>
      </template>
      <div class="relative overflow-hidden px-5 py-5">
        <ViewShed ref="vsRef" :params="markParams"> </ViewShed>
        <Button @click="openBookMark" class="ml-3">保存至书签</Button>
        <BookMark
          ref="bmRef"
          v-model:open="drawerOpen"
          @params="getParams"
          type="viewShed"
        ></BookMark>
      </div>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
  import Dialog from './Dialog.vue';
  import { ref, watch } from 'vue';
  import { Button, Slider } from 'ant-design-vue';
  import { ViewShed } from 'td-gis';
  import BookMark from './BookMark.vue';

  const drawerOpen = ref(false);
  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const emits = defineEmits(['update:open']);
  const open = ref<Boolean>(false);
  const handleCancel = () => {
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

  const vsRef = ref(null);
  const bmRef = ref(null);

  const openBookMark = () => {
    let params = vsRef.value.getParams();
    bmRef.value.set(params);
  };

  const markParams = ref({});
  const getParams = (e) => {
    // markParams.value = e;
    vsRef.value.setParams(e);
  };

</script>
<style lang="less" scoped>
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
