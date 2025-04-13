<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button size="small" :disabled="!hasPermission(RoleEnum.SUPER)" type="primary" @click="handleCreate">新增</Button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '修改',
              onClick: handleEdit.bind(null, record),
              disabled: !hasPermission(RoleEnum.SUPER),
            },
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
    <Modal @register="registerModal" @success="getMapList" />
  </div>
</template>

<script setup lang="ts">
  import { Button, message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import Modal from './Modal.vue';
  import { useModal } from '@/components/Modal';
  import { columns } from './data';
  import map from '@/api/map/index';
  import { usePermission } from '@/hooks/web/usePermission';
  import { RoleEnum } from '@/enums/roleEnum';

  const { hasPermission } = usePermission();

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, setTableData }] = useTable({
    title: '图层管理',
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

  const flat = (data, childrenKey = 'children') => {
    let result = [];
    const flatten = (node) => {
      let flatNode = { ...node };
      delete flatNode[childrenKey];
      result.push(flatNode);
      if (node[childrenKey] && node[childrenKey].length > 0) {
        node[childrenKey].forEach((child) => flatten(child));
      }
    };
    data.forEach((node) => flatten(node));
    return result;
  };

  const getDeptName = (data) => {
    let name = '';
    data.forEach((item, index) => {
      name += item.dname + (index == data.length - 1 ? '' : ' ，');
    });
    return name;
  };

  const getMapList = async () => {
    const { data } = await map.layerListApi({ pageSize: 999 });
    setTableData(
      data.records.map((item) => {
        return {
          ...item,
          deptNameList: getDeptName(flat(item.deptList)),
          fieldsMap: item.fieldsMap.value,
        };
      }),
    );
    reload();
  };
  getMapList();

  const rName = (arr) => {
    return arr.map((item) => {
      return {
        label: item.dname,
        value: item.did,
        options: item.children.length > 0 ? rName(item.children) : [],
      };
    });
  };

  const handleEdit = (record) => {
    openModal(true, {
      isUpdate: true,
      record,
    });
  };
  const handleDelete = async (f) => {
    let resp = await map.layerDelApi([f.id]);
    if (resp.succ == true) {
      message.success('删除成功');
      getMapList();
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
  :deep(.ant-popconfirm-buttons) {
    width: 125px !important;
  }
</style>
