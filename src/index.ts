/**
 * bigscreen-board · 统一出口
 *
 * 组件:
 *   ScaleScreen  固定设计稿 + 等比 scale 投影的适配容器
 *   ChartWidget  echarts 封装(自动 resize / 深色主题 / 像素密度自适应)
 *   BoardPanel   发光面板容器
 *
 * composables:
 *   useScreenScale  屏幕适配核心(scale/stretch 双模式)
 *   useBoardPolling 数据轮询(自动清理)
 *
 * 主题:
 *   registerBoardChartTheme 注册深色 echarts 主题(单例)
 *   BOARD_DESIGN / BOARD_COLORS 基准常量
 */
export { default as ScaleScreen } from './components/ScaleScreen.vue';
export { default as ChartWidget } from './components/ChartWidget.vue';
export { default as BoardPanel } from './components/BoardPanel.vue';

export { useScreenScale } from './composables/useScreenScale';
export { useBoardPolling } from './composables/useBoardPolling';

export { registerBoardChartTheme, BOARD_DESIGN, BOARD_COLORS } from './theme/boardTheme';
export { ScreenScaleKey } from './theme/screenScaleContext';

export type { BoardFitMode } from './theme/boardTheme';
export type { ScreenScaleContext } from './theme/screenScaleContext';
export type { ScreenScaleState } from './composables/useScreenScale';
export type { BoardPollingOptions } from './composables/useBoardPolling';
