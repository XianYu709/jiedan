<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button size="small" :disabled="!hasPermission(RoleEnum.SUPER)" type="primary"
                @click="handleCreate">新增
        </Button>
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

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'area'">
          {{ record.area }}
        </template>
      </template>
    </BasicTable>
    <Modal @register="registerModal" @success="getMapList"/>
  </div>
</template>

<script setup lang="ts">
import {Button, message} from 'ant-design-vue';
import {BasicTable, TableAction, useTable} from '@/components/Table';
import Modal from './Modal.vue';
import {useModal} from '@/components/Modal';
import {columns} from './data';
import dangerous from '@/api/emergency/dangerous';
import {usePermission} from '@/hooks/web/usePermission';
import {RoleEnum} from '@/enums/roleEnum';

const {hasPermission} = usePermission();

const [registerModal, {openModal}] = useModal();
const [registerTable, {reload, setTableData}] = useTable({
  title: '风险区域管理',
  columns,
  bordered: true,
  size: 'middle',
  isTreeTable: false,
  canResize: false,
  showIndexColumn: true,
  showTableSetting: true,
  pagination: {pageSize: 12},
  actionColumn: {
    width: 150,
    title: '操作',
    dataIndex: 'action',
    slots: {customRender: 'action'},
    fixed: undefined,
    align: 'center',
  },
});


const getMapList = async () => {
  const {data} = await dangerous.riskyAreaListApi({pageSize: 999});
  setTableData(
    data.records.map((item) => {
      return {
        ...item
      };
    }),
  );
  reload();
};
getMapList();


const handleDelete = async (f) => {
  let resp = await dangerous.riskyAreaDelApi(f.id);
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
