<template>
  <Dialog v-model:open="open" title="量算" :width="290" @cancel="handleCancel" noPadding>
    <div class="relative overflow-hidden bg-transparent rounded-md" :style="styles">

    </div>
  </Dialog>
</template>
<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import Dialog from './Dialog.vue';
  import { RadioGroup, RadioButton, Divider, Button } from 'ant-design-vue';
  const open = ref(false);
  const checked = ref(0);
  const drawerOpen = ref(false);

  const current = ref<any>(null);
  const getCurrent = (e) => {
    current.value = false;
    // current.value = e;
    // drawerOpen.value = !!e;
    drawerOpen.value = false;
  };

  const styles = computed(() => {
    return { height: !!current.value ? '220px' : '0px', transition: 'all 0.33s' };
  });

  const props = defineProps({
    open: { type: Boolean, default: false },
  });
  const emits = defineEmits(['update:open']);

  const handleCancel = () => {
    open.value = false;
    emits('update:open', false);
  };

  const getMeasureParams = (e) => {
    console.log(e);
  };

  const getParams = (e) => {
    current.value = false;
    console.log(e);
  };
  watch(
    () => props,
    () => {
      open.value = props.open;
    },
    { deep: true },
  );
</script>
<style lang="less" scoped></style>
