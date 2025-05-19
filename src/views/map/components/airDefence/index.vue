<script>
import AirDefenceHelper from './helper'

let helper

export default {
  name: 'AirDefence',
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      result: {}
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    handleSearch() {
      this.search(1)
    },
    handleCurrentChange() {
      this.search(this.currentPage)
    },
    handleClear() {
      this.result = { data: [], total: 0 }
    },
    search(pageNum) {
      if (!helper) {
        helper = new AirDefenceHelper(window.viewer)
      }
      helper.search({ pageNum, pageSize: this.pageSize }).then(result => {
        this.result = result || { data: [], total: 0 }
      })
    }
  }
}
</script>

<template>
  <div class="air-defence-container">
    <el-table
      :data="result.data"
      max-height="300"
      border
      stripe
      size="mini"
    >
      <el-table-column prop="index" width="50" />
      <el-table-column prop="tgtName" label="目标名称" width="50" />
      <el-table-column prop="posValid" label="位置信息是否有效" width="150" />
      <el-table-column prop="tgtLon" label="经度" width="80" />
      <el-table-column prop="tgtLat" label="纬度" width="80" />
      <el-table-column prop="tgtHeight" label="高度，（米）" width="100" />
      <el-table-column prop="geoPosInfo" label="位置信息" width="80" />
      <el-table-column prop="pwrValid" label="威力范围是否有效" width="120" />
      <el-table-column prop="pwrDis" label="威力距离" width="80" />
      <el-table-column prop="pwrAz" label="威力范围，方位" width="150" />
      <el-table-column prop="pwrEl" label="威力范围，俯仰" width="150" />
      <el-table-column prop="converArea" label="占地面积" width="80" />
      <el-table-column prop="criticalPart" label="关键部位" width="80" />
      <el-table-column prop="tgtSizeLen" label="目标长度" width="80" />
      <el-table-column prop="tgtSizeWidth" label="目标宽度" width="80" />
      <el-table-column prop="tgtSizeHeight" label="目标高度（米）" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="80" />
      <el-table-column prop="positionFunction" label="地位作用" width="80" />
      <el-table-column prop="tgtType" label="目标类型" width="80" />
      <el-table-column prop="tgtFirmType" label="坚固类型" width="80" />
      <el-table-column prop="tgtFormStr" label="组成结构" width="80" />
      <el-table-column prop="tgtRoundCase" label="周围情况" width="80" />
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="result.total"
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <div>
      <el-button type="primary" @click="handleSearch">获取数据</el-button>
      <el-button @click="handleClear">清空</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
