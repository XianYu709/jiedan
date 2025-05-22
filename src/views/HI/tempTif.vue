<template>
  <div style="width: 100%;height: 100%;">
    <div id="map" style="width: 100%;height:100%"></div>
    <div id="timeline"></div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';
import { GLOBAL_CONFIG } from '../../../public/static/config_Url_Str.js'
export default {
  data() {
    return {
        map: null,
        proj: null,
        layer: null,
        source: null,
        myChart: null,
        allFeatures: [],
        allTime: [],
        config: {
            collection: "nvdi",
            tileSize: "1028,1028",
        },
        wmsSourcesCache: [],
    }
  },
  methods: {

    initMap() {
        this.map = new ol.Map({
            target: 'map',
            // ol v7版本用法为ol.control.defaults.defaults； v6版本以下用法为ol.control.defaults
            controls: ol.control.defaults.defaults({
                attributionOptions: {
                collapsed: false
                }
            })
            .extend([new ol.supermap.control.Logo({
                link: "https://iclient.supermap.io"
            })]),
            view: new ol.View({
            center: [100, 35],
            zoom: 4,
            projection: 'EPSG:4326',
            multiWorld: true
            })
        });
        var layer = new ol.layer.Tile({
                source: new ol.source.TileSuperMapRest({
                url: GLOBAL_CONFIG.layerUrl
            }),
            projection: 'EPSG:4326'
        });
        this.map.addLayer(layer);
    },



    getAllFeatures() {
      var url = GLOBAL_CONFIG.templIserverUrl;
      this.proj = ol.proj.get("EPSG:4326");

      axios.get(url).then(res => {
        console.log(res.data.features)
        res.data.features.forEach(feature => {
          this.allTime.push(feature.properties.filetime.replace(/\//g, '-').split(' ')[0])
           // 将特征数据存入数组
          this.allFeatures.push({
            collection: feature.collection,
            name: feature.assets.data.title,
            // time: feature.properties.createtime,
            time: feature.properties.filetime,
            bbox: feature.bbox
          });
        });
        // 按 time 从早到晚排序
        this.allFeatures.sort((a, b) => a.time.localeCompare(b.time));
        // 如果需要，也可以同时排序 allTime（保持数据一致）
        this.allTime.sort((a, b) => a.localeCompare(b));
        // 为每个时间点创建WMS数据源并缓存
        this.allFeatures.forEach(feature => {
          var imageExtent = feature.bbox;
          var wmsurl = this.formatWMSURL(feature.time, imageExtent);
          var source = this.buildStaticSource(wmsurl,imageExtent);
          this.wmsSourcesCache.push(source);
        });
        this.start();
      });
    },

    start() {
      this.addStaticImageLayer();

      this.source.once("imageloadend", this.addTimeLine);
    },

    // 添加静态图像图层
    addStaticImageLayer() {
      var feature = this.allFeatures[0]; // 获取第一个时间点的数据
      var imageExtent = feature.bbox; // 获取地理范围
      var url = this.formatWMSURL(feature.time, imageExtent);  // 生成WMS URL
      this.source = this.buildStaticSource(url, imageExtent); // 创建数据源
      // 创建图像图层
      this.layer = new ol.layer.Image({
        source: this.source, // 设置数据源
        opacity: 0.7 // 设置透明度
      });
      this.map.addLayer(this.layer); // 添加到地图
    },

    // 添加时间轴控件
    addTimeLine() {
      this.myChart = echarts.init(document.getElementById('timeline'));
      var option = {
        timeline: {
          axisType: 'category',
          show: true,
          autoPlay: true,
          playInterval: 1000,
          data: this.allTime,
          label: {
            normal: {
              textStyle: {
                color: '#111'
              },
              rotate: 25,  // 标签倾斜45度
              align: 'right',  // 对齐方式（可选）
            },
            emphasis: {
              textStyle: {
                color: '#000'
              }
            }
          },
          controlStyle: {
            normal: {
              color: '#666',
              borderColor: '#666'
            }
          }
        }
      }
      console.log(2)
      this.myChart.setOption(option);
      console.log(3)
      console.log(this.myChart)
      this.myChart.on('timelinechanged', (params) => {
        var source = this.wmsSourcesCache[params.currentIndex];
        this.layer.setSource(source);
        this.source.once("imageloadstart", ()=> { 
          this.changeTimelinePlay(false) 
        });
        this.source.once("imageloadend", this.changeTimelinePlay);
      });
    },

    changeTimelinePlay(state = true) {
      this.myChart.dispatchAction({
        type: 'timelinePlayChange',
        playState: state
      })
    },

    formatWMSURL(time, extent) {

      let imageWMSService = GLOBAL_CONFIG.tempIserverConfigUrl
      // 基础WMS参数
      
      var commentSetting = imageWMSService +
        '?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=0.0.3';


      var SQLFilter = "SQLFILTER=filetime='" + time.replaceAll("/", "-") + "'"; // 时间过滤条件
      var crs = "CRS=" + this.proj.getCode(); // 坐标参考系统
      // 图像尺寸
      var width = "WIDTH=" + this.config.tileSize.split(",")[0]; 
      var height = "HEIGHT=" + this.config.tileSize.split(",")[1];
      // 地理范围(注意调整坐标顺序)
      var bbox = [extent[1], extent[0], extent[3], extent[2]];
      var bboxStr = "BBOX=" + bbox.join(",");
      // 拼接完整的WMS URL
      return commentSetting + "&" + SQLFilter + "&" + crs + "&" + width + "&" + height + "&" + bboxStr;
    },

    // 创建静态图像数据源
    buildStaticSource(url, imageExtent) {
      return new ol.source.ImageStatic({
        url: url, // WMS服务URL
        imageExtent: imageExtent, // 图像范围
        projection: this.proj // 投影系统
      });
    }

  },
  mounted(){
    this.initMap();
    this.getAllFeatures();
  }
}
</script>

<style lang="scss" scoped>
#timeline {
    position: absolute;
    bottom: 50px;
    width: 100%;
    height: 100px;
    z-index: 9999;
}

#title {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
}
.subTitle {
    font-size: 16px;
    font-weight: normal
}
</style>
