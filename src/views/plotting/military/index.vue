<template>
  <div class="container" @keydown.delete="handleDelete">
    <el-tree
      :data="treeData"
      node-key="id"
      class="el-tree"
      highlight-current
      :props="{
        children: 'childNodes',
        label: 'symbolName',
      }"
    >
      <div
        slot-scope="{ node, data }"
        v-if="data.symbolNodeType == 'SYMBOL_GROUP'"
      >
        {{ data.symbolName }}
      </div>
      <div
        slot-scope="{ node, data }"
        @click="nodeClick(node, data)"
        v-else
        style="padding: 5px 0; width: 60px; height: 70px"
      >
        <img
          :src="getImg(node, data)"
          alt=""
          style="width: 60px; height: 60px"
        />
        {{ data.symbolName }}
      </div>
    </el-tree>
  </div>
</template>
<script>
import useHellper from "./helper";

export default {
  name: "CesiumDrawer",
  data() {
    return {
      treeData: [],
      defaultCheckedKeys: [5],
      plottingHelper: null,
      plotEditControl: null,
      plotDrawControl: null,
    };
  },
  created() {
    this.loadTreeData();
  },
  mounted() {
    setTimeout(() => {
      this.initPlot();
    }, 3000)
  },
  beforeDestroy() {
  },
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
      const [one, two] = await Promise.all([
        fetch("data/22.json", {
          headers: {
            Accept: "application/json",
          },
        }).then((resp) => resp.json()),
        fetch("data/421.json", {
          headers: {
            Accept: "application/json",
          },
        }).then((resp) => resp.json()),
      ]);
      const data = [one.rootSymbolLibNode, two.rootSymbolLibNode];
      this.treeData = data;
    },
    initPlot() {
      const serverUrl =
        "http://www.supermapol.com/realspace/services/plot-TY/rest/plot";
      const viewer = window.viewer;
      this.plottingHelper = useHellper(viewer, viewer.scene, serverUrl);
    },
    nodeClick(node, data) {
      this.plottingHelper.drawSymbol(data.libID, data.symbolCode);
    },
    handleDelete() {
      this.plottingHelper.deleteSelected();
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
        height: 65px;
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
          height: 65px;
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
