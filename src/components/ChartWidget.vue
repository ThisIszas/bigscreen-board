<template>
  <div ref="chartRef" class="board-chart" />
</template>

<script lang="ts" setup>
import { inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption, EChartsType } from 'echarts';
import { ScreenScaleKey } from '../theme/screenScaleContext';
import { registerBoardChartTheme } from '../theme/boardTheme';

export interface ChartWidgetProps {
  /** echarts option(完整可渲染配置) */
  option: EChartsOption;
  /** 主题名, 默认使用框架注册的深色主题 */
  theme?: string;
  /** 监听容器尺寸自动 resize(外层 scale 不影响布局尺寸, 图表按设计稿像素渲染) */
  autoResize?: boolean;
  /** setOption 时是否整体替换(notMerge), 默认 true */
  notMerge?: boolean;
  /** 渲染像素密度; 默认按屏幕等比缩放比自动提升, 放大时保持清晰 */
  pixelRatio?: number;
}

const props = withDefaults(defineProps<ChartWidgetProps>(), {
  theme: 'board-dark',
  autoResize: true,
  notMerge: true,
});

const chartRef = ref<HTMLDivElement>();
let chart: EChartsType | null = null;
let resizeObserver: ResizeObserver | null = null;

function resolvePixelRatio() {
  if (props.pixelRatio) return props.pixelRatio;
  const scaleCtx = inject(ScreenScaleKey, null);
  const scale = scaleCtx?.scale?.value ?? 1;
  // 屏幕放大(scale>1)时提高 canvas 位图密度保持清晰, 上限 2.5 防性能过载
  return Math.max(1, Math.min(scale, 2.5));
}

onMounted(() => {
  registerBoardChartTheme();
  const el = chartRef.value;
  if (!el) return;
  chart = echarts.init(el, props.theme, { devicePixelRatio: resolvePixelRatio() });
  chart.setOption(props.option, { notMerge: props.notMerge });
  nextTick(() => chart?.resize());

  if (props.autoResize && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => chart?.resize());
    resizeObserver.observe(el.parentElement || el);
  }
});

watch(
  () => props.option,
  (opt) => chart?.setOption(opt, { notMerge: props.notMerge }),
  { deep: true },
);

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  chart?.dispose();
  chart = null;
});

defineExpose({ getInstance: () => chart });
</script>

<style scoped lang="scss">
.board-chart {
  width: 100%;
  height: 100%;
}
</style>
