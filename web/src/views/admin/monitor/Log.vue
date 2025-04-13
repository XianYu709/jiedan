<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '@/components/Table';
  import { columns } from './data';
  import log from '@/api/monitor/log';
  const [registerTable, { reload, setTableData }] = useTable({
    title: '系统日志',
    columns,
    bordered: true,
    size: 'middle',
    isTreeTable: false,
    canResize: false,
    showIndexColumn: true,
    showTableSetting: true,
    pagination: { pageSize: 12 },
  });


  const getLogList = async () => {
    const { data } = await log.logListApi({ pageSize: 999 });
    setTableData(data.records);
    reload();
  };
  getLogList();
</script>
<style lang="less" scoped>
</style>
