<script>
import TargetPlottingHelper from '@/views/plotting/targetPlotting/helper'

let helper

export default {
  name: 'TargetPlottingIndex',
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      result: { items: [], totalNum: 0 },
      loading: false
    }
  },
  mounted() {
    this.handleRefresh()
  },
  beforeDestroy() {
    helper?.destroy()
  },
  methods: {
    handleRefresh() {
      this.handleClear()
      this.search(1)
    },
    handleCurrentChange() {
      this.search(this.pageNum)
    },
    handleClear() {
      this.result = { items: [], totalNum: 0 }
      helper?.clear()
    },
    handleFlyTo(id) {
      helper?.flyTo(id)
    },
    search(pageNum) {
      this.loading = true
      this.pageNum = pageNum
      if (!helper) {
        helper = new TargetPlottingHelper(window.viewer)
      }
      helper.search({ pageInfo: { pageNum, pageSize: this.pageSize }}).then(data => {
        this.result = data || { items: [], totalNum: 0 }
        this.loading = false
        console.log('result =', data)
      })
    }
  }
}
</script>

<template>
  <div class="target-plotting-container">
    <el-table
      v-loading="loading"
      :data="result.items"
      max-height="300"
      border
      stripe
      size="mini"
    >
      <el-table-column type="index" width="50" />
      <el-table-column prop="tgtName" label="目标名称" width="80" />
      <el-table-column prop="posValid" label="位置信息是否有效" width="150" />
      <el-table-column prop="tgtLon" label="经度" width="80" />
      <el-table-column prop="tgtLat" label="纬度" width="80" />
      <el-table-column prop="tgtHeight" label="高度，（米）" width="100" />
      <el-table-column prop="geoPosInfo" label="位置信息" width="120" show-overflow-tooltip />
      <el-table-column prop="pwrValid" label="威力范围是否有效" width="120" />
      <el-table-column prop="pwrDis" label="威力距离" width="80" />
      <el-table-column prop="pwrAz" label="威力范围，方位" width="150" />
      <el-table-column prop="pwrEl" label="威力范围，俯仰" width="150" />
      <el-table-column prop="converArea" label="占地面积" width="80" />
      <el-table-column prop="criticalPart" label="关键部位" width="80" />
      <el-table-column prop="tgtSizeLen" label="目标长度" width="80" />
      <el-table-column prop="tgtSizeWidth" label="目标宽度" width="80" />
      <el-table-column prop="tgtSizeHeight" label="目标高度（米）" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="150" show-overflow-tooltip />
      <el-table-column prop="positionFunction" label="地位作用" width="80" />
      <el-table-column prop="tgtType" label="目标类型" width="120" show-overflow-tooltip />
      <el-table-column prop="tgtFirmType" label="坚固类型" width="120" show-overflow-tooltip />
      <el-table-column prop="tgtFormStr" label="组成结构" width="80" />
      <el-table-column prop="tgtRoundCase" label="周围情况" width="80" />
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleFlyTo(row.id)">居中</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="pageNum"
      :page-size="pageSize"
      :total="result.totalNum"
      :pager-count="5"
      layout="total, prev, pager, next"
      class="card-pagination"
      @current-change="handleCurrentChange"
    />
    <div style="text-align: center;margin-top: 10px;">
      <el-button type="primary" size="small" @click="handleRefresh">刷新</el-button>
      <el-button size="small" @click="handleClear">清空</el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.target-plotting-container {
  .el-pagination.card-pagination {
    text-align: right;
    ::v-deep {
      .btn-prev, .btn-next {
        background: none;
        color: #ffffff;
      }
      .el-pager li {
        background: none;
        &:not(.active) {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
