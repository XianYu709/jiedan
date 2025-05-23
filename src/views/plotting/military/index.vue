<template>
  <div class="container" @keydown.delete="handleDelete">
    <el-tabs v-model="activeName">
      <el-tab-pane label="标号库" name="标号库">
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
        </el-tree></el-tab-pane
      >
      <el-tab-pane
        :label="`动画效果 -${feature ? feature.symbolName : ''}`"
        name="动画效果"
      >
        <el-form ref="form" :model="form" label-width="100px" size="small">
          <el-form-item label="动画类型">
            <el-select
              v-model="form.type"
              placeholder="请选择动画效果"
              :disabled="!feature"
            >
              <el-option label="生长动画" value="ANIMATION_GROW"></el-option>
              <el-option label="闪烁动画" value="ANIMATION_BLINK"></el-option>
              <el-option label="显隐动画" value="ANIMATION_SHOW"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="动画持续时间">
            <el-input
              :disabled="!feature"
              v-model="form.duration"
              placeholder="请输入持续时间"
              type="number"
              size="small"
            ></el-input>
          </el-form-item>
          <template v-if="form.type == 'ANIMATION_GROW'">
            <el-form-item label="开始比例">
              <el-input
                :disabled="!feature"
                :min="0"
                v-model="form.startScale"
                type="number"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="结束比例">
              <el-input
                :min="0"
                :disabled="!feature"
                v-model="form.endScale"
                type="number"
                size="small"
              ></el-input>
            </el-form-item>
          </template>
          <template v-if="form.type == 'ANIMATION_BLINK'">
            <el-form-item label="闪烁间隔">
              <el-input
                :disabled="!feature"
                v-model="form.interval"
                type="number"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="交替颜色">
              <el-color-picker v-model="form.color" :disabled="!feature" />
            </el-form-item>
            <el-form-item label="交替起始颜色">
              <el-color-picker v-model="form.colorStart" :disabled="!feature" />
            </el-form-item>
          </template>
          <template v-if="form.type == 'ANIMATION_SHOW'">
            <el-form-item label="开始动画效果: ">
              <el-select
                size="small"
                v-model="form.startVisibility"
                placeholder="请选择开始动画效果"
              >
                <el-option label="显示" value="show"></el-option>
                <el-option label="隐藏" value="hide"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始动画效果: ">
              <el-select
                v-model="form.endVisibility"
                size="small"
                placeholder="请选择动画效果"
              >
                <el-option label="显示" value="show"></el-option>
                <el-option label="隐藏" value="hide"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <el-button
              type="primary"
              size="small"
              plain
              :disabled="!feature"
              @click="add"
              >添加</el-button
            >
            <el-button
              type="primary"
              size="small"
              plain
              :disabled="!feature"
              @click="play"
              >播放</el-button
            >
            <el-button
              type="primary"
              size="small"
              plain
              :disabled="!feature"
              @click="delte"
              >清除动画</el-button
            >
            <el-input
              :disabled="!feature"
              v-model="form.saveFileName"
              placeholder="保存名称"
              style="margin-left: 8px"
              size="small"
            >
              <el-button
                slot="append"
                type="primary"
                size="small"
                plain
                :disabled="!feature"
                @click="save"
                >保存</el-button
              >
            </el-input>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
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
      rootSymbolIconUrl: "",
      plottingHelper: null,
      plotEditControl: null,
      plotDrawControl: null,
      aniMationManager: null,
      sitDataManager: null,
      activeName: "标号库",
      feature: null,
      form: {
        type: "",
        saveFileName: "",
        duration: 5,
        startScale: 0,
        endScale: 1,
        interval: 500,
        color: "#FF0000",
        colorStart: "#0000FF",
        startVisibility: "show",
        endVisibility: "hide",
      },
    };
  },
  created() {
    this.loadTreeData();
  },
  mounted() {
    this.initPlot();
  },
  beforeDestroy() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        console.log(1);

        this.aniMationManager.removeAllGOAnimation();
        this.plottingHelper.destroy();
      }, 1000);
    }
  },
  methods: {
    add() {
      if (!this.feature || !this.form.type) {
        this.$message.warning("请先选择 feature 和动画类型！");
        return;
      }

      const type = SuperMap3D.GOAnimationType[this.form.type];
      const animationName = `Animation_${Date.now()}`;

      const animation = this.aniMationManager.createGOAnimation(
        type,
        animationName,
        this.feature
      );

      animation.startTime = 0;
      animation.duration = Number(this.form.duration) || 5;

      switch (this.form.type) {
        case "ANIMATION_GROW":
          animation.startScale = Number(this.form.startScale);
          animation.endScale = Number(this.form.endScale);
          break;
        case "ANIMATION_BLINK":
          animation.interval = Number(this.form.interval) || 1;
          animation.blinkStyle =
            SuperMap3D.BlinkAnimationBlinkStyle.Blink_Frequency;
          animation.replaceStyle =
            SuperMap3D.BlinkAnimationReplaceStyle.Replace_Color;
          animation.startColor = this.parseColor(
            this.form.colorStart || "#ffff00"
          );
          animation.endColor = this.parseColor(this.form.color || "#ff0000");
          break;
        case "ANIMATION_SHOW":
          animation.showEffect = false;
          animation.finalDisplay = this.form.endVisibility === "show";
          break;
        default:
          this.$message.error("暂不支持的动画类型！");
      }

      this.$message.success("动画已添加！");
    },
    parseColor(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = ((bigint >> 16) & 255) / 255;
      const g = ((bigint >> 8) & 255) / 255;
      const b = (bigint & 255) / 255;
      return new SuperMap3D.Color(r, g, b, 1.0);
    },
    play() {
      this.aniMationManager.play();
    },
    delte() {
      this.aniMationManager.removeGOAnimationByFeature(this.feature);
      this.form = JSON.parse(
        JSON.stringify({
          type: "",
          saveFileName: "",
          duration: 5,
          startScale: 0,
          endScale: 1,
          interval: 500,
          color: "#FF0000",
          colorStart: "#0000FF",
          startVisibility: "show",
          endVisibility: "hide",
        })
      );
    },
    save() {
      const smlName = this.form.saveFileName;
      if (smlName.length !== 0) {
        this.sitDataManager.saveAsSmlFile(smlName);
      } else {
        this.$message({
          message: "请输入文件名",
          type: "info",
        });
      }
      this.aniMationManager.saveEvoFile(smlName + "-evo", true);
      this.sitDataManager.saveSmlFileCompleted.addEventListener(() => {
        this.$message({
          message: "保存成功",
          type: "success",
          duration: 1800,
        });
        this.plottingHelper.clearAll();
      });
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
        this.rootSymbolIconUrl +
        names.join("/") +
        "/" +
        data.symbolCode +
        ".png"
      );
    },
    async loadTreeData() {
      const url = window.plotHost + window.plotSymbolLibPath;
      const symbolLibCode = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      }).then((resp) => resp.json());

      const symbols = await Promise.all(
        symbolLibCode.map(async (code) => {
          return fetch(
            plotHost + plotSymbolLibPath.replace(".json", "/") + code + ".json",
            {
              headers: {
                Accept: "application/json",
              },
            }
          ).then((res) => res.json());
        })
      );
      this.rootSymbolIconUrl = symbols[0].rootSymbolIconUrl;
      this.treeData = symbols.map((item) => item.rootSymbolLibNode);
    },
    initPlot() {
      const serverUrl = window.plotHost + window.plotSuffix;
      const viewer = window.viewer;
      this.plottingHelper = useHellper(
        "militaryLayer",
        viewer,
        viewer.scene,
        serverUrl,
        (e) => {
          this.feature = e;
        }
      );
      this.aniMationManager = this.plottingHelper.getAniMationManager();
      this.sitDataManager = this.plottingHelper.getDataManager();
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
::v-deep .el-tabs__item {
  color: white;
  opacity: 0.5;
}
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
