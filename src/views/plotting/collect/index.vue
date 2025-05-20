<template>
  <div class="container">
    <el-tree
      :data="treeData"
      node-key="SMLFileName"
      class="el-tree"
      highlight-current
      :props="{
        label: 'SMLFileName',
        children: 'childNodes',
      }"
    >
      <div
        slot-scope="{ node, data }"
        @click="nodeClick(node, data)"

      >
        {{ data.symbolName }}
      </div>
    </el-tree>
  </div>
</template>
<script>
export default {
  name: "CesiumDrawer",
  data() {
    return {
      treeData: [],
      defaultCheckedKeys: [5],
      plotEditControl: null,
      plotDrawControl: null,
      plotting: null,
    };
  },
  created() {
    this.loadTreeData();
  },
  mounted() {
    // this.initPlot();
  },
  beforeDestroy() {},
  methods: {
    getImg(node, data) {
      let names = [];
      const getLable = (parent) => {
        if (parent.data.symbolName) names.push(parent.data.symbolName);
        if (parent.parent) {
          return getLable(parent.parent);
        }
      };
      getLable(node.parent);
      names = names.reverse();
      return (
        "http://www.supermapol.com/realspace/output/SymbolIcon/" +
        names.join("/") +
        "/" +
        data.symbolCode +
        ".png"
      );
    },
    async loadTreeData() {
      const resp = await fetch('https://www.supermapol.com/realspace/services/plot-TY/rest/plot/smlInfos.rjson?start=0&count=10');
      const data= await resp.json();
      console.log(data);
      this.treeData = data;
    },
    initPlot() {
      const serverUrl = "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China_4326";
      // const serverUrl =
      //   "http://www.supermapol.com/realspace/services/plot-TY/rest/plot";
      const viewer = window.viewer;
      const scene = viewer.scene;
      if (!viewer) {
        return;
      }
      this.plottingLayer = new SuperMap3D.PlottingLayer(scene, "plottingLayer");
      scene.plotLayers.add(plottingLayer);

      this.plotting = SuperMap3D.Plotting.getInstance(serverUrl, scene);

      this.plotEditControl = new SuperMap3D.PlotEditControl(
        scene,
        plottingLayer
      ); //编辑控件
      this.plotEditControl.activate();
      this.plotDrawControl = new SuperMap3D.PlotDrawControl(
        scene,
        plottingLayer
      ); //绘制控件
      this.plotDrawControl.drawControlEndEvent.addEventListener(function () {
        //标绘结束，激活编辑控件
        this.plotEditControl.activate();
      });
    },
    nodeClick(node, data) {
      console.log(node, data);

    
    },
  },
};
</script>

<style scoped lang="scss">
$highTreeNodeBackgroundColor: rgba(95, 95, 95, 0.75);

.container {
  color: white;
  overflow: auto;
  ::v-deep {
    .el-card__body {
      padding: 15px;
    }
  }
  .el-tree {
    background: none;
    color: #cfcfcf;
    ::v-deep {
      .el-tree-node__content {
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
    ::v-deep {
      .el-tree-node__content {
        &:hover,
        &:has(.custom-tree-node.matched) {
          //background-color: rgba(95, 95, 95, 0.75);
          background-color: $highTreeNodeBackgroundColor;
        }
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }
    }
  }
  .el-tree--highlight-current {
    ::v-deep {
      .el-tree-node {
        &.is-current {
          .el-tree-node__content {
            //background-color: rgba(95, 95, 95, 0.75);
            background-color: $highTreeNodeBackgroundColor;
          }
        }
      }
    }
  }
}
</style>
