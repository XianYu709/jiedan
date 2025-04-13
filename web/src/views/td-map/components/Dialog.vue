<template>
  <Modal
    ref="modalRef"
    v-model:open="open"
    :maskClosable="false"
    :mask="false"
    :wrapClassName="noPadding ? 'dialog-npd' : 'dialog-pd'"
    :destroyOnClose="true"
    @cancel="cancel"
    :footer="null"
  >
    <template #title>
      <div
        :ref="props.isDrag ? 'modalTitleRef' : ''"
        :class="props.isDrag ? 'cursor-move' : ''"
        class="w-full px-4 py-3 h-12 border-b border-slate-300 flex justify-between"
      >
        <div class="font-normal">
          <slot name="title"
            ><span class="font-bold">{{ title }}</span></slot
          >
        </div>
        <div class="mr-8">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <template #modalRender="{ originVNode }">
      <div :style="transformStyle">
        <component :is="originVNode" />
      </div>
    </template>
    <slot></slot>
  </Modal>
</template>

<script setup lang="ts">
  import { Modal } from 'ant-design-vue';
  import { ref, watchEffect, watch, computed, CSSProperties, useAttrs } from 'vue';
  import { useDraggable } from '@vueuse/core';

  const props = defineProps({
    open: { type: Boolean, default: false, required: true },
    title: { type: String, default: '标题' },
    isDrag: { type: Boolean, default: true },
  });
  const emits = defineEmits(['cancel', 'update:open']);

  const modalTitleRef = ref<HTMLElement | null>();
  const { x, y, isDragging } = useDraggable(modalTitleRef);
  const startX = ref<number>(0);
  const startY = ref<number>(0);
  const startedDrag = ref(false);
  const transformX = ref(0);
  const transformY = ref(0);
  const preTransformX = ref(0);
  const preTransformY = ref(0);
  const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
  watch([x, y], () => {
    if (!startedDrag.value) {
      startX.value = x.value;
      startY.value = y.value;
      const bodyRect = document.body.getBoundingClientRect();
      const titleRect = modalTitleRef.value?.getBoundingClientRect();
      dragRect.value.right = bodyRect.width - titleRect.width;
      dragRect.value.bottom = bodyRect.height - titleRect.height;
      preTransformX.value = transformX.value;
      preTransformY.value = transformY.value;
    }
    startedDrag.value = true;
  });
  watch(isDragging, () => {
    if (!isDragging) {
      startedDrag.value = false;
    }
  });

  watchEffect(() => {
    if (startedDrag.value) {
      transformX.value =
        preTransformX.value +
        Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
        startX.value;
      transformY.value =
        preTransformY.value +
        Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
        startY.value;
    }
  });
  const transformStyle = computed<CSSProperties>(() => {
    return {
      transform: `translate(${transformX.value}px, ${transformY.value}px)`,
    };
  });

  const open = ref(false);
  const cancel = () => {
    open.value = false;
    emits('cancel');
    emits('update:open', false);
  };
  watchEffect(() => {
    open.value = props.open;
  });

  const attrs = useAttrs();
  const noPadding = attrs.hasOwnProperty('noPadding');
</script>

<style lang="less">
  .dialog(@Padding) {
    pointer-events: none;

    .ant-modal {
      .ant-modal-close {
        top: 14px;
      }

      .ant-modal-header {
        margin-bottom: 0;
        padding: 0;
        background-color: transparent;
      }

      .ant-modal-content {
        padding: 0;
        background-color: #ffffffd9;

        .ant-modal-close {
          inset-inline-end: 17px !important;
          top: 14px !important;

          .ant-modal-close-x {
            width: 22px;
            height: 22px;
            line-height: unset !important;
          }
        }
      }

      .ant-modal-body {
        padding: if(@Padding, 0 24px 16px, 0);
      }
    }
  }

  .dialog-pd {
    .dialog(true);
  }

  .dialog-npd {
    .dialog(false);
  }
</style>
