/**
 * bigscreen-board · 统一出口(纯屏幕适配库, 无 echarts/字体依赖)
 *
 * 组件:
 *   ScaleScreen  固定设计稿 + 等比 scale 投影的适配容器
 *   BoardPanel   通用面板容器(纯样式)
 *
 * composables:
 *   useScreenScale  屏幕适配核心(scale/stretch 双模式)
 *   useBoardPolling 数据轮询(自动清理)
 *
 * 常量/上下文:
 *   BOARD_DESIGN / BOARD_COLORS 基准常量
 *   ScreenScaleKey              缩放上下文注入键
 */
export { default as ScaleScreen } from './components/ScaleScreen.vue';
export { default as BoardPanel } from './components/BoardPanel.vue';

export { useScreenScale } from './composables/useScreenScale';
export { useBoardPolling } from './composables/useBoardPolling';

export { BOARD_DESIGN, BOARD_COLORS } from './theme/boardTheme';
export { ScreenScaleKey } from './theme/screenScaleContext';

export type { BoardFitMode } from './theme/boardTheme';
export type { ScreenScaleContext } from './theme/screenScaleContext';
export type { ScreenScaleState } from './composables/useScreenScale';
export type { BoardPollingOptions } from './composables/useBoardPolling';
