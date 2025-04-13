<template>
  <div ref="domRef">{{ value }} </div>
</template>

<script setup>
  // 引入第三方包
  import { ref } from 'vue';

  // 定义 props 或 emits
  const props = defineProps({
    visible: { type: Boolean, default: false },
  });
  const emits = defineEmits({});

  // 定义 Ref
  const domRef = ref(null);

  const name = computed(() => {
    return props.visible;
  });

  // 定义业务逻辑块
  const value = ref('');
  const handleValue = () => {
    value.value = '';
  };

  const valueHandler = () => {
    value.value = '';
  };

  //另一个业务逻辑块

  // watch
  watch(
    () => {},
    () => {},
  );
  watchEffect([value]);

  onMounted(() => {});

  defineExpose();
</script>

<style lang="scss" scoped></style>
