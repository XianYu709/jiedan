<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button size="small"    :disabled="!hasPermission([RoleEnum.SUPER])" type="primary" @click="handleCreate">新增</Button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '修改',
              onClick: handleEdit.bind(null, record),
              disabled: !hasPermission([RoleEnum.SUPER]),
            },
            {
              icon: 'ant-design:delete-outlined',
              label: '删除',
              color: 'error',
              disabled: !hasPermission([RoleEnum.SUPER]),
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <RoleModal @register="registerModal" @success="getRoleList" titles="账号"></RoleModal>
  </div>
</template>

<script setup lang="ts">
  import { Button, message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import RoleModal from './components/RoleModal.vue';
  import { useModal } from '@/components/Modal';
  import { columns } from './data/roleData';
  import role from '@/api/system/role';
  import { usePermission } from '@/hooks/web/usePermission';
  import { RoleEnum } from '@/enums/roleEnum';

  const [registerModal, { openModal }] = useModal();
  const { hasPermission } = usePermission();
  const [registerTable, { reload, setTableData }] = useTable({
    title: '角色管理',
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

  const getRoleList = async () => {
    const { data } = await role.roleListApi({ pageSize: 999 });
    setTableData(data.records);
    reload();
  };
  getRoleList();

  const handleEdit = (record) => {
    openModal(true, {
      isUpdate: true,
      record
    });
  };
  const handleDelete = async (f) => {
    let resp = await role.roleDelApi([f.rid]);
    if (resp.succ == true) {
      message.success('删除成功');
      getRoleList();
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

./data/roleData
