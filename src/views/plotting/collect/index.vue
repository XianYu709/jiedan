<template>
  <div class="container">
    <el-form label-width="90px" label-position="right">
      <el-form-item label="另存为" class="mb-0">
        <el-input v-model="allParmas.smlFile" placeholder="另存为" size="mini">
          <el-button slot="append" type="primary" @click="saveAsSmlFile"
            >保存</el-button
          >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="saveHandler" plain
          >保存修改</el-button
        >
        <el-button type="primary" size="mini" @click="uploadSmlFile" plain
          >选择本地文件并上传</el-button
        >
      </el-form-item>
      <el-form-item label="文件URL" class="mb-0">
        <el-input
          v-model="allParmas.downloadUrl"
          placeholder="文件URL"
          size="mini"
        >
          <el-button slot="append" type="primary" @click="down">下载</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="文件名称" class="mb-0">
        <el-input
          v-model="allParmas.smlFileName"
          placeholder="文件名"
          size="mini"
        >
          <el-button slot="append" type="primary" @click="deleteHandler"
            >删除</el-button
          >
        </el-input>
      </el-form-item>
      <div style="margin: 10px 0">
        <el-button type="primary" size="mini" @click="execute('play')"
          >态势推演</el-button
        >
        <el-button type="primary" size="mini" @click="execute('pause')"
          >暂停</el-button
        >
        <el-button type="primary" size="mini" @click="execute('reset')"
          >复位</el-button
        >
      </div>
    </el-form>
    <el-tree
      :data="treeData"
      node-key="label"
      class="el-tree"
      highlight-current
      :props="props"
    >
      <div slot-scope="{ node, data }" @click="nodeClick(node, data)">
        {{ data.label }}
      </div>
    </el-tree>
  </div>
</template>
<script>
import useHellper from "../military/helper";

export default {
  name: "CesiumDrawer",
  data() {
    return {
      props: {
        label: "label",
        children: "children",
      },
      allParmas: {
        smlFile: "",
        smlFileName: "",
        downloadUrl: "",
      },
      helper: null,
      treeData: [],
      labelKeys: [],
      hasAni: false,
      sitDataManager: null,
    };
  },
  created() {
    this.loadTreeData();
  },
  mounted() {
    this.initPlot();
  },
  destroyed() {
    // this.aniMationManager.removeAllGOAnimation();
    // this.helper.clearAll();
    // this.helper.destroy();
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        console.log(2);
        this.plottingHelper?.clearAll?.();
        this.plottingHelper?.destroy?.();
        this.aniMationManager.removeAllGOAnimation();
        this.helper.clearAll();
        this.helper.destroy();
      }, 1000);
    }
  },
  methods: {
    execute(type) {
      if (!this.hasAni) {
        this.$message({
          message: "此态势图无对应动画",
          type: "info",
        });
        return;
      }
      this.aniMationManager[type]();
    },
    down() {
      if (this.allParmas.downloadUrl) {
        window.open(this.allParmas.downloadUrl);
      }
    },
    saveHandler() {
      this.sitDataManager.saveSmlFile();
    },
    saveAsSmlFile() {
      const smlName = this.allParmas.smlFile;
      if (smlName.length !== 0) {
        this.sitDataManager.saveAsSmlFile(smlName);
      } else {
        this.$message({
          message: "请输入文件名",
          type: "info",
        });
      }
    },
    uploadSmlFile() {
      this.sitDataManager.uploadSmlFile(function (evt) {
        if (evt.success) {
          this.loadTreeData();
        }
        this.$message({
          message: evt.success ? "上传成功" : "上传失败",
          type: evt.success ? "success" : "error",
        });
      });
    },
    deleteHandler() {
      if (this.sitDataManager && this.allParmas.smlFileName) {
        if (this.labelKeys.includes(name)) {
          this.sitDataManager.deleteSmlFileOnServer(
            this.allParmas.smlFileName + "-evo"
          );
        }
        this.sitDataManager.deleteSmlFileOnServer(this.allParmas.smlFileName);
      }
    },
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
      this.allParmas = JSON.parse(
        JSON.stringify({
          smlFile: "",
          smlFileName: "",
          downloadUrl: "",
        })
      );
      this.treeData = JSON.parse(JSON.stringify([]));
      const url = window.plotHost + window.plotCollectUrl;
      const resp = await fetch(url);
      const data = await resp.json();
      let temp = data.map((it) => {
        const { SMLFileName, ...other } = it;
        const keys = Object.keys(other);
        return {
          label: SMLFileName,
          value: SMLFileName,
          children: keys.map((i) => {
            return { label: i, value: i };
          }),
        };
      });
      this.labelKeys = temp.map((it) => it.label);
      temp = temp.filter((it) => {
        return !it.label.endsWith("-evo");
      });
      this.treeData = temp;
    },
    initPlot() {
      const serverUrl = window.plotHost + window.plotSuffix;
      const viewer = window.viewer;
      const helper = useHellper(
        "collectLayer",
        viewer,
        viewer.scene,
        serverUrl
      );
      this.helper = helper;
      this.sitDataManager = helper.getDataManager();
      this.aniMationManager = this.helper.getAniMationManager();
      this.sitDataManager.saveSmlFileCompleted.addEventListener(() => {
        this.loadTreeData();
      });

      this.sitDataManager.deleteSmlFileCompleted.addEventListener(() => {
        this.loadTreeData();
      });
    },
    nodeClick(node, data) {
      if (!data.children) return;
      this.aniMationManager.removeAllGOAnimation();
      this.helper.clearAll();
      const url = this.sitDataManager.downloadSmlFileUrl(data.label);
      this.allParmas.downloadUrl = url;
      this.allParmas.smlFileName = data.label;
      let name = data.label + "-evo";
      if (this.labelKeys.includes(name)) {
        this.hasAni = true;
        this.aniMationManager.openEvoFileOnServer(name);
      } else {
        this.hasAni = false;
      }
      this.sitDataManager.openSmlFileOnServer(data.label);
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
