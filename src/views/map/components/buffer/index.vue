<script>
import request from '@/utils/request'
import { debounce } from 'lodash'
import * as turf from '@turf/turf'

const {
  GeoJsonDataSource,
  Color
} = window.Cesium

const geoJsonStyle = {
  stroke: Color.HOTPINK,
  strokeWidth: 3,
  fill: Color.PINK,
  clampToGround: true
}

const bufferedStyle = {
  stroke: Color.fromAlpha(Color.LIGHTSKYBLUE, 0.5),
  strokeWidth: 3,
  fill: Color.fromAlpha(Color.LIGHTSKYBLUE, 0.5),
  clampToGround: true
}

const dataSourceMap = {}

export default {
  name: 'MapBufferIndex',
  data() {
    return {
      fileNames: [],
      radius: 1,
      radiusUnit: 'meters',
      bufferFiles: [...window.MAP_CONFIG.bufferFiles]
    }
  },
  computed: {
    fileNameMap() {
      const fileNameMap = {}
      this.bufferFiles.forEach(file => {
        fileNameMap[file.name] = file
      })
      return fileNameMap
    }
  },
  unmounted() {
    const viewer = window.viewer
    Object.keys(dataSourceMap).forEach(fileName => {
      const { dataSource, bufferedDataSource } = dataSourceMap[fileName]
      viewer.dataSources.remove(dataSource)
      viewer.dataSources.remove(bufferedDataSource)
    })
  },
  methods: {
    handleChange() {
      const viewer = window.viewer
      this.bufferFiles.forEach(file => {
        const { name: fileName, path: filePath } = file
        if (this.fileNames.includes(fileName)) {
          if (dataSourceMap[fileName]) {
            dataSourceMap[fileName]['dataSource'].show = true
            dataSourceMap[fileName]['bufferedDataSource'].show = true
          } else {
            request.get(filePath, { baseURL: '/', responseType: 'blob' }).then(response => {
              response.text().then(text => {
                const geoJson = JSON.parse(text)
                viewer.dataSources.add(GeoJsonDataSource.load(geoJson, geoJsonStyle))
                  .then(dataSource => {
                    const feature = this.getFeature(geoJson)
                    const buffered = turf.buffer(feature, this.radius, { units: this.radiusUnit })
                    dataSourceMap[fileName] = { dataSource, feature }
                    viewer.dataSources.add(GeoJsonDataSource.load(buffered, bufferedStyle))
                      .then(bufferedDataSource => {
                        dataSourceMap[fileName]['bufferedDataSource'] = bufferedDataSource
                        this.sortDataSources()
                      })
                    viewer.flyTo(dataSource)
                  })
              })
            })
          }
        } else if (dataSourceMap[fileName]) {
          dataSourceMap[fileName]['dataSource'].show = false
          dataSourceMap[fileName]['bufferedDataSource'].show = false
        }
      })
    },
    handleRadiusChange2: debounce(function() {
      const viewer = window.viewer
      Object.keys(dataSourceMap).forEach(fileName => {
        viewer.dataSources.remove(dataSourceMap[fileName]['bufferedDataSource'])
        const buffered = turf.buffer(dataSourceMap[fileName]['feature'], this.radius, { units: this.radiusUnit })
        viewer.dataSources.add(GeoJsonDataSource.load(buffered, bufferedStyle))
          .then(bufferedDataSource => {
            dataSourceMap[fileName]['bufferedDataSource'] = bufferedDataSource
            this.sortDataSources()
          })
      })
    }, 500),
    sortDataSources() {
      const dataSources = window.viewer.dataSources
      Object.keys(dataSourceMap).forEach(fileName => {
        const { dataSource, bufferedDataSource } = dataSourceMap[fileName]
        const index = dataSources.indexOf(dataSource)
        const bufferedIndex = dataSources.indexOf(bufferedDataSource)
        if (bufferedIndex > index) {
          dataSources._dataSources.splice(bufferedIndex + 1, 0, ...dataSources._dataSources.splice(index, 1))
        }
      })
    },
    getFeature(geoJson) {
      const features = []
      if (geoJson.type === 'FeatureCollection') {
        geoJson.features.forEach(feature => {
          const { type, geometry } = feature
          if (type === 'Feature') {
            if (geometry.type === 'MultiLineString') {
              features.push(turf.multiLineString(geometry.coordinates))
            } else if (geometry.type === 'LineString') {
              features.push(turf.lineString(geometry.coordinates))
            }
          }
        })
      }
      return turf.featureCollection(features)
    }
  }
}
</script>

<template>
  <el-card
    class="map-buffer-container"
  >
    <el-form
      size="small"
      label-width="50px"
      class="buffer-form"
    >
      <el-form-item label="图层">
        <el-select
          v-model="fileNames"
          multiple
          collapse-tags
          :multiple-limit="2"
          placeholder="请选择图层"
          size="small"
          clearable
          popper-class="buffer-select-popper"
          @change="handleChange"
        >
          <el-option
            v-for="item in bufferFiles"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
            {{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="半径">
            <el-input-number
              v-model="radius"
              controls-position="right"
              :min="1"
              :max="9999"
              @change="handleRadiusChange2"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位">
            <el-select
              v-model="radiusUnit"
              popper-class="buffer-select-popper"
              @change="handleRadiusChange2"
            >
              <el-option label="米" value="meters">米</el-option>
              <el-option label="千米" value="kilometers">千米</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<style lang="scss">
$background-color: rgba(38, 38, 38, 0.75);
$border-color: rgba(157, 157, 157, 0.75);
$color: #a5a5a5;

.buffer-select-popper {
  background-color: $background-color;
  border-color: $border-color;
  .el-select-dropdown__item {
    background-color: $background-color;
    color: $color;
    &.selected.hover {
      background-color: $background-color;
      color: $color;
    }
  }
  .popper__arrow {
    top: -7px !important;
    border-bottom-color: $border-color !important;
    &::after {
      border-bottom-color: $border-color !important;
    }
  }
}
</style>

<style scoped lang="scss">
$background-color: rgba(38, 38, 38, 0.75);
$border-color: rgba(157, 157, 157, 0.75);
$color: #a5a5a5;

.map-buffer-container {
  position: absolute;
  top: 80px;
  left: 15px;
  width: 350px;
  max-height: 760px;
  border: 1px solid #444;
  background-color: $background-color;
  color: white;
  overflow: auto;
  ::v-deep {
    .el-card__body {
      padding: 15px;
    }
  }
}
.buffer-form {
  margin-bottom: -18px;
  ::v-deep {
    .el-form-item__label {
      color: $color;
    }
  }
  .el-input-number {
    width: 100%;
    ::v-deep {
      .el-input-number__decrease,
      .el-input-number__increase,
      .el-input input {
        background: none;
        border-color: $border-color;
        color: $color;
      }
    }
  }
  .el-select {
    ::v-deep {
      .el-input {
        &.is-focus {
          .el-input__inner {
            border-color: $border-color;
          }
        }
        .el-input__inner {
          color: $color;
          background: none;
          border-color: rgba(95, 95, 95, 0.75);
        }
      }
    }
  }
}
</style>
