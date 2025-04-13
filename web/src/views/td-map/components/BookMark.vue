<template>
  <Drawer
    :placement="position"
    :closable="false"
    :open="open"
    :get-container="false"
    :style="{ position: 'absolute' }"
    @close="open = false"
    class="p-0"
  >
    <div class="mark-item" v-for="item in list" :key="item?.id">
      <div class="flex justify-between items-center">
        <div>
          <Input
            ref="inputRef"
            v-model:value="item.bookName"
            v-if="item?.id == 'edit'"
            size="small"
            placeholder="请输入书签名"
          />
          <span v-else>{{ item?.bookName }}</span>
        </div>
        <Button
          v-if="item?.id == 'edit'"
          size="small"
          type="primary"
          @click="save(item?.bookName, item?.bookJsonStr?.value)"
          >保存</Button
        >
        <Button v-else size="small" @click="useHandler(item?.bookJsonStr?.value)">使用</Button>
      </div>
      <div v-if="item?.id != 'edit'" class="text-right mt-2 -mb-2 text-gray text-size-xs">
        创建于 {{ item?.bookDate }}
      </div>
    </div>
    <Empty v-if="list.length == 0" :image="simpleImage" />
  </Drawer>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Drawer, Input, Button, Empty } from 'ant-design-vue';
  import bookmark from '@/api/bookMark/index';
  import { template } from 'xe-utils';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

  const props = defineProps({
    open: { type: Boolean, default: false },
    type: { type: String, required: true },
    position: { type: String, default: 'right' },
  });

  const emits = defineEmits(['update:open', 'params']);
  const open = ref<Boolean>(false);

  watch(
    () => props,
    () => {
      if (props.open == true) getData();
      open.value = props.open;
    },
    { deep: true },
  );

  const list = ref<any>([]);
  const getData = async () => {
    const {
      data: { records },
    } = await bookmark.MarkListApi({ pageSize: 999, bookType: props.type });
    list.value = records.filter((item) => item.bookType == props.type);
  };
  getData();

  const set = (params) => {
    open.value = true;
    list.value = list.value.filter((item) => item.id != 'edit');
    list.value.unshift({
      id: 'edit',
      bookName: '',
      bookJsonStr: {
        type: 'json',
        value: JSON.stringify(params),
      },
    });
  };

  const inputRef = ref<HTMLElement | null>(null);
  const save = async (bookName: string, bookJsonStr) => {
    if (bookName.trim().length == 0) {
      inputRef.value[0].focus();
      return;
    }
    const { succ } = await bookmark.MarkAddApi({
      bookType: props.type,
      bookName,
      bookJsonStr: JSON.parse(bookJsonStr),
    });
    if (succ) open.value = false;
  };

  const useHandler = (params) => {
    emits('params', JSON.parse(params));
    open.value = false;
  };

  defineExpose({ set });
</script>
<style lang="less" scoped>
  .mark-item {
    width: 100%;
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid rgb(160 160 160 / 59.6%);
    border-radius: 8px;
  }
</style>
