<template>
  <Dialog v-model:open="open" title="场景绘制" @cancel="handleCancel" noPadding>
    <template #extra>
      <div class="flex items-center cursor-pointer" @click="drawerOpen = !drawerOpen">
        <span class="iconfont icon-shuqian align-middle" />
      </div>
    </template>
    <div class="relative overflow-hidden px-5 py-5">
      <BookMark
        ref="bmRef"
        v-model:open="drawerOpen"
        @params="getParams"
        type="sceneDrawn"
      ></BookMark>
      <SceneDrawn ref="sdRef" :iconSize="props.iconSize" :s3mModels="props.s3mModels"></SceneDrawn>
      <Button @click="openBookMark" class="ml-3">保存至书签</Button>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { SceneDrawn } from 'td-gis';
  import { S3mModels } from './types.ts';
  import Dialog from './Dialog.vue';
  import { Button } from 'ant-design-vue';
  import BookMark from './BookMark.vue';

  const drawerOpen = ref(false);
  const props = defineProps({
    s3mModels: {
      type: Array<S3mModels>,
      default: () => {
        return [];
      },
    },
    open: { type: Boolean, default: false },
    iconSize: {
      type: Number,
      default: 40,
    },
  });
  const emits = defineEmits(['update:open']);
  const handleCancel = () => {
    open.value = false;
    emits('update:open', false);
  };
  const open = ref<boolean>(false);
  watch(
    () => props,
    () => {
      open.value = props.open;
    },
    { deep: true },
  );

  const sdRef = ref(null);
  const bmRef = ref(null);

  const openBookMark = () => {
    let params = sdRef.value.getParams();
    bmRef.value.set(params);
  };

  const getParams = (e) => {
    sdRef.value.setParams(e);
  };
</script>
<style lang="less" scoped></style>
