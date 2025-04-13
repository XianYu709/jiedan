<template>
  <div class="p-4 flex flex-row w-full">
    <BasicTable
      @register="registerKeyTable"
      class="w-370px h-full mr-16px"
      @row-click="keyChangeHandler"
      @selection-change="keyChangeHandler"
      :row-selection="{ type: 'radio', selectedRowKeys: [selectedKey] }"
    >
      <template #toolbar>
        <Button size="small" type="primary" @click="handleKeyCreate">新增</Button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              auth: record.paramName == '已删除' ? 'other' : '',
              onClick: handleKeyEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              auth: record.paramName == '已删除' ? 'other' : '',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleKeyDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>

    <BasicTable @register="registerValueTable" class="h-full">
      <template #toolbar>
        <Button size="small" type="primary" @click="handleValueCreate">新增</Button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '修改',
              onClick: handleValueEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              label: '删除',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleValueDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <KeyModal @register="registerKeyModal" @success="valueUpdate" titles="键" />
    <ValueModal @register="registerValueModal" @success="valueUpdate" titles="值" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Button, message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { keyColumns, ValueColumn } from './data/dictData';
  import { useModal } from '@/components/Modal';
  import KeyModal from './components/KeyModal.vue';
  import ValueModal from './components/ValueModal.vue';
  import DictApi from '@/api/system/dict';

  const selectedKey = ref();
  const valueMap = ref({});

  const [registerKeyModal, { openModal }] = useModal();
  const [registerKeyTable, { reload: keyReload, setTableData: setKTableData }] = useTable({
    title: '键管理',
    striped: false,
    columns: keyColumns,
    bordered: true,
    size: 'middle',
    isTreeTable: false,
    canResize: false,
    showIndexColumn: false,
    showTableSetting: true,
    pagination: { pageSize: 12 },
    actionColumn: {
      width: 90,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: undefined,
      align: 'center',
    },
  });

  const getKey = async (key = null) => {
    let { data } = await DictApi.keyInfoApi({ pageSize: 999 });
    selectedKey.value = key ? key : data.records[0].dictType;
    setKTableData(
      data.records.map((item) => {
        return {
          paramId: item.paramId,
          created: item.created,
          dictType: item.dictType,
          paramName: item.paramName,
          key: item.dictType,
        };
      }),
    );
    keyReload();
  };
  getKey();

  const handleKeyEdit = (record) => {
    openModal(true, {
      isUpdate: true,
      record,
    });
  };

  const handleKeyDelete = async (f) => {
    let resp = await DictApi.keyDelApi([f.paramId]);
    if (resp.succ == true) {
      message.success('删除成功');
      getKey();
    } else {
      message.error(resp.msg as string);
    }
  };
  const handleKeyCreate = (record) => {
    openModal(true, {
      isUpdate: false,
      record,
    });
  };

  /* ------------------- */

  const [registerValueModal, { openModal: openValueModal }] = useModal();
  const [registerValueTable, { reload: valueReload, setTableData: setVTableData }] = useTable({
    title: '值管理',
    columns: ValueColumn,
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

  const getValue = async () => {
    let { data } = await DictApi.ValueInfoApi({ pageSize: 999 });
    console.log(data);
    let res = {};
    data.records.forEach((item) => {
      if (!res[item.dictType]) {
        res[item.dictType] = [];
      }
      res[item.dictType].push(item);
    });
    console.log(res);
    valueMap.value = res;
    setVTableData(res[selectedKey.value]);
    valueReload();
  };
  getValue();

  const handleValueDelete = async (record) => {
    let resp = await DictApi.ValueDelApi([record.id]);
    if (resp.succ == true) {
      message.success('删除成功');
      getValue();
      getKey(record.dictType);
    } else {
      message.error(resp.msg as string);
    }
  };
  const handleValueEdit = (record) => {
    openValueModal(true, {
      isUpdate: true,
      record,
    });
  };
  const handleValueCreate = (record) => {
    openValueModal(true, {
      isUpdate: false,
      record,
    });
  };

  const valueUpdate = (dictType) => {
    getValue();
    getKey(dictType);
  };

  const keyChangeHandler = async (e) => {
    selectedKey.value = e.key || (e.keys[0] ? e.keys[0] : selectedKey.value);
    setVTableData(valueMap.value[selectedKey.value]);
    valueReload();
  };
</script>
<style lang="less" scoped>
  :where(.css-dev-only-do-not-override-mqvs2y).ant-popconfirm .ant-popconfirm-buttons {
    width: 119px;
    text-align: end;
  }
</style>
