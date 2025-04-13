<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button size="small" type="primary" @click="handleCreate">新增</Button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '修改',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="getAccountList" titles="账号"> </AccountModal>
  </div>
</template>

<script setup lang="ts">
  import { Button, message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import AccountModal from './components/AccountModal.vue';
  import { useModal } from '@/components/Modal';
  import { columns } from './data/accountData';
  import account from '@/api/system/account';

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, setTableData }] = useTable({
    title: '账号管理',
    columns,
    bordered: true,
    size: 'middle',
    isTreeTable: false,
    canResize: false,
    showIndexColumn: true,
    showTableSetting: true,
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

  const getAccountList = async () => {
    const { data } = await account.accountInfoApi({ pageSize: 999 });
    setTableData(data.records);
    reload();
  };
  getAccountList();

  const handleEdit = (record) => {
    openModal(true, {
      isUpdate: true,
      record,
    });
  };
  const handleDelete = async (f) => {
    let resp = await account.accountDelApi([f.uid]);
    if (resp.succ == true) {
      message.success('删除成功');
      getAccountList();
    } else {
      message.error(resp.msg as string);
    }
  };
  const handleCreate = () => {
    openModal(true, {
      isUpdate: false,
    });
  };
</script>
<style lang="less" scoped>
  :where(.css-dev-only-do-not-override-mqvs2y).ant-popconfirm .ant-popconfirm-buttons {
    width: 119px;
    text-align: end;
  }
</style>
