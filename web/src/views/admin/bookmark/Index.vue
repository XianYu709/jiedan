<template>
  <div class="p-4">
    <BasicTable
      @register="registerTable"
      :row-selection="{ type: 'checkbox' }"
      @selection-change="keyChangeHandler"
    >
      <template #toolbar>
        <Button
          v-show="hasPermission(RoleEnum.SUPER) && delRows.length > 0"
          size="small"
          type="error"
          @click="handleDelete(delRows)"
          >批量删除</Button
        >
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:delete-outlined',
              label: '删除',
              color: 'error',
              disabled: !hasPermission(RoleEnum.SUPER),
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <Modal @register="registerModal" />
  </div>
</template>

<script setup lang="ts">
  import { Button } from 'ant-design-vue';
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import Modal from './Modal.vue';
  import { useModal } from '@/components/Modal';
  import bookmark from '@/api/bookMark/index';
  import { columns } from './data';

  import { usePermission } from '@/hooks/web/usePermission';
  import { RoleEnum } from '@/enums/roleEnum';

  const { hasPermission } = usePermission();

  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload, setTableData, getSelectRows }] = useTable({
    title: '书签管理',
    columns,
    bordered: true,
    size: 'middle',
    isTreeTable: false,
    canResize: false,
    showIndexColumn: true,
    showTableSetting: true,
    clickToRowSelect: false,
    pagination: { pageSize: 12 },
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
      align: 'center',
    },
  });

  const getData = async () => {
    const {
      data: { records },
    } = await bookmark.MarkListApi({ pageSize: 999 });
    setTableData(
      records.map((item) => {
        return {
          ...item,
          bookJsonStr: item.bookJsonStr?.value,
        };
      }),
    );
    reload();
  };
  getData();

  const handleDelete = async (e) => {
    const resp = await bookmark.MarkDeltApi(Array.isArray(e) ? e : [e.id]);
    console.log(resp);
    getData();
  };

  const delRows = ref([]);
  const keyChangeHandler = () => {
    delRows.value = getSelectRows().map((item) => item.id);
  };
</script>
<style lang="less" scoped>
  :deep(.ant-popconfirm-buttons) {
    width: 125px !important;
  }
</style>
