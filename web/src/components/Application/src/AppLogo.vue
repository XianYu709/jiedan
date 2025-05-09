<!--
 * @Author: Vben
 * @Description: logo component
-->
<template>
  <div class="anticon" :class="getAppLogoClass" @click="goHome">
    <img src="../../../assets/images/logo.png" />
    <div
      class="ml-2 truncate md:opacity-100 title text-lg"
      v-show="showTitle"
      :style="{ color: `${logoTestColor}` }"
    >
      <!-- style="font-size: 24px; text-shadow: rgb(0 0 0) 1px 0 1px, rgb(0 0 0) 1px 2px 2px;" -->
      <!-- :class="getTitleClass"
      v-show="showTitle" -->
      {{ title }}
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, unref } from 'vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { useGo } from '@/hooks/web/usePage';
  import { useMenuSetting } from '@/hooks/setting/useMenuSetting';
  import { useDesign } from '@/hooks/web/useDesign';
  import { PageEnum } from '@/enums/pageEnum';
  import { useUserStore } from '@/store/modules/user';

  const props = defineProps({
    /**
     * The theme of the current parent component
     */
    theme: { type: String, validator: (v: string) => ['light', 'dark'].includes(v) },
    /**
     * Whether to show title
     */
    showTitle: { type: Boolean, default: true },
    /**
     * The title is also displayed when the menu is collapsed
     */
    alwaysShowTitle: { type: Boolean },
    /**
     * Logo test color
     */
    logoTestColor: { type: String, default: '#B3B9BF' },
  });

  const { prefixCls } = useDesign('app-logo');
  const { getCollapsedShowTitle } = useMenuSetting();
  const userStore = useUserStore();
  const { title } = useGlobSetting();
  const go = useGo();

  const getAppLogoClass = computed(() => [
    prefixCls,
    props.theme,
    { 'collapsed-show-title': unref(getCollapsedShowTitle) },
  ]);

  const getTitleClass = computed(() => [
    `${prefixCls}__title`,
    {
      'xs:opacity-0': !props.alwaysShowTitle,
    },
  ]);

  function goHome() {
  const roles = userStore.userInfo.roles.map((item) => item.name);
    if (roles[0] == '超级管理员') {
      go(userStore.getUserInfo.homePath || PageEnum.BASE_HOME);
    }
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding-left: 7px;
    transition: all 0.2s ease;
    cursor: pointer;

    &.light {
      border-bottom: 1px solid @border-color-base;
    }

    &.collapsed-show-title {
      padding-left: 20px;
    }

    &.light &__title {
      color: @primary-color;
    }

    &.dark &__title {
      color: @white;
    }

    &__title {
      transition: all 0.5s;
      font-size: 16px;
      font-weight: 700;
      line-height: normal;
    }
  }

  .title {
    font-family: rzzyt;
  }
</style>
