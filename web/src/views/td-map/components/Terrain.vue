<template>
  <Dialog v-model:open="open" title="地形分析" @cancel="handleCancel">
    <div class="pt-3">
      <RadioGroup v-model:value="groupValue">
        <RadioButton value="1">地形修改 </RadioButton>
        <RadioButton value="2">地形开挖 </RadioButton>
        <RadioButton value="3"> 地形抽出</RadioButton>
      </RadioGroup>
      <Modifications
        ref="modificationsRef"
        :clear-other="modificationsClears"
        v-show="groupValue == '1'"
      ></Modifications>
      <Excavation
        ref="excavationRef"
        :clear-other="excavationClears"
        v-show="groupValue == '2'"
      ></Excavation>
      <Extraction
        ref="extractionRef"
        :clear-other="extractionClears"
        v-show="groupValue == '3'"
      ></Extraction>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import Dialog from './Dialog.vue';
  import { ref, watch, onMounted } from 'vue';
  import { Excavation, Extraction, Modifications } from 'td-gis';
  import { RadioGroup, RadioButton, Divider, Button } from 'ant-design-vue';

  const groupValue = ref('1');

  const excavationRef = ref(null);
  const extractionRef = ref(null);
  const modificationsRef = ref(null);

  const modificationsClears = ref();
  const extractionClears = ref();
  const excavationClears = ref();

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
  watch(
    () => groupValue,
    () => {
      console.log(groupValue);
    },
    { deep: true },
  );
  onMounted(() => {
    modificationsClears.value = () => {
      extractionRef.value.clear();
      excavationRef.value.clear();
    };

    extractionClears.value = () => {
      modificationsRef.value.clear();
      excavationRef.value.clear();
    };

    excavationClears.value = () => {
      extractionRef.value.clear();
      modificationsRef.value.clear();
    };
  });
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
