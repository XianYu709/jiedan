<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button
          size="small"
          type="primary"
          :disabled="!hasPermission([RoleEnum.SUPER])"
          @click="handleCreate"
          >新增</Button
        >
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
    <DeptModal @register="registerModal" @success="getDeptList" titles="部门" />
  </div>
</template>

<script setup lang="ts">
  import { Button, message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { useModal } from '@/components/Modal';
  import { columns } from './data/deptData';
  import dept from '@/api/system/dept';
  import { usePermission } from '@/hooks/web/usePermission';
  import { RoleEnum } from '@/enums/roleEnum';
  import DeptModal from './components/DeptModal.vue';
  const { hasPermission } = usePermission();

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, setTableData }] = useTable({
    title: '部门管理',
    columns,
    bordered: true,
    size: 'middle',
    isTreeTable: false,
    canResize: false,
    showIndexColumn: false,
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

  const dName = (arr) => {
    return arr.map((item) => {
      return {
        leaf: item.dleaf,
        dname: item.dname,
        dnotes: item.dnotes,
        dcreated: item.dcreated,
        dparent: item.dparent,
        key: item.did,
        did: item.did,
        children: item.children.length > 0 ? dName(item.children) : [],
      };
    });
  };

  const getDeptList = async () => {
    const { data } = await dept.deptInfoApi({ pageSize: 999 });
    setTableData(dName(data));
    reload();
  };
  getDeptList();

  const handleEdit = (record) => {
    openModal(true, {
      isUpdate: true,
      record,
    });
  };
  const handleDelete = async (f) => {
    let resp = await dept.deptDelApi([f.did]);
    if (resp.succ == true) {
      message.success('删除成功');
      getDeptList();
    } else {
      message.error(resp.msg as string);
    }
  };
  const handleCreate = (record) => {
    openModal(true, {
      isUpdate: false,
      record,
    });
  };
</script>
<style lang="less" scoped>
  :where(.css-dev-only-do-not-override-mqvs2y).ant-popconfirm .ant-popconfirm-buttons {
    width: 119px;
    text-align: end;
  }
</style>
./accountData ./data/deptData
