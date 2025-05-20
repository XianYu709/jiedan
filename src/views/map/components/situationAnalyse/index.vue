<script>
import useSlope from "./helper";

export default {
  name: "SituationAnalyse",
  components: {
    BaseCard: () => import("../card.vue"),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      intance: null,
    };
  },
  mounted() {
    this.intance ??= useSlope();
    this.intance.onload();
  },
  beforeDestroy() {
    this.intance.clearAll();
  },
  methods: {
    createAnimation() {
      this.intance.createAnimation();
    },
    play() {
      this.intance.play();
    },
    pause() {
      this.intance.pause();
    },
    stop() {
      this.intance.stop();
    },
    reset() {
      this.intance.reset();
    },
    deleteSelectedFeaturesAnimation() {
      this.intance.deleteSelectedFeaturesAnimation();
    },
    deleteAllAnimation() {
      this.intance.deleteAllAnimation();
    },
  },
};
</script>

<template>
  <div style="text-align: center">
    <el-button size="small" @click="createAnimation()">创建动画</el-button>
    <el-button size="small" @click="play()">播放</el-button>
    <el-button size="small" @click="pause()">暂停</el-button>
    <el-button size="small" @click="stop()">停止</el-button>
    <el-button size="small" @click="reset()">复位</el-button>
    <el-button size="small" @click="deleteSelectedFeaturesAnimation()"
      >删除动画</el-button
    >
    <el-button size="small" @click="deleteAllAnimation()"
      >删除全部动画</el-button
    >

    <div
      id="SuperMap3DContainer"
      class="fullSize"
      style="position: relative; left: 0%; height: 100%"
    />
  </div>
</template>

<style scoped lang="scss"></style>
