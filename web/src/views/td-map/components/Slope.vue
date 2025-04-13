<template>
  <Dialog v-model:open="open" title="坡度分析" @cancel="handleCancel" noPadding>
    <template #extra>
      <div class="flex items-center cursor-pointer" @click="drawerOpen = !drawerOpen">
        <span class="iconfont icon-shuqian align-middle" />
      </div>
    </template>
    <div class="relative overflow-hidden px-5 py-5">
      <Slope ref="slopeRef" :params="markParams"> </Slope>
      <Button @click="openBookMark" class="ml-3">保存至书签</Button>
      <BookMark
        ref="bmRef"
        v-model:open="drawerOpen"
        @params="getParams"
        type="slop"
      ></BookMark>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import Dialog from './Dialog.vue';
  import { ref, watch } from 'vue';
  import { Slope } from 'td-gis';
  import BookMark from './BookMark.vue';
  import { Slider, Button, Form, RadioGroup, RadioButton, InputNumber } from 'ant-design-vue';
  const FormItem = Form.Item;

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
  const slopeRef = ref(null);
  const bmRef = ref(null);

  const openBookMark = () => {
    let params = slopeRef.value.getParams();
    bmRef.value.set(params);
  };

  const markParams = ref({});
  const getParams = (e) => {
    slopeRef.value.setParams(e);
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
