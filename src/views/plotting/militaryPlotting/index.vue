<script>
// import img1 from '@/assets/image/addSymbols.jpg'
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
      showMode: false
    }
  },
  mounted() {
    this.addpoint()
    window.viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(119.00030433, 26.00191068, 1500000),
      orientation: {
        heading: window.Cesium.Math.toRadians(0),
        pitch: window.Cesium.Math.toRadians(-90),
        roll: 0.0
      },
      duration: 2.0// 飞行时间(秒)
    })
  },
  beforeDestroy() {
    window.viewer.entities.removeAll()
  },
  methods: {
    addpoint(params) {
      // 模拟点数据
      var pointsData = [
        {
          name: '目标A',
          lon: 118.00030433,
          lat: 27.70191068,
          height: 150,
          img: '/image/addSymbols.jpg',
          info: '按照规划部门的测算，在2020年前，厦门与泉漳龙三市之间出行联系极为密切，出行量也是巨大的。据此，《规划》提出今后的轨道交通（包括高速铁路）客运量将占40%，其余60%由道路交通承担，并加速建设“三纵五横”的交通网，“三纵”即厦成高速、漳浦至武平干道、泉港至长汀干道；“五横”即沈海高速及沿海通道、沈海复线、永定—龙岩—漳平干道、梅州至三明高速、武平—长汀干道。'
        },
        {
          name: '目标B',
          lon: 118.80678021,
          lat: 25.02716309,
          height: 150,
          img: '/image/pm.jpg',
          info: '南平武夷山机场 [2]（Nanping Wuyishan Airport），位于中国南平市建阳区麻沙镇和武夷山市兴田镇交界处，东北距武夷山景区约18千米，为4D级军民合用国际支线机场 [1]。'
        },
        {
          name: '目标C',
          lon: 120.6266214,
          lat: 24.26311381,
          height: 150,
          img: '/image/multiViewport.jpg',
          info: '台中国际机场（Taichung International Airport，IATA：RMQ，ICAO：RCMQ），位于中国台湾省台中市沙鹿区、清水区、神冈区、大雅区交界处，东南距台中市中心约14千米，为4D级军民合用国际机场 [4]。'
        }
      ]
      // 批量添加点
      pointsData.forEach(e => {
        this.add(e)
      })
    },
    add(point) {
      window.viewer.entities.add({
        name: point.name,
        position: window.Cesium.Cartesian3.fromDegrees(
          point.lon,
          point.lat,
          point.height
        ),
        point: {
          pixelSize: 10,
          color: window.Cesium.Color.BLUE,
          outlineColor: window.Cesium.Color.WHITE,
          outlineWidth: 1
        },
        label: {
          text: point.name,
          font: '14pt sans-serif',
          fillColor: window.Cesium.Color.WHITE,
          outlineColor: window.Cesium.Color.BLACK,
          outlineWidth: 2,
          style: window.Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new window.Cesium.Cartesian2(0, -10)// 垂直偏移
        },
        description: `
          <div style='padding:10px;font-family:Arial'>
            <h3 style='color:#1976d2;margin-top:0'>${point.name}</h3>
            <img src='${point.img}' style='height:120px; width:200px;'> 
            <p>${point.info}</p>
            <table style='width:100%;border-collapse:collapse'>
              <tr style='border-bottom:1px solid #eee'>
                <td style='padding:5px 0'>经度</td>
                <td style='text-align:right'>${point.lon.toFixed(4)}°E</td>
              </tr>
              <tr style='border-bottom:1px solid #eee'>
                <td style='padding:5px 0'>纬度</td>
                <td style='text-align:right'>${point.lat.toFixed(4)}°N</td>
              </tr>
              <tr>
                <td style='padding:5px 0'>高度</td>
                <td style='text-align:right'>${point.height}米</td>
              </tr>
            </table>
          </div>
        `
      })
    }
  }}
</script>

<style></style>
