<script>
import  coll  from "../HI/coll.vue";
import  wind  from "../HI/wind.vue";
import  temoTif  from "../HI/tempTif.vue";
export default {
  name: 'MapHeader',
  components: {coll,wind,temoTif},
  props: {
    getViewer: {
      type: Function,
      default: null
    },
    activeCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      HIStatus: 0,
      popUpStatus: false,
      menus: [
        { code: 'index', label: '首页' },
        {
          code: 'plot',
          label: '标绘',
          children: [
            { code: 'basePlotting', label: '基础标绘', componentName: 'basePlotting', cardOptions: { width: '450px', height: '230px' }},
            { code: 'jsPlotting', label: '目标数据', componentName: 'jsPlotting', cardOptions: { width: '450px', maxHeight: '470px' }},
            { code: 'militaryPlotting', label: '军事标绘', componentName: 'military', cardOptions: { top:"100px", width: "510px",left: "75px" } },
            { code: 'collect', label: '场景收藏', componentName: 'collect', cardOptions: { top:"100px", width: "470px",left: "75px" } },
            { label: '雷达波束标绘' },
            { code: '3dDraw', label: '三维标绘', componentName: 'ThreeDDraw', cardOptions: { width: '460px' } }
          ]
        },
        {
          code: 'analyse',
          label: '空间分析',
          children: [
            { code: 'slopeAnalyse', label: '坡度坡向', componentName: 'Slope', cardOptions: { top: "350px", width: "510px",left: "65%" }},
            { code: 'viewshedAnalyse', label: '可视域', componentName: 'ViewshedIndex', cardOptions: { top:"350px", width: "510px",left: "75px" } },
            { code: 'VisibilityAnalyse', label: '通视度', componentName: 'InterVisibility', cardOptions: { top:"350px", width: "510px"} },
            { code: 'buffer', label: '缓冲区', componentName: 'Buffer', cardOptions: { width: '350px',top:"350 px", }},
            { code: 'cutFillAnalyse', label: '填挖方', componentName: 'Excavation', cardOptions: { width: "400px", top:"350px", left:"75%" } },
            { code: 'sectionAnalyse', label: '剖面', componentName: 'Profile', cardOptions: { width: '350px',top:"350px", } },
            { code: 'situationAnalyse', label: '态势分析', componentName: 'SituationAnalyse', cardOptions: {width: '600px', top: '150px'}}
          ]
        },
        {
          code: 'specialEffects',
          label: '特效',
          children: [
            { code: 'burst', label: '爆炸', componentName: 'BurstIndex' },
            { code: 'fireworks', label: '烟火', componentName: 'FireworksIndex' },
            { code: 'hjtx', label: '环境特效', componentName: 'hjtx', cardOptions: { width: '425px' }},
            { code: 'ddtx', label: '地图特效', componentName: 'dttx', cardOptions: { width: '425px' }}
          ]
        },
        {
          code: 'dangerDefence',
          label: '危险预警',
          componentName: 'DangerDefenceIndex',
          cardOptions: { width: '300px' }
        },
        {
          code: 'history',
          label: '历史影像',
          children: [
            { code: 'history1', label: '时空影像' },
            { code: 'history2', label: '水文影像' },
            { code: 'history3', label: '气象影像' }
          ]
        },
        {
          code: 'tools',
          label: '工具',
          children: [
            { code: 'rollerShutter', label: '卷帘对比' },
            { code: 'measure', label: '空间量算', componentName: 'Measure', cardOptions: { width: '400px' }},
            { code: 'pyramid', label: '雷达波束模型', componentName: 'UdpIndex' },
            { code: 'gcoord', label: '坐标投影转换', componentName: 'GcoordIndex', cardOptions: { width: '460px' }},
            { code: 'udpTest', label: 'UDP连接', componentName: 'UdpIndex', cardOptions: { width: '450px' }}
          ]
        }
      ]
    }
  },
  computed: {
    computedActiveCode: {
      get() {
        return this.activeCode
      },
      set(code) {
        this.$emit('update:activeCode', code)
      }
    }
  },
  methods: {
    handleClick(menu) {
      console.log(menu)
      // 如果不是组件且又点击了一次，则表示关闭该菜单
      if (!menu.componentName && this.computedActiveCode === menu.code) {
        this.computedActiveCode = 'index'
        this.popUpStatus = false; // 关闭弹窗
        this.HIStatus = 0;
      } else {
        this.computedActiveCode = menu.code
        if(menu.code == 'history1') {
          this.popUpStatus = true; // 打开弹窗
          this.HIStatus = 1; // 时空影像
        } else if (menu.code == 'history2') {
          this.popUpStatus = true; // 打开弹窗
          this.HIStatus = 2; // 水文影像
        } else if (menu.code == 'history3') {
          this.popUpStatus = true; // 打开弹窗
          this.HIStatus = 3; //  气象影像
        } else {
          this.popUpStatus = false; // 打开弹窗
        }
      }
      this.$emit('click', menu)
    }
  }
}
</script>

<template>
  <nav class="navbar">
    <!-- 历史影像页面弹出框 -->
    <div class="popUp" v-if="popUpStatus">
      <!-- 时空影像  -->
      <coll style="width: 100%;height: 100%;" v-if="HIStatus == 1" />
      <!-- 水文影响 -->
      <wind style="width: 100%;height: 100%;" v-if="HIStatus == 2" />
      <!-- 气象影像 -->
      <temoTif style="width: 100%;height: 100%;" v-if="HIStatus == 3" />
    </div>
    <div class="nav-container">
      <a href="#" class="logo" onclick="">
        <i class="fas fa-cube" />
        <span>战场环境构建</span>
      </a>

      <ul class="nav-menu">
        <li
          v-for="(menu, index) in menus"
          :key="index"
          :class="['nav-item', menu.code === computedActiveCode ? 'active' : '']"
        >
          <a href="#" class="nav-link" @click.stop="handleClick(menu)">{{ menu.label }}</a>
          <div v-if="menu.children" class="dropdown">
            <a
              v-for="(child, index2) in menu.children"
              :key="`${index}-${index2}`"
              :class="['dropdown-item', child.code === computedActiveCode ? 'active' : '']"
              @click.stop="handleClick(child)"
            >
              {{ child.label }}
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.navbar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 0 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo i {
  margin-right: 10px;
  color: #4cc9f0;
}

.nav-menu {
  display: flex;
  list-style: none;
  height: 100%;
  margin: 0;
}

.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-item:hover .dropdown {
  display: block;
}
.nav-item.active,
.nav-item:has(.dropdown-item.active) {
  .nav-link {
    background-color: rgba(255, 255, 255, 0.1);
    color: #4cc9f0;
  }
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #4cc9f0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background-color: #4cc9f0;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 70%;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #1a1a2e;
  min-width: 200px;
  display: none;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-radius: 0 0 5px 5px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 20px;
  color: #ddd;
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dropdown-item:hover {
  background-color: rgba(76, 201, 240, 0.1);
  color: #4cc9f0;
  padding-left: 25px;
}

.dropdown-item.active {
  background-color: rgba(76, 201, 240, 0.3);
}

.search-container {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  outline: none;
  width: 200px;
  transition: all 0.3s ease;
}

.search-input:focus {
  width: 250px;
  background-color: rgba(255, 255, 255, 0.2);
}

.search-btn {
  background: none;
  border: none;
  color: white;
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: color 0.3s ease;
}

.search-btn:hover {
  color: #4cc9f0;
}


.popUp {
  width: 100vw;
  height: calc(100vh - 60px);
  background-color: #FFF;
  position: absolute;
  top: 60px;
  left: 0;
}
</style>
