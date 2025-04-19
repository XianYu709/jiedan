<template>
  <div class="nav-bar">
    <Menu
      v-model:selectedKeys="selectedKeys"
      :items="items"
      class="select-none"
      mode="horizontal"
      multiple
      @deselect="handleDeSelected"
      @select="handleSelected"
    ></Menu>
  </div>
</template>

<script lang="ts" setup>
import {createVNode, ref, watch} from 'vue';
import {Menu, MenuProps} from 'ant-design-vue';
import {CalculatorOutlined, SelectOutlined,} from '@ant-design/icons-vue';

const emits = defineEmits(['select', 'deselect']);
const props = defineProps({
  open: {type: Object},
});

const selectedKeys = ref<string[]>([]);
const items = ref<MenuProps['items']>([
  {
    key: 'layers',
    // icon: () => createVNode('span', { class: 'iconfont icon-distance text-lg' }),
    icon: () => createVNode(CalculatorOutlined),
    label: '图层管理',
    title: '图层管理',
  },
  {
    key: 'inquiry',
    icon: () => createVNode(SelectOutlined),
    label: '设施查询',
    title: '设施查询',
  },
  {
    key: 'measure',
    icon: () => createVNode(CalculatorOutlined),
    label: '空间量算',
    title: '空间量算',
  },
]);

watch(
  () => props.open,
  (value) => {
    let index = 0;
    selectedKeys.value = [];
    for (let key in value) {
      if (value[key]) {
        selectedKeys.value[index] = key;
        index = index + 1;
      }
    }
  },
  {deep: true},
);

const handleSelected = ({item, key, selectedKeys}) => {
  emits('select', {item, key, selectedKeys});
};
const handleDeSelected = ({item, key, selectedKeys}) => {
  emits('deselect', {item, key, selectedKeys});
};
</script>

<style lang="less" scoped>
.nav-bar {
  :deep(.ant-menu) {
    font-size: 16px;

    .ant-menu-item,
    .ant-menu-submenu-title {
      .ant-menu-item-icon,
      .anticon {
        font-size: 16px;
      }
    }
  }

  :deep(.ant-menu-light) {
    border-bottom: none;
    background: transparent;
  }

  :deep(.ant-menu-light.ant-menu-submenu) {
    & > .ant-menu {
      background-color: transparent;
    }
  }

  :deep(.ant-menu-light.ant-menu-horizontal) {
    & > .ant-menu-item-selected::after,
    & > .ant-menu-submenu-selected::after,
    & > .ant-menu-item-open::after,
    & > .ant-menu-submenu-open::after,
    & > .ant-menu-item:hover::after {
      border-bottom-color: #0000;
    }
  }

}
</style>
