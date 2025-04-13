<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Select
          style="width: 170px"
          v-model:value="selected"
          :options="selectOptions"
          placeholder="数据源"
          @change="selectData"
          allowClear
        />
        <a-input-search
          v-model:value="searchValue"
          placeholder="搜索"
          style="width: 170px"
          @change="onSearch"
        />
        <Button type="primary" @click="setTableList" :disabled="!hasPermission(RoleEnum.SUPER)"
          >同步</Button
        >
      </template>
      <template #status="{ record }">
        <TableAction
          :actions="[
            {
              label: stateMap[record.status].label,
              color: stateMap[record.status].color,
            },
          ]"
        />
      </template>
    </BasicTable>
    <Modal @register="registerModal" />
  </div>
</template>

<script setup lang="ts">
  import { Button, Select } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import Modal from './Modal.vue';
  import { useModal } from '@/components/Modal';
  import { columns } from './data';
  import { computed, ref } from 'vue';
  import axios from 'axios';
  import dataApi from '@/api/data/data.ts';
  import { usePermission } from '@/hooks/web/usePermission';
  import { RoleEnum } from '@/enums/roleEnum';

  const { hasPermission } = usePermission();

  const gisDataUrl = import.meta.env.VITE_GLOB_GIS_URL;
  let match = gisDataUrl.match(/services\/(.*?)\/rest/);
  const selected = ref();
  const searchValue = ref();

  const getIServeData = async () => {
    selected.value = undefined;
    searchValue.value = undefined;
    const res: any = [];
    const { data: dataSource } = await axios.get(gisDataUrl + '/datasources.json', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });

    for (const source of dataSource.childUriList) {
      const { data: dataSets } = await axios.get(source + '/datasets.json', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      });

      dataSets.datasetNames.forEach((dataset, setIndex) => {
        res.push({
          dataSet: dataset,
          dataSource: dataSource.datasourceNames[dataSource.childUriList.indexOf(source)],
          status: null,
          url: dataSets.childUriList[setIndex],
          workSpace: match[1],
        });
      });
    }
    return res;
  };

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, setTableData }] = useTable({
    title: '数据管理',
    columns,
    bordered: true,
    size: 'middle',
    isTreeTable: false,
    canResize: false,
    showIndexColumn: true,
    showTableSetting: true,
    pagination: { pageSize: 12 },
    actionColumn: {
      width: 80,
      title: '状态',
      dataIndex: 'status',
      slots: { customRender: 'status' },
      fixed: undefined,
      align: 'center',
    },
  });

  const stateMap = {
    3: {
      color: 'error',
      label: '异常',
    },
    1: {
      color: 'success',
      label: '正常',
    },
    2: {
      color: 'info',
      label: '新增',
    },
  };

  const selectOptions = ref([]);
  let tableSourceData = [];
  const setTableList = async () => {
    let res: Array<Object> = await getIServeData();
    let { data }: Array<any> = await dataApi.dataAddApi(res);

    selectOptions.value = [...new Set(data.map(({ dataSource }) => dataSource))].map((item) => {
      return {
        label: item,
        value: item,
      };
    });
    tableSourceData = data;
    setTableData(tableSourceData);
    reload();
  };
  setTableList();

  const filterData = ref([]);
  const selectData = () => {
    searchValue.value = undefined;
    let res = tableSourceData.filter((item) => {
      return selected.value ? item.dataSource == selected.value : true;
    });
    filterData.value = res;
    setTableData(res);
    reload();
  };

  const onSearch = () => {
    let res = filterData.value.filter((item) => {
      return searchValue.value ? item.dataSet.includes(searchValue.value) : true;
    });
    setTableData(res);
    reload();
  };
</script>
<style lang="less" scoped>
  :deep(.ant-popconfirm-buttons) {
    width: 125px !important;
  }
</style>
