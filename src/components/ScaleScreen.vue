<template>
  <div class="board-stage" :style="stageStyle">
    <div ref="screenRef" class="board-screen" :style="screenStyle">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
import { BOARD_DESIGN, registerBoardChartTheme } from '../theme/boardTheme';
import type { BoardFitMode } from '../theme/boardTheme';
import { useScreenScale } from '../composables/useScreenScale';
import { ScreenScaleKey } from '../theme/screenScaleContext';

export interface ScaleScreenProps {
  /** 设计稿宽度, 默认 1920 */
  designWidth?: number;
  /** 设计稿高度, 默认 1080 */
  designHeight?: number;
  /** 适配模式: scale=等比(默认) / stretch=拉伸铺满 */
  mode?: BoardFitMode;
  /** 舞台背景: 渐变/纯色/图片 URL(等比模式下留白区域的兜底背景) */
  background?: string;
  /**
   * 背景填充方式:
   *  - static(默认): 背景原样平铺在舞台(适合渐变/纯色)
   *  - cover: 背景图以 cover 铺满整个视口, 超宽/超高屏时无缝延展裁切
   *           (适合图片背景, 让等比内容的留白区与背景融为一体)
   */
  backgroundMode?: 'static' | 'cover';
  /** 全屏模式: 铺满视口, 并接管 body 背景色(离开页面自动恢复) */
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<ScaleScreenProps>(), {
  designWidth: BOARD_DESIGN.width,
  designHeight: BOARD_DESIGN.height,
  mode: 'scale',
  background: 'radial-gradient(1200px 800px at 50% 0%, #0A1B3D 0%, #050B1A 60%)',
  backgroundMode: 'static',
  fullScreen: true,
});

const screenRef = ref<HTMLDivElement>();
const design = computed(() => ({ width: props.designWidth, height: props.designHeight }));

const { state, start, stop } = useScreenScale(
  () => screenRef.value?.parentElement ?? null,
  design.value,
  props.mode,
);

const stageStyle = computed(() => ({
  background: props.background,
  backgroundSize: props.backgroundMode === 'cover' ? 'cover' : undefined,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

const screenStyle = computed(() => ({
  width: `${design.value.width}px`,
  height: `${design.value.height}px`,
  transform: `scale(${state.scaleX}, ${state.scaleY})`,
  left: `${state.offsetX}px`,
  top: `${state.offsetY}px`,
}));

provide(ScreenScaleKey, { scale: computed(() => state.scale), design: design.value });

onMounted(() => {
  registerBoardChartTheme();
  start();
  if (props.fullScreen) {
    document.body.classList.add('board-fullscreen');
  }
});
onUnmounted(() => {
  stop();
  if (props.fullScreen) {
    document.body.classList.remove('board-fullscreen');
  }
});
</script>

<style lang="scss">
/* 大屏数字专用字体 */
@font-face {
  font-family: 'board-number';
  src: url('../assets/font/ysbth.ttf');
}

/* 全屏大屏页: 接管 body 底色, 保证等比留白区域为深色(挂类名便于离开时恢复) */
body.board-fullscreen {
  background: #050b1a !important;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.board-stage {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.board-screen {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
}
</style>
