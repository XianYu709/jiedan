<template>
  <div class="date">
    <div class="text-lg leading-none mb-1 text-gray-600">{{ date }}</div>
    <div class="text-2xl leading-none">{{ time }}</div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { getDate } from '@/utils/time';
  const date = ref();
  const time = ref();
  const initTime = () => {
    setInterval(function () {
      const dateTime = new getDate();
      date.value = dateTime.format('yyyy.MM.dd');
      time.value = dateTime.format('hh:mm:ss');
    }, 1000);
  };
  onMounted(() => {
    initTime();
  });
</script>

<style scoped lang="less">
  .date {
    width: 100px;
    font-family: DS;
    letter-spacing: 1px;
  }
</style>
