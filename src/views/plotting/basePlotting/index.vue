/* eslint-disable */
<template>
    <div>
    <!-- <div id="cesiumContainer" ref="cesiumContainer"></div> -->
    <div id="controlPanel">
      <div class="control-group">
        <button @click="startDrawing('point')">点</button>
        <button @click="startDrawing('polyline')">线</button>
        <button @click="startDrawing('polygon')">面</button>
        <button @click="startDrawing('box')">立方体</button>
      </div>
      <div class="control-group">
        <!-- <button @click="toggleEditMode">编辑模式</button> -->
        <!-- <button @click="undoLast">撤销</button> -->
        <button @click="clearAll">清除所有</button>
      </div>
      <!-- <div class="control-group" v-if="showMode">
        <label>立方体长度: </label>
        <input
          type='range'
          v-model= "long"
          min="10"
          max="1000"
          step="10"
          @input="updatelong"
        >
        <span>长度: {{ long }} 米</span>
      </div>
      <div class="control-group" v-if="showMode">
        <label>立方体宽度: </label>
        <input
          type='range'
          v-model= "width"
          min="10"
          max="1000"
          step="10"
          @input="updatewidth"
        >
        <span>高度: {{ width }} 米</span>
      </div> -->
      <div class="control-group" v-if="showMode">
        <label>立方体高度: </label>
        <input
          type='range'
          v-model= "height"
          min="10"
          max="1000"
          step="10"
          @input="updateHeight"
        >
        <span>高度: {{ height }} 米</span>
      </div>
      <!-- <div id="status">{{ status }}</div> -->
    </div>
  </div>
</template>

<script>

export default {
  name: 'CesiumDrawer',
  data() {
    return {
      drawHandler: null,
      activeShapePoints: [],
      activeShape: null,
      floatingPoint: null,
      drawingMode: null,
      drawnEntities: [],
      isEditing: false,
      selectedEntity: null,
      height: 500,
      status: '就绪',
      showMode: false,
      boxid: ''
    }
  },
  mounted() {
    this.open()
  },
  beforeDestroy() {
    this.clearAll()
  },
  methods: {
    open() {
      window.viewer.selectedEntityChanged.addEventListener(function(entity) {
        console.log(666, entity, entity._id)
        if (entity._id) {
          this.showMode = true
          this.boxid = entity._id
          console.log(777, this.boxid)
        }
      })
    },
    cleanup() {
      if (window.viewer) {
        this.stopDrawing()
        window.viewer.entities.removeAll()
        window.viewer.destroy()
      }
    },
    updateStatus(message) {
      this.status = message
    },
    startDrawing(mode) {
      if (this.isEditing) {
        this.toggleEditMode()
      }

      this.stopDrawing()
      this.drawingMode = mode
      this.showMode = false

      this.floatingPoint = this.createPoint(new window.Cesium.Cartesian3(), true)

      this.drawHandler = new window.Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)

      this.drawHandler.setInputAction((movement) => {
        const cartesian = this.getPosition(movement.endPosition)
        if (cartesian) {
          if (this.activeShapePoints.length > 0) {
            this.floatingPoint.position = cartesian
            this.updateShape()
          }
          this.updateStatus(`正在绘制: ${mode} (左键添加点, 右键完成, ESC取消)`)
        }
      }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE)

      this.drawHandler.setInputAction((click) => {
        const cartesian = this.getPosition(click.position)
        if (cartesian) {
          this.addPointToShape(cartesian)
        }
      }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK)

      this.drawHandler.setInputAction((click) => {
        if (this.activeShapePoints.length >= this.getMinPoints()) {
          this.finishDrawing()
        } else {
          this.updateStatus(`需要至少 ${this.getMinPoints()} 个点来完成绘制`)
        }
      }, window.Cesium.ScreenSpaceEventType.RIGHT_CLICK)

      this.updateStatus(`开始绘制: ${mode}`)
    },
    stopDrawing() {
      if (this.drawHandler) {
        this.drawHandler.destroy()
        this.drawHandler = null
      }

      if (this.floatingPoint) {
        window.viewer.entities.remove(this.floatingPoint)
        this.floatingPoint = null
      }

      if (this.activeShape) {
        window.viewer.entities.remove(this.activeShape)
        this.activeShape = null
      }

      this.activeShapePoints = []
      this.drawingMode = null
    },
    clearAll() {
      this.stopDrawing()
      window.viewer.entities.removeAll()
      this.drawnEntities = []
      this.updateStatus('已清除所有图形')
    },
    getPosition(screenPosition) {
      const ray = window.viewer.camera.getPickRay(screenPosition)
      let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene)

      // 如果没有击中地面，使用椭球体上的点
      if (!cartesian) {
        cartesian = window.viewer.scene.camera.pickEllipsoid(
          screenPosition,
          window.viewer.scene.globe.ellipsoid
        )
      }

      return cartesian
    },
    createPoint(position, isFloating) {
      return window.viewer.entities.add({
        position: position,
        point: {
          pixelSize: isFloating ? 8 : 10,
          color: isFloating ? window.Cesium.Color.RED : window.Cesium.Color.YELLOW,
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 1,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
    },
    getMinPoints() {
      switch (this.drawingMode) {
        case 'point': return 1
        case 'polyline': return 2
        case 'polygon': return 3
        case 'box': return 2
        default: return 0
      }
    },
    addPointToShape(cartesian) {
      if (this.activeShapePoints.length === 0) {
        this.floatingPoint.position = cartesian
        this.activeShapePoints.push(cartesian)
        this.createPoint(cartesian, false)
      } else {
        this.activeShapePoints.push(cartesian)
        this.createPoint(cartesian, false)
      }

      // 点类型只需要一个点
      if (this.drawingMode === 'point') {
        this.finishDrawing()
      }
    },
    updateShape() {
      if (this.activeShapePoints.length < 1) return

      if (this.activeShape) {
        window.viewer.entities.remove(this.activeShape)
      }

      switch (this.drawingMode) {
        case 'point':
          this.activeShape = this.createPoint(this.activeShapePoints[0], false)
          break

        case 'polyline':
          this.activeShape = window.viewer.entities.add({
            polyline: {
              positions: this.activeShapePoints,
              width: 8,
              material: window.Cesium.Color.BLUE.withAlpha(0.7),
              clampToGround: true
            }
          })
          break

        case 'polygon':
          var positions = this.activeShapePoints.slice()
          if (positions.length > 1) {
            positions.push(positions[0])
          }
          this.activeShape = window.viewer.entities.add({
            polygon: {
              hierarchy: positions,
              material: window.Cesium.Color.GREEN.withAlpha(0.5),
              outline: true,
              outlineColor: window.Cesium.Color.GREEN,
              outlineWidth: 2,
              clampToGround: true
            }
          })
          break

        case 'box':
          if (this.activeShapePoints.length === 2) {
            const minPoint = this.activeShapePoints[0]
            const maxPoint = this.activeShapePoints[1]

            const minX = Math.min(minPoint.x, maxPoint.x)
            const minY = Math.min(minPoint.y, maxPoint.y)
            const minZ = Math.min(minPoint.z, maxPoint.z)
            const maxX = Math.max(minPoint.x, maxPoint.x)
            const maxY = Math.max(minPoint.y, maxPoint.y)
            const maxZ = Math.max(minPoint.z, maxPoint.z) + this.height

            this.activeShape = window.viewer.entities.add({
              box: {
                dimensions: new window.Cesium.Cartesian3(
                  maxX - minX,
                  maxY - minY,
                  maxZ - minZ
                ),
                material: window.Cesium.Color.RED.withAlpha(0.5),
                outline: true,
                outlineColor: window.Cesium.Color.WHITE,
                outlineWidth: 2
              },
              position: new window.Cesium.Cartesian3(
                (minX + maxX) / 2,
                (minY + maxY) / 2,
                (minZ + maxZ) / 2
              )
            })
          }
          break
      }
    },
    finishDrawing() {
      if (this.activeShapePoints.length < this.getMinPoints()) {
        this.updateStatus(`需要至少 ${this.getMinPoints()} 个点来完成绘制`)
        return
      }

      let finalEntity
      switch (this.drawingMode) {
        case 'point':
          finalEntity = this.createPoint(this.activeShapePoints[0], false)
          break

        case 'polyline':
          finalEntity = window.viewer.entities.add({
            name: `Polyline ${this.drawnEntities.length + 1}`,
            polyline: {
              positions: this.activeShapePoints,
              width: 6,
              material: window.Cesium.Color.BLUE.withAlpha(0.7),
              clampToGround: true
              // width: 3,
              // material: new window.Cesium.PolylineGlowMaterialProperty({
              //   glowPower: 0.2,
              //   color: window.Cesium.Color.BLUE
              // }),
              // clampToGround: true
            }
          })
          break

        case 'polygon':
          var positions = this.activeShapePoints.slice()
          positions.push(positions[0])
          finalEntity = window.viewer.entities.add({
            name: `Polygon ${this.drawnEntities.length + 1}`,
            polygon: {
              hierarchy: positions,
              material: window.Cesium.Color.GREEN.withAlpha(0.5),
              outline: true,
              outlineColor: window.Cesium.Color.GREEN,
              outlineWidth: 2,
              clampToGround: true
            }
          })
          break

        case 'box':
          var minPoint = this.activeShapePoints[0]
          var maxPoint = this.activeShapePoints[1]

          var minX = Math.min(minPoint.x, maxPoint.x)
          var minY = Math.min(minPoint.y, maxPoint.y)
          var minZ = Math.min(minPoint.z, maxPoint.z)
          var maxX = Math.max(minPoint.x, maxPoint.x)
          var maxY = Math.max(minPoint.y, maxPoint.y)
          var maxZ = Math.max(minPoint.z, maxPoint.z) + 1000

          console.log(11111)
          finalEntity = window.viewer.entities.add({
            box: {
              dimensions: new window.Cesium.Cartesian3(
                maxX - minX,
                maxY - minY,
                maxZ - minZ + this.height
              ),
              material: window.Cesium.Color.RED.withAlpha(0.5),
              outline: true,
              outlineColor: window.Cesium.Color.WHITE,
              outlineWidth: 2
            },
            position: new window.Cesium.Cartesian3(
              (minX + maxX) / 2,
              (minY + maxY) / 2,
              (minZ + maxZ) / 2 - this.height
            )
          })

          this.showMode = true
          console.log(22222)
          break
      }

      if (finalEntity) {
        finalEntity.label = {
          text: finalEntity.name,
          font: '12pt sans-serif',
          fillColor: window.Cesium.Color.WHITE,
          outlineColor: window.Cesium.Color.BLACK,
          outlineWidth: 1,
          pixelOffset: new window.Cesium.Cartesian2(0, 15),
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }

        this.addProperties(finalEntity)
        this.drawnEntities.push(finalEntity)
      }

      this.stopDrawing()
      this.updateStatus(`已完成绘制: ${this.drawingMode}`)
    },

    addProperties(entity) {
      entity.properties = {
        type: this.drawingMode,
        creator: '用户绘制',
        createTime: new Date().toISOString(),
        description: ''
      }
    },

    toggleEditMode() {
      this.isEditing = !this.isEditing

      if (this.isEditing) {
        this.stopDrawing()
        this.updateStatus('编辑模式: 点击选择图形，拖动移动位置')

        this.drawHandler = new window.Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)

        this.drawHandler.setInputAction((click) => {
          const pickedObject = window.viewer.scene.pick(click.position)
          if (pickedObject && pickedObject.id) {
            this.selectEntity(pickedObject.id)
          } else {
            this.deselectEntity()
          }
        }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK)

        this.drawHandler.setInputAction((movement) => {
          if (this.selectedEntity && !this.selectedEntity.isMoving) {
            const cartesian = this.getPosition(movement.endPosition)
            if (cartesian) {
              if (this.selectedEntity.position) {
                this.selectedEntity.position = cartesian
              } else if (this.selectedEntity.polygon) {
                // 处理面的移动
              }
            }
          }
        }, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      } else {
        if (this.drawHandler) {
          this.drawHandler.destroy()
          this.drawHandler = null
        }
        this.deselectEntity()
        this.updateStatus('已退出编辑模式')
      }
    },

    selectEntity(entity) {
      this.deselectEntity()
      this.selectedEntity = entity

      // 高亮显示选中的实体
      if (entity.polyline) {
        entity.polyline.width = 5
      } else if (entity.polygon) {
        entity.polygon.outlineWidth = 4
      } else if (entity.box) {
        entity.box.outlineWidth = 4
        // 更新高度滑块
        if (entity.properties && entity.properties.height) {
          this.height = entity.properties.height
        }
      } else if (entity.point) {
        entity.point.pixelSize = 15
      }

      this.updateStatus(`已选择: ${entity.name}`)
    },

    deselectEntity() {
      if (this.selectedEntity) {
        // 恢复原始样式
        if (this.selectedEntity.polyline) {
          this.selectedEntity.polyline.width = 3
        } else if (this.selectedEntity.polygon) {
          this.selectedEntity.polygon.outlineWidth = 2
        } else if (this.selectedEntity.box) {
          this.selectedEntity.box.outlineWidth = 2
        } else if (this.selectedEntity.point) {
          this.selectedEntity.point.pixelSize = 10
        }

        this.selectedEntity = null
      }

      this.updateStatus('就绪')
    },

    undoLast() {
      if (this.drawnEntities.length > 0) {
        const lastEntity = this.drawnEntities.pop()
        window.viewer.entities.remove(lastEntity)
        this.updateStatus(`已撤销: ${lastEntity.name}`)
      } else {
        this.updateStatus('没有可撤销的操作')
      }
    },

    updateHeight() {
      console.log(555, window.viewer.entities._entities._array)
      // forEach
      window.viewer.entities._entities._array.forEach(e => {
        console.log(66677888,e,this.boxid , e._id);
        
        if (e.box && this.boxid === e._id) {
          var dim = e.box.dimensions.getValue()

          console.log('dim', dim)

          // e.box.dimensions = new window.Cesium.Cartesian3(dim.x, dim.y, this.height * 1000)
          e.box.dimensions = new window.Cesium.Cartesian3(dim.x, dim.y, parseFloat(this.height))
        }
      })

      // 如果正在绘制立方体，实时更新预览
      if (this.drawingMode === 'box' && this.activeShapePoints.length === 2) {
        this.updateShape()
      }

      // 如果选中了立方体实体，更新其高度
      if (this.selectedEntity && this.selectedEntity.box) {
        this.updateBoxHeight(this.selectedEntity, this.height)
      }
    },

    updateBoxHeight(entity, newHeight) {
      const dimensions = entity.box.dimensions.getValue()
      const position = entity.position.getValue()

      // 保持长宽不变，只改变高度
      const newDimensions = new window.Cesium.Cartesian3(
        dimensions.x,
        dimensions.y,
        newHeight
      )

      // 调整位置使底部保持在地面
      const newPosition = new window.Cesium.Cartesian3(
        position.x,
        position.y,
        position.z - (dimensions.z / 2) + (newHeight / 2)
      )

      entity.box.dimensions = newDimensions
      entity.position = newPosition
      entity.properties.height = newHeight
    }
  }
}
</script>

<style>

#controlPanel {
  position: absolute;
  top: 80px;
  left: 10px;
  background: rgba(42, 42, 42, 0.8);
  padding: 10px;
  border-radius: 5px;
  color: white;
  z-index: 999;
}

.control-group {
  margin-bottom: 10px;
}

button {
  margin-right: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

#status {
  margin-top: 10px;
  font-size: 14px;
}
</style>
