<script>
import { isFunction, isEmpty, debounce } from 'lodash'

const layerMap = {}
export default {
  name: 'MayLayers',
  props: {
    getViewer: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      treeProps: {
        children: 'children',
        label: 'label'
      },
      layers: [...window.MAP_CONFIG.layers],
      searchText: null,
      searchMatchIds: []
    }
  },
  mounted() {
    const treeRef = this.$refs['treeRef']
    const checkedNodes = []
    const findCheckedNodes = (layers) => {
      if (!isEmpty(layers)) {
        layers.forEach(layer => {
          findCheckedNodes(layer.children)
          if (layer.checked === true) {
            checkedNodes.push(layer)
          }
        })
      }
    }
    findCheckedNodes(this.layers)
    treeRef.setCheckedNodes(checkedNodes)
  },
  methods: {
    /**
     * 勾选，显示/隐藏图层
     * @param data 节点数据
     * @param checked 是否勾选
     * @param indeterminate
     * @returns {boolean}
     */
    handleCheckChange(data, checked, indeterminate) {
      const viewer = this.getCurrentViewer()
      if (!viewer) {
        return false
      }
      const { name, type, url, center = [], orientation = {}, flyTo = true } = data
      if (!url) {
        return false
      }
      let layer = layerMap[name]
      if (checked) {
        if (!layer) {
          // 添加scp图层
          if (type === 'scp') {
            viewer.scene.addS3MTilesLayerByScp(url, { name }).then((layer2) => {
              layerMap[name] = layer2
              flyTo && this.flyTo({ layer: layer2, center, orientation })
            })
          } else if (type === 'webp') { // 添加ImageryProvider
            layer = new window.Cesium.ImageryLayer(
              new window.Cesium.SuperMapImageryProvider({
                url,
                name,
                tileFormat: 'webp'
              })
            )
            layerMap[name] = layer
            viewer.imageryLayers.add(layer)
            flyTo && this.flyTo({ layer, center, orientation })
          } else if (type === 'terrain') { // 添加ImageryProvider
            layer = new window.Cesium.CesiumTerrainProvider({
              url: url,
              requestWaterMask: true,
              requestVertexNormals: true,
              invisibility:true,
              isSct: true
            })
            layerMap[name] = layer
            viewer.terrainProvider = layer
            flyTo && this.flyTo({ layer, center, orientation })
          } else if (type === 'wmts') {
            // 添加ImageryProvider
            layer = viewer.imageryLayers.addImageryProvider(new window.Cesium.WebMapTileServiceImageryProvider({
              url: url,
              layer: name, // 必需参数
              style: 'default', // 必需参数，通常设为'default'
              format: 'image/png',
              tileMatrixSetID: 'EPSG:3857',
              maximumLevel: 18
            }))
            layerMap[name] = layer
            flyTo && this.flyTo({ layer, center, orientation })
          }
        } else {
          if (['scp'].includes(type)) {
            layer.visible = true
          } else if (['webp'].includes(type)) {
            layer.show = true
          } else if (['terrain'].includes(type)) {
<<<<<<< HEAD
            viewer.terrainProvider.visible = true
=======
            viewer.terrainProvider = layer
>>>>>>> a5b38bad97f0a881d5862753fe42332e71e4bc6c
          } else if (['wmts'].includes(type)) {
            layer.show = true
          }
          flyTo && this.flyTo({ layer, center, orientation })
        }
      } else if (layer) {
        if (['scp'].includes(type)) {
          layer.visible = false
        } else if (['webp'].includes(type)) {
          layer.show = false
<<<<<<< HEAD
        } else if (['terrain'].includes(type)) {
          viewer.terrainProvider.visible = false
=======
        } else if (['terrin'].includes(type)) {
          viewer.terrainProvider = ''
>>>>>>> a5b38bad97f0a881d5862753fe42332e71e4bc6c
        } else if (['wmts'].includes(type)) {
          layer.show = false
        }
      }
    },
    /**
     * 居中
     * @param node
     * @param data
     * @returns {boolean}
     */
    handleFlyTo(node, data) {
      const viewer = this.getCurrentViewer()
      if (!viewer) {
        return false
      }
      const { name, center = [], orientation = {}} = data
      this.flyTo({ layer: layerMap[name], center, orientation })
    },
    handleSearchTextInput: debounce(function() {
      const searchMatchIds = []
      if (this.searchText) {
        const findMatchIds = (layers) => {
          if (!isEmpty(layers)) {
            layers.forEach(layer => {
              if (layer.label.includes(this.searchText)) {
                searchMatchIds.push(layer.id)
              }
              findMatchIds(layer.children)
            })
          }
        }
        findMatchIds(this.layers)
      }
      this.searchMatchIds = searchMatchIds
    }, 800),
    /**
     * 居中
     * @param layer 要居中的图层
     * @param center 指定中心点
     * @param orientation 指定视角
     * @returns {boolean}
     */
    flyTo({ layer, center, orientation }) {
      const viewer = this.getCurrentViewer()
      if (!viewer) {
        return false
      }
      if (!isEmpty(center)) {
        const [lng, lat, height] = center
        const options = {
          destination: window.Cesium.Cartesian3.fromDegrees(lng, lat, height),
          duration: 2
        }
        if (!isEmpty(orientation)) {
          const { heading, pitch, roll } = orientation
          options['orientation'] = {
            heading: window.Cesium.Math.toRadians(heading),
            pitch: window.Cesium.Math.toRadians(pitch),
            roll
          }
        }
        viewer.scene.camera.flyTo(options)
      } else if (layer) {
        viewer.flyTo(layer)
      }
    },
    /**
     * 获取viewer
     * @returns {false|*}
     */
    getCurrentViewer() {
      return isFunction(this.getViewer) && this.getViewer()
    }
  }
}
</script>

<template>
  <el-popover
    v-model="visible"
    placement="left-start"
    width="400"
    trigger="manual"
    :visible-arrow="false"
    popper-class="el-layer-popover"
    class="layer-popover"
  >
    <el-card class="layer-container">
      <div>
        <el-input
          v-model="searchText"
          clearable
          size="mini"
          placeholder="输入关键字搜索"
          prefix-icon="el-icon-search"
          style="margin-bottom:10px;"
          @input="handleSearchTextInput"
        />
        <el-tree
          ref="treeRef"
          :data="layers"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="treeProps"
          @check-change="handleCheckChange"
        >
          <span slot-scope="{ node, data }" :class="['custom-tree-node', searchMatchIds.includes(data.id) ? 'matched' : '']">
            <span>{{ node.label }}</span>
            <span v-if="node.isLeaf && node.checked">
              <el-button
                type="text"
                size="mini"
                @click.stop="() => handleFlyTo(node, data)"
              >
                居中
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <el-button
      slot="reference"
      title="图层控制"
      class="layer-btn"
      :class="visible ? 'active' : ''"
      @click="visible = !visible"
    />
  </el-popover>
</template>

<style lang="scss">
.layer-popover {
  position: absolute;
  top: 80px;
  right: 18px;
  background: none;
  border: none;
  padding: 0;
  box-shadow: none;
  .layer-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    background-image: url('~@/assets/map/layers-default.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 24px 24px;
    background-color: rgba(48, 51, 54, .7);
    border: 1px solid #444;
    &:hover, &.active {
      background-color: #48b;
      border-color: #aef;
      box-shadow: 0 0 8px #fff;
    }
  }
}
.el-popover.el-layer-popover {
  background: none;
  border: none;
  width: auto !important;
  margin-left: 0;
  padding: 0 0 0 10px;
}
</style>
<style scoped lang="scss">
$highTreeNodeBackgroundColor: rgba(95, 95, 95, 0.75);

.layer-container {
  max-height: 760px;
  width: 300px;
  border: 1px solid #444;
  background-color: rgba(38, 38, 38, 0.75);
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
        &:hover,
        &:has(.custom-tree-node.matched){
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
