<template>
  <Dialog v-model:open="open" title="开敞度分析" @cancel="handleCancel" noPadding>
    <template #extra>
      <div class="flex items-center cursor-pointer" @click="drawerOpen = !drawerOpen">
        <span class="iconfont icon-shuqian align-middle" />
      </div>
    </template>
    <div class="px-5 py-5 overflow-hidden relative">
      <ViewDome ref="vdRef" :params="markParams"></ViewDome>
      <BookMark
        ref="bmRef"
        v-model:open="drawerOpen"
        @params="getParams"
        type="viewDemo"
      ></BookMark>
      <Button @click="saveHandler">保存到书签</Button>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import Dialog from './Dialog.vue';
  import { ref, watch } from 'vue';
  import { ViewDome } from 'td-gis';
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

  const vdRef = ref(null);
  const bmRef = ref(null);
  const drawerOpen = ref(false);
  const saveHandler = async () => {
    let params = vdRef.value.getParams();
    bmRef.value.set(params);
  };

  const markParams = ref({});
  const getParams = (e) => {
    // markParams.value = e;
    vdRef.value.setParams(e)
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
