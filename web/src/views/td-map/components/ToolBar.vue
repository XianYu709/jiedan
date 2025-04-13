<template>
  <div class="fixed z-10" v-draggable>
    <div class="toolbar flex rounded-lg">
      <div
        class="flex flex-col px-4 py-3 cursor-pointer"
        v-for="(item, index) in data"
        :key="item.name"
        @click="selectHandler(item)"
      >
        <div v-if="item.name === 'division'" class="division"></div>
        <Tooltip placement="bottom" v-else>
          <template #title>
            <span>{{ item.title }}</span>
          </template>
          <Icon
            :icon="item.icon"
            :size="item.size ?? 26"
            class="text-gray-800 align-middle"
            :class="{ active: open[index] }"
          />
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Tooltip } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { ToolbarItem } from './types';
  const emits = defineEmits(['selectHandler']);
  const props = defineProps({
    data: { type: Array<ToolbarItem>, default: () => [] },
    open: { type: Array },
  });
  const selectHandler = (item: ToolbarItem) => {
    emits('selectHandler', item);
    if (item.hasOwnProperty('selected')) {
      item.selected = !item.selected;
    }
  };
</script>

<style scoped lang="less">
  .toolbar {
    background: #fffc;

    .division {
      width: 1px;
      height: 100%;
      background-color: #00000080;
    }
  }

  .active {
    color: var(--vxe-primary-color);
  }
</style>
